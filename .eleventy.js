module.exports = function(eleventyConfig) {
    
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/admin");

  // Collections cennik
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
  

    return {
      dir: {
        input: "src",
        output: "public",
        includes: "includes"
      }
    }
  };

