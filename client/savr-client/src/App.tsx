import { DndContext } from '@dnd-kit/core';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Chat from './components/ChatBarInput/Chat';
import Checkout from './components/Checkout/Checkout';
import RestuarantList from './components/HomeLayout/RestuarantList';
import SavrLandingPage from './components/HomeLayout/SavrLandingPage';
import SignIn from './components/LoginFunctionality/SignIn';
import SignUp from './components/LoginFunctionality/SignUp';
import MenuCardDisplay from './components/MenuDisplay/MenuCardDisplay';
import RestuarantEntry from './components/RestuarantEntry/RestuarantEntry';
import RestuarantMenuImageUpload from './components/RestuarantEntry/RestuarantMenuImageUpload';
import DroppableArea from './components/RestuarantLayout/DroppableRestuarant';
import RestaurantStoreLayout from './components/RestuarantStoreLayout/RestuarantStoreLayout';
import ViewRestaurantLayout from './components/RestuarantViewLayout/ViewRestaurantLayout';
function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/lander"
          element={<SavrLandingPage />}
        />
        <Route
          path="/restaurants"
          element={<RestuarantList />}
        />
        <Route
          path="/chat"
          element={<Chat />}
        />
        <Route
          path="owner/restaurant-entry"
          element={<RestuarantEntry />}
        />
        <Route
          path="owner/restaurant-entry/menu-image-upload"
          element={<RestuarantMenuImageUpload />}
        />
        {/* <Route path="/menu-display" element={<MenuDisplay />} /> */}
        <Route
          path="/menu-card-display"
          element={<MenuCardDisplay />}
        />
        <Route
          path="/checkout"
          element={<Checkout />}
        />
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
          element={<ViewRestaurantLayout />}
        />
        <Route
          path="/sign-in"
          element={<SignIn />}
        />
        <Route
          path="/sign-up"
          element={<SignUp />}
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
