// k-Nearest Neighbors (KNN) Classification with ML5 and tensorflow.js
// 1. Load MobileNet -> 1000 classes trained from ImageNet
// 2. Create a "feature extractor"
// 3. Pass in image and get the logits values
// 4. Create an empty ml5.KNN model
// 5. "infer" from image (cosine distance)

let x, y;

let video;
let features;
let knn;
let labelP;
let ready = false;
let label = "nothing";

function setup() {
  createCanvas(320, 240);
  video = createCapture(VIDEO);
  video.size(320, 240);
  //video.style("transform", "scale(-1, 1)");
  features = ml5.featureExtractor("MobileNet", modelReady);
  knn = ml5.KNNClassifier();
  labelP = createP("Need training data");
  labelP.style('font-size', '32pt')
  x = width/2;
  y = height/2;
}

function goClassify() {
  const logits = features.infer(video);
  knn.classify(logits, function (error, result) {
    if(error) {
      console.log(error);
    } else {
      label = result.label;
      labelP.html(label);
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
  } else if (key === "u") {
    knn.addExample(logits, "up");
    console.log("right");
  } else if (key === "d") {
    knn.addExample(logits, "down");
    console.log("right");
  } else if (key === " ") {
    knn.addExample(logits, "stay");
    console.log("right");
  } else if (key === "s") {
    save("model.json");
  }
  
}

function modelReady() {
  console.log("MobileNet loaded");
  //knn = ml5.KNNClassifier();
  //knn.load("model.json", function() {
  //  console.log("KNN loaded")
  //  goClassify();
  //});
}

const save = (knn, name) => {
  const dataset = knn.knnClassifier.getClassifierDataset();
  if (knn.mapStringToIndex.length > 0) {
    Object.keys(dataset).forEach(key => {
      if (knn.mapStringToIndex[key]) {
        dataset[key].label = knn.mapStringToIndex[key];
      }
    });
  }
  const tensors = Object.keys(dataset).map(key => {
    const t = dataset[key];
    if (t) {
      return t.dataSync();
    }
    return null;
  });
  let fileName = 'myKNN.json';
  if (name) {
    fileName = name.endsWith('.json') ? name : `${name}.json`;
  }
  saveFile(fileName, JSON.stringify({ dataset, tensors }));
};

const saveFile = (name, data) => {
  const downloadElt = document.createElement('a');
  const blob = new Blob([data], { type: 'octet/stream' });
  const url = URL.createObjectURL(blob);
  downloadElt.setAttribute('href', url);
  downloadElt.setAttribute('download', name);
  downloadElt.style.display = 'none';
  document.body.appendChild(downloadElt);
  downloadElt.click();
  document.body.removeChild(downloadElt);
  URL.revokeObjectURL(url);
};

function draw() {
  background(0)
  fill(255);
  ellipse(x, y, 32);

  if (label == "up") {
    y--;
  } else if (label == "down") {
    y++;
  } else if (label == "left") {
    x--;
  } else if (label == "right") {
    x++;
  }
  x = constrain(x, 0, width);
  y = constrain(y, 0, height);

  if (!ready && knn.getNumLabels() > 0) {
    goClassify();
    ready = true;
  }
}