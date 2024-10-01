import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import {
  GET_ALL_CHECKLIST_RESULTS,
  GET_CHECKLIST_RESULT_DETAILS_BY_CHEKLIST_ID,
  EXPORT_CHECKLIST_RESULTS,
  EXPORT_CHECKLIST_RESULTS_WITH_INSIDE,
  UPDATE_CHECKLIST_RESULT_STATUS,
  GET_CHECKLIST_OPERATION_EDIT_HISTORY_BY_ID
} from "../../../../features/clients/services/api";
import Loading from "../../../../components/Loading";
import Error from "../../../../components/Error";
import styled from "styled-components";
import { BiSearch, BiPencil, BiTrash, BiHistory } from 'react-icons/bi';
import { Calendar } from "primereact/calendar";
import { TbTrashOff } from "react-icons/tb";
import ChecklistResultDetails from "./ChecklistResultDetails";
import ExportDialog from "./ExportDialog";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from './DeleteConfirmationModal'
import HistoryDialog from "./CheclistResultEditHistory";

const ChecklistResults = () => {
  const defaultStartDate = new Date();
  defaultStartDate.setMonth(defaultStartDate.getMonth() - 1);

  const defaultEndDate = new Date();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [selectedStatus, setSelectedStatus] = useState("true");
  const [filters, setFilters] = useState({
    pageSize: 10,
    first: 0,
    draw: 0,
    order: "asc",
    orderColumn: "id",
    searchList: [{ colName: "status", value: selectedStatus }],
  });
  const [exportDialogVisible, setExportDialogVisible] = useState(false);
  const [exportVariant, setExportVariant] = useState("");
  const [exportLoading, setExportLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [historyDialogVisible, setHistoryDialogVisible] = useState(false);
  const [historyData, setHistoryData] = useState(null);
  
  const [searchCriteria, setSearchCriteria] = useState([
    { colName: "code" },
    { colName: "slS_CODE" },
    { colName: "slS_NAME" },
    { colName: "slS_CODE_RESPONSIBLE" },
    { colName: "slS_NAME_RESPONSIBLE" },
    { colName: "manageR_SLS_CODE" },
    { colName: "manageR_SLS_NAME" },
    { colName: "date" },
    { colName: "clienT_CODE" },
    { colName: "checK_LIST_CODE" },
    { colName: "clienT_NAME" },
    { colName: "checK_LIST_DESC" },
    { colName: "checK_LIST_SPECODE" },
    { colName: "totaL_ANSWER_POINT" },
    { colName: "totaL_QUESTION_POINT" },
    { colName: "checK_LIST_PERCENTAGE" },
    { colName: "status" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailedData, setDetailedData] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const formatDate2 = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const adjustedPageSize =
        (exportVariant === "variant1" || exportVariant === "variant3") 
          ? totalRecords 
          : filters.pageSize;

      let exportResponse;

      const searchList = [
        { colName: "status", value: selectedStatus },
        ...searchCriteria.filter(
          (criteria) =>
            criteria.value !== "" &&
            criteria.value !== null &&
            criteria.value !== undefined
        ),
      ];

      if (exportVariant === "variant3" || exportVariant === "variant4") {
        exportResponse = await EXPORT_CHECKLIST_RESULTS_WITH_INSIDE({
          ...filters,
          start: filters.first,
          pageSize: adjustedPageSize,
          startDate: formatDate2(startDate),
          endDate: formatDate2(endDate),
          searchList: searchList,
        });
      } else {
        exportResponse = await EXPORT_CHECKLIST_RESULTS({
          ...filters,
          start: filters.first,
          pageSize: adjustedPageSize,
          startDate: formatDate2(startDate),
          endDate: formatDate2(endDate),
          searchList: searchList,
        });
      }

      const blob = new Blob([exportResponse.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "CheckListNeticeleri.xlsx";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting data", error);
    } finally {
      setExportLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const searchList = [
        { colName: "status", value: selectedStatus },
        ...searchCriteria.filter(
          (criteria) =>
            criteria.value !== "" &&
            criteria.value !== null &&
            criteria.value !== undefined
        ),
      ];
      const response = await GET_ALL_CHECKLIST_RESULTS({
        ...filters,
        start: filters.first,
        pageSize: filters.pageSize,
        startDate: formatDate2(startDate),
        endDate: formatDate2(endDate),
        searchList: searchList,
      });
      setData(response.data.data);
      setTotalRecords(response.data.totalRecords);
    } catch (error) {
      console.error("Error fetching data", error);
      setError("Error fetching data");
    }
    setLoading(false);
  };

  const handleSearchClick = () => {
    setFilters({
      ...filters,
      searchList: searchCriteria.filter(
        (criteria) =>
          criteria.value !== "" &&
          criteria.value !== null &&
          criteria.value !== undefined
      ),
    });
  };

  const handleInputChange = (colName, value) => {
    setSearchCriteria((prevCriteria) =>
      prevCriteria.map((criteria) =>
        criteria.colName === colName ? { ...criteria, value } : criteria
      )
    );
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setFilters((prevFilters) => {
      const updatedSearchList = prevFilters.searchList.filter(
        (criteria) => criteria.colName !== "status"
      );

      updatedSearchList.push({ colName: "status", value });

      return {
        ...prevFilters,
        searchList: updatedSearchList,
      };
    });
  };

  const onPageChange = (event) => {
    const { first, rows } = event;
    setFilters((prevFilters) => ({
      ...prevFilters,
      first: first,
      pageSize: rows,
    }));
  };

  const handleDateChange = (e, type) => {
    const date = e.value;
    if (type === "begin") {
      setStartDate(date);
    } else if (type === "end") {
      setEndDate(date);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchClick();
    }
  };

  const statusOptions = [
    { label: "Aktiv", value: "true" },
    { label: "Passiv", value: "false" },
  ];

  const renderHeader = (field, placeholder) => (
    <div>
      <div>{placeholder}</div>
      <InputContainer>
        <input
          type="text"
          value={
            searchCriteria.find((criteria) => criteria.colName === field)
              ?.value || ""
          }
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={placeholder}
          style={{
            padding: "8px",
            fontSize: "14px",
            boxSizing: "border-box",
            borderRadius: "4px",
            border: "1px solid #ccc",
            display: "flex",
            alignItems: "center",
            width: "150px",
          }}
          onKeyPress={handleKeyPress}
        />
        <SearchIcon onClick={handleSearchClick}>
          <BiSearch size={18} />
        </SearchIcon>
      </InputContainer>
    </div>
  );

  const handleRowDoubleClick = async (event) => {
    const rowData = event.data;
    setDetailsLoading(true);
    try {
      const response = await GET_CHECKLIST_RESULT_DETAILS_BY_CHEKLIST_ID(
        rowData.id
      );
      setDetailedData(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching detailed data", error);
    }
    setDetailsLoading(false);
  };
  const handleEditClick = (rowData) => {
    const { clienT_CODE, slS_CODE_RESPONSIBLE } = rowData; 
    
    if (clienT_CODE || slS_CODE_RESPONSIBLE) {
        navigate(`/clients/checklist/checklist-result-edit/${rowData.id}`, {
            state: { clienT_CODE, slS_CODE_RESPONSIBLE }
        });
    } else {
        console.error("Client Code or Sales Code is empty.");
    }
};

const handleHistoryClick = async (rowData) => {
  try {
    const response = await GET_CHECKLIST_OPERATION_EDIT_HISTORY_BY_ID(rowData.id);
    setHistoryData(response.data);
    setHistoryDialogVisible(true);
  } catch (error) {
    console.error("Error fetching history data", error);
  }
};


  const handleRemoveClick = (rowData) => {
    setItemToDelete(rowData);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async (item) => {
    const result = await UPDATE_CHECKLIST_RESULT_STATUS(item.id);

    if (result.statusCode == 200) {
      setShowDeleteModal(false);
      fetchData();
    } else {
      alert("Bilinməyən bir xəta baş verdi");
    }
  };
  const editButtonTemplate = (rowData) => (
    <ButtonContainer>
      <ColumnButton onClick={() => handleEditClick(rowData)}>
        <BiPencil size={24} />
      </ColumnButton>
      <ColumnButton onClick={() => handleHistoryClick(rowData)}>
        <BiHistory size={24} />
      </ColumnButton>
      <ColumnButton onClick={() => handleRemoveClick(rowData)}>
        {selectedStatus == "true" ? (
          <BiTrash size={24} />
        ) : (
          <TbTrashOff size={24} />
        )}
      </ColumnButton>
    </ButtonContainer>
  );

  return (
    <Wrapper>
      <Container>
        <StatusWrapper>
          <label style={{ color: "#495057", fontWeight: 600 }}>Status:</label>
          <Dropdown
            value={selectedStatus}
            options={statusOptions}
            onChange={(e) => handleStatusChange(e.value)}
            placeholder="Status"
          />
        </StatusWrapper>
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

          <FilterButton onClick={handleSearchClick}>Filter</FilterButton>
        </DateInputContainer>
        {/* <ExportButton onClick={() => setExportDialogVisible(true)} loading={exportLoading} disabled={exportLoading}>
        {exportLoading ? (
          <>
            <LoadingSpinner />
            <span style={{ marginLeft: '0.5em' }}>Yüklənir...</span>
          </>
        ) : (
          "Export to Excel"
        )}
      </ExportButton> */}
      </Container>

      <DataTableContainer>
        <DataTable
          value={data}
          paginator={false}
          rows={filters.pageSize}
          totalRecords={totalRecords}
          lazy
          loading={loading}
          onPage={onPageChange}
          first={filters.first}
          onRowDoubleClick={handleRowDoubleClick}
        >
          <Column
            field="code"
            header={renderHeader("code", "Kod")}
            body={(rowData) => <Truncate>{rowData.code}</Truncate>}
          />
          <Column
            field="slS_NAME"
            header={renderHeader("slS_NAME", "Təftiş ad")}
            body={(rowData) => <TruncateExt>{rowData.slS_NAME}</TruncateExt>}
          />
          <Column
            field="slS_NAME_RESPONSIBLE"
            header={renderHeader("slS_NAME_RESPONSIBLE	", "Təmsilçi ad")}
            body={(rowData) => (
              <TruncateExt>{rowData.slS_NAME_RESPONSIBLE}</TruncateExt>
            )}
          />
          <Column
            field="clienT_NAME"
            header={renderHeader("clienT_NAME", "Müştəri ad")}
            body={(rowData) => rowData.clienT_NAME}
          />
          <Column
            field="manageR_SLS_NAME"
            header={renderHeader("manageR_SLS_NAME", "Menecer ad")}
            body={(rowData) => (
              <TruncateExt>{rowData.manageR_SLS_NAME}</TruncateExt>
            )}
          />
          <Column
            field="slS_CODE"
            header={renderHeader("slS_CODE", "Təftiş kod")}
            body={(rowData) => <Truncate>{rowData.slS_CODE}</Truncate>}
          />
          <Column
            field="slS_CODE_RESPONSIBLE"
            header={renderHeader("slS_CODE_RESPONSIBLE", "Təmsilçi kod")}
            body={(rowData) => (
              <Truncate>{rowData.slS_CODE_RESPONSIBLE}</Truncate>
            )}
          />
          <Column
            field="manageR_SLS_CODE"
            header={renderHeader("manageR_SLS_CODE", "Menecer kod")}
            body={(rowData) => <Truncate>{rowData.manageR_SLS_CODE}</Truncate>}
          />
          <Column
            field="date"
            header="Tarix"
            headerStyle={{ paddingBottom: "3rem" }}
            body={(rowData) => <Truncate>{formatDate(rowData.date)}</Truncate>}
            style={{ minWidth: "140px" }}
          />
          <Column
            field="clienT_CODE"
            header={renderHeader("clienT_CODE", "Müştəri kod")}
            body={(rowData) => <Truncate>{rowData.clienT_CODE}</Truncate>}
          />
          <Column
            field="checK_LIST_CODE"
            header={renderHeader("checK_LIST_CODE", "Sorğu kodu")}
            body={(rowData) => <Truncate>{rowData.checK_LIST_CODE}</Truncate>}
          />
          <Column
            field="checK_LIST_DESC"
            header={renderHeader("checK_LIST_DESC", "Sorğu")}
            body={(rowData) => <Truncate>{rowData.checK_LIST_DESC}</Truncate>}
          />
          <Column
            field="checK_LIST_SPECODE"
            header={renderHeader("checK_LIST_SPECODE", "Sorğu özəl kod")}
            body={(rowData) => (
              <Truncate>{rowData.checK_LIST_SPECODE}</Truncate>
            )}
          />
          <Column
            field="totaL_ANSWER_POINT"
            header={renderHeader("totaL_ANSWER_POINT", "Təmsilçi balı")}
            body={(rowData) => (
              <Truncate>{rowData.totaL_ANSWER_POINT}</Truncate>
            )}
          />
          <Column
            field="totaL_QUESTION_POINT"
            header={renderHeader("totaL_QUESTION_POINT", "Maksimum bal")}
            body={(rowData) => (
              <Truncate>{rowData.totaL_QUESTION_POINT}</Truncate>
            )}
          />
          <Column
            field="checK_LIST_PERCENTAGE"
            header={renderHeader("checK_LIST_PERCENTAGE", "Sorğu nəticəsi")}
            body={(rowData) => (
              <Truncate>{rowData.checK_LIST_PERCENTAGE} %</Truncate>
            )}
          />
          <Column
            header={"#"}
            body={editButtonTemplate}
            style={{
              textAlign: "center",
              width: "5%",
              right: "0",
              position: "sticky",
              background: "white",
            }}
          />
        </DataTable>
        <Paginator
          first={filters.first}
          rows={filters.pageSize}
          totalRecords={totalRecords}
          rowsPerPageOptions={[5, 10, 50, 100]}
          onPageChange={onPageChange}
        />
      </DataTableContainer>
      {detailsLoading ? (
        <LoadingOverlay>
          <Loading />
        </LoadingOverlay>
      ) : (
        <ChecklistResultDetails
          isOpen={isModalOpen}
          data={detailedData}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <ExportDialog
        visible={exportDialogVisible}
        onHide={() => setExportDialogVisible(false)}
        onExport={handleExport}
        setExportVariant={setExportVariant}
      />
      <DeleteConfirmationModal
        visible={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        itemToDelete={itemToDelete}
      />
      <HistoryDialog
        visible={historyDialogVisible}
        onHide={() => setHistoryDialogVisible(false)}
        historyData={historyData}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const DataTableContainer = styled.div`
  overflow-y: auto;
  width: 100%;
  max-width: 82vw;
  font-size: 12px;
`;

const InputContainer = styled.div`
  margin-top: 5px;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 3px;
`;

const Truncate = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Container = styled.div`
  display: flex;
  // justify-content: space-between;
  gap: 50px;
  align-items: center;
  margin-bottom: 20px;
`;
const DateInputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  margin-bottom: 5px;
`;

const DateInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 150px;
`;
const StatusWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 150px;
`;

const DateInput = styled(Calendar)`
  margin-top: 5px;
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  background-color: #007ad9;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  align-self: flex-end;
`;

const TruncateExt = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 350px;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const ColumnButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

// const ExportButton = styled.button`
//   padding: 8px 16px;
//   background-color: #007ad9;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   font-size: 18px;
//   margin-left: auto;
// `;

const ExportButton = styled.button`
  background-color: ${props => (props.loading ? '#28a745' : '#007bff')};
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: ${props => (props.loading ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center; 
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  margin-left: auto;
  transition: background-color 0.3s;
  min-width: 150px; 

  &:disabled {
    opacity: 0.6; 
  }
`;

const LoadingSpinner = styled.div`
  border: 2px solid white;
  border-top: 2px solid transparent;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  margin-right: 0.5em; // Add margin to separate spinner from text
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;



export default ChecklistResults;
