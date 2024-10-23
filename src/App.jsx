import "./App.css";
import Login from "./features/login/components/Login";
import Main from "./layout/Main";
import { Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import Modal from "./components/modal/Modal";
import Income from "./pages/esd/Income";
import ProcurementDocs from "./pages/procurement/Procurement";
import OutGoing from "./pages/esd/OutGoing";
import History from "./pages/esd/History";
import DocumentType from "./pages/admin/esd/DocumentType";
import EditDoc from "./pages/esd/EditDoc";
import PreviewDoc from "./pages/esd/PreviewDoc";
import PreviewWareHouseDoc from "./pages/esd/PreviewWareHouseDoc";
import PreviewProcurementOrderDoc from "./pages/esd/PreviewProcurementOrderDoc";
import NewDoc from "./pages/esd/NewDoc";
import AdminEsd from "./pages/admin/esd/Root";
import Admin from "./pages/admin/Root";
import Esd from "./pages/esd/Root";
import Procurement from "./pages/procurement/Root";
import Dashboard from "./pages/dashboard/Dashboard";
import { useSelector } from "react-redux";
import ProcurementDetail from "./pages/procurement/ProcurementDetail";
import MesMer from "./pages/admin/esd/MesMer";
import EditMesMer from "./pages/admin/esd/EditMesMer";
import QuestionGroups from "./pages/clients/checklist/question-group/QuestionGroups";
import Reasons from "./pages/clients/checklist/reasons/Reasons";
import Questions from "./pages/clients/checklist/questions/Questions";
import Checklists from "./pages/clients/checklist/checklists/Checklists";
import ChecklistResults from "./pages/clients/checklist/checklist-results/ChecklistResults";
import SpecialSettingsOperations from "./pages/clients/special-settings/special-settings-operations/SpecialSettingsOperations";
import SpecialSettings from "./pages/clients/special-settings/special-settings/SpecialSettings";
import NotificationOperations from "./pages/notification/notification-operations/NotificationOperations";
import NotificationHistory from "./pages/notification/notification-senders/NotificationHistory";
import Clients from "./pages/clients/Root";
import Notification from "./pages/notification/Root";
import ActiveVisit from "./pages/visit/visit-active/ActiveVisit";
import Jobs from "./pages/mobile-terminal/jobs/Jobs";
import JobOrder from "./pages/mobile-terminal/job-order/JobOrder";
import MobileTerminal from "./pages/mobile-terminal/Root";
import Visit from "./pages/visit/visit-active/Root";
import Delivery from "./pages/delivery/Root";
import DeliveryDocuments from "./pages/delivery/DeliveryDocuments";
import OrderItems from "./pages/delivery/OrderItems";
import useInactivityTimer from "./useInactivityTimer";
import VisitDurations from "./pages/clients/visit-duration/VisitDurations";
import VisitDurationEdit from "./pages/clients/visit-duration/VisitDurationEdit";
import ChecklistResultEdit from "./pages/clients/checklist/checklist-results/CheckListResultEdit";
import ImageGallery from "./pages/image-gallery/ImageGallery";
import Image from "./pages/image-gallery/Root";
import TaskEdit from "./pages/task/TaskEdit";
import WorkOffices from "./pages/mobile-terminal/work-offices/WorkOffices";

export default function App() {
  useInactivityTimer();

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
            <Route
              path="doc/procurementdemand/:id"
              element={<PreviewWareHouseDoc />}
            />
            <Route
              path="doc/procurementorder/:id"
              element={<PreviewProcurementOrderDoc />}
            />
            <Route path="doc/new" element={<NewDoc />} />
          </Route>
          <Route path="/procurement" element={<Procurement />}>
            <Route path="docs" index element={<ProcurementDocs />} />
            <Route path="docs/detail/:id" element={<ProcurementDetail />} />
          </Route>
          <Route path="/clients" element={<Clients />}>
            <Route path="checklists" element={<Checklists />} />
            <Route
              path="checklist/question-groups"
              element={<QuestionGroups />}
            />
            <Route path="checklist/reasons" element={<Reasons />} />
            <Route path="checklist/questions" element={<Questions />} />
            <Route
              path="checklist/checklist-results"
              element={<ChecklistResults />}
            />
            <Route
              path="special-settings/special-settings-operations"
              element={<SpecialSettingsOperations />}
            />
            <Route
              path="special-settings/block"
              element={<SpecialSettings />}
            />
            <Route path="visit-durations" element={<VisitDurations />} />
            <Route path="visit-duration-edit" element={<VisitDurationEdit />} />
            <Route
              path="visit-duration-edit/:id"
              element={<VisitDurationEdit />}
            />
            <Route
              path="checklist/checklist-result-edit/:id"
              element={<ChecklistResultEdit />}
            />
          </Route>

          <Route path="/notification" element={<Notification />}>
            <Route path="operations" element={<NotificationOperations />} />
            <Route path="history" element={<NotificationHistory />} />
          </Route>

          <Route path="/mobile-terminal" element={<MobileTerminal />}>
            <Route path="jobs" element={<Jobs />} />
            <Route path="job-order" element={<JobOrder />} />
            <Route path="work-offices" element={ <WorkOffices/>} />
          </Route>

          <Route path="/visit" element={<Visit />}>
            <Route path="active-visit" element={<ActiveVisit />} />
          </Route>
          <Route path="/delivery" element={<Delivery />}>
            <Route path="documents" element={<DeliveryDocuments />} />
            <Route path="order-items" element={<OrderItems />} />
          </Route>

          <Route path="/image-gallery" element={<Image />}>
            <Route path="index" element={<ImageGallery />} />
          </Route>

          <Route path="/task" element={<Image />}>
            <Route path="task-edit" element={<TaskEdit />} />
          </Route>

          {userType === 1 && (
            <Route path="/admin" element={<Admin />}>
              <Route path="esd" element={<AdminEsd />}>
                <Route path="doctype" element={<DocumentType />} />
                <Route path="doctype/edit/:id" element={<EditDoc />} />
                <Route path="mesmer" element={<MesMer />} />
                <Route path="mesmer/edit/:id" element={<EditMesMer />} />
                <Route path="mesmer/add/" element={<EditMesMer />} />
              </Route>
            </Route>
          )}
        </Route>
      </Routes>
    </ToastProvider>
  );
}
