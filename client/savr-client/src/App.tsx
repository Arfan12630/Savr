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
import MenuCardDisplay from './components/MenuDisplay/MenuCardDisplay';
import PolygonTest from './components/RestuarantLayout/PolygonTest';
import SignIn from './components/LoginFunctionality/SignIn';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/lander" element={<SavrLandingPage />} />
        <Route path="/restaurants" element={<RestuarantList />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="owner/restaurant-entry" element={<RestuarantEntry />} />
        <Route path="owner/restaurant-entry/menu-image-upload" element={<RestuarantMenuImageUpload />} />
        {/* <Route path="/menu-display" element={<MenuDisplay />} /> */}
        <Route path="/menu-card-display" element={<MenuCardDisplay />} />
<Route path="/polygon-test" element={<PolygonTest label="Kitchen" top={100} left={100} width={300} height={200}  />} />
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
          path="/sign-in"
          element={<SignIn />}
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
