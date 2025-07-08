/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://plus-one-wine.vercel.app/", 
  generateRobotsTxt: true, 
  sitemapSize: 10000,

  transform: async (config, path) => {
    // 경로별 priority 커스텀
    let priority = 0.7;
    if (path === "/") priority = 1.0;

    return {
      loc: path,
      changefreq: "weekly",
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};