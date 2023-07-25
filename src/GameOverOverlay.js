import React from 'react';
import styled from 'styled-components';

const GameOverOverlayStyled = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  padding: 20px;
  color: white;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GameOverOverlay = ({ onRestart }) => {
  return (
    <GameOverOverlayStyled>
      <h2>Game Over</h2>
      <button onClick={onRestart}>Tentar Novamente</button>
    </GameOverOverlayStyled>
  );
};

export default GameOverOverlay;