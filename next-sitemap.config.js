/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://ideinteriorai.com',
  generateRobotsTxt: true, // Ini akan membuat file robots.txt juga
  sitemapSize: 7000, // Opsional: Maksimum URL per file sitemap. Ini sudah cukup besar.
  // Anda bisa menambahkan URL tambahan jika ada halaman yang tidak terdeteksi otomatis
  // Contoh jika ada halaman /blog/hello-world yang bukan dari file:
  // additionalPaths: async (config) => [
  //   '/blog/hello-world',
  // ],
  // Atau jika Anda punya data dinamis dari API:
  // additionalPaths: async (config) => {
  //   const articles = await fetch('https://api.ideinteriorai.com/articles').then(res => res.json());
  //   return articles.map((article) => `/artikel/${article.slug}`);
  // },
};
