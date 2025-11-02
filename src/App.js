import React from "react";
import { NavigationProvider } from "./context/NavigationContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <NavigationProvider>
      <AppRoutes />
    </NavigationProvider>
  );
}

export default App;
