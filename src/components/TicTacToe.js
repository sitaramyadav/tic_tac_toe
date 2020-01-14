import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import PropTypes from 'prop-types';

import {
  PLAYER_X,
  PLAYER_O,
  SQUARE_DIMS,
  DRAW,
  GAME_STATES,
  DIMS
} from "../constants";
import Board from "./Board";
import { getRandomInt, switchPlayer } from "../helpers/utils";
import { minimax } from "../helpers/minimax";
import { border } from "../styles";

const arr = new Array(DIMS ** 2).fill(null);
const board = new Board();

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: ${({ dims }) => `${dims * (SQUARE_DIMS + 5)}px`};
  flex-flow: wrap;
  position: relative;
`;

const Square = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${SQUARE_DIMS}px;
  height: ${SQUARE_DIMS}px;
  ${border};

  &:hover {
    cursor: pointer;
  }
`;

Square.displayName = "Square";

const Marker = styled.p`
  font-size: 68px;
`;

const Choose = styled.section`
  display: flex;
  width: 150px;
  justify-content: space-between;
`;

const Screen = styled.article``;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;
const ChooseText = styled.h2``;

const Strikethrough = styled.div`
  position: absolute;
  ${({ styles }) => styles}
  background-color: indianred;
  height: 5px;
  width: ${({ styles }) => !styles && "0px"};
`;

const Winner = styled.h2`
  font-size: 36px;

`;

const Button = styled.button`
  background: ${props => props.primary ? "palevioletred" : "white"};
  color: ${props => props.primary ? "white" : "palevioletred"};

  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
  cursor: pointer;
`;


const TextOr = styled.p`
  font-size: 24px;
  margin: 14px auto;
`;

const TicTacToe = ({ squares = arr }) => {
  const [players, setPlayers] = useState({ human: null, computer: null });
  const [gameState, setGameState] = useState(GAME_STATES.notStarted);
  const [grid, setGrid] = useState(squares);
  const [winner, setWinner] = useState(null);
  const [nextMove, setNextMove] = useState(null);


  useEffect(() => {
    const winner = board.getWinner(grid);
    const declareWinner = winner => {
      let winnerStr;
      switch (winner) {
        case PLAYER_X:
          winnerStr = "Player X wins!";
          break;
        case PLAYER_O:
          winnerStr = "Player O wins!";
          break;
        case DRAW:
        default:
          winnerStr = "It's a draw";
      }
      setGameState(GAME_STATES.over);
      setWinner(winnerStr);
    };

    if (winner !== null && gameState !== GAME_STATES.over) {
      declareWinner(winner);
    }
  }, [gameState, grid, nextMove]);


  const move = useCallback(
    (index, player) => {
      if (player && gameState === GAME_STATES.inProgress) {
        setGrid(grid => {
          const gridCopy = grid.concat();
          gridCopy[index] = player;
          return gridCopy;
        });
      }
    },
    [gameState]
  );
  const computerMove = useCallback(() => {
    const board = new Board(grid.concat());
    const emptyIndices = board.getEmptySquares(grid);
    let smartMove;
    let index;
        smartMove = !board.isEmpty(grid) && Math.random() < 0.5;
        if (smartMove) {
          index = minimax(board, players.computer)[1];
        } else {
          do {
            index = getRandomInt(0, 8);
          } while (!emptyIndices.includes(index));
        }
      if (!grid[index]) {
        move(index, players.computer);
        setNextMove(players.human);
      }
  }, [move, grid, players]);

  useEffect(() => {
    let timeout;
    if (
      nextMove !== null &&
      nextMove === players.computer &&
      gameState !== GAME_STATES.over
    ) {
      timeout = setTimeout(() => {
        computerMove();
      }, 100);
    }
    return () => timeout && clearTimeout(timeout);
  }, [nextMove, computerMove, players.computer, gameState]);

  const humanMove = index => {
    if (!grid[index] && nextMove === players.human) {
      move(index, players.human);
      setNextMove(players.computer);
    }
  };

  const choosePlayer = option => {
    setPlayers({ human: option, computer: switchPlayer(option) });
    setGameState(GAME_STATES.inProgress);
    setNextMove(PLAYER_X);
  };

  const startNewGame = () => {
    setGrid(arr);
    setGameState(GAME_STATES.notStarted);
    setWinner(null);
  };

  return gameState === GAME_STATES.notStarted ? (
    <Screen>
      <Inner>
        <ChooseText>click on X if you want to play first and computer will play second else choose 0</ChooseText>
        <Choose>
          <Button onClick={() => choosePlayer(PLAYER_X)}>X</Button>
          <TextOr>or</TextOr>
          <Button onClick={() => choosePlayer(PLAYER_O)}>O</Button>
        </Choose>
      </Inner>
    </Screen>
  ) : (
    <>
     <Winner>{winner}</Winner>
    <Container dims={DIMS}>
      {grid.map((value, index) => {
        const isActive = value !== null;

        return (
          <Square
            data-testid={`square_${index}`}
            key={index}
            onClick={() => humanMove(index)}
          >
            {isActive && <Marker>{value === PLAYER_X ? "X" : "O"}</Marker>}
          </Square>
        );
      })}
      <Strikethrough
        styles={
          gameState === GAME_STATES.over && board.getStrikethroughStyles()
        }
      />
      <div>
        <Button primary onClick={startNewGame}>Restart</Button>
      </div>
    </Container>
    </>
  );
};

TicTacToe.propTypes = {
  squares : PropTypes.array
}

export default TicTacToe;
