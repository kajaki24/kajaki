# Odkrywanie treści Kajaki24 przez agentów

Konfiguracja dotyczy publicznej strony informacyjnej. Markdown powstaje podczas
budowania z aktualnie wyrenderowanych stron, a nie z osobnej kopii cennika.
Nagłówki HTTP i funkcja negocjująca format działają po wdrożeniu na Netlify.

## Zaimplementowane elementy

- Content Signals w `src/robots.njk`: wyszukiwanie i odpowiedzi AI dozwolone,
  trening modeli niedozwolony. Jest to deklaracja preferencji, nie blokada techniczna.
- `Link` na stronie głównej wskazuje `/llms.txt` z relacją `describedby`.
- `Accept: text/markdown` zwraca Markdown; przeglądarki nadal otrzymują HTML.
- `/.well-known/agent-skills/index.json` wskazuje instrukcję planowania spływu.
  Build kopiuje dokładne bajty SKILL.md i wylicza ich SHA-256.
- `/.well-known/ai-catalog.json` opisuje tę instrukcję i podsumowanie strony.
- `/.well-known/poppy.json` deklaruje wyłącznie publiczną stronę. Używa aktualnej
  wersji 1.0; stary audyt wymagający 0.1 może nadal zgłaszać niezgodność wersji.
- WebMCP udostępnia odczyt cennika, tras i kontaktu w obsługujących go przeglądarkach.
  Nie wysyła formularzy ani nie rezerwuje sprzętu. Brak WebMCP nie zmienia działania strony.

## Punkty nieadekwatne do obecnej strony

API Catalog, OAuth/OIDC discovery, OAuth Protected Resource, rejestracja przez
auth.md, karta serwera MCP i karta agenta A2A wymagają odpowiadających im usług.
Projekt ich nie oferuje; nie publikujemy fikcyjnych endpointów ani pustych
deklaracji wyłącznie dla punktacji. WebMCP w przeglądarce nie jest serwerem MCP.

DNS-AID wymaga rzeczywistej usługi agentowej i zmian u operatora DNS. Netlify DNS
nie obsługuje DNSSEC. Zmiana operatora wymaga oddzielnego planu migracji strefy.

## Sprawdzenie i publikacja

Uruchom `npm run build`, potem `npm run test:agents`. Wdróż repozytorium standardowym
procesem Netlify; sama wysyłka katalogu public nie instaluje Edge Function.
Po wdrożeniu uruchom `npm run verify:agents -- https://kajaki24.com.pl`.
Skrypt sprawdza publiczne odpowiedzi HTTP, MIME, CORS, negocjację i sumę kontrolną.
Wykonuj go po kolejnych wdrożeniach oraz w zewnętrznym monitoringu.

Ponów audyt przez POST do `https://isitagentready.com/api/scan`, z nagłówkiem
`Content-Type: application/json` i treścią `{"url":"https://kajaki24.com.pl"}`.
Zapisuj wynik dla wdrożonej wersji. Kontrola zbudowanych plików nie potwierdza
konfiguracji CDN, WAF ani publicznej dostępności po publikacji.

## Specyfikacje

- https://contentsignals.org/
- https://github.com/cloudflare/agent-skills-discovery-rfc
- https://github.com/Agent-Card/ai-catalog
- https://webmachinelearning.github.io/webmcp/
- https://personalagentprotocol.org/docs/1.0/spec
- https://docs.netlify.com/manage/domains/troubleshooting-tips/
