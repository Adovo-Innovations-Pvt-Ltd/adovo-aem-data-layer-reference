export function mapPageView(event) {
  const title = event?.page?.title;
  const url = event?.page?.url;

  if (typeof title !== 'string' || !title.trim()) {
    throw new TypeError('page.title must be a nonempty string');
  }

  if (typeof url !== 'string') {
    throw new TypeError('page.url must be an absolute HTTP or HTTPS URL');
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new TypeError('page.url must be an absolute HTTP or HTTPS URL');
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new TypeError('page.url must be an absolute HTTP or HTTPS URL');
  }

  return {
    eventType: 'web.webpagedetails.pageViews',
    web: {
      webPageDetails: {
        name: title.trim(),
        URL: parsed.href,
        pageViews: { value: 1 },
      },
    },
  };
}
