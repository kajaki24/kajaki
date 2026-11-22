import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const base = process.argv[2] || 'https://kajaki24.com.pl';
// Public HTTP verification: intentionally follow redirects, then check the final
// response and linked resource. Nonzero exit code can alert deployment monitoring.
for (const accept of ['text/html', 'text/markdown']) {
  const response = await fetch(base, { headers: { Accept: accept } });
  console.log(accept, response.status, response.url, response.headers.get('content-type'));
  assert.equal(response.status, 200);
  assert.ok(response.headers.get('content-type')?.startsWith(accept));
  assert.match(response.headers.get('vary') || '', /\bAccept\b/i);
  assert.match(response.headers.get('link') || '', /<\/llms\.txt>; rel="describedby"/);
  assert.ok((await response.text()).length > 100);
}
const resource = await fetch(new URL('/llms.txt', base));
assert.equal(resource.status, 200);
assert.match(resource.headers.get('content-type') || '', /^text\/markdown/);
assert.ok((await resource.text()).length > 100);
const robots = await fetch(new URL('/robots.txt', base));
assert.equal(robots.status, 200);
assert.match(robots.headers.get('content-type') || '', /^text\/plain/);
assert.match(await robots.text(), /Content-Signal: search=yes, ai-input=yes, ai-train=no/);
for (const path of ['/.well-known/ai-catalog.json', '/.well-known/agent-skills/index.json', '/.well-known/poppy.json']) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, path);
  assert.match(response.headers.get('content-type') || '', /^application\/json/, path);
  assert.equal(response.headers.get('access-control-allow-origin'), '*', path);
  const data = await response.json();
  for (const skill of data.skills || []) {
    const artifact = await fetch(new URL(new URL(skill.url).pathname, base));
    assert.equal(artifact.status, 200);
    assert.match(artifact.headers.get('content-type') || '', /^text\/markdown/);
    const digest = createHash('sha256').update(Buffer.from(await artifact.arrayBuffer())).digest('hex');
    assert.equal(skill.digest, 'sha256:' + digest);
  }
  for (const entry of data.entries || []) {
    const target = await fetch(new URL(new URL(entry.url).pathname, base));
    assert.equal(target.status, 200, entry.url);
    assert.ok(target.headers.get('content-type')?.startsWith(entry.type), entry.url);
  }
  console.log('PASS:', path);
}
console.log('PASS: public HTTP discovery, MIME types, CORS, Content Signals and skill integrity');
