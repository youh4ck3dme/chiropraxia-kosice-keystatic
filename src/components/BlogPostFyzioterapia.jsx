import React from 'react';

const BlogPostFyzioterapia = () => {
  // Brand farba definovaná pre inline použitie alebo Tailwind config
  const brandColorText = 'text-[#2E8B57]';
  const brandColorBg = 'bg-[#2E8B57]';

  return (
    <article className="min-h-screen bg-white font-sans transition-colors duration-300 dark:bg-gray-900">
      {/* --- HERO SEKCIA --- */}
      <header className="relative h-64 w-full overflow-hidden md:h-96">
        <img
          src="/images/blog/fyzio-hero.jpg"
          alt="Fyzioterapia Košice - Moderná klinika"
          className="h-full w-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-gray-900/80 to-transparent">
          <div className="mx-auto w-full max-w-4xl px-4 py-8">
            <span
              className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wider text-white uppercase ${brandColorBg}`}
            >
              Zdravie & Wellness
            </span>
            <h1 className="mb-2 text-3xl leading-tight font-extrabold text-white drop-shadow-lg md:text-5xl">
              Fyzioterapia Košice: Váš dokonalý sprievodca k životu bez bolesti
            </h1>
          </div>
        </div>
      </header>

      {/* --- HLAVNÝ OBSAH --- */}
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* PEREX / ÚVOD */}
        <p className="mb-10 text-xl leading-relaxed font-medium text-gray-600 md:text-2xl dark:text-gray-300">
          Trápia vás bolesti chrbta zo sedavého zamestnania? Alebo sa zotavujete po športovom úraze?
          Odpoveďou je kvalitná <span className={brandColorText}>fyzioterapia</span>. Zistite, prečo
          je to viac než len &quot;masáž&quot; a prečo by ste mali zvážiť návštevu odborníka práve v
          Košiciach.
        </p>

        {/* TELO ČLÁNKU */}
        <div className="prose prose-lg prose-green dark:prose-invert max-w-none">
          <h2 className={`mb-4 text-2xl font-bold text-gray-900 dark:text-white`}>
            Čo je to vlastne fyzioterapia?
          </h2>
          <p className="mb-6 leading-7 text-gray-700 dark:text-gray-300">
            Mnoho ľudí si pod týmto pojmom predstaví len jednoduché naprávanie kostí. Moderná
            fyzioterapia je však komplexný medicínsky odbor. Cieľom nie je len dočasne utlmiť
            bolesť, ale <strong>odstrániť jej príčinu</strong>. Zaoberá sa diagnostikou, liečbou a
            prevenciou porúch pohybového aparátu.
          </p>

          <div className="my-10 rounded-xl border-l-4 border-[#2E8B57] bg-gray-50 p-6 shadow-sm dark:bg-gray-800">
            <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">💡 Vedeli ste?</h3>
            <p className="text-gray-700 italic dark:text-gray-300">
              Až 80% bolestí hlavy môže mať pôvod v krčnej chrbtici. Správna fyzioterapia dokáže
              tieto problémy trvalo odstrániť bez liekov.
            </p>
          </div>

          <h2 className={`mb-6 text-2xl font-bold text-gray-900 dark:text-white`}>
            5 dôvodov, prečo si vybrať fyzioterapiu
          </h2>

          <ul className="mb-10 space-y-4">
            {[
              { title: 'Život bez liekov', text: 'Prirodzená cesta k úľave bez chémie.' },
              {
                title: 'Zlepšenie mobility',
                text: 'Vrátime vám rozsah pohybu, či už pri športe alebo bežnom živote.',
              },
              { title: 'Prevencia úrazov', text: 'Naučíme vás, ako správne zaťažovať telo.' },
              { title: 'Riešenie pre každého', text: 'Od novorodencov až po seniorov.' },
              {
                title: 'Psychická pohoda',
                text: 'Odstránenie chronickej bolesti prináša novú energiu.',
              },
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <span
                  className={`h-6 w-6 flex-shrink-0 rounded-full ${brandColorBg} mt-1 mr-3 flex items-center justify-center text-white`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  <strong className="text-gray-900 dark:text-white">{item.title}:</strong>{' '}
                  {item.text}
                </span>
              </li>
            ))}
          </ul>

          <img
            src="/images/blog/fyzio-detail.jpg"
            alt="Fyzioterapeut pri práci s pacientom"
            className="mb-10 h-64 w-full rounded-xl object-cover shadow-lg md:h-80"
          />

          <h2 className={`mb-4 text-2xl font-bold text-gray-900 dark:text-white`}>
            Fyzioterapia Košice: Prečo práve u nás?
          </h2>
          <p className="mb-4 leading-7 text-gray-700 dark:text-gray-300">
            Košice sú domovom špičkových odborníkov. V našej praxi kladieme dôraz na individuálny
            prístup. Nepoužívame šablóny – váš plán liečby vychádza z dôkladného vstupného
            vyšetrenia. Využívame najnovšie poznatky vedy, manuálne techniky a moderné prístrojové
            vybavenie.
          </p>
        </div>

        {/* --- CTA / ZÁVER SEKCIA --- */}
        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
          <h3 className="mb-4 text-center text-2xl font-bold text-gray-900 dark:text-white">
            Pripravení na život bez bolesti?
          </h3>
          <p className="mx-auto mb-8 max-w-lg text-center text-gray-600 dark:text-gray-400">
            Nečakajte, kým sa bolesť zhorší. Objednajte sa na konzultáciu ešte dnes a zažite
            profesionálnu starostlivosť v Košiciach.
          </p>

<<<<<<< HEAD
          <div className="flex justify-center">
            <a
              href="/rezervacia" // Uprav podľa tvojej routing cesty
              className={` ${brandColorBg} flex transform items-center gap-2 rounded-lg px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-90 hover:shadow-xl`}
            >
              <span>Rezervovať termín</span>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
=======
                    <h2 className={`text-2xl font-bold mb-4 text-gray-900 dark:text-white`}>
                        Fyzioterapia Košice: Prečo práve u nás?
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-7">
                        Košice sú domovom špičkových odborníkov. V našej praxi kladieme dôraz na individuálny prístup.
                        Nepoužívame šablóny – váš plán liečby vychádza z dôkladného vstupného vyšetrenia.
                        Využívame najnovšie poznatky vedy, manuálne techniky a moderné prístrojové vybavenie.
                    </p>

                </div>

                {/* --- CTA / ZÁVER SEKCIA --- */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">
                        Pripravení na život bez bolesti?
                    </h3>
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
                        Nečakajte, kým sa bolesť zhorší. Objednajte sa na konzultáciu ešte dnes a zažite profesionálnu starostlivosť v Košiciach.
                    </p>

                    <div className="flex justify-center">
                        <a
                            href="https://booking.fyzioafit.sk"
                            className={`
                ${brandColorBg} text-white
                px-8 py-4 rounded-lg
                font-bold text-lg
                shadow-lg hover:shadow-xl hover:opacity-90
                transform hover:-translate-y-1 transition-all duration-300
                flex items-center gap-2
              `}
                        >
                            <span>Rezervovať termín</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </a>
                    </div>
                </div>

            </div>
        </article>
    );
>>>>>>> origin/main
};

export default BlogPostFyzioterapia;
