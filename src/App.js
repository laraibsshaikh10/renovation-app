import React from "react";
import { useRoutes } from "react-router-dom"; // useRoutes for defining routes

import Login from "./components/login";
import Register from "./components/signup";
import Header from "./components/header";
import Home from "./components/home";


import { AuthProvider } from "./contexts/authContext";

function App() {
  const routesArray = [
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/home", element: <Home /> },
    { path: "*", element: <Login /> }

  ];

  // useRoutes inside Router context provided by index.js
  const routesElement = useRoutes(routesArray);

  return (
    <AuthProvider>
      <Header />
      <div className="container-fluid d-flex flex-column vh-100">
        {routesElement}
      </div>
    </AuthProvider>
  );
}

export default App;


