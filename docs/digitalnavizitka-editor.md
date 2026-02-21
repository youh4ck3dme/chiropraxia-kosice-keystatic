<!DOCTYPE html>
<html lang="sk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>FYZIO&FIT | Jaroslav Begala</title>
    
    <!-- Ikony a Fonty -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">

    <style>
        :root {
            --bg-dark: #050505;
            --glass-panel: rgba(255, 255, 255, 0.03);
            --glass-border: rgba(255, 255, 255, 0.08);
            --gold-primary: #D4AF37;
            --gold-gradient: linear-gradient(135deg, #FFD700 0%, #FDB931 50%, #C08805 100%);
            --teal-glow: rgba(20, 184, 166, 0.4);
            --teal-solid: #14b8a6;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

        body {
            font-family: 'Outfit', sans-serif;
            background-color: var(--bg-dark);
            color: #fff;
            height: 100dvh;
            width: 100vw;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
        }

        /* --- NOISE TEXTURE (Matné sklo) --- */
        body::after {
            content: "";
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
            pointer-events: none;
            z-index: 5;
            opacity: 0.4;
        }

        /* --- LIQUID BLOBS (Animované pozadie) --- */
        .blob {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            z-index: 0;
            opacity: 0.6;
            animation: morph 15s infinite ease-in-out alternate;
        }

        .blob-1 {
            top: -10%; left: -20%; width: 400px; height: 400px;
            background: var(--teal-glow);
            animation-duration: 20s;
        }
        
        .blob-2 {
            bottom: -20%; right: -20%; width: 350px; height: 350px;
            background: radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, transparent 70%);
            animation-delay: -5s;
            animation-duration: 25s;
        }

        @keyframes morph {
            0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: translate(0, 0) rotate(0deg); }
            33% { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; transform: translate(30px, 50px) rotate(10deg); }
            66% { border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%; transform: translate(-20px, 20px) rotate(-5deg); }
            100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: translate(0, 0) rotate(0deg); }
        }

        /* --- HLAVNÝ KONTAJNER --- */
        .app-container {
            position: relative;
            z-index: 10;
            width: 100%;
            height: 100%;
            max-width: 450px;
            background: rgba(15, 15, 15, 0.4);
            backdrop-filter: blur(30px) saturate(180%);
            -webkit-backdrop-filter: blur(30px) saturate(180%);
            display: flex;
            flex-direction: column;
            border-left: 1px solid rgba(255,255,255,0.05);
            border-right: 1px solid rgba(255,255,255,0.05);
            box-shadow: 0 0 50px rgba(0,0,0,0.5);
        }

        .app-container::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            z-index: 11;
        }

        /* --- COVER AREA --- */
        .cover-area {
            height: 38%;
            width: 100%;
            position: relative;
            /* Nahraď vlastným obrázkom */
            background: url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop') center/cover no-repeat;
            mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
            -webkit-mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
        }
        
        .cover-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, rgba(5,5,5,0.1), rgba(5,5,5,0.8));
        }

        /* --- PROFILE --- */
        .profile-section {
            margin-top: -70px;
            text-align: center;
            padding: 0 24px;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            z-index: 20;
        }

        .avatar-wrapper {
            width: 115px;
            height: 115px;
            border-radius: 50%;
            padding: 3px;
            background: var(--gold-gradient);
            box-shadow: 0 10px 40px rgba(0,0,0,0.6);
            margin-bottom: 15px;
            position: relative;
        }

        /* Pulzujúca žiara */
        .avatar-wrapper::after {
            content: '';
            position: absolute;
            top: -5px; left: -5px; right: -5px; bottom: -5px;
            border-radius: 50%;
            background: var(--gold-gradient);
            z-index: -1;
            filter: blur(15px);
            opacity: 0.3;
            animation: pulse-gold 3s infinite;
        }

        @keyframes pulse-gold {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.05); }
        }

        .avatar {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #1a1a1a;
            /* Nahraď profilovkou */
            background: url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop') center/cover;
        }

        /* --- TEXTY --- */
        .brand-name {
            font-size: 30px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            background: var(--gold-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 4px;
            filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.3));
        }

        .person-name {
            font-size: 17px;
            color: #fff;
            font-weight: 500;
            margin-bottom: 2px;
            text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }

        .job-title {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.6);
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 20px;
        }

        .bio-box {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 16px 20px;
            border-radius: 20px;
            font-size: 14px;
            line-height: 1.5;
            color: #d1d5db;
            max-width: 100%;
            margin-bottom: 25px;
            backdrop-filter: blur(5px);
            box-shadow: inset 0 0 20px rgba(0,0,0,0.2);
        }

        /* --- ACTION GRID (4 Ikony) --- */
        .action-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            gap: 10px;
            width: 100%;
            margin-bottom: auto;
        }

        .icon-btn {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            padding: 16px 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 8px;
            color: white;
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            cursor: pointer;
        }

        /* Odlesk pri hoveri */
        .icon-btn::before {
            content: '';
            position: absolute;
            top: 0; left: -100%; width: 100%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            transition: 0.5s;
        }
        
        .icon-btn:active { transform: scale(0.96); background: rgba(255,255,255,0.06); }
        .icon-btn i { font-size: 20px; color: var(--gold-primary); filter: drop-shadow(0 0 8px rgba(212,175,55,0.4)); }
        .icon-btn span { font-size: 11px; font-weight: 500; opacity: 0.7; white-space: nowrap; }

        /* Špecifický štýl pre AI tlačidlo */
        .btn-ai {
            border-color: rgba(20, 184, 166, 0.3);
            background: rgba(20, 184, 166, 0.05);
        }
        .btn-ai i { color: var(--teal-solid); filter: drop-shadow(0 0 8px rgba(20, 184, 166, 0.6)); }

        /* --- BOTTOM BUTTONS --- */
        .bottom-actions {
            width: 100%;
            padding: 20px 0 30px 0;
            display: flex;
            gap: 12px;
        }

        .btn-large {
            flex: 1;
            padding: 18px;
            border-radius: 22px;
            font-weight: 700;
            font-size: 15px;
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: transform 0.2s;
            position: relative;
            overflow: hidden;
        }

        .btn-web {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            color: #fff;
        }

        .btn-save {
            background: var(--gold-gradient);
            color: #1a1002;
            border: none;
            box-shadow: 0 5px 20px rgba(212, 175, 55, 0.3);
            z-index: 1;
        }

        /* Shimmer animácia na tlačidle Uložiť */
        .btn-save::before {
            content: '';
            position: absolute;
            top: 0; left: -100%; width: 50%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
            transform: skewX(-20deg);
            animation: shimmer 4s infinite;
            pointer-events: none;
        }

        @keyframes shimmer { 0%, 80% { left: -100%; } 100% { left: 200%; } }
        .btn-large:active { transform: scale(0.97); }

        /* --- AI MODAL WINDOW --- */
        .modal {
            display: none;
            position: fixed;
            z-index: 100;
            left: 0; top: 0; width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.8);
            backdrop-filter: blur(15px);
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .modal-content {
            background: linear-gradient(145deg, rgba(20,20,20,0.95), rgba(5,5,5,0.98));
            border: 1px solid var(--teal-glow);
            width: 100%;
            max-width: 400px;
            border-radius: 24px;
            padding: 24px;
            position: relative;
            box-shadow: 0 0 50px rgba(20, 184, 166, 0.15);
            animation: modalPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes modalPop {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        .close-btn {
            position: absolute;
            top: 15px; right: 20px;
            color: #666;
            font-size: 28px;
            cursor: pointer;
            transition: color 0.2s;
        }
        .close-btn:hover { color: #fff; }

        .modal-header {
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            padding-bottom: 15px;
        }

        .modal-header i { color: var(--teal-solid); font-size: 24px; }
        .modal-header h2 { font-size: 18px; margin: 0; color: #fff; font-weight: 600; letter-spacing: 0.5px; }

        .ai-input-area { width: 100%; margin-bottom: 15px; }

        .ai-input {
            width: 100%;
            padding: 14px;
            border-radius: 16px;
            border: 1px solid rgba(255,255,255,0.1);
            background: rgba(255,255,255,0.03);
            color: #fff;
            font-family: 'Outfit', sans-serif;
            font-size: 15px;
            resize: none;
            height: 90px;
            transition: border-color 0.3s;
        }

        .ai-input:focus { outline: none; border-color: var(--teal-solid); background: rgba(20, 184, 166, 0.05); }

        .ai-submit-btn {
            width: 100%;
            padding: 14px;
            border-radius: 16px;
            border: none;
            background: linear-gradient(135deg, #14b8a6 0%, #0f766e 100%);
            color: white;
            font-weight: 600;
            font-size: 15px;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 15px rgba(20, 184, 166, 0.3);
        }

        .ai-submit-btn:active { transform: scale(0.98); }
        .ai-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .ai-response {
            margin-top: 20px;
            padding: 16px;
            background: rgba(255,255,255,0.03);
            border-radius: 16px;
            font-size: 14px;
            line-height: 1.6;
            color: #e2e8f0;
            display: none;
            border-left: 3px solid var(--teal-solid);
        }

        .loader {
            display: none;
            text-align: center;
            margin-top: 20px;
        }
        .loader i { color: var(--teal-solid); animation: spin 1s infinite linear; font-size: 24px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    </style>
</head>
<body>

    <!-- Animované pozadie -->
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>

    <main class="app-container">
        
        <div class="cover-area">
            <div class="cover-overlay"></div>
        </div>

        <div class="profile-section">
            
            <div class="avatar-wrapper">
                <div class="avatar"></div>
            </div>

            <h1 class="brand-name">FYZIO&FIT</h1>
            <h2 class="person-name">Jaroslav Begala</h2>
            <p class="job-title">Fyzioterapeut</p>

            <div class="bio-box">
                "FYZIO&FIT - Poskytovanie masáží, fyzioterapie a chiropraxie na profesionálnej úrovni"
            </div>

            <div class="action-grid">
                <!-- Instagram -->
                <a href="#" class="icon-btn">
                    <i class="fab fa-instagram"></i>
                    <span>Instagram</span>
                </a>
                <!-- O nás -->
                <a href="#" class="icon-btn">
                    <i class="fas fa-info-circle"></i>
                    <span>O nás</span>
                </a>
                <!-- Telefón -->
                <a href="tel:+421900000000" class="icon-btn">
                    <i class="fas fa-phone-alt"></i>
                    <span>Zavolať</span>
                </a>
                <!-- AI Button -->
                <div class="icon-btn btn-ai" id="openAiModal">
                    <i class="fas fa-brain"></i>
                    <span>AI Poradňa</span>
                </div>
            </div>

            <div class="bottom-actions">
                <a href="https://chiropraxiakosice.eu" class="btn-large btn-web">
                    <i class="fas fa-globe"></i>
                    Web
                </a>
                <a href="#" class="btn-large btn-save">
                    <i class="fas fa-user-plus"></i>
                    Uložiť kontakt
                </a>
            </div>

        </div>
    </main>

    <!-- AI MODAL OKNO -->
    <div id="aiModal" class="modal">
        <div class="modal-content">
            <span class="close-btn" id="closeAiModal">&times;</span>
            
            <div class="modal-header">
                <i class="fas fa-robot"></i>
                <h2>AI Asistent FYZIO&FIT</h2>
            </div>
            
            <p style="font-size: 13px; color: #aaa; margin-bottom: 20px; line-height: 1.4;">
                Opíšte svoj problém (napr. "bolí ma krk", "seklo ma v krížoch") a AI vám poskytne rýchlu radu prvej pomoci.
                <br><br>
                <em style="color: #d4af37;">*Nenahrádza lekárske vyšetrenie.*</em>
            </p>
            
            <div class="ai-input-area">
                <textarea class="ai-input" id="userQuestion" placeholder="Napíšte sem, čo vás trápi..."></textarea>
            </div>
            
            <button class="ai-submit-btn" id="askAiBtn">
                <i class="fas fa-paper-plane" style="margin-right: 8px;"></i> Odoslať otázku
            </button>
            
            <div class="loader" id="aiLoader">
                <i class="fas fa-circle-notch"></i>
            </div>
            
            <div class="ai-response" id="aiResponse"></div>
        </div>
    </div>

    <script>
        // --- vCard Logic (Uloženie kontaktu) ---
        document.querySelector('.btn-save').addEventListener('click', function(e) {
            e.preventDefault();
            
            // ⚠️ UPRAVTE SI ÚDAJE TU:
            var vCardData = [
                'BEGIN:VCARD', 'VERSION:3.0',
                'FN:Jaroslav Begala - FYZIO&FIT', 
                'ORG:FYZIO&FIT', 
                'TITLE:Fyzioterapeut',
                'TEL;TYPE=WORK,VOICE:+421900000000', // <-- Zmeň číslo
                'URL:https://chiropraxiakosice.eu',
                'END:VCARD'
            ].join('\n');

            var blob = new Blob([vCardData], { type: 'text/vcard' });
            var url = URL.createObjectURL(blob);
            var newLink = document.createElement('a');
            newLink.download = "jaroslav-begala.vcf";
            newLink.href = url; newLink.click();
        });

        // --- AI Modal Ovládanie ---
        const modal = document.getElementById("aiModal");
        const openBtn = document.getElementById("openAiModal");
        const closeBtn = document.getElementById("closeAiModal");
        const askBtn = document.getElementById("askAiBtn");
        const responseDiv = document.getElementById("aiResponse");
        const loader = document.getElementById("aiLoader");
        const input = document.getElementById("userQuestion");

        openBtn.onclick = function() { modal.style.display = "flex"; }
        closeBtn.onclick = function() { modal.style.display = "none"; }
        window.onclick = function(event) { if (event.target == modal) { modal.style.display = "none"; } }

        // --- GEMINI API INTEGRÁCIA ---
        const apiKey = ""; // ⚠️ API Kľúč je vložený systémom, alebo ho doplňte tu

        askBtn.onclick = async function() {
            const question = input.value.trim();
            if (!question) return;

            // UI Stav: Načítavanie
            responseDiv.style.display = "none";
            loader.style.display = "block";
            askBtn.disabled = true;
            askBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzujem...';

            try {
                // Prompt pre AI (Inštrukcie)
                const prompt = `Si profesionálny AI asistent pre fyzioterapeutickú kliniku FYZIO&FIT. 
                Klient sa pýta: "${question}".
                
                Tvoja úloha:
                1. Odpovedz stručne, empaticky a v slovenčine.
                2. Ak sa pýta na bolesť, daj 1-2 bezpečné rady prvej pomoci (teplo/chlad, kľudový režim).
                3. Vždy na záver odporuč objednanie sa na vyšetrenie na klinike.
                4. Nepíš dlhé lekárske správy, buď ako skúsený recepčný/konzultant.`;
                
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }]
                    })
                });

                const data = await response.json();
                const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Ospravedlňujeme sa, systém je momentálne vyťažený.";
                
                // Formátovanie textu
                const formattedText = aiText.replace(/\n/g, "<br>");

                responseDiv.innerHTML = formattedText;
                responseDiv.style.display = "block";

            } catch (error) {
                console.error("Error:", error);
                responseDiv.innerHTML = "Chyba pripojenia k AI. Skontrolujte internet alebo API kľúč.";
                responseDiv.style.display = "block";
            } finally {
                loader.style.display = "none";
                askBtn.disabled = false;
                askBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Odoslať otázku';
            }
        }
    </script>
</body>
</html><!DOCTYPE html>
<html lang="sk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>FYZIO&FIT | Jaroslav Begala</title>
    
    <!-- Ikony a Fonty -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">

    <style>
        :root {
            --bg-dark: #050505;
            --glass-panel: rgba(255, 255, 255, 0.03);
            --glass-border: rgba(255, 255, 255, 0.08);
            --gold-primary: #D4AF37;
            --gold-gradient: linear-gradient(135deg, #FFD700 0%, #FDB931 50%, #C08805 100%);
            --teal-glow: rgba(20, 184, 166, 0.4);
            --teal-solid: #14b8a6;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

        body {
            font-family: 'Outfit', sans-serif;
            background-color: var(--bg-dark);
            color: #fff;
            height: 100dvh;
            width: 100vw;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
        }

        /* --- NOISE TEXTURE (Matné sklo) --- */
        body::after {
            content: "";
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
            pointer-events: none;
            z-index: 5;
            opacity: 0.4;
        }

        /* --- LIQUID BLOBS (Animované pozadie) --- */
        .blob {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            z-index: 0;
            opacity: 0.6;
            animation: morph 15s infinite ease-in-out alternate;
        }

        .blob-1 {
            top: -10%; left: -20%; width: 400px; height: 400px;
            background: var(--teal-glow);
            animation-duration: 20s;
        }
        
        .blob-2 {
            bottom: -20%; right: -20%; width: 350px; height: 350px;
            background: radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, transparent 70%);
            animation-delay: -5s;
            animation-duration: 25s;
        }

        @keyframes morph {
            0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: translate(0, 0) rotate(0deg); }
            33% { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; transform: translate(30px, 50px) rotate(10deg); }
            66% { border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%; transform: translate(-20px, 20px) rotate(-5deg); }
            100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: translate(0, 0) rotate(0deg); }
        }

        /* --- HLAVNÝ KONTAJNER --- */
        .app-container {
            position: relative;
            z-index: 10;
            width: 100%;
            height: 100%;
            max-width: 450px;
            background: rgba(15, 15, 15, 0.4);
            backdrop-filter: blur(30px) saturate(180%);
            -webkit-backdrop-filter: blur(30px) saturate(180%);
            display: flex;
            flex-direction: column;
            border-left: 1px solid rgba(255,255,255,0.05);
            border-right: 1px solid rgba(255,255,255,0.05);
            box-shadow: 0 0 50px rgba(0,0,0,0.5);
        }

        .app-container::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            z-index: 11;
        }

        /* --- COVER AREA --- */
        .cover-area {
            height: 38%;
            width: 100%;
            position: relative;
            /* Nahraď vlastným obrázkom */
            background: url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop') center/cover no-repeat;
            mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
            -webkit-mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
        }
        
        .cover-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, rgba(5,5,5,0.1), rgba(5,5,5,0.8));
        }

        /* --- PROFILE --- */
        .profile-section {
            margin-top: -70px;
            text-align: center;
            padding: 0 24px;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            z-index: 20;
        }

        .avatar-wrapper {
            width: 115px;
            height: 115px;
            border-radius: 50%;
            padding: 3px;
            background: var(--gold-gradient);
            box-shadow: 0 10px 40px rgba(0,0,0,0.6);
            margin-bottom: 15px;
            position: relative;
        }

        /* Pulzujúca žiara */
        .avatar-wrapper::after {
            content: '';
            position: absolute;
            top: -5px; left: -5px; right: -5px; bottom: -5px;
            border-radius: 50%;
            background: var(--gold-gradient);
            z-index: -1;
            filter: blur(15px);
            opacity: 0.3;
            animation: pulse-gold 3s infinite;
        }

        @keyframes pulse-gold {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.05); }
        }

        .avatar {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #1a1a1a;
            /* Nahraď profilovkou */
            background: url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop') center/cover;
        }

        /* --- TEXTY --- */
        .brand-name {
            font-size: 30px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            background: var(--gold-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 4px;
            filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.3));
        }

        .person-name {
            font-size: 17px;
            color: #fff;
            font-weight: 500;
            margin-bottom: 2px;
            text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }

        .job-title {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.6);
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 20px;
        }

        .bio-box {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 16px 20px;
            border-radius: 20px;
            font-size: 14px;
            line-height: 1.5;
            color: #d1d5db;
            max-width: 100%;
            margin-bottom: 25px;
            backdrop-filter: blur(5px);
            box-shadow: inset 0 0 20px rgba(0,0,0,0.2);
        }

        /* --- ACTION GRID (4 Ikony) --- */
        .action-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            gap: 10px;
            width: 100%;
            margin-bottom: auto;
        }

        .icon-btn {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            padding: 16px 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 8px;
            color: white;
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            cursor: pointer;
        }

        /* Odlesk pri hoveri */
        .icon-btn::before {
            content: '';
            position: absolute;
            top: 0; left: -100%; width: 100%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            transition: 0.5s;
        }
        
        .icon-btn:active { transform: scale(0.96); background: rgba(255,255,255,0.06); }
        .icon-btn i { font-size: 20px; color: var(--gold-primary); filter: drop-shadow(0 0 8px rgba(212,175,55,0.4)); }
        .icon-btn span { font-size: 11px; font-weight: 500; opacity: 0.7; white-space: nowrap; }

        /* Špecifický štýl pre AI tlačidlo */
        .btn-ai {
            border-color: rgba(20, 184, 166, 0.3);
            background: rgba(20, 184, 166, 0.05);
        }
        .btn-ai i { color: var(--teal-solid); filter: drop-shadow(0 0 8px rgba(20, 184, 166, 0.6)); }

        /* --- BOTTOM BUTTONS --- */
        .bottom-actions {
            width: 100%;
            padding: 20px 0 30px 0;
            display: flex;
            gap: 12px;
        }

        .btn-large {
            flex: 1;
            padding: 18px;
            border-radius: 22px;
            font-weight: 700;
            font-size: 15px;
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: transform 0.2s;
            position: relative;
            overflow: hidden;
        }

        .btn-web {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            color: #fff;
        }

        .btn-save {
            background: var(--gold-gradient);
            color: #1a1002;
            border: none;
            box-shadow: 0 5px 20px rgba(212, 175, 55, 0.3);
            z-index: 1;
        }

        /* Shimmer animácia na tlačidle Uložiť */
        .btn-save::before {
            content: '';
            position: absolute;
            top: 0; left: -100%; width: 50%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
            transform: skewX(-20deg);
            animation: shimmer 4s infinite;
            pointer-events: none;
        }

        @keyframes shimmer { 0%, 80% { left: -100%; } 100% { left: 200%; } }
        .btn-large:active { transform: scale(0.97); }

        /* --- AI MODAL WINDOW --- */
        .modal {
            display: none;
            position: fixed;
            z-index: 100;
            left: 0; top: 0; width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.8);
            backdrop-filter: blur(15px);
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .modal-content {
            background: linear-gradient(145deg, rgba(20,20,20,0.95), rgba(5,5,5,0.98));
            border: 1px solid var(--teal-glow);
            width: 100%;
            max-width: 400px;
            border-radius: 24px;
            padding: 24px;
            position: relative;
            box-shadow: 0 0 50px rgba(20, 184, 166, 0.15);
            animation: modalPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes modalPop {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        .close-btn {
            position: absolute;
            top: 15px; right: 20px;
            color: #666;
            font-size: 28px;
            cursor: pointer;
            transition: color 0.2s;
        }
        .close-btn:hover { color: #fff; }

        .modal-header {
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            padding-bottom: 15px;
        }

        .modal-header i { color: var(--teal-solid); font-size: 24px; }
        .modal-header h2 { font-size: 18px; margin: 0; color: #fff; font-weight: 600; letter-spacing: 0.5px; }

        .ai-input-area { width: 100%; margin-bottom: 15px; }

        .ai-input {
            width: 100%;
            padding: 14px;
            border-radius: 16px;
            border: 1px solid rgba(255,255,255,0.1);
            background: rgba(255,255,255,0.03);
            color: #fff;
            font-family: 'Outfit', sans-serif;
            font-size: 15px;
            resize: none;
            height: 90px;
            transition: border-color 0.3s;
        }

        .ai-input:focus { outline: none; border-color: var(--teal-solid); background: rgba(20, 184, 166, 0.05); }

        .ai-submit-btn {
            width: 100%;
            padding: 14px;
            border-radius: 16px;
            border: none;
            background: linear-gradient(135deg, #14b8a6 0%, #0f766e 100%);
            color: white;
            font-weight: 600;
            font-size: 15px;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 15px rgba(20, 184, 166, 0.3);
        }

        .ai-submit-btn:active { transform: scale(0.98); }
        .ai-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .ai-response {
            margin-top: 20px;
            padding: 16px;
            background: rgba(255,255,255,0.03);
            border-radius: 16px;
            font-size: 14px;
            line-height: 1.6;
            color: #e2e8f0;
            display: none;
            border-left: 3px solid var(--teal-solid);
        }

        .loader {
            display: none;
            text-align: center;
            margin-top: 20px;
        }
        .loader i { color: var(--teal-solid); animation: spin 1s infinite linear; font-size: 24px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    </style>
</head>
<body>

    <!-- Animované pozadie -->
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>

    <main class="app-container">
        
        <div class="cover-area">
            <div class="cover-overlay"></div>
        </div>

        <div class="profile-section">
            
            <div class="avatar-wrapper">
                <div class="avatar"></div>
            </div>

            <h1 class="brand-name">FYZIO&FIT</h1>
            <h2 class="person-name">Jaroslav Begala</h2>
            <p class="job-title">Fyzioterapeut</p>

            <div class="bio-box">
                "FYZIO&FIT - Poskytovanie masáží, fyzioterapie a chiropraxie na profesionálnej úrovni"
            </div>

            <div class="action-grid">
                <!-- Instagram -->
                <a href="#" class="icon-btn">
                    <i class="fab fa-instagram"></i>
                    <span>Instagram</span>
                </a>
                <!-- O nás -->
                <a href="#" class="icon-btn">
                    <i class="fas fa-info-circle"></i>
                    <span>O nás</span>
                </a>
                <!-- Telefón -->
                <a href="tel:+421900000000" class="icon-btn">
                    <i class="fas fa-phone-alt"></i>
                    <span>Zavolať</span>
                </a>
                <!-- AI Button -->
                <div class="icon-btn btn-ai" id="openAiModal">
                    <i class="fas fa-brain"></i>
                    <span>AI Poradňa</span>
                </div>
            </div>

            <div class="bottom-actions">
                <a href="https://chiropraxiakosice.eu" class="btn-large btn-web">
                    <i class="fas fa-globe"></i>
                    Web
                </a>
                <a href="#" class="btn-large btn-save">
                    <i class="fas fa-user-plus"></i>
                    Uložiť kontakt
                </a>
            </div>

        </div>
    </main>

    <!-- AI MODAL OKNO -->
    <div id="aiModal" class="modal">
        <div class="modal-content">
            <span class="close-btn" id="closeAiModal">&times;</span>
            
            <div class="modal-header">
                <i class="fas fa-robot"></i>
                <h2>AI Asistent FYZIO&FIT</h2>
            </div>
            
            <p style="font-size: 13px; color: #aaa; margin-bottom: 20px; line-height: 1.4;">
                Opíšte svoj problém (napr. "bolí ma krk", "seklo ma v krížoch") a AI vám poskytne rýchlu radu prvej pomoci.
                <br><br>
                <em style="color: #d4af37;">*Nenahrádza lekárske vyšetrenie.*</em>
            </p>
            
            <div class="ai-input-area">
                <textarea class="ai-input" id="userQuestion" placeholder="Napíšte sem, čo vás trápi..."></textarea>
            </div>
            
            <button class="ai-submit-btn" id="askAiBtn">
                <i class="fas fa-paper-plane" style="margin-right: 8px;"></i> Odoslať otázku
            </button>
            
            <div class="loader" id="aiLoader">
                <i class="fas fa-circle-notch"></i>
            </div>
            
            <div class="ai-response" id="aiResponse"></div>
        </div>
    </div>

    <script>
        // --- vCard Logic (Uloženie kontaktu) ---
        document.querySelector('.btn-save').addEventListener('click', function(e) {
            e.preventDefault();
            
            // ⚠️ UPRAVTE SI ÚDAJE TU:
            var vCardData = [
                'BEGIN:VCARD', 'VERSION:3.0',
                'FN:Jaroslav Begala - FYZIO&FIT', 
                'ORG:FYZIO&FIT', 
                'TITLE:Fyzioterapeut',
                'TEL;TYPE=WORK,VOICE:+421900000000', // <-- Zmeň číslo
                'URL:https://chiropraxiakosice.eu',
                'END:VCARD'
            ].join('\n');

            var blob = new Blob([vCardData], { type: 'text/vcard' });
            var url = URL.createObjectURL(blob);
            var newLink = document.createElement('a');
            newLink.download = "jaroslav-begala.vcf";
            newLink.href = url; newLink.click();
        });

        // --- AI Modal Ovládanie ---
        const modal = document.getElementById("aiModal");
        const openBtn = document.getElementById("openAiModal");
        const closeBtn = document.getElementById("closeAiModal");
        const askBtn = document.getElementById("askAiBtn");
        const responseDiv = document.getElementById("aiResponse");
        const loader = document.getElementById("aiLoader");
        const input = document.getElementById("userQuestion");

        openBtn.onclick = function() { modal.style.display = "flex"; }
        closeBtn.onclick = function() { modal.style.display = "none"; }
        window.onclick = function(event) { if (event.target == modal) { modal.style.display = "none"; } }

        // --- GEMINI API INTEGRÁCIA ---
        const apiKey = ""; // ⚠️ API Kľúč je vložený systémom, alebo ho doplňte tu

        askBtn.onclick = async function() {
            const question = input.value.trim();
            if (!question) return;

            // UI Stav: Načítavanie
            responseDiv.style.display = "none";
            loader.style.display = "block";
            askBtn.disabled = true;
            askBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzujem...';

            try {
                // Prompt pre AI (Inštrukcie)
                const prompt = `Si profesionálny AI asistent pre fyzioterapeutickú kliniku FYZIO&FIT. 
                Klient sa pýta: "${question}".
                
                Tvoja úloha:
                1. Odpovedz stručne, empaticky a v slovenčine.
                2. Ak sa pýta na bolesť, daj 1-2 bezpečné rady prvej pomoci (teplo/chlad, kľudový režim).
                3. Vždy na záver odporuč objednanie sa na vyšetrenie na klinike.
                4. Nepíš dlhé lekárske správy, buď ako skúsený recepčný/konzultant.`;
                
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }]
                    })
                });

                const data = await response.json();
                const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Ospravedlňujeme sa, systém je momentálne vyťažený.";
                
                // Formátovanie textu
                const formattedText = aiText.replace(/\n/g, "<br>");

                responseDiv.innerHTML = formattedText;
                responseDiv.style.display = "block";

            } catch (error) {
                console.error("Error:", error);
                responseDiv.innerHTML = "Chyba pripojenia k AI. Skontrolujte internet alebo API kľúč.";
                responseDiv.style.display = "block";
            } finally {
                loader.style.display = "none";
                askBtn.disabled = false;
                askBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Odoslať otázku';
            }
        }
    </script>
</body>
</html>""""