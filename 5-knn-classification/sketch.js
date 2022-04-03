// k-Nearest Neighbors (KNN) Classification with ML5 and tensorflow.js
// 1. Load MobileNet -> 1000 classes trained from ImageNet
// 2. Create a "feature extractor"
// 3. Pass in image and get the logits values
// 4. Create an empty ml5.KNN model
// 5. "infer" from image (cosine distance)

let video;
let features;
let knn;
let lebelP;
let ready = false;

function setup() {
  createCanvas(320, 240);
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();
  features = ml5.featureExtractor("MobileNet", modelReady());
  knn = ml5.KNNClassifier();
  labelP = createP("Need training data");
  labelP.style('font-size', '32pt')
}

function goClassify() {
  const logits = features.infer(video);
  knn.classify(logits, function (error, result) {
    if(error) {
      console.log(error);
    } else {
      labelP.html(result.label);
      goClassify();
    }  
  });
}

function mousePressed() {
  if (knn.getNumLabels() > 0) {
    const logits = features.infer(video);
    knn.classify(logits, gotResult);
  }
}

function keyPressed() {
  const logits = features.infer(video);
  if (key === 'l') {
    knn.addExample(logits, "left");
    console.log("left");
  } else if (key === "r") {
    knn.addExample(logits, "right");
    console.log("right");
  } else if (key === "s") {
    knn.save("model.json");
  }
  
}

function modelReady() {
  console.log("model ready");
}

function draw() {
  image(video, 0, 0);

  if (!ready && knn.getNumLabels() > 0) {
    goClassify();
    ready = true;
  }

}