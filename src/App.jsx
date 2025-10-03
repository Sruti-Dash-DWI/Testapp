import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import AppRouter from "./Router/AppRouter.jsx";

function App() {
  return (
    <GoogleOAuthProvider clientId="804264640043-ml1n9lmpgepsjaefuah76c6784cjli3h.apps.googleusercontent.com">
      <AppRouter />
    </GoogleOAuthProvider>
  );
}

export default App;
