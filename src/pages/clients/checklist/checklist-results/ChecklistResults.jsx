import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import {
  GET_ALL_CHECKLIST_RESULTS,
  GET_CHECKLIST_RESULT_DETAILS_BY_CHEKLIST_ID,
} from "../../../../features/clients/services/api";
import Loading from "../../../../components/Loading";
import Error from "../../../../components/Error";
import styled from "styled-components";
import { BiSearch } from "react-icons/bi";
import { Calendar } from "primereact/calendar";
import ChecklistResultDetails from "./ChecklistResultDetails";

const ChecklistResults = () => {
  const defaultStartDate = new Date();
  defaultStartDate.setMonth(defaultStartDate.getMonth() - 1);

  const defaultEndDate = new Date();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [filters, setFilters] = useState({
    pageSize: 10,
    first: 0,
    draw: 0,
    order: "asc",
    orderColumn: "id",
    searchList: [],
  });

  const [searchCriteria, setSearchCriteria] = useState([
    { colName: "code" },
    { colName: "slS_CODE" },
    { colName: "slS_NAME" },
    { colName: "date" },
    { colName: "clienT_CODE" },
    { colName: "clienT_NAME" },
    { colName: "checK_LIST_DESC" },
    { colName: "checK_LIST_SPECODE" },
    { colName: "totaL_ANSWER_POINT" },
    { colName: "totaL_QUESTION_POINT" },
    { colName: "checK_LIST_PERCENTAGE" },
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

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await GET_ALL_CHECKLIST_RESULTS({
        ...filters,
        start: filters.first,
        pageSize: filters.pageSize,
        startDate: formatDate2(startDate),
        endDate: formatDate2(endDate),
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

  const renderHeader = (field, placeholder) => (
    <div>
      <div>{placeholder}</div>
      <InputContainer>
        {field === "date" ? (
          <Calendar
            value={filters[field]}
            onChange={(e) => handleInputChange(field, e.value)}
            dateFormat="dd-mm-yy"
            placeholder={placeholder}
            showIcon
            className="p-inputtext"
            style={{
              fontSize: "4px",
              padding: "0px",
              minWidth: "12rem",
              pointerEvents: "none",
            }}
          />
        ) : (
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
        )}
        {field !== "date" && (
          <SearchIcon onClick={handleSearchClick}>
            <BiSearch size={18} />
          </SearchIcon>
        )}
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

  return (
    <Wrapper>
      <Container>
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
              placeholder="Select begin date"
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
              placeholder="Select end date"
            />
          </DateInputWrapper>

          <FilterButton onClick={handleSearchClick}>Filter</FilterButton>
        </DateInputContainer>
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
            field="slS_CODE"
            header={renderHeader("slS_CODE", "Təmsilçi kod")}
            body={(rowData) => <Truncate>{rowData.slS_CODE}</Truncate>}
          />
          <Column
            field="slS_NAME"
            header={renderHeader("slS_NAME", "Təmsilçi ad")}
            body={(rowData) => <Truncate>{rowData.slS_NAME}</Truncate>}
          />
          <Column
            field="date"
            header={renderHeader("date", "Tarix")}
            body={(rowData) => <Truncate>{formatDate(rowData.date)}</Truncate>}
          />
          <Column
            field="clienT_CODE"
            header={renderHeader("clienT_CODE", "Müştəri kod")}
            body={(rowData) => <Truncate>{rowData.clienT_CODE}</Truncate>}
          />
          <Column
            field="clienT_NAME"
            header={renderHeader("clienT_NAME", "Müştəri ad")}
            body={(rowData) => (
              <TruncateExtra>{rowData.clienT_NAME}</TruncateExtra>
            )}
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
        </DataTable>
        <Paginator
          first={filters.first}
          rows={filters.pageSize}
          totalRecords={totalRecords}
          rowsPerPageOptions={[5, 10, 20]}
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

const TruncateExtra = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
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
  justify-content: space-between;
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

export default ChecklistResults;
