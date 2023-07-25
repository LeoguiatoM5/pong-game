import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 600px;
  height: 400px;
  border: 2px solid #333;
  position: relative;
  overflow: hiddsen;
`;

const Paddle = styled.div`
  width: 10px;
  height: 80px;
  position: absolute;
`;

const PaddleLeft = styled(Paddle)`
  background-color: blue;
  left: 10px;
`;

const PaddleRight = styled(Paddle)`
  background-color: red;
  right: 10px;
`;

const Ball = styled.div`
  width: 15px;
  height: 15px;
  background-color: #333;
  position: absolute;
`;

const Score = styled.div`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
`;

const PongGame = () => {
  const containerRef = useRef(null);
  const paddleLeftRef = useRef(null);
  const paddleRightRef = useRef(null);
  const ballRef = useRef(null);

  const [ballPosition, setBallPosition] = useState({ x: 290, y: 190 });
  const [ballSpeed, setBallSpeed] = useState({ x: 5, y: 5 });
  const [paddleLeftPosition, setPaddleLeftPosition] = useState(160);
  const [paddleRightPosition, setPaddleRightPosition] = useState(160);
  const [scoreLeft, setScoreLeft] = useState(0);
  const [scoreRight, setScoreRight] = useState(0);

  // Estado para controlar a velocidade da bola
  const [ballSpeedInterval, setBallSpeedInterval] = useState(null);

  const handleKeyDown = (e) => {
    const { key } = e;
    if (key === 'w') {
      setPaddleLeftPosition((prevPosition) => Math.max(0, prevPosition - 20));
    } else if (key === 's') {
      setPaddleLeftPosition((prevPosition) => Math.min(320, prevPosition + 20));
    } else if (key === 'ArrowUp') {
      setPaddleRightPosition((prevPosition) => Math.max(0, prevPosition - 20));
    } else if (key === 'ArrowDown') {
      setPaddleRightPosition((prevPosition) => Math.min(320, prevPosition + 20));
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const checkCollisions = () => {
    const container = containerRef.current;
    const ball = ballRef.current;

    const ballRect = ball.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Colisões com bordas verticais
    if (ballRect.top <= containerRect.top || ballRect.bottom >= containerRect.bottom) {
      setBallSpeed((prevSpeed) => ({ ...prevSpeed, y: -prevSpeed.y }));
    }

    // Colisões com paddles
    const paddleLeft = paddleLeftRef.current;
    const paddleRight = paddleRightRef.current;

    const paddleLeftRect = paddleLeft.getBoundingClientRect();
    const paddleRightRect = paddleRight.getBoundingClientRect();

    if (ballRect.left <= paddleLeftRect.right && ballRect.top >= paddleLeftRect.top && ballRect.bottom <= paddleLeftRect.bottom) {
      setBallSpeed((prevSpeed) => ({ ...prevSpeed, x: -prevSpeed.x }));
      setScoreRight((prevScore) => prevScore + 1);
    }

    if (ballRect.right >= paddleRightRect.left && ballRect.top >= paddleRightRect.top && ballRect.bottom <= paddleRightRect.bottom) {
      setBallSpeed((prevSpeed) => ({ ...prevSpeed, x: -prevSpeed.x }));
      setScoreLeft((prevScore) => prevScore + 1);
    }

    // Verifica se a bola saiu da tela
    if (ballRect.left <= containerRect.left || ballRect.right >= containerRect.right) {
      resetBall();
    }
  };

  useEffect(() => {
    const handle = setInterval(() => {
      setBallPosition((prevPosition) => ({
        x: prevPosition.x + ballSpeed.x,
        y: prevPosition.y + ballSpeed.y,
      }));
    }, 30);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(handle);
  }, [ballSpeed]);

  useEffect(() => {
    // Iniciar o intervalo para aumentar a velocidade a cada 10 segundos
    const speedInterval = setInterval(() => {
      setBallSpeed((prevSpeed) => ({
        x: prevSpeed.x > 0 ? prevSpeed.x + 1 : prevSpeed.x - 1,
        y: prevSpeed.y > 0 ? prevSpeed.y + 1 : prevSpeed.y - 1,
      }));
    }, 10000);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(speedInterval);
  }, []);

  useEffect(() => {
    checkCollisions();
  }, [ballPosition]);

  const resetBall = () => {
    setBallPosition({ x: 290, y: 190 });
    setBallSpeed({ x: 5, y: 5 });
  };

  return (
    <Container ref={containerRef}>
      <PaddleLeft ref={paddleLeftRef} style={{ top: `${paddleLeftPosition}px` }} />
      <PaddleRight ref={paddleRightRef} style={{ top: `${paddleRightPosition}px` }} />
      <Ball ref={ballRef} style={{ top: `${ballPosition.y}px`, left: `${ballPosition.x}px` }} />
      <Score>
        {scoreLeft} - {scoreRight}
      </Score>
    </Container>
  );
};

export default PongGame;