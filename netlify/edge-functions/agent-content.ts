import pages from './generated/pages.json' with { type: 'json' };

export function prefersMarkdown(accept = '') {
  const ranges = accept.toLowerCase().split(',').map(item => {
    const [type, ...params] = item.trim().split(';');
    const qParam = params.map(p => p.trim()).find(p => p.startsWith('q='));
    const q = qParam ? Number(qParam.slice(2)) : 1;
    return { type, q: Number.isFinite(q) && q >= 0 && q <= 1 ? q : 0 };
  });
  const markdown = ranges.find(r => r.type === 'text/markdown')?.q || 0;
  const html = ranges.find(r => r.type === 'text/html')?.q || 0;
  return markdown > 0 && markdown >= html;
}

export default async function handler(request, context) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  if (!['GET', 'HEAD'].includes(request.method) || !Object.hasOwn(pages, pathname)) return context.next();
  // Respect origin redirects/errors before selecting a representation.
  const origin = await context.next();
  if (origin.status !== 200 || !origin.headers.get('content-type')?.includes('text/html')) return origin;
  const headers = new Headers(origin.headers);
  const vary = new Set((headers.get('vary') || '').split(',').map(v => v.trim()).filter(Boolean));
  vary.add('Accept');
  headers.set('Vary', [...vary].join(', '));
  headers.set('Link', '</llms.txt>; rel="describedby"; type="text/markdown"');
  // Avoid a CDN/browser reusing one representation for another Accept value.
  headers.set('Cache-Control', 'no-store');
  if (!prefersMarkdown(request.headers.get('accept') || '')) {
    return new Response(origin.body, { status: origin.status, headers });
  }
  for (const name of ['content-length', 'content-encoding', 'etag', 'last-modified', 'accept-ranges']) headers.delete(name);
  headers.set('Content-Type', 'text/markdown; charset=utf-8');
  return new Response(request.method === 'HEAD' ? null : pages[pathname], { status: 200, headers });
}
