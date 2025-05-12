import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DndContext } from '@dnd-kit/core';
import DroppableArea from './components/RestuarantLayout/DroppableRestuarant';
import './App.css';
import TempHomeFile from './components/HomeLayout/TempHomeFile';
import ViewRestaurantLayout from './components/RestuarantViewLayout/ViewRestaurantLayout';
import RestuarantList from './components/HomeLayout/RestuarantList';
import Chat from './components/ChatBarInput/Chat';
import RestaurantStoreLayout from './components/RestuarantStoreLayout/RestuarantStoreLayout';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TempHomeFile />} />
        <Route path="/restaurants" element={<RestuarantList />} />
        <Route path="/chat" element={<Chat />} />
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
        <Route
          path="/restaurant-display"
          element={<RestaurantStoreLayout />}
        />
      </Routes>
    </Router>
  );
}

export default App;
