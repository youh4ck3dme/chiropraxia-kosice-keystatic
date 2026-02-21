import { Keystatic } from '@keystatic/core/ui';
import config from '../../../keystatic.config';

export default function KeystaticApp() {
  return (
    <Keystatic 
      config={config as any} 
      appSlug={{
        envName: 'PUBLIC_KEYSTATIC_GITHUB_APP_SLUG',
        value: 'keystatic-chiropraxia-kosice'
      }}
    />
  );
}


