export async function GET() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>404 - Page Not Found</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #0a0a0a;
      color: white;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      text-align: center;
    }
    h1 {
      font-size: 4rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }
    p {
      font-size: 1.25rem;
      margin-bottom: 2rem;
    }
    a {
      color: #60a5fa;
      text-decoration: none;
      font-size: 1rem;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>404</h1>
    <p>Page not found</p>
    <a href="/">← Back to Home</a>
  </div>
</body>
</html>`

  return new Response(html, {
    status: 404,
    headers: {
      'Content-Type': 'text/html',
    },
  })
}
