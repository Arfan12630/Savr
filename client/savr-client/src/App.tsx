import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DndContext } from '@dnd-kit/core';
import NavBar from './components/RestuarantLayout/Navbar/NavBar';
// import logo from './logo.svg';
import DroppableArea from './components/RestuarantLayout/DroppableRestuarant';
import './App.css';
import RestuarantLayout from './components/RestuarantLayout/ChairLayout';
import TempHomeFile from './components/HomeLayout/TempHomeFile';
import ViewRestaurantLayout from './components/RestuarantViewLayout/ViewRestaurantLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TempHomeFile />} />
        <Route
          path="/edit"
          element={
            <DndContext>
              <DroppableArea />
            </DndContext>
          }
        />
        <Route
          path="/view"
          element={
              <ViewRestaurantLayout />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
