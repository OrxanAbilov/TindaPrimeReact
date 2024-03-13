import "./App.css";
import Login from "./features/login/components/Login";
import Main from "./layout/Main";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./routers/PrivateRoute";
import { ToastProvider } from "./context/ToastContext";
import Modal from "./components/modal/Modal";
export default function App() {

  return (
    <ToastProvider>
      <Modal />
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <Main />
            </PrivateRoute>
          }
        />
      </Routes>
    </ToastProvider>
  );
}
