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
      <h2 className="mb-6 text-xl font-bold text-white">🔗 Užitočné Odkazy</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {USEFUL_LINKS.map((link) => (
          <a
            key={link.title}
            href={link.url}
            target={link.url.startsWith('http') ? '_blank' : undefined}
            rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="glass-card group p-6 transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="flex items-start gap-4">
              <div
                className={`h-12 w-12 rounded-xl bg-linear-to-br ${link.color} flex shrink-0 items-center justify-center text-2xl transition-transform group-hover:scale-110`}
              >
                {link.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="group-hover:text-aurora font-bold text-white transition-colors">
                  {link.title}
                </h3>
                <p className="text-chrome-gray mt-1 text-sm">{link.description}</p>
              </div>
              <svg
                className="text-chrome-gray group-hover:text-aurora h-5 w-5 shrink-0 transition-all group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </a>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="glass-card bg-aurora/5 border-aurora/30 mt-8 p-6">
        <h3 className="mb-4 text-sm font-black tracking-widest text-white uppercase">💡 Tipy</h3>
        <ul className="text-chrome-gray space-y-2 text-sm">
          <li>
            • <strong>Keystatic</strong> - Na pridávanie blogov a služieb
          </li>
          <li>
            • <strong>Supabase</strong> - Na úpravu databázy rezervácií
          </li>
          <li>
            • <strong>Vercel</strong> - Na kontrolu deploymentov
          </li>
        </ul>
      </div>
    </>
  );
}
