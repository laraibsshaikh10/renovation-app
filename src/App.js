import React from "react";
import { useRoutes } from "react-router-dom"; // useRoutes for defining routes

import Login from "./components/login";
import Register from "./components/signup";
import Header from "./components/header";
import Home from "./components/home";

import { AuthProvider } from "./contexts/authContext";

function App() {
  const routesArray = [
    { path: "*", element: <Login /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/home", element: <Home /> },
  ];

  // useRoutes inside Router context provided by index.js
  const routesElement = useRoutes(routesArray);

  return (
    <AuthProvider>
      <Header />
      <div className="w-full h-screen flex flex-col">
        {routesElement}
      </div>
    </AuthProvider>
  );
}

export default App;


