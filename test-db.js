const fs = require('fs');
const net = require('net');

// Parse .env
const lines = fs.readFileSync('.env', 'utf8').split('\n');
const env = {};
lines.forEach(line => {
  const m = line.match(/^([^#=\s][^=]*)=(.*)/);
  if (m) env[m[1].trim()] = m[2].trim().replace(/^"|"$/g, '');
});

const url = env['DATABASE_URL'] || '';
const hostMatch = url.match(/@([^:/]+)/);
const host = hostMatch ? hostMatch[1] : null;

console.log('\n=== AL GHAZI — Supabase Connection Diagnostic ===\n');
console.log('DATABASE_URL present:', !!url);
console.log('Host detected:', host || 'NOT FOUND');

if (!host) {
  console.error('Cannot extract host from DATABASE_URL. Check your .env file.');
  process.exit(1);
}

// Test port 6543 (PgBouncer / Transaction pooler)
function testPort(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port, timeout: 8000 });
    socket.on('connect', () => {
      socket.destroy();
      resolve({ port, ok: true });
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve({ port, ok: false, reason: 'TIMEOUT (port may be blocked by ISP)' });
    });
    socket.on('error', (e) => {
      resolve({ port, ok: false, reason: e.message });
    });
  });
}

async function run() {
  for (const port of [6543, 5432]) {
    const r = await testPort(port);
    if (r.ok) {
      console.log(`✅ TCP Port ${port}: OPEN — DB is reachable`);
    } else {
      console.log(`❌ TCP Port ${port}: FAILED — ${r.reason}`);
    }
  }

  // Check for URL-encoded password special chars
  const passwordMatch = url.match(/:([^@]+)@/);
  if (passwordMatch) {
    const pwd = passwordMatch[1];
    const hasEncoding = /%[0-9A-Fa-f]{2}/.test(pwd);
    console.log('\nPassword URL-encoded:', hasEncoding ? 'YES (correct)' : 'NO — special chars like @#& must be %xx encoded');
  }

  // Check DIRECT_URL
  const directUrl = env['DIRECT_URL'];
  console.log('DIRECT_URL present:', !!directUrl);
  if (!directUrl) {
    console.warn('⚠️  DIRECT_URL missing — prisma migrate dev will fail');
  }

  console.log('\nDiagnosis complete.');
  console.log('\nIf both ports are OPEN but Prisma still fails, the issue is:');
  console.log('  → The Supabase project may be PAUSED (free tier auto-pauses after 1 week of inactivity)');
  console.log('  → Go to app.supabase.com → your project → click "Resume project"');
}

run();
