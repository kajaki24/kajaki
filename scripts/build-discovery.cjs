const fs = require('node:fs/promises');
const path = require('node:path');
const { createHash } = require('node:crypto');

module.exports = async function (output) {
  const origin = 'https://kajaki24.com.pl';
  const skillPath = '/.well-known/agent-skills/kajaki-trip-planning/SKILL.md';
  const skill = await fs.readFile('agent-resources/kajaki-trip-planning/SKILL.md');
  async function write(url, value) {
    const target = path.join(output, url);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, value);
  }
  async function json(url, value) { await write(url, JSON.stringify(value, null, 2) + '\n'); }
  await write(skillPath, skill);
  await json('/.well-known/agent-skills/index.json', {
    $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
    skills: [{
      name: 'kajaki-trip-planning', type: 'skill-md',
      description: 'Find published Kajaki24 routes, prices and contact details for a kayaking trip on the Pilica near Warka. Use for trip research, not live availability or booking confirmation.',
      url: origin + skillPath,
      digest: 'sha256:' + createHash('sha256').update(skill).digest('hex')
    }]
  });
  await json('/.well-known/ai-catalog.json', {
    specVersion: '1.0',
    host: { displayName: 'Kajaki24 — Kajaki Warka', identifier: origin },
    entries: [{
      identifier: 'urn:air:kajaki24.com.pl:skill:kajaki-trip-planning',
      displayName: 'Planowanie spływu Pilicą z Kajaki24',
      type: 'text/markdown', url: origin + skillPath,
      representativeQueries: ['Jak zaplanować spływ Pilicą w okolicy Warki?', 'Gdzie sprawdzić ceny i trasy Kajaki24?', 'Jak skontaktować się w sprawie rezerwacji kajaków?']
    }, {
      identifier: 'urn:air:kajaki24.com.pl:document:website-summary',
      displayName: 'Informacje o ofercie Kajaki24',
      type: 'text/markdown', url: origin + '/llms.txt',
      representativeQueries: ['Co oferuje wypożyczalnia Kajaki24 w Warce?', 'Gdzie znaleźć informacje o spływach kajakowych Pilicą?']
    }]
  });
  // Website-only discovery: no OAuth, session identity or booking API advertised.
  await json('/.well-known/poppy.json', {
    protocol_version: '1.0',
    organization: { name: 'Kajaki24', domain: 'kajaki24.com.pl' },
    web: {}
  });
};
