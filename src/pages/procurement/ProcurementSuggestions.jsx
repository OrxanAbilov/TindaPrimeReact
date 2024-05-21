import { useParams } from "react-router-dom";
import { Button } from "primereact/button";
import styled from "styled-components";
import { Fragment, useEffect, useRef, useState } from "react";
import { GET_ALL_SUGESTION_BY_PROCUREMENT_ID,DELETE_PROCUREMENT_SUGGESTION } from "../../features/procurement/services/api";
import Loading from "../../components/Loading";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primeicons/primeicons.css';
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { Accordion, AccordionTab } from "primereact/accordion";
import React from "react";



export default function ProcurementSuggestions({ procurementId }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const toast = useRef(null);
    //const { id } = useParams();
    const [data, setData] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await GET_ALL_SUGESTION_BY_PROCUREMENT_ID(procurementId);
            setData(res.data);
            setError(false);
        } catch (error) {
            console.log(error);
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        let mounted = true;
        if (mounted) {
            fetchData();
        }

        return () => {
            mounted = false;
            setRefresh(false);
        };
    }, [refresh]);


    const handleDelete = async (id) => {
        try {
            const responseData = await DELETE_PROCUREMENT_SUGGESTION(id);
            toast.current.show({ severity: 'success', summary: 'Uğurlu əməliyyat', detail: 'Təklif uğurla silindi', life: 3000 });
            setRefresh(true);
        } catch (error) {
            // Handle error
            toast.current.show({ severity: 'error', summary: 'Xəta baş verdi', detail: error.response.data.Exception[0], life: 3000 });
            // Optionally, you can show an error message to the user
        }
        
    };

    const createDynamicTabs = () => {
        return data.map((suggestion, i) => {
            const total = suggestion.total;
            const headerData = suggestion.clientCode + "-" + suggestion.clientName + "   | Məbləğ:" + suggestion.total + " AZN";
            return (
                <AccordionTab
                    header={
                        <HeaderWrapper>
                            <span className="font-bold white-space-nowrap">{headerData}</span>
                            
                        </HeaderWrapper>
                    } key={headerData}
                >
                    <Card>
                        <HeaderWrapper>
                        <Button icon="pi pi-trash" className="p-button-danger p-button-text" onClick={() => handleDelete(suggestion.id)} />
                        </HeaderWrapper>
                        <Information>
                            <InfoGroup>
                                <TitleInfo>Kodu:</TitleInfo>
                                <Desc>{suggestion.clientCode}</Desc>
                            </InfoGroup>

                            <InfoGroup>
                                <TitleInfo>Adı:</TitleInfo>
                                <Desc>{suggestion.clientName}</Desc>
                            </InfoGroup>
                            <InfoGroup>
                                <TitleInfo>Məbləğ:</TitleInfo>
                                <Desc>{suggestion.total}</Desc>
                            </InfoGroup>

                            <InfoGroup>
                                <TitleInfo>Fayllar:</TitleInfo>
                                {data[i]?.files?.length && data[i]?.files.map((file) => (
                                    <Button
                                        key={file.id}
                                        label={file.fileName}
                                        severity="secondary"
                                        outlined
                                        size="small"
                                        style={{ width: '350px' }}
                                        icon = "pi pi-arrow-circle-down"
                                        iconPos = "left"
                                    />
                                ))}
                            </InfoGroup>

                        </Information>

                        <br />

                        <DataTable
                            value={suggestion.items}
                            selectionMode="row"
                            dataKey="suggestion"
                            //metaKeySelection={true}
                            emptyMessage="Mal sətri tapılmadı.">
                            <Column showFilterMenu field="cardType" header="Tip" sortable></Column>
                            <Column showFilterMenu field="itemCode" header="Mal Kodu" sortable></Column>
                            <Column showFilterMenu field="itemName" header="Mal Adı" sortable></Column>
                            <Column showFilterMenu field="erpId" header="Erp-Id" sortable></Column>
                            <Column field="amount" header="Miqdar" sortable></Column>
                            <Column field="price" header="Qiymət" sortable></Column>
                            <Column field="total" header="Toplam" sortable></Column>
                        </DataTable>
                    </Card>
                </AccordionTab>
            );
        });
    };


    return (<>




        <br />
        <Toast ref={toast} />
        <Fragment>
            {data && !error && !isLoading && data.length > 0 ? (
                <div className="card">
                    <Accordion>{createDynamicTabs()}</Accordion>
                    <br />
                    <br />

                </div>







            ) : !data && !error && isLoading ? (
                <Loading />
            ) : (
                <>
                    <p>Heç Bir Təklif Yoxdur</p>
                    <br />
                    <br />
                </>
            )}
        </Fragment>
    </>
    );
}

const Buttons = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 32px;
`;
const Information = styled.div`
  width: 100%;
  display: grid;
  margin-top: 32px;
  margin-left: 14px;
  gap: 24px;
  grid-template-columns: 1fr 1fr;
`;

const Desc = styled.div`
  width: 100%;
  font-size: 14px;
  color: #3b3a3a;
`;

const TitleInfo = styled.div`
  width: 100%;
  font-weight: 500;
  font-size: 18px;
`;



const InfoGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;

  &:nth-of-type(6) {
    grid-column-start: 1;
    grid-column-end: 3;
  }
  &:nth-of-type(7) {
    grid-column-start: 1;
    grid-column-end: 3;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const HeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TabButtons = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;

  .active {
    background-color: #007ad9 !important;
    color: #ffffff !important;
  }
`;