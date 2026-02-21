
/**
 * Shared Premium Email Template System
 * Uses table-based layout for maximum compatibility (Outlook, Gmail, Apple Mail).
 * Theme: Void Black / Aurora Teal
 */

const THEME = {
    bg: '#000000',
    cardBg: '#111111',
    text: '#e5e5e5',
    textMuted: '#a1a1aa',
    border: '#27272a',
    accent: '#14b8a6', // Teal
};

const LOGO_SVG = `
<svg width="200" height="50" viewBox="0 0 1200 365" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="luxury-g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14b8a6"></stop>
      <stop offset="100%" stop-color="#0f766e"></stop>
    </linearGradient>
  </defs>
  <g transform="translate(10,5)">
    <!-- Shield -->
    <path d="M100 0 C150 25 185 50 185 100 C185 160 145 205 100 235 C55 205 15 160 15 100 C15 50 50 25 100 0 Z" fill="#14b8a6" />
    <!-- Spine abstract -->
    <path d="M100 30 C105 30 110 35 110 40 C110 45 105 50 100 50 C95 50 90 45 90 40 C90 35 95 30 100 30 Z" fill="white" />
    <path d="M100 60 C108 60 115 67 115 75 C115 83 108 90 100 90 C92 90 85 83 85 75 C85 67 92 60 100 60 Z" fill="white" opacity="0.9" />
    <path d="M100 105 C110 105 118 113 118 123 C118 133 110 141 100 141 C90 141 82 133 82 123 C82 113 90 105 100 105 Z" fill="white" opacity="0.8" />
  </g>
  <!-- Text -->
  <g transform="translate(250, 40)">
     <text x="0" y="110" font-family="Arial, sans-serif" font-weight="bold" font-size="100" fill="#ffffff">CHIROPRAXIA</text>
     <text x="00" y="210" font-family="Arial, sans-serif" font-weight="bold" font-size="100" fill="#14b8a6">KOŠICE</text>
  </g>
</svg>
`;

export function wrapEmailLayout(title: string, contentHtml: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: ${THEME.bg}; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    table { border-collapse: collapse; }
    .content-card {
      background-color: ${THEME.cardBg};
      border: 1px solid ${THEME.border};
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    }
    .field-label { color: ${THEME.textMuted}; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
    .field-value { color: #ffffff; font-size: 16px; font-weight: 500; margin-bottom: 16px; }
    .btn {
      background-color: ${THEME.accent};
      color: #ffffff;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: bold;
      display: inline-block;
    }
  </style>
</head>
<body style="background-color: ${THEME.bg}; margin: 0; padding: 0;">
  
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: ${THEME.bg};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- HEADER / LOGO -->
        <table width="100%" maxWidth="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px;">
          <tr>
            <td align="center" style="padding-bottom: 30px;">
              ${LOGO_SVG}
            </td>
          </tr>
        </table>

        <!-- MAIN CARD -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px;">
          <tr>
            <td class="content-card" style="background-color: ${THEME.cardBg}; border: 1px solid ${THEME.border}; border-radius: 12px; padding: 40px;">
              
              <!-- Title -->
              <h1 style="color: #ffffff; margin: 0 0 20px 0; font-size: 24px; text-align: center;">${title}</h1>
              
              <div style="width: 100%; height: 1px; background-color: ${THEME.border}; margin-bottom: 30px;"></div>

              <!-- Content injected here -->
              <div style="color: ${THEME.text}; font-size: 16px; line-height: 1.6;">
                ${contentHtml}
              </div>

            </td>
          </tr>
        </table>

        <!-- FOOTER -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin-top: 30px;">
          <tr>
            <td align="center" style="color: ${THEME.textMuted}; font-size: 12px; line-height: 1.5;">
              <p style="margin: 0;"><strong>Chiropraxia Košice</strong></p>
              <p style="margin: 5px 0;">Krmanova 854/6, 040 01 Košice</p>
              <p style="margin: 5px 0;">
                <a href="https://chiropraxiakosice.eu" style="color: ${THEME.accent}; text-decoration: none;">www.chiropraxiakosice.eu</a>
                |
                <a href="mailto:info@chiropraxiakosice.eu" style="color: ${THEME.accent}; text-decoration: none;">info@chiropraxiakosice.eu</a>
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
}


