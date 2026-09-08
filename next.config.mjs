/** @type {import('next').NextConfig} */
// GitHub Pages 배포: 저장소 이름이 경로 앞에 붙는다 (https://<user>.github.io/<repo>/)
const repo = process.env.PAGES_REPO ?? "";
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: repo ? `/${repo}` : "",
  assetPrefix: repo ? `/${repo}/` : undefined,
};
export default nextConfig;
