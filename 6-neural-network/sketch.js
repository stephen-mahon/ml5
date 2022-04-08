// 1. Collect the training data
// (save data)
// 2. Train the model
// (save model)
// 3. Prediction/Inference

let model;
let targetLabel = 'C';

let state = "collection";

function setup() {
  createCanvas(400, 400);

  let options = {
    inputs: ['x', 'y'],
    outputs: ['label'],
    task: 'classification',
    debug: 'true',
    //learningRate: 0.01
  };
  model = ml5.neuralNetwork(options);
  model.loadData('mouse-labels.json', dataLoaded)
  background(255);
}

function dataLoaded() {
  console.log(model.data);
  let data = model.data.data.raw;
  for (let i = 0; i < data.Length; i++) {
    let inputs = data[i].xs;
    let target = data[i].ys;
    stroke(0);
    noFill();
    ellipse(inputs.x, inputs.y, 24);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(target.label, inputs.x, inputs.y);
  }
  state = "training";
  console.log("starting training:")
  model.normalizeData();
  let options = {
    epoch: 200
  };
  model.train(options, whileTraining, finishedTraining);
}

function keyPressed() {
  if (key == 't') {
    state = "training";
    console.log("starting training:")
    model.normalizeData();
    let options = {
      epoch: 200
    };
    model.train(options, whileTraining, finishedTraining);
  } else if (key == 's') {
    model.saveData("mouse-labels")
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
    model.classify(inputs, gotResults);
  }
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  console.log(results);
  stroke(0);
  fill(0,0,255,100);
  ellipse(mouseX, mouseY, 24);
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  text(results[0].label, mouseX, mouseY);
}