export const ASSETS_TO_PRELOAD = [
  '/remi.png',
  '/ego.png',
  '/gusteau.png',
  '/dish-1-madeleine.jpg',
  '/dish-2-soup.jpg',
  '/dish-3-omelette.jpg',
  '/dish-4-sweetbreads.jpg',
  '/dish-5-ratatouille.jpg',
  '/dish-6-espresso.jpg',
  '/dish-7-mushrooms.jpg',
  '/dish-8-cheese.jpg',
  '/dish-9-bread.jpg'
];

export function preloadAndDecodeAssets() {
  if (typeof window === 'undefined') return Promise.resolve();

  const promises = ASSETS_TO_PRELOAD.map((src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;

      // decode() заставляет браузер асинхронно распаковать JPEG в GPU до вставки в DOM
      if ('decode' in img) {
        img.decode()
          .then(resolve)
          .catch(() => {
            img.onload = resolve;
            img.onerror = resolve;
          });
      } else {
        img.onload = resolve;
        img.onerror = resolve;
      }
    });
  });

  return Promise.allSettled(promises);
}