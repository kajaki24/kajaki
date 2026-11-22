(() => {
  const scripts = new Map();
  function loadScript(src) {
    if (!scripts.has(src)) scripts.set(src, new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    }));
    return scripts.get(src);
  }
  function nearViewport(element, init) {
    if (!element) return;
    const run = () => Promise.resolve().then(init).catch(error => console.warn('Widget unavailable', error));
    if (!('IntersectionObserver' in window)) { run(); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect();
        run();
      }
    }, { rootMargin: '200px' });
    observer.observe(element);
  }
  nearViewport(document.querySelector('#glide1'), async () => {
    await loadScript('/assets/js/vendor/glide.min.js');
    new Glide('#glide1', {
      type: 'carousel', perView: 1,
      autoplay: matchMedia('(prefers-reduced-motion: reduce)').matches ? false : 5000,
      hoverpause: true
    }).mount();
  });
  nearViewport(document.querySelector('.glightbox'), async () => {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = '/assets/css/glightbox.min.css';
    document.head.appendChild(style);
    await loadScript('/assets/js/glightbox.min.js');
    GLightbox({ touchNavigation: true, loop: false, autoplayVideos: true });
  });
  nearViewport(document.querySelector('#inpl-weather-main'), () => {
    // The provider uses this id to avoid duplicate widget initialization.
    if (document.getElementById('widget-js')) return;
    const script = document.createElement('script');
    script.id = 'widget-js';
    script.async = true;
    script.src = 'https://w.iplsc.com/widget/weather-2.0.2.jssc';
    document.head.appendChild(script);
  });
})();
