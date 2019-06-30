// Emulate the DOM because it's actually unavailable in the tests, i.e. the tests don't run on the browser.
// https://spectrum.chat/testing-library/help/fireevent-change-not-working-with-fireevent-submit~b9b522b7-0b8c-4d38-ae7f-c7c8f8cbb513?m=MTU1MzAxNjA3NDc3MQ==
import 'jest-dom/extend-expect';
import { JSDOM } from 'jsdom';


export const emulateDom = () => {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"><div></body></html>');
  (global as any).document = dom.window.document;
  (global as any).window = dom.window;
  (global as any).navigator = dom.window.navigator;
};
