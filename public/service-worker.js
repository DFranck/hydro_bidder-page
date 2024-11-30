// https://dev.to/tyuen/nextjs-app-router-navigation-indicator-and-the-delay-after-onclick-5aba
let ignore = { image: 1, audio: 1, video: 1, style: 1, font: 1 }

self.addEventListener("fetch", (e) => {
  let { request, clientId } = e
  let { destination } = request
  if (!clientId || ignore[destination]) return
  e.waitUntil(
    self.clients.get(clientId).then((client) =>
      client?.postMessage({
        fetchUrl: request.url,
        dest: destination,
      })
    )
  )
})
