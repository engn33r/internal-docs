import 'dotenv/config';
import express from 'express';
import basicAuth from 'express-basic-auth';
import compression from 'compression';
import fs from 'node:fs';
import path from 'node:path';

const BUILD_DIR = path.resolve('build');
if (!fs.existsSync(BUILD_DIR)) {
  throw new Error('Missing build output. Run "npm run build" before starting the secure server.');
}

const rawCredentials = process.env.DOCS_BASIC_AUTH_USERS?.trim();
if (!rawCredentials) {
  throw new Error('Set DOCS_BASIC_AUTH_USERS to a comma-separated list of username:password pairs.');
}

const credentials = rawCredentials.split(',').reduce((acc, pair) => {
  if (!pair) {
    return acc;
  }
  const [user, password] = pair.split(':');
  if (!user || !password) {
    throw new Error(`Invalid credential pair: "${pair}". Expected username:password.`);
  }
  acc[user] = password;
  return acc;
}, {});

if (Object.keys(credentials).length === 0) {
  throw new Error('DOCS_BASIC_AUTH_USERS must include at least one credential pair.');
}

const allowlistPath = process.env.DOCS_ALLOWLIST_PATH
  ? path.resolve(process.env.DOCS_ALLOWLIST_PATH)
  : path.resolve('allowlist.json');
let allowlistedUsers = null;
if (fs.existsSync(allowlistPath)) {
  try {
    const file = fs.readFileSync(allowlistPath, 'utf8');
    const parsed = JSON.parse(file);
    const users = Array.isArray(parsed.githubUsers) ? parsed.githubUsers : [];
    allowlistedUsers = new Set(users);
    if (allowlistedUsers.size === 0) {
      allowlistedUsers = null;
    }
  } catch (error) {
    console.warn(`[secure-server] Failed to parse allowlist at ${allowlistPath}:`, error);
  }
}

const authorizer = (username, password) => {
  const expectedPassword = credentials[username];
  if (!expectedPassword) {
    return false;
  }
  const passwordMatches = basicAuth.safeCompare(password, expectedPassword);
  const allowlistMatches = !allowlistedUsers || allowlistedUsers.has(username);
  return passwordMatches && allowlistMatches;
};

const app = express();
app.disable('x-powered-by');
app.use(compression());
app.use(
  basicAuth({
    authorizer,
    authorizeAsync: false,
    challenge: true,
    realm: 'YearnDocs',
    unauthorizedResponse: () => 'Authentication required.',
  }),
);
app.use(express.static(BUILD_DIR, {extensions: ['html']}));
app.use((_req, res) => {
  res.sendFile(path.join(BUILD_DIR, 'index.html'));
});

const port = Number(process.env.DOCS_PORT ?? 4173);
app.listen(port, () => {
  console.log(`Secure docs server listening on http://localhost:${port}`);
});
