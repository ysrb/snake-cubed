import React, { useState, useContext, useMemo, useEffect } from 'react';
import { Canvas, WebCanvasProps, useThree } from 'react-three-fiber';
import styled, { ThemeContext } from 'styled-components';

import Cube from './Cube';
import Rotation from './Rotation';
import Controller from './Controller';
import Snake from './Snake';
import Food from './Food';

import { buildCubeMap } from './map';
import GameStates from './GameStates';
import { DoubleSide } from 'three';

const Container = styled.div`
  display: inline-flex;
  height: 100vh;
  width: 100vw;
  background-image: ${({ theme }) => `radial-gradient(${theme.background.from} 80%, ${theme.background.to})`};
`;

type GameProps = {
  size: number;
  speed: number;
}

const Game = ({ size, speed }: GameProps) => {
  const cubeMap = useMemo(() => buildCubeMap(size), [size]);
  const [gameState, setGameState] = useState<GameStates>(GameStates.PLAYING);

  return (
    <Container>
      {gameState == GameStates.LOSE && (
        <YouLose>
          <h1>
            YOU
            <br />
            LOSE
          </h1>
        </YouLose>
      )}
      <CanvasWithProviders camera={{ far: 1000 }} shadowMap>
        <ambientLight intensity={1.5} />
        <spotLight
          intensity={0.5}
          position={[12, 50, 12]}
          angle={1}
          penumbra={1}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          castShadow
        />
        <Rotation distance={size * 1.2}>
          <Cube size={size} />
          {/* <axesHelper args={[SIZE * 2]}></axesHelper> */}
          <Controller
            map={cubeMap}
            speed={speed}
            gameState={gameState}
            setGameState={setGameState}
          >
            {state => {
              return (
                <>
                  <Food position={state.food.vector} />
                  <Snake body={state.snake}></Snake>
                </>
              );
            }}
          </Controller>
        </Rotation>
      </CanvasWithProviders>
      {/* <Buttons>
        <button onClick={left}>left</button>
        <button onClick={right}>right</button>
      </Buttons> */}
    </Container>
  );
};
export default Game;

// const Plane = ({ size }: { size: number }) => (
//   <mesh
//     rotation={[-Math.PI / 2, 0, 0]}
//     position={[0, -size * 1.5, 5]}
//     receiveShadow={true}
//   >
//     <planeBufferGeometry attach="geometry" args={[20, 20]} />
//     <meshStandardMaterial
//       color='pink'
//       attach="material"
//       side={DoubleSide}
//       roughness={0}
//     />
//   </mesh>
// );

const YouLose = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  font-size: 10vw;
  text-align: center;
  color: pink;
`;

const Buttons = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  width: 100vw;
  bottom: 2rem;
  button {
    width: 100%;
    height: 2rem;
  }
`;

const left = () => {
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
};

const right = () => {
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }));
};


// Work around for react-three-fiber canvas reconciler mangling providers
function CanvasWithProviders({ children, ...props }: WebCanvasProps) {
  const theme = useContext(ThemeContext);
  return (
    //@ts-ignore props mismatch
    <Canvas {...props}>
      <ThemeContext.Provider value={theme}>
        {children}
      </ThemeContext.Provider>
    </Canvas>
  )
}