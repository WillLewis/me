export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>500 - Portfolio</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex,nofollow,noarchive" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #fbf7ef; color: #1f1712; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 32rem; width: 100%; text-align: center; padding: 2rem; }
      .eyebrow { color: #7b7169; font-size: 0.75rem; letter-spacing: 0.18em; text-transform: uppercase; margin: 0 0 1rem; }
      h1 { font-family: Georgia, "Times New Roman", serif; font-size: clamp(2rem, 8vw, 3.75rem); line-height: 1; margin: 0 0 1rem; }
      p { color: #675b51; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.65rem 1.1rem; border-radius: 999px; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #1f1712; color: #fff; }
      .secondary { background: transparent; color: #1f1712; border-color: #ded5c8; }
    </style>
  </head>
  <body>
    <div class="card">
      <p class="eyebrow">500 · Application error</p>
      <h1>This page didn't load.</h1>
      <p>Something went wrong while rendering the portfolio. Try again, or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Back to portfolio</a>
      </div>
    </div>
  </body>
</html>`;
}
