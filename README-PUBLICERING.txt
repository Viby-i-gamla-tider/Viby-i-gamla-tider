VIBY I GAMLA TIDER – MODERN PUBLIK VERSION

Detta är ett statiskt webbpaket som kan publiceras direkt på GitHub Pages, Netlify eller Cloudflare Pages.

VIKTIGT
- Historiska originaltexter har inte skrivits om.
- Hela det återställda originalarkivet ligger i archive/original/.
- Den moderna läsvyn använder extraherat originalinnehåll för bättre läsbarhet.
- Sökfunktionen är lokal i webbläsaren och kräver ingen databas eller extern tjänst.

INNEHÅLL
- 209 indexerade HTML-sidor
- 540 bilder i bildkatalogen
- 8 PDF-filer

PUBLICERING PÅ GITHUB PAGES
1. Skapa ett nytt publikt repository på GitHub, t.ex. viby-i-gamla-tider.
2. Ladda upp innehållet i denna mapp (inte den yttre ZIP-filen).
3. Gå till Settings > Pages.
4. Välj Deploy from a branch, branch main och mappen / (root).
5. Spara. GitHub visar därefter webbadressen.

TESTA LOKALT
På Mac, öppna Terminal i mappen och kör:
  python3 -m http.server 8000
Öppna sedan http://localhost:8000 i webbläsaren.

OBS
Öppna inte bara index.html genom att dubbelklicka om du vill testa sökning och dynamiskt innehåll; webbläsarens säkerhetsregler kan blockera lokala JSON-anrop. Kör en lokal webbserver enligt ovan.
