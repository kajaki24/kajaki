module.exports = function(eleventyConfig) {
    
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");

    return {
      dir: {
        input: "src",
        output: "public",
        includes: "includes"
      }
    }
  };

