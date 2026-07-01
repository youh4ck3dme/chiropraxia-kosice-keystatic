import {
  computeSeoScore,
  getGoogleSnippetDisplayTitle,
  getGoogleSnippetDisplayDescription,
  type SeoScoreResult,
  type SeoRecommendation,
} from '../../lib/seo-score';

const SITE_URL = 'https://chiropraxiakosice.eu';

export interface SeoPanelProps {
  title: string;
  metaTitle?: string | null;
  seoDescription: string;
  slug: string;
  focusKeyword?: string | null;
  coverImageAlt?: string | null;
  body?: string | null;
  /** Optional: precomputed result (e.g. from server); otherwise computed from props */
  initialResult?: SeoScoreResult | null;
  className?: string;
}

function ScoreBar({ score, maxScore }: { score: number; maxScore: number }) {
  const pct = Math.round((score / maxScore) * 100);
  const color = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">SEO skóre</span>
        <span className="font-medium text-white">
          {score} / {maxScore}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function RecommendationItem({ rec }: { rec: SeoRecommendation }) {
  const icon = rec.type === 'success' ? '✓' : rec.type === 'warning' ? '!' : '✕';
  const bg =
    rec.type === 'success'
      ? 'bg-emerald-500/20 text-emerald-400'
      : rec.type === 'warning'
        ? 'bg-amber-500/20 text-amber-400'
        : 'bg-red-500/20 text-red-400';
  return (
    <li className="flex items-start gap-2 text-sm">
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${bg}`}>
        {icon}
      </span>
      <span className="text-gray-300">{rec.message}</span>
    </li>
  );
}

export default function SeoPanel({
  title,
  metaTitle,
  seoDescription,
  slug,
  focusKeyword,
  coverImageAlt,
  body,
  initialResult,
  className = '',
}: SeoPanelProps) {
  const result =
    initialResult ??
    computeSeoScore({
      title,
      metaTitle,
      seoDescription,
      slug,
      focusKeyword,
      coverImageAlt,
      body,
    });

  const displayTitle = getGoogleSnippetDisplayTitle(title, metaTitle);
  const displayDesc = getGoogleSnippetDisplayDescription(seoDescription);
  const displayUrl = `${SITE_URL}/blog/${slug}`;

  return (
    <div
      className={`space-y-4 rounded-xl border border-white/10 bg-black/40 p-4 ${className}`}
      data-testid="seo-panel"
    >
      <h3 className="border-b border-white/10 pb-2 text-lg font-semibold text-white">SEO panel</h3>

      <ScoreBar score={result.score} maxScore={result.maxScore} />

      <div>
        <h4 className="mb-2 text-sm font-medium text-gray-400">Náhľad Google Snippet</h4>
        <div
          className="space-y-1 rounded border border-white/10 bg-white/5 p-3 text-left"
          data-testid="google-snippet-preview"
        >
          <div className="cursor-pointer truncate text-lg text-blue-400 hover:underline">
            {displayTitle || '(bez title)'}
          </div>
          <div className="truncate text-sm text-green-600">{displayUrl}</div>
          <div className="line-clamp-2 text-sm text-gray-500">
            {displayDesc || '(bez meta description)'}
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium text-gray-400">Dĺžky</h4>
        <p className="text-sm text-gray-300">
          Title: {result.titleLength} zn. · Description: {result.descriptionLength} zn.
        </p>
      </div>

      {result.keywordOccurrences && result.keywordOccurrences.count > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-medium text-gray-400">
            Výskyty kľúčového slova v texte
          </h4>
          <p className="mb-1 text-sm text-gray-300">
            Počet výskytov: {result.keywordOccurrences.count}
          </p>
          {result.keywordOccurrences.snippets.length > 0 && (
            <ul className="list-inside list-disc space-y-1 text-xs text-gray-400">
              {result.keywordOccurrences.snippets.slice(0, 3).map((s, i) => (
                <li key={i} className="max-w-full truncate">
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div>
        <h4 className="mb-2 text-sm font-medium text-gray-400">Odporúčania</h4>
        <ul className="space-y-2" data-testid="seo-recommendations">
          {result.recommendations.map((rec) => (
            <RecommendationItem key={rec.id} rec={rec} />
          ))}
        </ul>
      </div>
    </div>
  );
}
