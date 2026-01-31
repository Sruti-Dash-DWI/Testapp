import React from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from "./contexts/ThemeContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

import AppRouter from "./Router/AppRouter.jsx";

function App() {
  return (
    <GoogleOAuthProvider clientId="804264640043-ml1n9lmpgepsjaefuah76c6784cjli3h.apps.googleusercontent.com">
      <ThemeProvider>
        <AppRouter />
      </ThemeProvider>
      <ToastContainer position="top-center" autoClose={2000} theme="colored" />
    </GoogleOAuthProvider>
  );
}

export default App;