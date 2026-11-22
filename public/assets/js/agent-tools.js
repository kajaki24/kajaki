(() => {
  const modelContext = document.modelContext || navigator.modelContext;
  if (!modelContext?.registerTool) return;
  let controller;
  const paths = { prices: '/cennik/', routes: '/trasy/', contact: '/kontakt/' };

  function register() {
    if (controller && !controller.signal.aborted) return;
    controller = new AbortController();
    try {
      Promise.resolve(modelContext.registerTool({
        name: 'kajaki_read_information',
        description: 'Read current published Kajaki24 prices, kayaking routes or contact information. Does not check availability or make bookings.',
        inputSchema: {
          type: 'object',
          properties: { topic: { type: 'string', enum: ['prices', 'routes', 'contact'] } },
          required: ['topic'],
          additionalProperties: false
        },
        execute: async ({ topic } = {}) => {
          if (!Object.hasOwn(paths, topic)) throw new Error('Unknown information topic');
          const url = new URL(paths[topic], location.origin);
          const response = await fetch(url, {
            headers: { Accept: 'text/markdown' },
            credentials: 'omit',
            redirect: 'error'
          });
          if (!response.ok || !response.headers.get('content-type')?.startsWith('text/markdown')) {
            throw new Error('Published Markdown is unavailable. Open ' + url.href);
          }
          return { content: [{ type: 'text', text: `Source: ${url.href}\n\n${await response.text()}` }] };
        }
      }, { signal: controller.signal })).catch(() => {
        controller.abort();
        console.warn('Kajaki24: WebMCP registration unavailable');
      });
    } catch {
      controller.abort();
    }
  }
  register();
  window.addEventListener('pagehide', () => controller?.abort());
  window.addEventListener('pageshow', register);
})();
