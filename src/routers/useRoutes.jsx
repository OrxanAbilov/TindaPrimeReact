import Income from '../pages/esd/Income'
import DocumentType from '../pages/admin/esd/DocumentType'
import History from '../pages/esd/History'
import NewDoc from '../pages/esd/NewDoc'
import PreviewDoc from '../pages/esd/PreviewDoc'
import OutGoing from '../pages/esd/OutGoing'
import EditDoc from '../pages/esd/EditDoc'
import Login from '../features/login/components/Login'
import Dashboard from '../pages/dashboard/Dashboard'

export default function useRoutes() {


const routes =[
    {path:"income", exact:true, element: <Income />},
    {path:"doc/new",exact:true,element: <NewDoc />},
    {path:"doc/:id",exact:true,element: <PreviewDoc />},
    {path:"doc/edit/:id",exact:true,element: <EditDoc />},
    {path:"outgoing",element: <OutGoing />},
    {path:"history",element: <History />},
    {path:"admin/esd/doctype",element: <DocumentType />},
    {path:"dashboard",element: <Dashboard />},
    {path:"login",element: <Login />},

]




  return routes
}