import { mapPageView } from './map-page-view.mjs';

export function registerPageViewBridge(dataLayer, sendEvent) {
  if (!dataLayer || typeof dataLayer.push !== 'function') {
    throw new TypeError('dataLayer must support push');
  }
  if (typeof sendEvent !== 'function') {
    throw new TypeError('sendEvent must be a function');
  }

  dataLayer.push(function (layer) {
    layer.addEventListener('page view', (event) =>
      sendEvent({ xdm: mapPageView(event) })
    );
  });
}
