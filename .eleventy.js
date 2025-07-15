const eleventyPluginFilesMinifier = require("@sherby/eleventy-plugin-files-minifier");
const Image = require('@11ty/eleventy-img');
const { parse } = require('node-html-parser');
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const slugify = require("slugify"); 
const blogImage = require('./src/shortcodes/blogImage.js');

module.exports = function(eleventyConfig) {
    
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/static/img");
  eleventyConfig.addPassthroughCopy("src/posts/img");
  eleventyConfig.addPassthroughCopy("src/galeria/img");
  eleventyConfig.addPassthroughCopy("src/galeria-szkoly/img");
  eleventyConfig.addPassthroughCopy("src/galeria-firmy/img");
  eleventyConfig.addPassthroughCopy("src/admin");

  eleventyConfig.addPlugin(eleventyPluginFilesMinifier);

      eleventyConfig.addFilter("extractHeaders", function(content) {
      const root = parse(content);
      const headers = root.querySelectorAll('h2');
      return headers.map(header => header.innerText);
    });


  // get the current year 
  eleventyConfig.addShortcode("getYear", function() {
    const year = new Date().getFullYear();
      return `${year}`;
  });
  eleventyConfig.addNunjucksAsyncShortcode("blogImage", blogImage);

          // Date
        eleventyConfig.addFilter('dateDisplay', require('./src/filters/date-display.js'));
        eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);


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

  // Blog
  eleventyConfig.addCollection('posts', function(collectionApi) {
    return collectionApi.getFilteredByGlob('src/posts/**/*.md').reverse();
  });


  // Settings
  eleventyConfig.addCollection('settings', function(collectionApi) {
    return collectionApi.getFilteredByGlob('src/settings/**/*.md').reverse();
  });  

  // Gallery Main
  eleventyConfig.addCollection('galeria', function(collectionApi) {
    return collectionApi.getFilteredByGlob('src/galeria/**/*.md').reverse();
  });

  // Gallery School
    eleventyConfig.addCollection('galeria_szkoly', function(collectionApi) {
      return collectionApi.getFilteredByGlob('src/galeria-szkoly/**/*.md').reverse();
    });

  // Gallery Business
  eleventyConfig.addCollection('galeria_firmy', function(collectionApi) {
    return collectionApi.getFilteredByGlob('src/galeria-firmy/**/*.md').reverse();
  });
  eleventyConfig.addNunjucksAsyncShortcode('Image', async (src, alt) => {
    if (!alt) {
      throw new Error(`Missing \`alt\` on myImage from: ${src}`);
    }

    let stats = await Image(src, {
      widths: [25, 320, 640, 960, 1200, 1800 ],
      formats: ['jpeg', 'webp'],
      urlPath: '/assets/img/',
      outputDir: './public/assets/img/',
    });

    let lowestSrc = stats['jpeg'][0]; 
    let largestSrc = stats['jpeg'][1];

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
      decoding="async"
      loading="lazy"
      alt="${alt}"
      src="${lowestSrc.url}"
      sizes='(min-width: 1024px) 1024px, 100vw'
      srcset="${srcset['jpeg']}"
      width="${largestSrc.width}"
      height="${largestSrc.height}">`;

    return `<div class="image-wrapper blur-load" >
              <img class="placeholder" src="${lowestSrc.url}" loading="lazy" alt="Placeholder" width="${largestSrc.width}" height="${largestSrc.height}"><picture> ${source} ${img} </picture></div>`;
  });


        let md = markdownIt({
        html: true,
        breaks: true,
        linkify: true
    }).use(markdownItAnchor, {
        level: 2, 
        slugify: function(str) {
            return slugify(str, {
                lower: true,  
                strict: true 
            });
        }
    });

    eleventyConfig.setLibrary("md", md);

    return {
      dir: {
        input: "src",
        output: "public",
        includes: "includes"
      }
    }
  };

