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
    order: '',
    orderColumn: '',
    searchList: [
      { colName: "cari_kod", value: "" },
      { colName: "cari_isim", value: "" }
    ]
  });

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const response = await GET_ALL_CLIENTS({
          ...filters,
          start: filters.first,
        });
        setClients(response.data.data); // Adjust based on your response structure
        setTotalRecords(response.data.totalRecords); // Ensure this returns total records
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      fetchClients();
    }
  }, [visible, filters]);

  const toggleCode = (code) => {
    setSelectedCodes((prev) =>
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code]
    );
  };

  const handleAddCodes = () => {
    onAddCodes(selectedCodes);
    setSelectedCodes([]);
    onHide();
  };

  const isSelected = (code) => selectedCodes.includes(code);

  const handleSearch = (e, colName) => {
    const newValue = e.target.value;
    setFilters((prevFilters) => {
      const updatedSearchList = prevFilters.searchList.map((search) =>
        search.colName === colName ? { ...search, value: newValue } : search
      );
      return { ...prevFilters, searchList: updatedSearchList };
    });
  };

  const onPageChange = (event) => {
    const { first, rows } = event;
    setFilters((prevFilters) => ({
      ...prevFilters,
      first,
      pageSize: rows,
    }));
  };

  return (
    <Dialog
      header="Müştərilər"
      visible={visible}
      onHide={onHide}
      style={{ width: "80vw" }}
    >
      <SearchContainer>
        <SearchInputContainer>
          <input
            type="text"
            placeholder="Axtar Kodu"
            value={filters.searchList.find(search => search.colName === 'cari_kod').value}
            onChange={(e) => handleSearch(e, 'cari_kod')}
            style={inputStyle}
          />
          <SearchIcon>
            <BiSearch size={18} />
          </SearchIcon>
        </SearchInputContainer>
        <SearchInputContainer>
          <input
            type="text"
            placeholder="Axtar Adı"
            value={filters.searchList.find(search => search.colName === 'cari_isim').value}
            onChange={(e) => handleSearch(e, 'cari_isim')}
            style={inputStyle}
          />
          <SearchIcon>
            <BiSearch size={18} />
          </SearchIcon>
        </SearchInputContainer>
      </SearchContainer>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <DataTable
            value={clients}
            rows={filters.pageSize}
            totalRecords={totalRecords}
            className="p-datatable-gridlines"
          >
            <Column
              body={(rowData) => (
                <input
                  type="checkbox"
                  checked={isSelected(rowData.cari_kod)}
                  onChange={() => toggleCode(rowData.cari_kod)}
                />
              )}
              header="Select"
              style={{ width: "50px" }}
            />
            <Column
              field="cari_kod"
              header="Client Code"
              headerStyle={{ textAlign: 'center' }}
              bodyStyle={{ textAlign: 'center' }}
            />
            <Column
              field="cari_isim"
              header="Client Name"
              headerStyle={{ textAlign: 'center' }}
              bodyStyle={{ textAlign: 'center' }}
            />
          </DataTable>
          <Paginator
            first={filters.first}
            rows={filters.pageSize}
            totalRecords={totalRecords}
            rowsPerPageOptions={[5, 10, 20]}
            onPageChange={onPageChange}
          />
        </>
      )}
      <Button label="Əlavə et" onClick={handleAddCodes} />
    </Dialog>
  );
};

const SearchContainer = styled.div`
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
`;

const SearchInputContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  margin-right: 10px;

  &:last-child {
    margin-right: 0;
  }
`;

const SearchIcon = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 3px;
  margin-left: 8px;
`;

const inputStyle = {
  padding: "8px",
  fontSize: "14px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  width: "100%",
};

export default ClientCodeDialog;
