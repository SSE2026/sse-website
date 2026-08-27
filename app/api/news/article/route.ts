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
  /* Old site's top banner (light-blue bg image with logo + nav). It's the first
     child of #canvas — a div.full_column with a layerXXXX id. Article content
     uses .cstlayer so this rule doesn't touch it. */
  #canvas > .full_column,
  #canvas > div[id^="layer"].full_column { display: none !important; }
  /* Old nav menu block nested inside the banner — also hide. */
  .full_content { display: none !important; }
  /* Previous/Next article links at the bottom of the article — old-site's
     nav widget, irrelevant inside our iframe (and would navigate away to
     the old site if clicked). */
  .artview_prev_next { display: none !important; }
  /* The old site's parallax background layer — it inflates to 80,000+px and
     inflates scrollHeight, making the iframe huge. Force it to 0. */
  #scroll_container_bg { display: none !important; height: 0 !important; min-height: 0 !important; max-height: 0 !important; }
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
      // Reset the parallax background layer that the old site inflates to ~80,000px
      // (it follows viewport scroll for visual effect). Match it to canvas height.
      var bg = document.getElementById('scroll_container_bg');
      if (bg && canvas) { bg.style.height = canvas.style.height; }
      var canvas = document.getElementById('canvas');
      if (canvas) {
        // Auto-size canvas to fit the article layer (the last .cstlayer inside it),
        // so the iframe doesn't have 30,000+px of empty padding at the bottom.
        var layers = canvas.querySelectorAll(':scope > .cstlayer');
        var maxBottom = 0;
        for (var i = 0; i < layers.length; i++) {
          var top = parseFloat(layers[i].style.top) || 0;
          var h = layers[i].offsetHeight || 0;
          if (top + h > maxBottom) maxBottom = top + h;
        }
        if (maxBottom > 0) {
          canvas.style.height = (maxBottom + 60) + 'px';
          canvas.style.minHeight = (maxBottom + 60) + 'px';
        } else {
          canvas.style.height = 'auto';
          canvas.style.minHeight = '12000px';
        }
        canvas.style.maxHeight = 'none';
        // Lift the article up to fill the space the old top banner occupied
        // (the banner is hidden but the article was positioned at top: 410px).
        for (var j = 0; j < layers.length; j++) {
          var t = parseFloat(layers[j].style.top) || 0;
          if (t >= 200 && t <= 800) {
            layers[j].style.top = '0px';
          }
        }
      }
    } catch(e){}
  }
  // Post current document height to parent so it can resize the iframe to match.
// We use body.scrollHeight (not html.scrollHeight) because the old site's parallax
// JS inflates html.scrollHeight to 80,000+px even when nothing extends past the body.
// Also clamp to actual visible content via the canvas (article layer's max).
function postHeight(){
    try {
      var canvas = document.getElementById('canvas');
      var body = document.body;
      var h = body ? body.scrollHeight : 0;
      // If we can find the canvas, prefer its offsetHeight + top (article's actual size).
      if (canvas) {
        var layers = canvas.querySelectorAll(':scope > .cstlayer');
        var maxBottom = 0;
        for (var i = 0; i < layers.length; i++) {
          var top = parseFloat(layers[i].style.top) || 0;
          var lh = layers[i].offsetHeight || 0;
          if (top + lh > maxBottom) maxBottom = top + lh;
        }
        if (maxBottom > 0) {
          // Use the larger of canvas height and actual article bottom.
          h = Math.max(canvas.offsetHeight, maxBottom + 60);
        }
      }
      // 32px buffer so the bottom border of the article isn't clipped.
      parent.postMessage({ type: 'sse-article-height', height: h + 32 }, '*');
    } catch(e){}
  }
  function tick(){ fixHeight(); postHeight(); }
  // Run immediately, on DOMContentLoaded, on load, and periodically.
  if (document.readyState === 'complete' || document.readyState === 'interactive') tick();
  else document.addEventListener('DOMContentLoaded', tick);
  window.addEventListener('load', tick);
  // Re-apply every 500ms for first 15s to defeat post-load height-resets.
  var count = 0;
  var iv = setInterval(function(){ tick(); if (++count >= 30) clearInterval(iv); }, 500);
  // Persistent observer: re-fix heights whenever the old site's JS mutates them.
  var obs = new MutationObserver(function(){ tick(); });
  obs.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['style', 'class'] });
  // Re-post on resize and after images load (heights can change then).
  window.addEventListener('resize', postHeight);
  window.addEventListener('load', function(){
    setTimeout(postHeight, 500);
    setTimeout(postHeight, 1500);
    setTimeout(postHeight, 3000);
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