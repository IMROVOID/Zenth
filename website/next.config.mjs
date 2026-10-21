import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || '3000';

function getLocalIpAddresses() {
  const ips = [];
  try {
    const interfaces = os.networkInterfaces() || {};
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name] || []) {
        if (iface && iface.family === 'IPv4' && !iface.internal) {
          ips.push(iface.address);
          ips.push(`${iface.address}:${port}`);
        }
      }
    }
  } catch {}
  return ips;
}

const localIps = getLocalIpAddresses();
const primaryIp = localIps.find((ip) => !ip.includes(':'));

if (primaryIp && process.env.NODE_ENV !== 'production') {
  console.log(`\n  \x1b[36m▲ Network IP:\x1b[0m   http://${primaryIp}:${port}\n`);
}

/** @type {import('next').NextConfig} */
function normalizeBasePath(raw) {
  const trimmed = (raw || '').trim();
  if (!trimmed || trimmed === '/') return '';
  if (!/^\/[A-Za-z0-9._~-]+(\/[A-Za-z0-9._~-]+)*$/.test(trimmed)) {
    throw new Error(`Invalid NEXT_PUBLIC_BASE_PATH: ${trimmed}`);
  }
  return trimmed;
}

const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  assetPrefix: basePath ? `${basePath}/` : '',
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    ...localIps,
    'localhost',
    `localhost:${port}`,
    '127.0.0.1',
    `127.0.0.1:${port}`,
    '*.local',
  ],
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
