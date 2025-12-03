import "bootstrap/dist/css/bootstrap.min.css";

import './App.css';

import Navbar from "./Components/Navbar";
import Catalog from "./Components/Catalog";
import Compare from "./Components/Compare";
import Preferences from "./Components/Preferences";
import Favorites from "./Components/Favorites";
import Login from "./Components/Login";

import { useState, useEffect } from "react";
import { getMe } from "./api";

function App() {
  const [currentView, setCurrentView] = useState("catalog");
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    getMe().then(data => {
      if (data && data.user) {
        setCurrentUser(data.user);
      }
    }).catch(() => {
      setCurrentUser(null);
    });
  }, []);

  function handleLoginSuccess(user) {
    setCurrentUser(user);
    setShowLoginModal(false);
  }

  function handleLogout() {
    localStorage.removeItem("sc_token");
    setCurrentUser(null);
    setCurrentView("catalog");
  }

  function handleRequireAuth() {
    setShowLoginModal(true);
  }

  return (
    <div className="app-container">
      <Navbar
        name="SmartChoice"
        onNavClick={setCurrentView}
        currentUser={currentUser}
        onLoginClick={() => setShowLoginModal(true)}
        onLogoutClick={handleLogout}
      />

      {currentView === "catalog" && <Catalog onRequireAuth={handleRequireAuth} />}
      {currentView === "compare" && <Compare />}
      {currentView === "preferences" && <Preferences onRequireAuth={handleRequireAuth} />}
      {currentView === "favorites" && <Favorites onRequireAuth={handleRequireAuth} />}

      {showLoginModal && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </div>
  );
}

export default App;
