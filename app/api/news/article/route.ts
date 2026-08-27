import { NextRequest } from "next/server";

// Server-side proxy for embedding ssebatt.com articles inside the independent site.
// The source site sends X-Frame-Options: SAMEORIGIN and CSP frame-ancestors 'self',
// which blocks any external iframe embed. By proxying through our own origin
// and stripping those headers, the iframe can render.

// Hide the old site's chrome inside the iframe so users only see one header (ours).
// Also unlock the body/html height — the upstream page uses absolute-positioned layout
// with body { height: 100% } which clips article content to the iframe box height.
//
// IMPORTANT: do NOT set min-height: 0 on html/body — that causes 0-height collapse.
const HIDE_OLD_CHROME_CSS = `
  html, body {
    background: #ffffff !important;
    height: auto !important;
    max-height: none !important;
    overflow: visible !important;
  }
  body { overflow-y: auto !important; }
  #site_footer, #footer_content { display: none !important; }
  .wp-new_navigation_content, .nav1.menu_hs9, .navigation { display: none !important; }
  header, .site-header, .topbar { display: none !important; }
  #scroll_container, #canvas { margin-top: 0 !important; padding-top: 0 !important; height: auto !important; max-height: none !important; }
`;

// Inline-script that keeps forcing html/body height via inline style and CSS.
// Use MutationObserver + setInterval to fight any post-load JS that resets the height.
// Also posts the document height to the parent so the iframe can resize to fit.
const HIDE_OLD_CHROME_SCRIPT = `
<script>
(function(){
  function fixHeight(){
    try {
      // Force a minimum height that fits typical articles (article 22 is ~9986px).
      // Setting min-height as inline style + !important via a high-specificity rule.
      var HTML = document.documentElement;
      var BODY = document.body;
      HTML.style.height = 'auto';
      HTML.style.minHeight = '12000px';
      HTML.style.maxHeight = 'none';
      HTML.style.overflow = 'visible';
      BODY.style.height = 'auto';
      BODY.style.minHeight = '12000px';
      BODY.style.maxHeight = 'none';
      BODY.style.overflow = 'visible';
      var sc = document.getElementById('scroll_container');
      if (sc) { sc.style.height='auto'; sc.style.minHeight='12000px'; sc.style.maxHeight='none'; }
      var cv = document.getElementById('canvas');
      if (cv) { cv.style.height='auto'; cv.style.minHeight='12000px'; cv.style.maxHeight='none'; }
    } catch(e){}
  }
  // Post current document height to parent so it can resize the iframe to match.
  function postHeight(){
    try {
      var h = Math.max(
        document.body ? document.body.scrollHeight : 0,
        document.documentElement ? document.documentElement.scrollHeight : 0,
        document.body ? document.body.offsetHeight : 0,
        document.documentElement ? document.documentElement.offsetHeight : 0
      );
      // 32px buffer so the bottom border of the article isn't clipped.
      parent.postMessage({ type: 'sse-article-height', height: h + 32 }, '*');
    } catch(e){}
  }
  function tick(){ fixHeight(); postHeight(); }
  // Run immediately, on DOMContentLoaded, on load, and periodically.
  if (document.readyState === 'complete' || document.readyState === 'interactive') tick();
  else document.addEventListener('DOMContentLoaded', tick);
  window.addEventListener('load', tick);
  // Re-apply every 250ms for first 8s to defeat any post-load JS that resets height.
  var count = 0;
  var iv = setInterval(function(){ tick(); if (++count >= 32) clearInterval(iv); }, 250);
  // Re-post on resize and after images load (heights can change then).
  window.addEventListener('resize', postHeight);
  window.addEventListener('load', function(){
    setTimeout(postHeight, 500);
    setTimeout(postHeight, 1500);
  });
})();
</script>
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
    const combinedInject = styleTag + HIDE_OLD_CHROME_SCRIPT;
    if (/<head[^>]*>/i.test(html)) {
      html = html.replace(/<head([^>]*)>/i, `<head$1>${combinedInject}`);
    } else if (/<html[^>]*>/i.test(html)) {
      html = html.replace(/<html([^>]*)>/i, `<html$1><head>${combinedInject}</head>`);
    } else {
      html = `${combinedInject}${html}`;
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
        // 60s cache so users get fast loads on repeat visits but updates
        // to the proxy logic propagate quickly.
        "Cache-Control": "public, max-age=60, s-maxage=60",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(`Proxy failed: ${msg}`, { status: 500 });
  }
}