self.addEventListener("install", (event) => {
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	clients.claim();
});

self.addEventListener("fetch", (event) => {
	const request = event.request;
	if (request.method !== "GET") return;
	event.respondWith(
		caches.open("finpal-runtime").then(async (cache) => {
			const cached = await cache.match(request);
			if (cached) return cached;
			try {
				const response = await fetch(request);
				cache.put(request, response.clone());
				return response;
			} catch (err) {
				return cached || Response.error();
			}
		})
	);
});

