import React from 'react'
import { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
// import logo from './logo.svg';
import DroppableArea from './components/DroppableRestuarant';
import './App.css';

function App() {
  return (
    <DndContext>
      <div className="App">
        <DroppableArea />
      </div>
    </DndContext>
  );
}

export default App;
