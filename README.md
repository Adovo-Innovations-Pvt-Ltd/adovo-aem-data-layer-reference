# AEM page-view data layer to Web SDK reference

This small example maps a project-defined `page view` event from the Adobe Client Data Layer on an AEM site to an XDM `sendEvent` payload for Adobe Experience Platform Web SDK. It gives a team one place to agree on the page title, URL, trigger, and expected payload before configuring Adobe Analytics reporting.

It is a reference implementation, not an AEM package. The example has no Adobe credentials and does not send data during tests. Your AEM event shape, XDM schema, datastream, Adobe Analytics mappings, and consent flow must be checked in your own environment.

## Event contract

The project-defined data layer event is named `page view` and carries:

| Field | Meaning | Rule |
| --- | --- | --- |
| `page.title` | Reporting name for the page | Nonempty string |
| `page.url` | Canonical page URL | Absolute HTTP or HTTPS URL |

See [example/page-view.json](example/page-view.json) for a synthetic event. The mapping produces `xdm.eventType = web.webpagedetails.pageViews`, `xdm.web.webPageDetails.name`, `URL`, and `pageViews.value = 1`.

Adobe documents how to [send Adobe Client Data Layer events with Web SDK](https://experienceleague.adobe.com/en/docs/experience-platform/collection/acdl/web-sdk) and the [`sendEvent` command](https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/sendevent/overview). This repo keeps the event contract and mapping testable without needing a browser or Adobe environment.

## Try it

Node.js 20 or later is enough; no packages need installing.

```sh
node --test
node example/show-payload.mjs
```

`src/bridge.mjs` registers a listener with an existing Adobe Client Data Layer and calls a supplied `sendEvent` function. In a browser where the Web SDK is already configured, the caller can supply `payload => window.alloy("sendEvent", payload)`.

Before using this in production, settle when the event fires, confirm the fields against the site's actual data layer, and connect consent through the site's CMP and Web SDK configuration. Adobe's [`setConsent` documentation](https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/setconsent) describes the SDK side. Check whether automatic link collection is enabled before adding separate click listeners.

For delivery context, see Adovo's [Adobe Analytics measurement case study](https://www.adovo.ai/case-studies/adobe-analytics-enterprise-implementation) and [Adobe Experience Cloud services](https://www.adovo.ai/services/adobe).

## License

MIT. See [LICENSE](LICENSE).
