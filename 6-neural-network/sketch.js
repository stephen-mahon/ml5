// 1. Collect training data
// 2. Train model
// 3. Prediction

let model;
let targetLabel = 'C';

let state = "collection";

function setup() {
  createCanvas(400, 400);

  let options = {
    inputs: ['x', 'y'],
    outputs: ['label'],
    task: 'classification',
    debug: 'true'
  };
  model = ml5.neuralNetwork(options);
  background(255);
}

function keyPressed() {
  state = "training";
  if (key == 't') {
    console.log("starting training:")
    model.normalizeData();
    let options = {
      epoch: 200
    };
    model.train(options, whileTraining, finishedTraining);
  } else {
    targetLabel = key.toUpperCase();
  }
}

function whileTraining(epoch, loss) {
  console.log(epoch);

}

function finishedTraining() {
  console.log("finished training.");
  state = "prediction";
}

function mousePressed(){
  let inputs = {
    x: mouseX,
    y: mouseY
  };

  if (state == "collection") {
    let target = {
      label: targetLabel
    };
    model.addData(inputs, target);
    stroke(0);
    noFill();
    ellipse(mouseX, mouseY, 24);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(targetLabel, mouseX, mouseY);
  } else if (state == "prediction") {
    model.classify(inouts);
  }
}

function gotResults(error, results) {
  if (error) {
    console.log(error);
    return;
  }
  console.log(results);
}