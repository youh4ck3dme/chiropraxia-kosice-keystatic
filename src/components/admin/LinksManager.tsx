interface LinkCard {
  title: string;
  description: string;
  url: string;
  icon: string;
  color: string;
}

const USEFUL_LINKS: LinkCard[] = [
  {
    title: 'Keystatic CMS',
    description: 'Správa blogu, služieb a digitálnych vizitiek',
    url: '/keystatic',
    icon: '✏️',
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Supabase Dashboard',
    description: 'Databáza, autentifikácia a real-time dáta',
    url: 'https://supabase.com/dashboard',
    icon: '🗄️',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Vercel Analytics',
    description: 'Návštevnosť a výkon webu',
    url: 'https://vercel.com/dashboard',
    icon: '📊',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Sentry Monitoring',
    description: 'Sledovanie chýb a výnimiek',
    url: 'https://sentry.io',
    icon: '🐛',
    color: 'from-orange-500 to-red-500',
  },
];

export function LinksManager() {
  return (
    <>
      <h2 className="text-xl font-bold text-white mb-6">🔗 Užitočné Odkazy</h2>
      
      <div className="grid gap-4 sm:grid-cols-2">
        {USEFUL_LINKS.map((link) => (
          <a
            key={link.title}
            href={link.url}
            target={link.url.startsWith('http') ? '_blank' : undefined}
            rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="glass-card p-6 group hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${link.color} flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform`}>
                {link.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white group-hover:text-aurora transition-colors">
                  {link.title}
                </h3>
                <p className="text-sm text-chrome-gray mt-1">
                  {link.description}
                </p>
              </div>
              <svg 
                className="w-5 h-5 text-chrome-gray group-hover:text-aurora group-hover:translate-x-1 transition-all shrink-0" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 glass-card p-6 bg-aurora/5 border-aurora/30">
        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">💡 Tipy</h3>
        <ul className="space-y-2 text-sm text-chrome-gray">
          <li>• <strong>Keystatic</strong> - Na pridávanie blogov a služieb</li>
          <li>• <strong>Supabase</strong> - Na úpravu databázy rezervácií</li>
          <li>• <strong>Vercel</strong> - Na kontrolu deploymentov</li>
        </ul>
      </div>
    </>
  );
}


