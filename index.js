const Canvas = require('drawille');
const JIMP = require('jimp');

let w = process.stdout.columns * 2;
let h = (process.stdout.rows-2) * 4;
const c = new Canvas(w, h);

JIMP.read('./sample_data/type.jpg')
  .then((image) => {
    let error = 0;
    let e = {};
    image.resize(150, 100)
      .scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, i) => {
        let n = `${x}.${y}`;
        if (e[n]) error = e[n];
      
        const R = image.bitmap.data[i],
          G = image.bitmap.data[i+1],
          B = image.bitmap.data[i+2];

        const b = (R+R+G+G+G+B)/6; 

        v = b + error;
        error -= v;

        error_divided = error/16;
        e[`${x+1}.${y}`] = (e[`${x+1}.${y}`] || 0) + error_divided*7;
        e[`${x-1}.${y+1}`] = (e[`${x-1}.${y+1}`] || 0) + error_divided*3;
        e[`${x}.${y+1}`] = (e[`${x}.${y+1}`] || 0) + error_divided*5;
        e[`${x+1}.${y+1}`] = (e[`${x+1}.${y+1}`] || 0) + error_divided*1;

        if (v > 0){
          c.set(x, y);
        }
      });
    console.log(c.frame());
  });
