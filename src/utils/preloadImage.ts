const loaded = new Set<string>()

export function preloadImage(src: string): Promise<void> {
  if (!src || loaded.has(src)) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      loaded.add(src)
      resolve()
    }
    img.onerror = () => resolve()
    img.src = src
    if (img.complete) {
      loaded.add(src)
      resolve()
    }
  })
}

export function preloadImages(urls: string[]): void {
  for (const url of urls) {
    void preloadImage(url)
  }
}
