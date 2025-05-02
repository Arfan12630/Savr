import React from 'react'
import { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import NavBar from './components/RestuarantLayout/Navbar/NavBar';
import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom';
// import logo from './logo.svg';
import DroppableArea from './components/DroppableRestuarant';
import './App.css';

function App() {
  return (
    <BrowserRouter>
    <NavBar />
    </BrowserRouter>
    
  );
}

export default App;
