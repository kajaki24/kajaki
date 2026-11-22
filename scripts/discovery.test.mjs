import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import vm from 'node:vm';

const json = async path => JSON.parse(await readFile('public' + path, 'utf8'));
test('Published skill digest matches served bytes and catalog links resolve', async () => {
  const index = await json('/.well-known/agent-skills/index.json');
  assert.equal(index.$schema, 'https://schemas.agentskills.io/discovery/0.2.0/schema.json');
  for (const skill of index.skills) {
    const bytes = await readFile('public' + new URL(skill.url).pathname);
    assert.equal(skill.digest, 'sha256:' + createHash('sha256').update(bytes).digest('hex'));
    assert.match(bytes.toString(), /^---\r?\nname: /);
  }
  const catalog = await json('/.well-known/ai-catalog.json');
  for (const entry of catalog.entries) {
    assert.match(entry.identifier, /^urn:air:kajaki24\.com\.pl:/);
    assert.ok(entry.url && !entry.data);
    assert.ok(entry.representativeQueries.length >= 2);
    await readFile('public' + new URL(entry.url).pathname);
  }
  const poppy = await json('/.well-known/poppy.json');
  assert.equal(poppy.organization.domain, 'kajaki24.com.pl');
  assert.equal(poppy.protocol_version, '1.0');
  assert.deepEqual(poppy.web, {});
  assert.equal(poppy.auth, undefined);
});

const code = await readFile('src/assets/js/agent-tools.js', 'utf8');
test('WebMCP reads allowlisted pages, validates MIME, and restores after back navigation', async () => {
  const registrations = [];
  const events = {};
  const requests = [];
  let mime = 'text/markdown; charset=utf-8';
  vm.runInNewContext(code, {
    document: { modelContext: { registerTool(tool, options) { registrations.push({ tool, options }); return Promise.resolve(); } } },
    navigator: {}, window: { addEventListener(name, fn) { events[name] = fn; } },
    location: { origin: 'https://kajaki24.com.pl' }, URL, AbortController, console,
    fetch: async (url, options) => { requests.push({ url, options }); return new Response('# Cennik', { headers: { 'content-type': mime } }); }
  });
  assert.equal(registrations.length, 1);
  const tool = registrations[0].tool;
  const result = await tool.execute({ topic: 'prices' });
  assert.match(result.content[0].text, /# Cennik/);
  assert.equal(requests[0].url.pathname, '/cennik/');
  assert.equal(requests[0].options.credentials, 'omit');
  await assert.rejects(tool.execute({ topic: '__proto__' }), /Unknown/);
  await assert.rejects(tool.execute({ topic: 'https://example.com' }), /Unknown/);
  mime = 'text/html';
  await assert.rejects(tool.execute({ topic: 'routes' }), /unavailable/);
  events.pagehide();
  assert.equal(registrations[0].options.signal.aborted, true);
  events.pageshow();
  assert.equal(registrations.length, 2);
});
test('Browsers without WebMCP continue without errors or network requests', () => {
  vm.runInNewContext(code, { document: {}, navigator: {} });
});
