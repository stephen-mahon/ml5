let mobilenet;
let bear;


function modelReady() {
  console.log('Model is ready.');
  mobilenet.predict(bear, gotResults);
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
  } else {
    console.log(results);
    let label = results[0].label;
    let confidence =results[0].confidence;
    fill(0);
    textSize(64);
    text(label, 10, height - 100);
    createP(label);
    createP(confidence);
  }
}

function imageReady() {
  image(bear, 0, 0, width, height);
}

function setup() {
  createCanvas(640, 480);
  bear = createImg('images/moose.jpg', imageReady)
  bear.hide();
  background(0);
  image(bear, 0, 0);
  mobilenet = ml5.imageClassifier('MobileNet', modelReady);

}