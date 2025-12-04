import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
<<<<<<< HEAD
=======
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
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
<<<<<<< HEAD
=======
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            style={{ zIndex: 9999 }}
          />
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
        </div>
      </Router>
    </Provider>
  );
}

export default App;

