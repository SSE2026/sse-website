import { NextRequest } from "next/server";

// Server-side proxy for embedding ssebatt.com articles inside the independent site.
// The source site sends X-Frame-Options: SAMEORIGIN and CSP frame-ancestors 'self',
// which blocks any external iframe embed. By proxying through our own origin
// and stripping those headers, the iframe can render.

// Hide the old site's chrome inside the iframe so users only see one header (ours).
// Also unlock the body/html height — the upstream page uses absolute-positioned layout
// with body { height: 100% } which clips article content to the iframe box height.
const HIDE_OLD_CHROME_CSS = `
  html, body {
    background: #ffffff !important;
    height: auto !important;
    min-height: auto !important;
    max-height: none !important;
    overflow: visible !important;
  }
  #site_footer, #footer_content { display: none !important; }
  .wp-new_navigation_content, .nav1.menu_hs9, .navigation { display: none !important; }
  header, .site-header, .topbar { display: none !important; }
  #scroll_container, #canvas { margin-top: 0 !important; padding-top: 0 !important; height: auto !important; }
  /* Ensure iframe content scrolls inside the iframe box */
  body { overflow-y: auto !important; }
`;

function isAllowedUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      (u.hostname === "www.ssebatt.com" || u.hostname === "ssebatt.com") &&
      (u.protocol === "http:" || u.protocol === "https:")
    );
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const targetUrl = req.nextUrl.searchParams.get("url");

  if (!targetUrl) {
    return new Response("Missing url parameter", { status: 400 });
  }

  if (!isAllowedUrl(targetUrl)) {
    return new Response("Invalid url", { status: 400 });
  }

  try {
    const upstream = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      },
      // Don't follow excessively; default is fine
    });

    if (!upstream.ok) {
      return new Response(`Upstream error: ${upstream.status}`, {
        status: 502,
      });
    }

    let html = await upstream.text();

    // Inject CSS to hide the old site's nav/footer so only our header is visible.
    const styleTag = `<style id="sse-hide-chrome">${HIDE_OLD_CHROME_CSS}</style>`;
    if (/<head[^>]*>/i.test(html)) {
      html = html.replace(/<head([^>]*)>/i, `<head$1>${styleTag}`);
    } else if (/<html[^>]*>/i.test(html)) {
      html = html.replace(/<html([^>]*)>/i, `<html$1><head>${styleTag}</head>`);
    } else {
      html = `${styleTag}${html}`;
    }

    // Add a <base> tag so relative URLs (CSS, JS, anchors) resolve against the original site
    const baseUrl = new URL(targetUrl);
    const baseTag = `<base href="${baseUrl.origin}/" />`;
    html = html.replace(/<head([^>]*)>/i, `<head$1>${baseTag}`);

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        // Explicitly do NOT set X-Frame-Options or CSP frame-ancestors.
        // Same-origin response (this route serves on our own domain) means our parent
        // page (also our domain) can iframe it freely.
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(`Proxy failed: ${msg}`, { status: 500 });
  }
}