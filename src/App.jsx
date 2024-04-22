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
import PreviewWareHouseDoc from "./pages/esd/PreviewWareHouseDoc";
import NewDoc from "./pages/esd/NewDoc";
import AdminEsd from "./pages/admin/esd/Root";
import Admin from "./pages/admin/Root";
import Esd from "./pages/esd/Root";
import Dashboard from "./pages/dashboard/Dashboard";
import { useSelector } from "react-redux";

export default function App() {
  const { userData } = useSelector((state) => state.loginSlice);
  const userType = userData ? userData.userType : null;
  return (
    <ToastProvider>
      <Modal />
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route path="/" element={<Main />}>
          <Route path="*" element={"Not Found"} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/esd" element={<Esd />}>
            <Route path="income" index element={<Income />} />
            <Route path="outgoing" element={<OutGoing />} />
            <Route path="history" element={<History />} />
            <Route path="doc/cashorder/:id" element={<PreviewDoc />} />
            <Route path="doc/warehousedemand/:id" element={<PreviewWareHouseDoc />} />
            <Route path="doc/new" element={<NewDoc />} />
          </Route>
          {userType === 1 && (
            <Route path="/admin" element={<Admin />}>
              <Route path="esd" element={<AdminEsd />}>
                <Route path="doctype" element={<DocumentType />} />
                <Route path="doctype/edit/:id" element={<EditDoc />} />
              </Route>
            </Route>
          )}
        </Route>
      </Routes>
    </ToastProvider>
  );
}
