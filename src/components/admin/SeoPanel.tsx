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
  const color =
    pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">SEO skóre</span>
        <span className="font-medium text-white">{score} / {maxScore}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function RecommendationItem({ rec }: { rec: SeoRecommendation }) {
  const icon =
    rec.type === 'success' ? '✓' : rec.type === 'warning' ? '!' : '✕';
  const bg =
    rec.type === 'success'
      ? 'bg-emerald-500/20 text-emerald-400'
      : rec.type === 'warning'
        ? 'bg-amber-500/20 text-amber-400'
        : 'bg-red-500/20 text-red-400';
  return (
    <li className="flex items-start gap-2 text-sm">
      <span
        className={`shrink-0 w-5 h-5 rounded flex items-center justify-center ${bg}`}
      >
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
      className={`rounded-xl border border-white/10 bg-black/40 p-4 space-y-4 ${className}`}
      data-testid="seo-panel"
    >
      <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
        SEO panel
      </h3>

      <ScoreBar score={result.score} maxScore={result.maxScore} />

      <div>
        <h4 className="text-sm font-medium text-gray-400 mb-2">
          Náhľad Google Snippet
        </h4>
        <div
          className="rounded border border-white/10 bg-white/5 p-3 text-left space-y-1"
          data-testid="google-snippet-preview"
        >
          <div className="text-blue-400 text-lg hover:underline cursor-pointer truncate">
            {displayTitle || '(bez title)'}
          </div>
          <div className="text-green-600 text-sm truncate">{displayUrl}</div>
          <div className="text-gray-500 text-sm line-clamp-2">
            {displayDesc || '(bez meta description)'}
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-400 mb-2">
          Dĺžky
        </h4>
        <p className="text-sm text-gray-300">
          Title: {result.titleLength} zn. · Description: {result.descriptionLength} zn.
        </p>
      </div>

      {result.keywordOccurrences && result.keywordOccurrences.count > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-2">
            Výskyty kľúčového slova v texte
          </h4>
          <p className="text-sm text-gray-300 mb-1">
            Počet výskytov: {result.keywordOccurrences.count}
          </p>
          {result.keywordOccurrences.snippets.length > 0 && (
            <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
              {result.keywordOccurrences.snippets.slice(0, 3).map((s, i) => (
                <li key={i} className="truncate max-w-full">{s}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium text-gray-400 mb-2">
          Odporúčania
        </h4>
        <ul className="space-y-2" data-testid="seo-recommendations">
          {result.recommendations.map((rec) => (
            <RecommendationItem key={rec.id} rec={rec} />
          ))}
        </ul>
      </div>
    </div>
  );
}
