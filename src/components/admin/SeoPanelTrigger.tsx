import { useEffect, useState } from 'react';
import SeoPanel from './SeoPanel';

export interface SeoPanelTriggerProps {
  title: string;
  metaTitle?: string | null;
  seoDescription: string;
  slug: string;
  focusKeyword?: string | null;
  coverImageAlt?: string | null;
  body?: string | null;
}

export default function SeoPanelTrigger(props: SeoPanelTriggerProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    setShow(params.get('seo') === '1');
  }, []);

  if (!show) return null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <SeoPanel {...props} />
    </div>
  );
}
