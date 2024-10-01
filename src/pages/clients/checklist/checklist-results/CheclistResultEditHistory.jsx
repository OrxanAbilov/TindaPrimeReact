import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const HistoryDialog = ({ visible, onHide, historyData }) => {

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
      };
      
  return (
    <Dialog
      header="Tarixçə"
      visible={visible}
      style={{ width: "50vw" }}
      onHide={onHide}
    >
      <DataTable value={historyData}>
        <Column field="namE_UPDATE_BY" header="Dəyişdirən istifadəçi" />
        <Column
          field="updatE_DATE"
          header="Dəyişdirmə tarixi"
          body={(rowData) => formatDate(rowData.updatE_DATE)}
        />
      </DataTable>
    </Dialog>
  );
};

export default HistoryDialog;
