/**
 * Password protection for the whole site (every page, image, and audio file).
 * Runs on Cloudflare Pages only — GitHub Pages ignores this file.
 *
 * Setup: in the Cloudflare Pages project, go to Settings → Variables and
 * Secrets, add CFP_PASSWORD (required) and optionally CFP_USERNAME
 * (defaults to "are"), then redeploy.
 */
export async function onRequest(context) {
  const { request, env, next } = context;

  if (!env.CFP_PASSWORD) {
    return new Response(
      "Site locked: set the CFP_PASSWORD environment variable in Cloudflare Pages settings, then redeploy.",
      { status: 503 }
    );
  }

  const expected =
    "Basic " + btoa((env.CFP_USERNAME || "are") + ":" + env.CFP_PASSWORD);

  if (request.headers.get("Authorization") === expected) {
    return next();
  }

  return new Response("Password required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="ARE Study Aid", charset="UTF-8"'
    }
  });
}
