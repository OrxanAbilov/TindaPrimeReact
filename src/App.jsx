import "./App.css";
import Login from "./features/login/components/Login";
import Main from "./layout/Main";
import { Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import Modal from "./components/modal/Modal";
import Income from "./pages/esd/Income";
import OutGoing from "./pages/esd/OutGoing";
import History from "./pages/esd/History";
import DocumentType from "./pages/admin/esd/DocumentType";
import EditDoc from "./pages/esd/EditDoc";
import PreviewDoc from "./pages/esd/PreviewDoc";
import NewDoc from "./pages/esd/NewDoc";
import AdminEsd from "./pages/admin/esd/Root";
import Admin from "./pages/admin/Root";
import Esd from "./pages/esd/Root";
export default function App() {

  return (
    <ToastProvider>
      <Modal />
      <Routes>

        <Route exact path="/login" element={<Login />} />
        <Route path="/" element={<Main />}>
          <Route path="*" element={"Not Found"} />
          <Route path="/dashboard" element={"DashBoard"} />
          <Route path="/esd" element={<Esd />}>
            <Route path="income" index element={<Income />} />
            <Route path="outgoing" element={<OutGoing />} />
            <Route path="history" element={<History />} />
            <Route path="doc/:id" element={<PreviewDoc />} />
            <Route path="doc/new" element={<NewDoc />} />
          </Route>
          <Route path="/admin" element={<Admin />}>
            <Route path="esd" element={<AdminEsd />}>
              <Route path="doctype" element={<DocumentType />} />
              <Route path="doctype/edit/:id" element={<EditDoc />} />

            </Route>
          </Route>
        </Route>
        {/* <Route
          path="/*"
          element={
            <PrivateRoute>
              <Main />
            </PrivateRoute>
          }
        /> */}
      </Routes>
    </ToastProvider>
  );
}
