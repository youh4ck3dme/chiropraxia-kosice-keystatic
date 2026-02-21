/**
 * SEO score (0–100) and recommendations for blog posts.
 * Used by the SEO panel component.
 */

const TITLE_IDEAL_MIN = 50;
const TITLE_IDEAL_MAX = 60;
const TITLE_ABS_MIN = 30;
const TITLE_ABS_MAX = 70;
const DESC_IDEAL_MIN = 120;
const DESC_IDEAL_MAX = 160;
const DESC_ABS_MIN = 70;
const DESC_ABS_MAX = 170;

export interface SeoInputs {
  title: string;
  metaTitle?: string | null;
  seoDescription: string;
  slug: string;
  focusKeyword?: string | null;
  coverImageAlt?: string | null;
  /** Optional: article body (MDX/HTML) for keyword count, ALT check, duplicate hint */
  body?: string | null;
}

export interface SeoRecommendation {
  id: string;
  type: 'success' | 'warning' | 'error';
  message: string;
}

export interface KeywordOccurrence {
  count: number;
  snippets: string[];
}

export interface SeoScoreResult {
  score: number;
  maxScore: number;
  recommendations: SeoRecommendation[];
  titleLength: number;
  descriptionLength: number;
  focusKeywordInTitle: boolean;
  focusKeywordInDescription: boolean;
  focusKeywordInSlug: boolean;
  /** When body + focusKeyword provided */
  keywordOccurrences?: KeywordOccurrence;
}

function clampScore(value: number): number {
  return Math.round(Math.max(0, Math.min(100, value)));
}

/** Find images in markdown/HTML that lack or have empty alt text */
export function getImagesWithoutAlt(body: string): { count: number; indices: number[] } {
  if (!body || typeof body !== 'string') return { count: 0, indices: [] };
  const indices: number[] = [];
  const mdImgRegex = /!\[([^\]]*)\]\([^)]+\)/g;
  let m: RegExpExecArray | null;
  while ((m = mdImgRegex.exec(body)) !== null) {
    if (!m[1] || !m[1].trim()) indices.push(m.index);
  }
  const htmlImgRegex = /<img[^>]*alt=["']([^"']*)["'][^>]*>/gi;
  while ((m = htmlImgRegex.exec(body)) !== null) {
    if (!m[1] || !m[1].trim()) indices.push(m.index);
  }
  const htmlImgNoAlt = /<img(?![^>]*\balt=)[^>]*>/gi;
  while ((m = htmlImgNoAlt.exec(body)) !== null) {
    indices.push(m.index);
  }
  const unique = [...new Set(indices)];
  return { count: unique.length, indices: unique };
}

/** Count focus keyword in body and return short snippets around first occurrences */
export function getKeywordOccurrences(body: string, keyword: string): KeywordOccurrence {
  if (!body || !keyword || typeof body !== 'string' || typeof keyword !== 'string') {
    return { count: 0, snippets: [] };
  }
  const k = keyword.trim().toLowerCase();
  const text = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const lower = text.toLowerCase();
  let idx = 0;
  let count = 0;
  const snippets: string[] = [];
  const snippetLen = 60;
  while ((idx = lower.indexOf(k, idx)) !== -1) {
    count++;
    if (snippets.length < 3) {
      const start = Math.max(0, idx - snippetLen / 2);
      const end = Math.min(text.length, idx + k.length + snippetLen / 2);
      snippets.push(('...' + text.slice(start, end) + '...').replace(/\s+/g, ' '));
    }
    idx += k.length;
  }
  return { count, snippets };
}

export function computeSeoScore(input: SeoInputs): SeoScoreResult {
  const metaTitle = (input.metaTitle || '').trim() || input.title;
  const title = metaTitle;
  const desc = (input.seoDescription || '').trim();
  const slug = (input.slug || '').trim().toLowerCase();
  const focus = (input.focusKeyword || '').trim().toLowerCase();
  const body = (input.body || '').trim();
  const recommendations: SeoRecommendation[] = [];

  if (body) {
    if (title && body.includes(title)) {
      recommendations.push({ id: 'dup-meta-in-body', type: 'warning', message: 'Kontrola duplicity: meta title sa vyskytuje v obsahu článku. Skontrolujte, či to nie je duplicita.' });
    }
    if (desc && body.includes(desc)) {
      recommendations.push({ id: 'dup-desc-in-body', type: 'warning', message: 'Kontrola duplicity: meta description sa vyskytuje v obsahu. Vyhnite sa duplicitným meta tagom.' });
    }
    const noAlt = getImagesWithoutAlt(body);
    if (noAlt.count > 0) {
      recommendations.push({ id: 'img-alt-missing', type: 'warning', message: `Pridajte ALT text k obrázku (${noAlt.count} obrázok/ov bez ALT v obsahu).` });
    }
  }

  let score = 0;
  const weights = {
    titleLength: 25,
    descriptionLength: 25,
    focusKeyword: 30,
    focusInTitle: 10,
    focusInDesc: 5,
    coverAlt: 5,
  };

  // Title length (0–25)
  const titleLen = title.length;
  if (titleLen >= TITLE_IDEAL_MIN && titleLen <= TITLE_IDEAL_MAX) {
    score += weights.titleLength;
    recommendations.push({ id: 'title-length', type: 'success', message: `Dĺžka meta title (${titleLen}) je v odporúčanom rozsahu 50–60 znakov.` });
  } else if (titleLen >= TITLE_ABS_MIN && titleLen <= TITLE_ABS_MAX) {
    score += weights.titleLength * 0.6;
    if (titleLen < TITLE_IDEAL_MIN) {
      recommendations.push({ id: 'title-short', type: 'warning', message: `Meta title má ${titleLen} znakov. Odporúčané: 50–60 znakov.` });
    } else {
      recommendations.push({ id: 'title-long', type: 'warning', message: `Meta title má ${titleLen} znakov. Odporúčané: 50–60 znakov.` });
    }
  } else {
    if (titleLen < TITLE_ABS_MIN) {
      recommendations.push({ id: 'title-too-short', type: 'error', message: `Meta title je príliš krátky (${titleLen} zn.). Odporúčané aspoň 30, ideálne 50–60.` });
    } else if (titleLen > TITLE_ABS_MAX) {
      recommendations.push({ id: 'title-too-long', type: 'error', message: `Meta title je príliš dlhý (${titleLen} zn.). Google zvykne skrátiť nad 70 znakov.` });
    }
  }

  // Description length (0–25)
  const descLen = desc.length;
  if (descLen >= DESC_IDEAL_MIN && descLen <= DESC_IDEAL_MAX) {
    score += weights.descriptionLength;
    recommendations.push({ id: 'desc-length', type: 'success', message: `Dĺžka meta description (${descLen}) je v odporúčanom rozsahu 120–160 znakov.` });
  } else if (descLen >= DESC_ABS_MIN && descLen <= DESC_ABS_MAX) {
    score += weights.descriptionLength * 0.6;
    if (descLen < DESC_IDEAL_MIN) {
      recommendations.push({ id: 'desc-short', type: 'warning', message: `Meta description má ${descLen} znakov. Odporúčané: 120–160 znakov.` });
    } else {
      recommendations.push({ id: 'desc-long', type: 'warning', message: `Meta description má ${descLen} znakov. Odporúčané: 120–160 znakov.` });
    }
  } else {
    if (descLen < DESC_ABS_MIN) {
      recommendations.push({ id: 'desc-too-short', type: 'error', message: `Meta description je príliš krátka (${descLen} zn.). Odporúčané 120–160 znakov.` });
    } else if (descLen > DESC_ABS_MAX) {
      recommendations.push({ id: 'desc-too-long', type: 'error', message: `Meta description je príliš dlhá (${descLen} zn.). Google zvykne skrátiť nad 160 znakov.` });
    }
  }

  const focusInTitle = !!focus && title.toLowerCase().includes(focus);
  const focusInDesc = !!focus && desc.toLowerCase().includes(focus);
  const focusInSlug = !!focus && slug.includes(focus.replace(/\s+/g, '-'));

  if (focus) {
    if (focusInTitle) {
      score += weights.focusInTitle;
      recommendations.push({ id: 'focus-title', type: 'success', message: `Kľúčové slovo „${focus}“ je v meta title.` });
    } else {
      recommendations.push({ id: 'focus-title-missing', type: 'warning', message: `Pridajte kľúčové slovo „${focus}“ do meta title (alebo názvu článku).` });
    }
    if (focusInDesc) {
      score += weights.focusInDesc;
      recommendations.push({ id: 'focus-desc', type: 'success', message: `Kľúčové slovo „${focus}“ je v meta description.` });
    } else {
      recommendations.push({ id: 'focus-desc-missing', type: 'warning', message: `Pridajte kľúčové slovo „${focus}“ do meta description.` });
    }
    if (focusInSlug) {
      score += weights.focusKeyword * 0.33;
    }
    score += weights.focusKeyword * 0.34; // partial for having a focus keyword set
  } else {
    recommendations.push({ id: 'focus-missing', type: 'warning', message: 'Vyplňte Focus Keyword pre lepšie SEO.' });
  }

  if (input.coverImageAlt && input.coverImageAlt.trim().length > 0) {
    score += weights.coverAlt;
    recommendations.push({ id: 'alt-ok', type: 'success', message: 'Titulný obrázok má vyplnený ALT text.' });
  } else {
    recommendations.push({ id: 'alt-missing', type: 'warning', message: 'Vyplňte ALT text titulného obrázka pre prístupnosť a SEO.' });
  }

  let keywordOccurrences: KeywordOccurrence | undefined;
  if (body && focus) {
    keywordOccurrences = getKeywordOccurrences(body, focus);
    if (keywordOccurrences.count > 0) {
      recommendations.push({ id: 'keyword-in-body', type: 'success', message: `Kľúčové slovo „${focus}“ sa v texte vyskytuje ${keywordOccurrences.count}×.` });
    } else {
      recommendations.push({ id: 'keyword-not-in-body', type: 'warning', message: `Kľúčové slovo „${focus}“ sa v texte nevyskytuje. Zvážte jeho použitie v odstavcoch.` });
    }
  }

  return {
    score: clampScore(score),
    maxScore: 100,
    recommendations,
    titleLength: titleLen,
    descriptionLength: descLen,
    focusKeywordInTitle: focusInTitle,
    focusKeywordInDescription: focusInDesc,
    focusKeywordInSlug: focusInSlug,
    keywordOccurrences,
  };
}

export function getGoogleSnippetDisplayTitle(title: string, metaTitle?: string | null): string {
  const t = (metaTitle || title).trim() || title;
  return t.length > 70 ? t.slice(0, 67) + '...' : t;
}

export function getGoogleSnippetDisplayDescription(description: string): string {
  const d = description.trim();
  return d.length > 160 ? d.slice(0, 157) + '...' : d;
}
