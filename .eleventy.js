const Image = require("@11ty/eleventy-img");
const path = require("path");

async function galleryImageShortcode(src, alt) {
  if (alt === undefined) {
    throw new Error(`Missing \`alt\` on myImage from: ${src}`);
  }

  src = path.join(__dirname, 'images', src);

  const metadata = await Image(src, {
    widths: [100, "auto"],
    formats: ["webp"],
    outputDir: "dist/img"
  });

  const [ thumbnail, data ] = metadata.webp;
  return `<a href="${data.url}" data-pswp-width="${data.width}" data-pswp-height="${data.height}"><img class="shadow" src="${thumbnail.url}" width="${thumbnail.width}" height="${thumbnail.height}" alt="${alt}"></a>`;
}

module.exports = config => {
  config.addAsyncShortcode("gallery-image", galleryImageShortcode);

  config.addPassthroughCopy("assets");
  config.addPassthroughCopy("demo");

  return {
    dir: {
      input: 'src/html',
      output: 'dist'
    }
  };
};
