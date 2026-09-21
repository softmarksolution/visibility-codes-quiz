import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  /* The quiz used to live at /quiz, behind a landing page and a cover page that
     have both been removed. Ads, emails and bookmarks still point at the old
     path, so it is kept alive as a permanent redirect rather than a 404. */
  async redirects() {
    return [
      { source: "/quiz", destination: "/", permanent: true },
      { source: "/quiz-cover", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
