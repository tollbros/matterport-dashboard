/** @type {import('next').NextConfig} */

const isGithubActions = process.env.GITHUB_ACTIONS || false
let basePath = ''

if (isGithubActions) {
  basePath = '/matterport-dashboard'
}


const nextConfig = {
  basePath: basePath,
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;