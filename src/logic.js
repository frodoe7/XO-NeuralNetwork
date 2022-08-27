/* eslint-disable array-callback-return */
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
    callback(randomSlot);
  }
};

const randomAction = (currentState) => {
  let availableIndexes = [];

  currentState.forEach((state, i) => {
    if (state === '') availableIndexes.push(i);
  });

  let randomSlot = Math.floor(Math.random() * availableIndexes.length);
  return [availableIndexes[randomSlot]];
};

export const checkWinner = (board) => {
  let combos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2],
  ];

  // iterate though the combos and de-structure the set of 3 indices
  for (let [a, b, c] of combos) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // 'X' | 'O'
    }
  }
  return ''; // no winner
};
