
import { Dialog } from 'primereact/dialog';
import { useDispatch, useSelector } from "react-redux";
import { hideModal } from "./modalSlice";

export default function Modal() {
    const {visible ,header ,content} = useSelector((state)=>state.modalSlice)
    const dispatch = useDispatch()

    return (
            <Dialog header={header} visible={visible} style={{ width: '40vw' }} onHide={() => dispatch(hideModal())}>
               {content}
            </Dialog>
    )
}
 