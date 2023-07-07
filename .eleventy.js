const eleventyPluginFilesMinifier = require("@sherby/eleventy-plugin-files-minifier");
const Image = require('@11ty/eleventy-img');

module.exports = function(eleventyConfig) {
    
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/static/img");
  eleventyConfig.addPassthroughCopy("src/galeria/img");
  eleventyConfig.addPassthroughCopy("src/admin");

  eleventyConfig.addPlugin(eleventyPluginFilesMinifier);

  // get the current year 
  eleventyConfig.addShortcode("getYear", function() {
    const year = new Date().getFullYear();
      return `${year}`;
  });

  // Collections 
eleventyConfig.addCollection('cennik', function(collectionApi) {
  const cennikPosts = collectionApi.getFilteredByGlob('src/cennik/**/*.md').reverse();

  // Grupowanie postów "Cennik" według kategorii
  const cennikCategories = {};
  cennikPosts.forEach(post => {
    const category = post.data.category;

    if (!cennikCategories[category]) {
      cennikCategories[category] = [];
    }

    cennikCategories[category].push(post);
  });

  return cennikCategories;
});

  // Trasy
  eleventyConfig.addCollection('trasy', function(collectionApi) {
    return collectionApi.getFilteredByGlob('src/trasy/**/*.md').reverse();
  });

  // Settings
  eleventyConfig.addCollection('settings', function(collectionApi) {
    return collectionApi.getFilteredByGlob('src/settings/**/*.md').reverse();
  });  

  // Gallery
  eleventyConfig.addCollection('galeria', function(collectionApi) {
    return collectionApi.getFilteredByGlob('src/galeria/**/*.md').reverse();
  });

  eleventyConfig.addNunjucksAsyncShortcode('Image', async (src, alt, className) => {
    if (!alt) {
      throw new Error(`Missing \`alt\` on myImage from: ${src}`);
    }

    let stats = await Image(src, {
      widths: [25, 320, 640, 960, 1200, 1800, 2400],
      formats: ['jpeg', 'webp'],
      urlPath: '/assets/images/',
      outputDir: './public/assets/images/',
    });

    let lowestSrc = stats['jpeg'][0];

    const srcset = Object.keys(stats).reduce(
      (acc, format) => ({
        ...acc,
        [format]: stats[format].reduce(
          (_acc, curr) => `${_acc} ${curr.srcset} ,`,
          '',
        ),
      }),
      {},
    );

    const source = `<source type="image/webp" srcset="${srcset['webp']}" >`;

    const img = `<img
      loading="lazy"
      alt="${alt}"
      src="${lowestSrc.url}"
      sizes='(min-width: 1024px) 1024px, 100vw'
      srcset="${srcset['jpeg']}"
      width="${lowestSrc.width}"
      height="${lowestSrc.height}"
      class="${className}">`;

    return `<div class="image-wrapper"><picture> ${source} ${img} </picture></div>`;
});


    return {
      dir: {
        input: "src",
        output: "public",
        includes: "includes"
      }
    }
  };

