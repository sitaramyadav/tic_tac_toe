import React from "react";
import styled from "styled-components";
import TicTacToe from "./TicTacToe";

const Header = styled.header`
  width: 100%;
  height: 200px;
  background-color: slategrey;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function App() {
  return (
    <>
      <Header>
        <h1>Tic Tac Toe Game</h1>
      </Header>
      <Main>
        <TicTacToe />
      </Main>
    </>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1 0 auto;
  background-color: #3913d099;
`;

export default App;
