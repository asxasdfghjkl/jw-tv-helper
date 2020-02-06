import { PubPageParser } from './PubPageParser';
import { TvPageParser } from './TvPageParser';

export function createPageParser() {
  const { hostname, hash } = window.location;
  if (hostname === 'localhost') {
    return new PubPageParser('https://apps.jw.org/GETPUBMEDIALINKS?output=json&pub=thv&fileformat=m4v%2Cmp4%2C3gp%2Cmp3&alllangs=1&track=1&langwritten=CH&txtCMSLang=CH');
  } else if (hash.includes('/mediaitems/')) {
    return new TvPageParser(hash);
  } else if (document.querySelector('.jsIncludeVideo')) {
    const target = document.querySelector('.jsIncludeVideo')!;
    const jsonUrl = target.getAttribute('data-jsonurl');
    if (jsonUrl) {
      return new PubPageParser(jsonUrl);
    }
  }
  return null;
}