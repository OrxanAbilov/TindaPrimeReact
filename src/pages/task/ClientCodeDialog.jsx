import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { GET_ALL_CLIENTS } from "../../features/task/services/api";
import styled from "styled-components";
import { BiSearch } from "react-icons/bi";

const ClientCodeDialog = ({ visible, onHide, onAddCodes }) => {
  const [selectedCodes, setSelectedCodes] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filters, setFilters] = useState({
    pageSize: 10,
    first: 0,
    draw: 0,
    order: "asc",
    orderColumn: "cari_kod",
    searchList: [],
  });

  const [searchCriteria, setSearchCriteria] = useState([
    { colName: "cari_kod" },
    { colName: "cari_isim" },
  ]);

  useEffect(() => {
    if (visible) {
      fetchClients();
    }
  }, [visible, filters]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await GET_ALL_CLIENTS({
        ...filters,
        start: filters.first,
      });
      setClients(response.data.data);
      setTotalRecords(response.data.totalRecords);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCode = (code) => {
    setSelectedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleAddCodes = () => {
    onAddCodes(selectedCodes);
    setSelectedCodes([]);
    onHide();
    console.log(selectedCodes);
  };

  const isSelected = (code) => selectedCodes.includes(code);

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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  const onPageChange = (event) => {
    const { first, rows } = event;
    setFilters((prevFilters) => ({
      ...prevFilters,
      first,
      pageSize: rows,
    }));
  };

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
          }}
          onKeyPress={handleKeyPress}
        />
        <SearchIcon onClick={handleSearchClick}>
          <BiSearch size={18} />
        </SearchIcon>
      </InputContainer>
    </div>
  );

  return (
    <Dialog
      header="Müştərilər"
      visible={visible}
      onHide={onHide}
      style={{ width: "80vw" }}
    >
      <DataTable
        value={clients}
        rows={filters.pageSize}
        totalRecords={totalRecords}
        loading={loading}
      >
        <Column
          field="cari_kod"
          header={renderHeader("cari_kod", "Kod")}
          body={(rowData) => <Truncate>{rowData.cari_kod}</Truncate>}
          frozen
        />
        <Column
          field="cari_isim"
          header={renderHeader("cari_isim", "Adı")}
          body={(rowData) => <Truncate>{rowData.cari_isim}</Truncate>}
          frozen
        />
        <Column
          header="#"
          body={(rowData) => (
            <input
              type="checkbox"
              checked={isSelected(rowData.cari_kod)}
              onChange={() => toggleCode(rowData.cari_kod)}
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

      <DialogFooter>
        <Button label="Əlavə et" onClick={handleAddCodes} />
      </DialogFooter>
    </Dialog>
  );
};

const SearchIcon = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const Truncate = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 450px;
`;

const InputContainer = styled.div`
  margin-top: 5px;
  display: flex;
  align-items: center;
`;
const DialogFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

export default ClientCodeDialog;
