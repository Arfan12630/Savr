import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DndContext } from '@dnd-kit/core';
import DroppableArea from './components/RestuarantLayout/DroppableRestuarant';
import './App.css';
import SavrLandingPage from './components/HomeLayout/SavrLandingPage';
import ViewRestaurantLayout from './components/RestuarantViewLayout/ViewRestaurantLayout';
import RestuarantList from './components/HomeLayout/RestuarantList';
import Chat from './components/ChatBarInput/Chat';
import RestaurantStoreLayout from './components/RestuarantStoreLayout/RestuarantStoreLayout';
import RestuarantEntry from './components/RestuarantEntry/RestuarantEntry';
import RestuarantMenuImageUpload from './components/RestuarantEntry/RestuarantMenuImageUpload';
import MenuDisplay from './components/MenuDisplay/MenuDisplay';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/lander" element={<SavrLandingPage />} />
        <Route path="/restaurants" element={<RestuarantList />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="owner/restaurant-entry" element={<RestuarantEntry />} />
        <Route path="owner/restaurant-entry/menu-image-upload" element={<RestuarantMenuImageUpload />} />
        <Route path="/menu-display" element={<MenuDisplay />} />
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
