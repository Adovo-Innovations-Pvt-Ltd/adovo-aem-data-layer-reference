import test from 'node:test';
import assert from 'node:assert/strict';
import { registerPageViewBridge } from '../src/bridge.mjs';
import { mapPageView } from '../src/map-page-view.mjs';

const event = {
  event: 'page view',
  page: { title: ' Example guide ', url: 'https://example.com/guides/data-quality' },
};

test('maps a page view to XDM', () => {
  assert.deepEqual(mapPageView(event), {
    eventType: 'web.webpagedetails.pageViews',
    web: {
      webPageDetails: {
        name: 'Example guide',
        URL: 'https://example.com/guides/data-quality',
        pageViews: { value: 1 },
      },
    },
  });
});

test('rejects missing page fields', () => {
  assert.throws(() => mapPageView({ page: { url: 'https://example.com' } }), /page.title/);
  assert.throws(() => mapPageView({ page: { title: 'Guide', url: '/guide' } }), /page.url/);
  assert.throws(() => mapPageView({ page: { title: 'Guide', url: 'file:///guide' } }), /page.url/);
});

test('registers one listener and sends the mapped event', () => {
  const listeners = new Map();
  const layer = { addEventListener: (name, handler) => listeners.set(name, handler) };
  const dataLayer = { push: (callback) => callback(layer) };
  const sent = [];

  registerPageViewBridge(dataLayer, (payload) => sent.push(payload));
  listeners.get('page view')(event);

  assert.equal(sent.length, 1);
  assert.deepEqual(sent[0], { xdm: mapPageView(event) });
});
