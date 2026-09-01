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
const isProd = process.env.NODE_ENV === 'production';
const repoName = 'Zenth';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
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
