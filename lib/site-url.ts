/**
 * 站点对外域名 —— sitemap / robots 里列出的绝对地址用。
 *
 * 同一个仓库有两个部署：国内 EdgeOne（www.ssebatt.com）和境外 Vercel
 * （sse-website.vercel.app）。域名不能写死，否则其中一个部署的 sitemap
 * 会把搜索引擎指向另一个域名 —— 之前就写死了 vercel 的地址，而那个域名
 * 在国内被 DNS 污染，收录进去等于给爬虫一个打不开的链接。
 *
 * 还没配环境变量的部署，兜底到国内正式站：那是主要面向用户的地址。
 */
const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = (
  configured && configured.length > 0 ? configured : "https://www.ssebatt.com"
).replace(/\/+$/, "");
