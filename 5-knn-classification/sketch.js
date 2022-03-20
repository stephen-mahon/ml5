// k-Nearest Neighbors (KNN) Classification with ML5 and tensorflow.js
// 1. Load MobileNet -> 1000 classes trained from ImageNet
// 2. Create a "feature extractor"
let video;
let features;

function setup() {
  createCanvas(320, 240);
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();
  features = ml5.featureExtractor("MobileNet", modelReady());
}

function mousePressed() {
  const logits = features.infer(video);
  console.log(logits.dataSync());
}

function modelReady() {
  console.log("model ready");
}

function draw() {
  image(video, 0, 0);
}