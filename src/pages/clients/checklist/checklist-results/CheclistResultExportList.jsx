import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { 
  GET_CHECKLIST_RESULT_EXCEL_FILES, 
  UPDATE_CHECKLIST_RESULT_DOWNLOAD_STATUS
} from "../../../../features/clients/services/api";
import { Calendar } from 'primereact/calendar';
import { Paginator } from 'primereact/paginator';
import styled from "styled-components";
import { BiDownload } from 'react-icons/bi';

const ExportListDialog = ({ visible, onClose }) => {
  const defaultStartDate = new Date();
  const defaultEndDate = new Date();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filters, setFilters] = useState({
    first: 0,
    pageSize: 5,
    order: "asc",
    orderColumn: "id",
    begiN_DATE: defaultStartDate,
    enD_DATE: defaultEndDate,
    searchList: [],
  });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };


  const formatDate2 = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (visible) {
      setFilters((prev) => ({
        ...prev,
        begiN_DATE: formatDate2(startDate),
        enD_DATE: formatDate2(endDate),
      }));
      fetchFiles();
    }
  }, [visible]);

  useEffect(() => {
    if (filters.begiN_DATE && filters.enD_DATE) {
      fetchFiles();
    }
  }, [filters]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await GET_CHECKLIST_RESULT_EXCEL_FILES({
        ...filters,
        start: filters.first,
        pageSize: filters.pageSize,
      });
      setFiles(response.data.data);
      setTotalRecords(response.data.totalRecords);
    } catch (error) {
      console.error("Error fetching export files:", error);
    }
    setLoading(false);
  };

  const handleDateChange = (e, dateType) => {
    if (e.value) {
      const date = new Date(e.value);
      date.setHours(0, 0, 0, 0); 
  
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      
      if (dateType === "begin") {
        setStartDate(e.value);
        setFilters((prev) => ({ ...prev, begiN_DATE: formattedDate }));
      } else if (dateType === "end") {
        setEndDate(e.value);
        setFilters((prev) => ({ ...prev, enD_DATE: formattedDate }));
      }
    }
  };
        
  const handleDownload = async (filePath, id) => {
    try {
      window.open(filePath);
  
      const response = await UPDATE_CHECKLIST_RESULT_DOWNLOAD_STATUS(id);
      console.log("Download status updated:", response);
      fetchFiles();
    } catch (error) {
      console.error("Error downloading file and updating status:", error);
    }
  };
  

  const onPageChange = (event) => {
    setFilters((prev) => ({
      ...prev,
      first: event.first,
      pageSize: event.rows,
    }));
  };

  return (
    <Dialog
      visible={visible}
      header="Excell faylları"
      onHide={onClose}
      modal
      style={{ width: '50vw' }}
    >
      <DateInputContainer>
          <DateInputWrapper>
            <label style={{ color: "#495057", fontWeight: 600 }}>
              Başlanğıc tarix:
            </label>
            <DateInput
              value={startDate}
              onChange={(e) => handleDateChange(e, "begin")}
              showIcon
              dateFormat="dd-mm-yy"
              placeholder="Başlanğıc tarixi seçin"
            />
          </DateInputWrapper>

          <DateInputWrapper>
            <label style={{ color: "#495057", fontWeight: 600 }}>
              Son tarix:
            </label>
            <DateInput
              value={endDate}
              onChange={(e) => handleDateChange(e, "end")}
              showIcon
              dateFormat="dd-mm-yy"
              placeholder="Son tarixi seçin"
            />
          </DateInputWrapper>
        </DateInputContainer>

      <DataTable value={files} loading={loading} paginator={false}>
        <Column field="filename" header="File adı" />
        <Column
          field="createDate"
          header="Yaranma tarixi"
          body={(rowData) => formatDate(rowData.createDate)}
        />
        <Column
          header="#"
          body={(rowData) => (
            <BiDownload
              style={{ 
                cursor: 'pointer', 
                color: rowData.downloaD_STATUS ? '#8c8c8c' : '#0d89ec'
              }}
              size={32}
              onClick={() => handleDownload(rowData.filepath, rowData.id)}
              />
          )}
        />
      </DataTable>
      <Paginator
        first={filters.first}
        rows={filters.pageSize}
        totalRecords={totalRecords}
        rowsPerPageOptions={[5, 10, 20]}
        onPageChange={onPageChange}
      />
    </Dialog>
  );
};

const DateInputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  margin-bottom: 15px;
`;

const DateInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px;
`;

const DateInput = styled(Calendar)`
  margin-top: 5px;
`;



export default ExportListDialog;
