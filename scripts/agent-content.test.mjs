import test from 'node:test';
import assert from 'node:assert/strict';
import handler, { prefersMarkdown } from '../netlify/edge-functions/agent-content.ts';

test('Accept negotiation honors explicit preferences and q=0', () => {
  for (const accept of ['', '*/*', 'text/html', 'text/markdown;q=0', 'text/html;q=1,text/markdown;q=0.5']) assert.equal(prefersMarkdown(accept), false, accept);
  for (const accept of ['text/markdown', 'text/markdown, text/html', 'text/html;q=0.5,text/markdown;q=1']) assert.equal(prefersMarkdown(accept), true, accept);
});
const context = () => ({ next: async () => new Response('<h1>HTML</h1>', { headers: { 'content-type': 'text/html', etag: 'html-only', vary: 'Accept-Encoding' } }) });
test('Markdown has correct MIME, body, Vary, Link and no HTML validator', async () => {
  const response = await handler(new Request('https://kajaki24.com.pl/', { headers: { Accept: 'text/markdown' } }), context());
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^text\/markdown/);
  assert.match(response.headers.get('vary'), /Accept-Encoding, Accept/);
  assert.match(response.headers.get('link'), /rel="describedby"/);
  assert.equal(response.headers.get('etag'), null);
  assert.match(await response.text(), /Kajaki|kajaki/);
});
test('Browser HTML, HEAD, missing routes and redirects are preserved', async () => {
  const html = await handler(new Request('https://kajaki24.com.pl/'), context());
  assert.equal(await html.text(), '<h1>HTML</h1>');
  const head = await handler(new Request('https://kajaki24.com.pl/', { method: 'HEAD', headers: { Accept: 'text/markdown' } }), context());
  assert.equal(await head.text(), '');
  const redirect = await handler(new Request('https://kajaki24.com.pl/', { headers: { Accept: 'text/markdown' } }), { next: async () => Response.redirect('https://www.kajaki24.com.pl/', 301) });
  assert.equal(redirect.status, 301);
  const missing = await handler(new Request('https://kajaki24.com.pl/missing/'), { next: async () => new Response('Missing', { status: 404 }) });
  assert.equal(missing.status, 404);
});
