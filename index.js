const Canvas = require('drawille');
const JIMP = require('jimp');

let w = process.stdout.columns * 2;
let h = (process.stdout.rows-2) * 4;
const c = new Canvas(w, h);


function renderImage(path){
  return JIMP.read(path)
    .then((image) => {
      let error = 0;
      let e = {};
      let thisLine = [];
      let nextLine = [0];
      image.contain(w, h)
        .scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, i) => {
          if (x === 0) {
            thisLine = nextLine;
            nextLine = [];
          }

          const R = image.bitmap.data[i],
            G = image.bitmap.data[i+1],
            B = image.bitmap.data[i+2];

          const brightness = (R+G+G+G+B+B)/6; 

          v = brightness + error;
          
          const clamped = v > 128 ? 256 : 0;
          error = v - clamped;

          error_divided = error/16;
          thisLine[x+1] = (thisLine[x+1] || 0) + error_divided*7;
          nextLine[x-1] = (nextLine[x-1] || 0) + error_divided*3;
          nextLine[x] = (nextLine[x] || 0) + error_divided*5;
          nextLine[x+1] = (nextLine[x+1] || 0) + error_divided*1;

          if (clamped > 128){
            c.set(x, y);
          }
        });
      return c.frame();
    });
}

if (require.main === module) {
  let path = process.argv.reverse()[0];
  renderImage(path).then(img => console.log(img));
} else {
  module.exports = renderImage;
}
