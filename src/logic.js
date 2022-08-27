import { NeuralNetwork } from 'brain.js';

// provide optional config object (or undefined). Defaults shown.
const config = {
  binaryThresh: 0.5,
  hiddenLayers: [3], // array of ints for the sizes of the hidden layers in the network
  activation: 'sigmoid', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
  leakyReluAlpha: 0.01, // supported for activation type 'leaky-relu'
};

// create a simple feed forward neural network with backpropagation
const net = new NeuralNetwork(config);

export const playAi = (currentState, aiEnabled, callback) => {
  if (aiEnabled) {
    // TODO: should use neural network model here!
  } else {
    let randomSlot = randomAction(currentState);
    console.log(randomSlot);
    callback(randomSlot[0], randomSlot[1]);
  }
};

const randomAction = (currentState) => {
  let availableIndexes = [];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (currentState[i][j] === '') availableIndexes.push([i, j]);
    }
  }

  let randomSlot = Math.floor(Math.random() * availableIndexes.length);
  return [availableIndexes[randomSlot][0], availableIndexes[randomSlot][1]];
};
