<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solvbox – Für jedes Problem die perfekte Lösung</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
            background: #000000;
            color: #ffffff;
            overflow-x: hidden;
            line-height: 1.6;
        }

        /* Hero Section */
        .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            padding: 2rem;
            background: radial-gradient(ellipse at center, rgba(30, 107, 85, 0.3) 0%, rgba(0, 0, 0, 0.8) 70%, #000000 100%);
        }

        .hero-content {
            max-width: 980px;
            width: 100%;
            text-align: center;
            z-index: 10;
        }

        .hero-badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 25px;
            padding: 8px 20px;
            font-size: 0.9rem;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 2rem;
            backdrop-filter: blur(20px);
            animation: fadeInUp 0.8s ease 0.2s both;
        }

        .hero-title {
            font-size: clamp(3rem, 8vw, 6rem);
            font-weight: 700;
            line-height: 1.1;
            margin-bottom: 1.5rem;
            color: #ffffff;
            letter-spacing: -0.02em;
            animation: fadeInUp 0.8s ease 0.4s both;
        }

        .hero-title .gradient-text {
            background: linear-gradient(135deg, #1E6B55 0%, #00A041 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .hero-subtitle {
            font-size: clamp(1.2rem, 3vw, 1.8rem);
            font-weight: 400;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 3rem;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
            animation: fadeInUp 0.8s ease 0.6s both;
        }

        .cta-button {
            background: linear-gradient(135deg, #1E6B55 0%, #00A041 100%);
            color: white;
            padding: 18px 40px;
            font-size: 1.1rem;
            font-weight: 600;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            text-decoration: none;
            display: inline-block;
            box-shadow: 0 10px 40px rgba(30, 107, 85, 0.3);
            animation: fadeInUp 0.8s ease 0.8s both;
        }

        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 20px 60px rgba(30, 107, 85, 0.4);
            background: linear-gradient(135deg, #00A041 0%, #1E6B55 100%);
        }

        .scroll-indicator {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            width: 24px;
            height: 40px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 12px;
            display: flex;
            justify-content: center;
            padding-top: 8px;
            animation: fadeInUp 0.8s ease 1s both;
        }

        .scroll-dot {
            width: 4px;
            height: 8px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 2px;
            animation: scroll 2s infinite;
        }

        /* Features Preview Section */
        .features-preview {
            padding: 120px 2rem;
            background: linear-gradient(180deg, #000000 0%, #0a0a0a 100%);
        }

        .features-preview-content {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 40px;
        }

        .feature-preview {
            text-align: center;
            padding: 40px 20px;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .feature-preview:hover {
            transform: translateY(-8px);
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(30, 107, 85, 0.3);
        }

        .feature-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #1E6B55 0%, #00A041 100%);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            margin: 0 auto 24px;
            box-shadow: 0 10px 30px rgba(30, 107, 85, 0.3);
        }

        .feature-title {
            font-size: 1.4rem;
            font-weight: 600;
            margin-bottom: 16px;
            color: #ffffff;
        }

        .feature-description {
            color: rgba(255, 255, 255, 0.6);
            font-size: 1rem;
            line-height: 1.6;
        }

        /* Stats Section */
        .stats-section {
            padding: 120px 2rem;
            background: rgba(30, 107, 85, 0.03);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stats-content {
            max-width: 1000px;
            margin: 0 auto;
            text-align: center;
        }

        .stats-title {
            font-size: clamp(2rem, 5vw, 3rem);
            font-weight: 700;
            margin-bottom: 60px;
            color: #ffffff;
            letter-spacing: -0.02em;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 60px;
        }

        .stat-item {
            text-align: center;
        }

        .stat-number {
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: 700;
            color: #1E6B55;
            margin-bottom: 12px;
            letter-spacing: -0.02em;
            background: linear-gradient(135deg, #1E6B55 0%, #00A041 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .stat-label {
            font-size: 1.1rem;
            color: rgba(255, 255, 255, 0.7);
            font-weight: 500;
        }

        /* How it works Section */
        .how-it-works {
            padding: 120px 2rem;
            background: #000000;
        }

        .how-it-works-content {
            max-width: 1200px;
            margin: 0 auto;
            text-align: center;
        }

        .section-title {
            font-size: clamp(2rem, 5vw, 3rem);
            font-weight: 700;
            margin-bottom: 60px;
            color: #ffffff;
            letter-spacing: -0.02em;
        }

        .steps-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 40px;
            margin-top: 80px;
        }

        .step-item {
            position: relative;
            padding: 40px 30px;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .step-item:hover {
            transform: translateY(-8px);
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(30, 107, 85, 0.3);
        }

        .step-number {
            position: absolute;
            top: -15px;
            left: 30px;
            width: 30px;
            height: 30px;
            background: linear-gradient(135deg, #1E6B55 0%, #00A041 100%);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.9rem;
        }

        .step-title {
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 16px;
            color: #ffffff;
            margin-top: 10px;
        }

        .step-description {
            color: rgba(255, 255, 255, 0.6);
            line-height: 1.6;
        }

        /* Final CTA Section */
        .final-cta {
            padding: 120px 2rem;
            background: radial-gradient(ellipse at center, rgba(30, 107, 85, 0.2) 0%, rgba(0, 0, 0, 0.8) 70%, #000000 100%);
            text-align: center;
        }

        .final-cta-content {
            max-width: 800px;
            margin: 0 auto;
        }

        .final-cta h2 {
            font-size: clamp(2.5rem, 6vw, 4rem);
            font-weight: 700;
            margin-bottom: 24px;
            color: #ffffff;
            letter-spacing: -0.02em;
        }

        .final-cta p {
            font-size: 1.3rem;
            margin-bottom: 40px;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.6;
        }

        /* Footer */
        .footer {
            padding: 60px 2rem 30px;
            background: #000000;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
            text-align: center;
        }

        .footer-links {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-bottom: 40px;
            flex-wrap: wrap;
        }

        .footer-link {
            color: rgba(255, 255, 255, 0.6);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
        }

        .footer-link:hover {
            color: #1E6B55;
        }

        .footer-copyright {
            color: rgba(255, 255, 255, 0.4);
            font-size: 0.9rem;
        }

        /* Animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes scroll {
            0% {
                opacity: 0;
                transform: translateY(0);
            }
            50% {
                opacity: 1;
                transform: translateY(8px);
            }
            100% {
                opacity: 0;
                transform: translateY(16px);
            }
        }

        @keyframes float {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-10px);
            }
        }

        /* Modal Styles */
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(20px);
        }

        .modal-content {
            background: rgba(10, 10, 10, 0.95);
            margin: 5% auto;
            padding: 40px;
            border-radius: 20px;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(40px);
        }

        .close {
            color: rgba(255, 255, 255, 0.6);
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            position: absolute;
            right: 20px;
            top: 20px;
            transition: color 0.3s ease;
        }

        .close:hover {
            color: white;
        }

        .modal h2 {
            color: white;
            margin-bottom: 24px;
            font-weight: 600;
        }

        .modal p {
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.6;
            margin-bottom: 16px;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .hero {
                padding: 1rem;
            }

            .features-preview,
            .stats-section,
            .how-it-works,
            .final-cta {
                padding: 80px 1rem;
            }

            .stats-grid {
                gap: 40px;
            }

            .steps-grid {
                gap: 30px;
            }

            .footer-links {
                gap: 20px;
            }
        }

        /* Scroll-triggered animations */
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-on-scroll.animated {
            opacity: 1;
            transform: translateY(0);
        }
    </style>
</head>
<body>
    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-content">
            <div class="hero-badge">Nur für Unternehmer</div>
            <h1 class="hero-title">
                Für jedes Problem<br>
                die <span class="gradient-text">perfekte Lösung</span>
            </h1>
            <p class="hero-subtitle">
                Steuern senken, Liquidität verbessern, A-Player finden – wir matchen dich in 60 Sekunden 
                mit dem Experten, der dein Problem bereits gelöst hat.
            </p>
            <a href="#cta" class="cta-button">Jetzt kostenlos starten</a>
        </div>
        <div class="scroll-indicator">
            <div class="scroll-dot"></div>
        </div>
    </section>

    <!-- Features Preview Section -->
    <section class="features-preview">
        <div class="features-preview-content">
            <div class="feature-preview animate-on-scroll">
                <div class="feature-icon">🎯</div>
                <h3 class="feature-title">Präzises Matching</h3>
                <p class="feature-description">
                    Unsere KI analysiert dein Problem und findet den Experten, 
                    der exakt deine Situation bereits gemeistert hat.
                </p>
            </div>
            <div class="feature-preview animate-on-scroll">
                <div class="feature-icon">⚡</div>
                <h3 class="feature-title">60-Sekunden-Garantie</h3>
                <p class="feature-description">
                    Keine endlosen Recherchen mehr. In maximal 60 Sekunden hast du 
                    3 passende Experten mit bewiesenen Erfolgsgeschichten.
                </p>
            </div>
            <div class="feature-preview animate-on-scroll">
                <div class="feature-icon">📊</div>
                <h3 class="feature-title">Bewiesene Ergebnisse</h3>
                <p class="feature-description">
                    Jeder Experte hat seine Lösungen bereits erfolgreich umgesetzt – 
                    mit messbaren, dokumentierten Ergebnissen.
                </p>
            </div>
        </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
        <div class="stats-content">
            <h2 class="stats-title animate-on-scroll">Zahlen, die überzeugen</h2>
            <div class="stats-grid">
                <div class="stat-item animate-on-scroll">
                    <div class="stat-number">500+</div>
                    <div class="stat-label">Verifizierte Experten</div>
                </div>
                <div class="stat-item animate-on-scroll">
                    <div class="stat-number">10.000+</div>
                    <div class="stat-label">Gelöste Probleme</div>
                </div>
                <div class="stat-item animate-on-scroll">
                    <div class="stat-number">95%</div>
                    <div class="stat-label">Erfolgsquote</div>
                </div>
                <div class="stat-item animate-on-scroll">
                    <div class="stat-number">€50M+</div>
                    <div class="stat-label">Ersparte Kosten</div>
                </div>
            </div>
        </div>
    </section>

    <!-- How it works Section -->
    <section class="how-it-works">
        <div class="how-it-works-content">
            <h2 class="section-title animate-on-scroll">So einfach funktioniert's</h2>
            <div class="steps-grid">
                <div class="step-item animate-on-scroll">
                    <div class="step-number">1</div>
                    <h3 class="step-title">Problem beschreiben</h3>
                    <p class="step-description">
                        Teile uns in wenigen Sätzen mit, welche Herausforderung du lösen möchtest.
                    </p>
                </div>
                <div class="step-item animate-on-scroll">
                    <div class="step-number">2</div>
                    <h3 class="step-title">KI-Matching</h3>
                    <p class="step-description">
                        Unsere KI analysiert deine Anfrage und findet passende Experten mit bewiesenen Erfolgen.
                    </p>
                </div>
                <div class="step-item animate-on-scroll">
                    <div class="step-number">3</div>
                    <h3 class="step-title">Experten erhalten</h3>
                    <p class="step-description">
                        Du erhältst 3 perfekt passende Experten mit Fallstudien und Kontaktdaten.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Final CTA Section -->
    <section class="final-cta" id="cta">
        <div class="final-cta-content">
            <h2 class="animate-on-scroll">Bereit für deine Lösung?</h2>
            <p class="animate-on-scroll">
                Schließe dich tausenden erfolgreichen Unternehmern an, 
                die ihre Probleme mit Solvbox gelöst haben.
            </p>
            <a href="#" class="cta-button animate-on-scroll" onclick="openModal('contact')">
                Jetzt kostenlos testen
            </a>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-links">
                <a href="#" class="footer-link" onclick="openModal('impressum')">Impressum</a>
                <a href="#" class="footer-link" onclick="openModal('datenschutz')">Datenschutz</a>
                <a href="#" class="footer-link" onclick="openModal('contact')">Kontakt</a>
            </div>
            <p class="footer-copyright">
                © 2024 Solvbox. Alle Rechte vorbehalten.
            </p>
        </div>
    </footer>

    <!-- Modals -->
    <div id="impressumModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal('impressum')">&times;</span>
            <h2>Impressum</h2>
            <p><strong>Solvbox GmbH</strong></p>
            <p>Musterstraße 123<br>12345 Musterstadt<br>Deutschland</p>
            <p><strong>Geschäftsführer:</strong> Max Mustermann</p>
            <p><strong>Registergericht:</strong> Amtsgericht Musterstadt<br><strong>Handelsregisternummer:</strong> HRB 12345</p>
            <p><strong>Umsatzsteuer-ID:</strong> DE123456789</p>
            <p><strong>E-Mail:</strong> info@solvbox.de<br><strong>Telefon:</strong> +49 (0) 123 456789</p>
        </div>
    </div>

    <div id="datenschutzModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal('datenschutz')">&times;</span>
            <h2>Datenschutzerklärung</h2>
            <p><strong>1. Datenschutz auf einen Blick</strong></p>
            <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen.</p>
            
            <p><strong>2. Allgemeine Hinweise und Pflichtinformationen</strong></p>
            <p>Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.</p>
            
            <p><strong>3. Datenerfassung auf unserer Website</strong></p>
            <p>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.</p>
            
            <p><strong>4. Ihre Rechte</strong></p>
            <p>Sie haben jederzeit das Recht unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten.</p>
        </div>
    </div>

    <div id="contactModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal('contact')">&times;</span>
            <h2>Kontakt</h2>
            <p>Bereit, dein nächstes Unternehmer-Problem zu lösen?</p>
            <p><strong>E-Mail:</strong> info@solvbox.de</p>
            <p><strong>Telefon:</strong> +49 (0) 123 456789</p>
            <p><strong>Geschäftszeiten:</strong> Mo-Fr 9:00-18:00 Uhr</p>
            <p>Oder starte direkt mit unserem 60-Sekunden-Test und finde sofort die passende Lösung für dein Problem!</p>
            <a href="#" class="cta-button" style="margin-top: 1rem;">60-Sekunden-Test starten</a>
        </div>
    </div>

    <script>
        // Modal functions
        function openModal(modalType) {
            document.getElementById(modalType + 'Modal').style.display = 'block';
        }

        function closeModal(modalType) {
            document.getElementById(modalType + 'Modal').style.display = 'none';
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                if (this.getAttribute('href') !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });

        // Scroll-triggered animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);

        // Observe all elements with animate-on-scroll class
        document.addEventListener('DOMContentLoaded', function() {
            const animateElements = document.querySelectorAll('.animate-on-scroll');
            animateElements.forEach(el => observer.observe(el));
        });
    </script>
</body>
</html>

