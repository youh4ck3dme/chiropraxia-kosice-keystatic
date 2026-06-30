import React from 'react';

const BlogPostFyzioterapia = () => {
    // Brand farba definovaná pre inline použitie alebo Tailwind config
    const brandColorText = "text-[#2E8B57]";
    const brandColorBg = "bg-[#2E8B57]";

    return (
        <article className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 font-sans">
            {/* --- HERO SEKCIA --- */}
            <header className="relative w-full h-64 md:h-96 overflow-hidden">
                <img
                    src="/images/blog/fyzio-hero.jpg"
                    alt="Fyzioterapia Košice - Moderná klinika"
                    className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent flex items-end">
                    <div className="max-w-4xl mx-auto px-4 py-8 w-full">
                        <span className={`inline-block px-3 py-1 mb-3 text-xs font-bold tracking-wider text-white uppercase rounded-full ${brandColorBg}`}>
                            Zdravie & Wellness
                        </span>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-2 drop-shadow-lg">
                            Fyzioterapia Košice: Váš dokonalý sprievodca k životu bez bolesti
                        </h1>
                    </div>
                </div>
            </header>

            {/* --- HLAVNÝ OBSAH --- */}
            <div className="max-w-3xl mx-auto px-4 py-12">

                {/* PEREX / ÚVOD */}
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed mb-10 font-medium">
                    Trápia vás bolesti chrbta zo sedavého zamestnania? Alebo sa zotavujete po športovom úraze?
                    Odpoveďou je kvalitná <span className={brandColorText}>fyzioterapia</span>. Zistite, prečo je to viac než len "masáž"
                    a prečo by ste mali zvážiť návštevu odborníka práve v Košiciach.
                </p>

                {/* TELO ČLÁNKU */}
                <div className="prose prose-lg prose-green dark:prose-invert max-w-none">

                    <h2 className={`text-2xl font-bold mb-4 text-gray-900 dark:text-white`}>
                        Čo je to vlastne fyzioterapia?
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-7">
                        Mnoho ľudí si pod týmto pojmom predstaví len jednoduché naprávanie kostí. Moderná fyzioterapia je však komplexný medicínsky odbor.
                        Cieľom nie je len dočasne utlmiť bolesť, ale <strong>odstrániť jej príčinu</strong>. Zaoberá sa diagnostikou, liečbou a prevenciou porúch pohybového aparátu.
                    </p>

                    <div className="my-10 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border-l-4 border-[#2E8B57] shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">💡 Vedeli ste?</h3>
                        <p className="text-gray-700 dark:text-gray-300 italic">
                            Až 80% bolestí hlavy môže mať pôvod v krčnej chrbtici. Správna fyzioterapia dokáže tieto problémy trvalo odstrániť bez liekov.
                        </p>
                    </div>

                    <h2 className={`text-2xl font-bold mb-6 text-gray-900 dark:text-white`}>
                        5 dôvodov, prečo si vybrať fyzioterapiu
                    </h2>

                    <ul className="space-y-4 mb-10">
                        {[
                            { title: "Život bez liekov", text: "Prirodzená cesta k úľave bez chémie." },
                            { title: "Zlepšenie mobility", text: "Vrátime vám rozsah pohybu, či už pri športe alebo bežnom živote." },
                            { title: "Prevencia úrazov", text: "Naučíme vás, ako správne zaťažovať telo." },
                            { title: "Riešenie pre každého", text: "Od novorodencov až po seniorov." },
                            { title: "Psychická pohoda", text: "Odstránenie chronickej bolesti prináša novú energiu." }
                        ].map((item, index) => (
                            <li key={index} className="flex items-start">
                                <span className={`flex-shrink-0 w-6 h-6 rounded-full ${brandColorBg} text-white flex items-center justify-center mr-3 mt-1`}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </span>
                                <span className="text-gray-700 dark:text-gray-300">
                                    <strong className="text-gray-900 dark:text-white">{item.title}:</strong> {item.text}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <img
                        src="/images/blog/fyzio-detail.jpg"
                        alt="Fyzioterapeut pri práci s pacientom"
                        className="w-full rounded-xl shadow-lg mb-10 object-cover h-64 md:h-80"
                    />

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
};

export default BlogPostFyzioterapia;
