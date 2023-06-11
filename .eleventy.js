module.exports = function(eleventyConfig) {
    
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/admin");

  // Collections blog
  eleventyConfig.addCollection('cennik', function(collectionApi) {
      return collectionApi.getFilteredByGlob('src/cennik/**/*.md').reverse();
  });

    return {
      dir: {
        input: "src",
        output: "public",
        includes: "includes"
      }
    }
  };

