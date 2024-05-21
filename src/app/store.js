import { configureStore } from '@reduxjs/toolkit'
import loginSlice from '../features/login/loginSlice'
import incomeSlice from '../features/esd/income/incomeSlice'
import outGoingSlice from '../features/esd/outgoing/outGoingSlice'
import historySlice from '../features/esd/history/historySlice'
import documentTypeSlice from '../features/admin/esd/documentType/documentTypeSlice'
import modalSlice from '../components/modal/modalSlice'
import procurementSlice from '../features/procurement/procurementSlice'
import procurementDetailSlice from '../features/procurement/procurementDetails/procurementDetailSlice'
import procurementSuggestionSlice from '../features/procurement/procurementDetails/procurementSuggestionSlice'
export default configureStore({
  reducer: {loginSlice,incomeSlice,outGoingSlice,historySlice,documentTypeSlice,modalSlice,procurementSlice,procurementDetailSlice,procurementSuggestionSlice},
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(
    {      serializableCheck: false,
}
  ),

})