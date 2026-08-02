function resizeImage(width, height, maxWidth, maxHeight) {
  let w = width;
  let h = height;

  if (w > maxWidth) {
    h = Math.round((h * maxWidth) / w);
    w = maxWidth;
  }

  if (h > maxHeight) {
    w = Math.round((w * maxHeight) / h);
    h = maxHeight;
  }

  return { width: w, height: h };
}

module.exports = resizeImage;