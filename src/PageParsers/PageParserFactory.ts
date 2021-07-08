import { PubicationMediaParser } from './PublicationMediaParser';
import { TvPageParser } from './TvPageParser';

export async function createPageParser() {
  const { hostname, hash, href } = window.location;
  if (hostname === 'localhost') {
    return new PubicationMediaParser('https://apps.jw.org/GETPUBMEDIALINKS?output=json&pub=thv&fileformat=m4v%2Cmp4%2C3gp%2Cmp3&alllangs=1&track=1&langwritten=CH&txtCMSLang=CH');
  } else if (hash.includes('/mediaitems/')) {
    return new TvPageParser(hash);
  } else if (document.querySelector('video')) {
    const fromCurrent = getJsonUrl(document);
    if (fromCurrent) {
      return fromCurrent;
    }
    const page = await fetch(href);
    const html = await page.text();
    const vdom = document.createElement('html');
    vdom.innerHTML = html;
    const fromSource = getJsonUrl(vdom);
    if (fromSource) {
      return fromSource;
    }
  }
  return null;
}

function getJsonUrl(dom: HTMLElement | Document) {
  const target = dom.querySelector('.jsIncludeVideo');
  if (!target) {
    return null;
  }
  const jsonUrl = target.getAttribute('data-jsonurl');
  if (jsonUrl) {
    return new PubicationMediaParser(jsonUrl);
  }
}