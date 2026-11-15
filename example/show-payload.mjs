import { readFileSync } from 'node:fs';
import { mapPageView } from '../src/map-page-view.mjs';

const event = JSON.parse(readFileSync(new URL('./page-view.json', import.meta.url)));
console.log(JSON.stringify({ xdm: mapPageView(event) }, null, 2));
