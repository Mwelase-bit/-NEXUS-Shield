import express from 'express';
import https from 'https';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '64kb' }));

// Configure Helmet with relaxed Content Security Policy for Google Fonts and Vite
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        "font-src": ["'self'", "https://fonts.gstatic.com"],
        "img-src": ["'self'", "data:", "blob:"],
        "connect-src": ["'self'"],
      },
    },
  })
);

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const MAX_TOKENS_CAP = 2048;

// Roles permitted to issue privileged crane/SCADA commands
const PRIVILEGED_ROLES = new Set(['Security Analyst', 'Port Administrator']);

// POST /api/claude — server-side proxy; key never leaves this process
app.post('/api/claude', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'AI service not configured' });
  }

  const { model, messages, system, max_tokens } = req.body ?? {};

  if (!model || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Invalid request: model and messages are required' });
  }

  // Cap tokens server-side regardless of what the client sends
  const cappedTokens = Math.min(Number(max_tokens) || MAX_TOKENS_CAP, MAX_TOKENS_CAP);

  const payload = JSON.stringify({ model, messages, system, max_tokens: cappedTokens });

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
      'Content-Length': Buffer.byteLength(payload),
    },
  };

  const upstream = https.request(ANTHROPIC_URL, options, (upRes) => {
    res.status(upRes.statusCode);
    upRes.pipe(res, { end: true });
  });

  upstream.on('error', () => res.status(502).json({ error: 'Upstream unreachable' }));
  upstream.write(payload);
  upstream.end();
});

// POST /api/crane-command — privileged SCADA action; RBAC enforced server-side
app.post('/api/crane-command', (req, res) => {
  const role = req.headers['x-role'] ?? '';
  if (!PRIVILEGED_ROLES.has(role)) {
    return res.status(403).json({
      error: 'Access Denied — Separation of Duties',
      detail: `Role "${role || 'unknown'}" is not authorised to issue crane commands. Required: Security Analyst or Port Administrator.`,
    });
  }
  return res.json({ status: 'CRANE HALT ISSUED', operator: role, timestamp: new Date().toISOString() });
});

// Serve static assets from the Vite build directory
app.use(express.static(path.join(__dirname, '../dist')));

// Fallback all other client-side routing requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  process.stdout.write(`[proxy] listening on :${PORT}\n`);
});
