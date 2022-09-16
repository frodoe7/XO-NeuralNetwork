/* eslint-disable array-callback-return */
import { NeuralNetwork } from "brain.js";
const combos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];
const possibleStates = [-1, 0, 1];

// provide optional config object (or undefined). Defaults shown.
const config = {
  binaryThresh: 0.5,
  hiddenLayers: [9],
  activation: "sigmoid",
};

// create a simple feed forward neural network with backpropagation
const net = new NeuralNetwork(config);

const processRow = (row, indexes) => {
  let output = {};

  // INDEX 0
  if (row[0] !== 0) {
    output[indexes[0]] = 0;
  } else {
    if (row[1] === row[2]) {
      if (row[1] === -1) output[indexes[0]] = 10;
      else if (row[1] === 1) output[indexes[0]] = 10;
      else output[indexes[0]] = 0;
    } else output[indexes[0]] = 1;
  }

  // INDEX 1
  if (row[1] !== 0) {
    output[indexes[1]] = 0;
  } else {
    if (row[0] === row[2]) {
      if (row[0] === -1) output[indexes[1]] = 10;
      else if (row[0] === 1) output[indexes[1]] = 10;
      else output[indexes[1]] = 0;
    } else output[indexes[1]] = 1;
  }

  // INDEX 2
  if (row[2] !== 0) {
    output[indexes[2]] = 0;
  } else {
    if (row[0] === row[1]) {
      if (row[1] === -1) output[indexes[2]] = 10;
      else if (row[1] === 1) output[indexes[2]] = 10;
      else output[indexes[2]] = 0;
    } else output[indexes[2]] = 1;
  }

  return output;
};

const processBoard = (board) => {
  let finalOutput = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let [a, b, c] of combos) {
    let input = [board[a], board[b], board[c]];
    let output = processRow(input, [a, b, c]);
    finalOutput[a] += output[a] / 10;
    finalOutput[b] += output[b] / 10;
    finalOutput[c] += output[c] / 10;
  }

  return finalOutput;
};

const generateRandomCell = () => {
  return possibleStates[Math.floor(Math.random() * possibleStates.length)];
};

const generateRandomBoard = () => {
  let output = [];
  for (var i = 0; i < 9; i++) {
    output.push(generateRandomCell());
  }

  return output;
};

const prepareTrainingData = (sets) => {
  let data = [];
  for (var i = 0; i < sets; i++) {
    let input = generateRandomBoard();
    let output = processBoard(input);

    data.push({
      input,
      output,
    });
  }

  return data;
};

const binarizeBoard = (board, playerSign) => {
  let signMap = playerSign === "X" ? { X: -1, O: 1 } : { O: -1, X: 1 };
  let binarizedBoard = [];
  for (var i = 0; i < board.length; i++) {
    if (board[i] === "") binarizedBoard.push(0);
    else {
      binarizedBoard.push(signMap[board[i]]);
    }
  }

  return binarizedBoard;
};

const randomAction = (currentState) => {
  let availableIndexes = [];

  currentState.forEach((state, i) => {
    if (state === "") availableIndexes.push(i);
  });

  let randomSlot = Math.floor(Math.random() * availableIndexes.length);
  return [availableIndexes[randomSlot]];
};

const networkThink = (board) => {
  let output = net.run(board);
  for (var i = 0; i < output.length; i++) {
    if (board[i] !== 0 || isNaN(output[i])) {
      output[i] = Number.MIN_VALUE;
    }
  }

  console.log(output);
  return output.indexOf(Math.max(...output));
};

export const trainNetwork = (sets, starterPlayer, cb) => {
  let data = prepareTrainingData(sets);
  net.train(data);
  cb(starterPlayer);
};

export const playAi = (currentState, playerSign, aiEnabled, callback) => {
  if (aiEnabled) {
    let binarizedBoard = binarizeBoard(currentState, playerSign);
    let slotIndex = networkThink(binarizedBoard);
    callback(slotIndex);
  } else {
    let randomSlot = randomAction(currentState);
    callback(randomSlot);
  }
};

export const checkWinner = (board) => {
  // iterate though the combos and de-structure the set of 3 indices
  for (let [a, b, c] of combos) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // 'X' | 'O'
    }
  }
  return ""; // no winner
};
