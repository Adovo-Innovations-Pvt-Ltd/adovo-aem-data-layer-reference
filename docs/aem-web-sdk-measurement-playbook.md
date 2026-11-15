# AEM to Adobe Analytics measurement playbook

Use this when an AEM site's data layer, Adobe Web SDK collection, and Adobe Analytics reports disagree about page views or interactions. The work starts with a measurement contract: which action matters, when it fires, which fields identify it, and how the team will prove it arrived.

## 1. Start with a reporting question

For each question, identify the event and the dimensions needed to answer it. A page view needs a stable page name and URL. A form or CTA event needs a distinct trigger and a naming rule. Record the report suite, analysis view, and owner of the definition.

## 2. Inspect the actual data layer

Open representative AEM pages in a browser and capture the events that the Adobe Client Data Layer emits. Check initial load, navigation, locale changes, and authored variations. Record the event name and field path from real pages rather than assuming a component always emits the same shape.

This repository's [page-view contract](../README.md#event-contract) uses a project-defined `page view` event with `page.title` and `page.url`. Adapt those fields to the site's actual implementation.

## 3. Map once, then test the payload

Map the agreed fields to the XDM object sent by Web SDK. Keep the mapping in one testable function and reject missing required values. [Adobe's ACDL-to-Web-SDK guide](https://experienceleague.adobe.com/en/docs/experience-platform/collection/acdl/web-sdk) shows the data layer listener and `sendEvent` pattern. The [sample mapper](../src/map-page-view.mjs) and [tests](../test/bridge.test.mjs) demonstrate this for one page-view event.

Document report-suite variables, success events, channel rules, and classification rules separately. A valid browser payload alone does not prove the final Adobe Analytics report is correct.

## 4. Treat consent and duplicate collection as launch checks

Confirm what happens before consent, after opt-in, and after opt-out with the site's CMP and Web SDK configuration. Follow the current [Adobe `setConsent` guidance](https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/setconsent). Check automatic Web SDK link collection before adding manual click tracking so the same interaction is not counted twice.

## 5. Trace one event end to end

Test the same page view at four points: data layer event, `sendEvent` payload, Adobe collection/processing, and the intended Analysis Workspace report. Compare a stable page name, URL, time window, and expected count at each point. Keep screenshots or request traces with the release record.

## Acceptance checks

- A page view is emitted once for each agreed trigger, including navigation paths.
- Missing title or invalid URL fails the mapping test.
- The consent scenarios match the agreed collection policy.
- The payload uses the intended XDM fields and reaches the expected datastream and report suite.
- Reported page names and counts can be reconciled to a browser test trace.
- Changes to the event contract trigger a review of mapping, tests, and reports.

Adovo's [published Adobe Analytics case study](https://www.adovo.ai/case-studies/adobe-analytics-enterprise-implementation) brings together separate measurement engagements and a later reporting pattern. This playbook is general operating guidance, not a claim that the sample code was deployed in those engagements.
