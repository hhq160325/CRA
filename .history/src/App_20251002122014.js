import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import store from "./app/store";
import AppRouter from "./routes/AppRouter";
import { NavBar, Footer } from "./shared";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App min-h-screen flex flex-col">
          <NavBar />
          <main className="flex-1">
            <AppRouter />
          </main>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;

