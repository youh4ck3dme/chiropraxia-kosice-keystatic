import { describe, it, expect } from 'vitest';
import {
  computeSeoScore,
  getGoogleSnippetDisplayTitle,
  getGoogleSnippetDisplayDescription,
  getImagesWithoutAlt,
  getKeywordOccurrences,
} from './seo-score';

describe('computeSeoScore', () => {
  it('returns high score for ideal title and description length', () => {
    const result = computeSeoScore({
      title: 'Bolesť chrbta – príčiny a liečba v Košiciach',
      seoDescription:
        'Zistite príčiny bolesti chrbta a ako vám chiropraktik v Košiciach môže pomôcť. Odborná diagnostika a manuálna terapia. Objednajte sa ešte dnes.',
      slug: 'bolest-chrbta-kosice',
      focusKeyword: 'bolesť chrbta',
      coverImageAlt: 'Pacient na vyšetrení',
    });
    expect(result.score).toBeGreaterThanOrEqual(60);
    expect(result.titleLength).toBeGreaterThan(40);
    expect(result.descriptionLength).toBeGreaterThan(120);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it('returns lower score when focus keyword is missing from title', () => {
    const withKeyword = computeSeoScore({
      title: 'Bolesť chrbta – príčiny a liečba',
      seoDescription: 'A'.repeat(130),
      slug: 'bolest-chrbta',
      focusKeyword: 'bolesť chrbta',
    });
    const withoutKeyword = computeSeoScore({
      title: 'Príčiny a liečba – všeobecný prehľad',
      seoDescription: 'A'.repeat(130),
      slug: 'bolest-chrbta',
      focusKeyword: 'bolesť chrbta',
    });
    expect(withKeyword.score).toBeGreaterThan(withoutKeyword.score);
  });

  it('includes recommendation for missing cover alt', () => {
    const result = computeSeoScore({
      title: 'Test',
      seoDescription: 'A'.repeat(130),
      slug: 'test',
      coverImageAlt: '',
    });
    const altRec = result.recommendations.find((r) => r.id === 'alt-missing');
    expect(altRec).toBeDefined();
  });

  it('adds duplicate warning when body contains meta title', () => {
    const title = 'Presný názov článku';
    const result = computeSeoScore({
      title,
      seoDescription: 'Popis',
      slug: 'slug',
      body: `Úvod. ${title} je tu znova.`,
    });
    const dup = result.recommendations.find((r) => r.id === 'dup-meta-in-body');
    expect(dup).toBeDefined();
  });

  it('adds image ALT recommendation when body has image without alt', () => {
    const result = computeSeoScore({
      title: 'Test',
      seoDescription: 'A'.repeat(130),
      slug: 'test',
      body: 'Text s obrázkom ![ ](image.jpg) ďalší.',
    });
    const imgRec = result.recommendations.find((r) => r.id === 'img-alt-missing');
    expect(imgRec).toBeDefined();
  });

  it('returns keywordOccurrences when body and focusKeyword provided', () => {
    const result = computeSeoScore({
      title: 'Test',
      seoDescription: 'A'.repeat(130),
      slug: 'test',
      focusKeyword: 'chiropraxia',
      body: 'Chiropraxia pomáha. Chiropraxia je super. O chiropraxii viac.',
    });
    expect(result.keywordOccurrences).toBeDefined();
    expect(result.keywordOccurrences!.count).toBeGreaterThanOrEqual(2);
    expect(result.keywordOccurrences!.snippets.length).toBeGreaterThan(0);
  });
});

describe('getImagesWithoutAlt', () => {
  it('finds markdown images without alt', () => {
    const r = getImagesWithoutAlt('text ![ ](x.jpg) more');
    expect(r.count).toBe(1);
  });
  it('returns 0 for empty body', () => {
    expect(getImagesWithoutAlt('').count).toBe(0);
    expect(getImagesWithoutAlt('![alt](x.jpg)').count).toBe(0);
  });
});

describe('getKeywordOccurrences', () => {
  it('counts keyword in text', () => {
    const r = getKeywordOccurrences('Ahoj svet svet svet', 'svet');
    expect(r.count).toBe(3);
    expect(r.snippets.length).toBeGreaterThan(0);
  });
  it('returns 0 for empty input', () => {
    expect(getKeywordOccurrences('', 'x').count).toBe(0);
    expect(getKeywordOccurrences('text', '').count).toBe(0);
  });
});

describe('getGoogleSnippetDisplayTitle', () => {
  it('returns metaTitle when provided', () => {
    expect(getGoogleSnippetDisplayTitle('Article', 'Custom Meta')).toBe('Custom Meta');
  });
  it('returns title when metaTitle is empty', () => {
    expect(getGoogleSnippetDisplayTitle('Article', '')).toBe('Article');
    expect(getGoogleSnippetDisplayTitle('Article', null)).toBe('Article');
  });
  it('truncates at 70 chars with ellipsis', () => {
    const long = 'A'.repeat(80);
    const out = getGoogleSnippetDisplayTitle(long);
    expect(out.length).toBe(70);
    expect(out.endsWith('...')).toBe(true);
  });
});

describe('getGoogleSnippetDisplayDescription', () => {
  it('truncates description at 160 chars', () => {
    const long = 'B'.repeat(200);
    const out = getGoogleSnippetDisplayDescription(long);
    expect(out.length).toBe(160);
    expect(out.endsWith('...')).toBe(true);
  });
  it('returns short description unchanged', () => {
    const short = 'Short desc';
    expect(getGoogleSnippetDisplayDescription(short)).toBe(short);
  });
});
