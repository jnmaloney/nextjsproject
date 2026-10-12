// Static export for GitHub Pages. BASE_PATH is set by the CI workflow
// to "/<repo-name>"; locally it is empty so `npm run dev` works at "/".
const basePath = process.env.BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  // Remove if the SKA package builds fine without it.
  transpilePackages: ['@ska-telescope/ska-gui-components'],
};

export default nextConfig;
