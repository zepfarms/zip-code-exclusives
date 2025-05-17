
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const svg2img = require('svg2img');

// Convert house favicon
svg2img('public/house-favicon.svg', { width: 32, height: 32 }, (error, buffer) => {
  if (error) {
    console.error('Error converting favicon SVG to PNG:', error);
    return;
  }
  fs.writeFileSync('public/house-favicon.png', buffer);
  console.log('House favicon converted to PNG successfully');
});

// Convert social share image
svg2img('public/social-share-image.svg', { width: 1200, height: 630 }, (error, buffer) => {
  if (error) {
    console.error('Error converting social share SVG to PNG:', error);
    return;
  }
  fs.writeFileSync('public/social-share-image.png', buffer);
  console.log('Social share image converted to PNG successfully');
});
