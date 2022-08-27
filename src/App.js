/* eslint-disable react-hooks/exhaustive-deps */
import './App.css';
import {
  Box,
  Button,
  Grommet,
  RadioButtonGroup,
  RangeInput,
  Spinner,
  Tab,
  Tabs,
  Text,
} from 'grommet';
import { useEffect, useState } from 'react';
import { playAi, checkWinner } from './logic';

const theme = {
  global: {
    focus: {
      outline: {
        size: '0px',
      },
    },
  },
  tab: {
    color: 'gray',
    border: {
      color: 'gray',
      active: {
        color: 'brand',
      },
    },
    active: {
      color: 'brand',
    },
  },
};

function App() {
  const [currentState, setCurrentState] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ]);

  const signs = ['X', 'O'];
  const [currentPlayer, setCurrentPlayer] = useState('');
  const [playerSign, setPlayerSign] = useState('X');
  const [aiEnabled, setAiEnabled] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [trainSet, setTrainSet] = useState(100);
  const [personWon, setPersonWon] = useState('');

  useEffect(() => {
    let winner = checkWinner(currentState);
    if (winner === '') {
      if (checkIfAllFilled()) {
        setPersonWon('D');
      } else {
        if (currentPlayer !== playerSign) {
          setTimeout(
            () => {
              playBot();
            },
            aiEnabled ? 3000 : 1000
          );
        }
      }
    } else {
      if (playerSign === winner) {
        setPersonWon('P');
      } else {
        setPersonWon('B');
      }
    }
  }, [currentPlayer]);

  const startGame = (starterPlayer) => {
    setCurrentPlayer(starterPlayer);
    setCurrentState(['', '', '', '', '', '', '', '', '']);
    setPersonWon('');
    setGameStarted(true);
  };

  const getCurrentSign = () => {
    if (currentPlayer === playerSign) {
      return playerSign;
    } else {
      return playerSign === signs[0] ? signs[1] : signs[0];
    }
  };

  const getNextSign = (sign) => {
    return sign === signs[0] ? signs[1] : signs[0];
  };

  const fillCell = (id) => {
    let cells = [...currentState];
    let sign = getCurrentSign();

    cells[id] = sign;
    setCurrentPlayer(getNextSign(sign));
    setCurrentState([...cells]);
  };

  const play = (id) => {
    if (currentState[id] !== '') return;
    if (currentPlayer !== playerSign) return;
    if (!gameStarted || personWon !== '') return;

    fillCell(id);
  };

  const checkIfAllFilled = () => {
    for (let i = 0; i < currentState.length; i++) {
      if (currentState[i] === '') return false;
    }
    return true;
  };

  const playBot = () => {
    if (currentPlayer === playerSign) return;
    if (!gameStarted || personWon !== '') return;

    playAi(currentState, aiEnabled, fillCell);
  };

  const renderCell = (id) => {
    return (
      <Box
        focusIndicator={false}
        onClick={() => {
          play(id);
        }}
        style={styles.cell}
        margin="xsmall"
        background="brand"
      >
        <Text style={styles.cellValue}>{currentState[id]}</Text>
      </Box>
    );
  };

  const getLabelByPersonWon = () => {
    const labels = {
      B: 'Game Over! The bot won',
      D: 'Draw! No one win',
      P: 'Congrats! you won',
    };

    return labels[personWon];
  };

  return (
    <Grommet theme={theme} className="App">
      <header className="App-header">
        {gameStarted && (
          <>
            {personWon === '' && (
              <Text style={styles.turnIndicator}>
                {playerSign === currentPlayer ? 'Your turn' : 'Ai Turn'}
              </Text>
            )}

            {personWon !== '' && (
              <Text
                color={personWon === 'P' ? '#fbc531' : 'gray'}
                style={styles.turnIndicator}
              >
                {getLabelByPersonWon()}
              </Text>
            )}

            {personWon !== '' && (
              <Button
                onClick={() => {
                  setGameStarted(false);
                }}
                style={{ marginBottom: 28 }}
                primary
                label="New Game"
              />
            )}

            <Box>
              <Box direction="row">
                {renderCell(0)}
                {renderCell(1)}
                {renderCell(2)}
              </Box>
              <Box direction="row">
                {renderCell(3)}
                {renderCell(4)}
                {renderCell(5)}
              </Box>
              <Box direction="row">
                {renderCell(6)}
                {renderCell(7)}
                {renderCell(8)}
              </Box>
            </Box>
            <Text
              color={aiEnabled ? '#fbc531' : 'light-3'}
              style={styles.aiIndicator}
            >
              {aiEnabled
                ? 'Neural Network Integrated'
                : 'Random actions (NO AI)'}
            </Text>

            {personWon === '' && (
              <Box
                direction="row"
                style={{
                  visibility:
                    currentPlayer === playerSign ? 'hidden' : 'visible',
                  marginTop: 8,
                }}
              >
                <Text style={styles.thinking}>Thinking..</Text>
                <Spinner color={'#fbc531'} />
              </Box>
            )}
          </>
        )}

        {!gameStarted && (
          <>
            <Text style={styles.startGame}>Configure a new game</Text>
            <Box style={{ padding: 16 }} background="white">
              <Tabs>
                <Tab
                  color="red"
                  style={{
                    color: 'red',
                  }}
                  onClick={() => {
                    setAiEnabled(false);
                  }}
                  title="Normal Game (without AI)"
                >
                  <Text style={styles.aiIndicator}>Play with ?</Text>
                  <RadioButtonGroup
                    options={['X', 'O']}
                    value={playerSign}
                    onChange={(event) => {
                      setPlayerSign(event.target.value);
                    }}
                  />
                  <Button
                    style={{ marginTop: 24 }}
                    primary
                    size="large"
                    label="Start"
                    onClick={() => {
                      let randomPlayerStart = Math.floor(Math.random() * 2);
                      startGame(signs[randomPlayerStart]);
                    }}
                  />
                </Tab>
                <Tab
                  onClick={() => {
                    setAiEnabled(true);
                  }}
                  title="AI Mode (With Neural Network)"
                >
                  <Text style={styles.aiIndicator}>Play with ?</Text>
                  <RadioButtonGroup
                    options={['X', 'O']}
                    value={playerSign}
                    onChange={(event) => {
                      setPlayerSign(event.target.value);
                    }}
                  />
                  <Text style={styles.aiIndicator}>
                    Gain experience / Learn {trainSet} Sets
                  </Text>
                  <RangeInput
                    value={trainSet}
                    min={100}
                    max={1000000}
                    onChange={(event) => setTrainSet(event.target.value)}
                  />
                  <Button
                    style={{ marginTop: 24 }}
                    primary
                    size="large"
                    label="Start"
                    onClick={() => {
                      let randomPlayerStart = Math.floor(Math.random() * 2);
                      startGame(signs[randomPlayerStart]);
                    }}
                  />
                </Tab>
              </Tabs>
            </Box>
          </>
        )}
      </header>
    </Grommet>
  );
}

const styles = {
  cell: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellValue: { fontSize: 18, fontWeight: 'bold' },
  turnIndicator: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  aiIndicator: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
  },
  thinking: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 16,
    color: '#fbc531',
  },
  startGame: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
  },
};

export default App;
