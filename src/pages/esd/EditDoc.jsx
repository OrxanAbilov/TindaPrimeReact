import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  GET_BY_ID_FOR_EDIT,
  GET_WORKERS_FOR_COMBO,
  PUT_DOC_TYPE,
} from "../../features/admin/esd/documentType/services/api";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import { useToast } from "../../context/ToastContext";
import { InputNumber } from "primereact/inputnumber";

export default function EditDoc() {
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorUser, setErrorUser] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [buttonisLoading, setButtonIsLoading] = useState(false);
  const [amount, setAmount] = useState(0);

  const [selectedUser1, setSelectedUser1] = useState(null);
  const [selectedUser2, setSelectedUser2] = useState(null);

  const { showToast } = useToast()




  const fetUsers = async () => {
    try {
      setIsLoadingUser(true);
      const res = await GET_WORKERS_FOR_COMBO();
      setUsers(res.data);
      setErrorUser(false);
    } catch (error) {
      console.log(error);
      setErrorUser(true);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const navigate = useNavigate();

  const defaultValues = {
    id: "",
    name: "",
    description: "",
    workFlows: [],
    sendToLeader: false,
    sendToUpper: false,
    viewers: [],
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues
  } = useForm({ defaultValues });

  const fetchData = async (docId) => {
    try {
      setIsLoading(true);
      const res = await GET_BY_ID_FOR_EDIT(docId);

      setValue("name", res.data.name);
      setValue("description", res.data.description);
      setValue("workFlows", res.data.workFlows);
      setValue("sendToLeader", res.data.sendToLeader);
      setValue("sendToUpper", res.data.sendToUpper);
      setValue("viewers", res.data.viewers);
      setValue("id", res.data.id);

      setError(false);
    } catch (error) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data) => {
    setButtonIsLoading(true)

    // Update queueNo for workflows
    const updatedData = { ...data };
    updatedData.workFlows = updatedData.workFlows.map((item, index) => ({
      ...item,
      queueNo: index
    }));

    // Update queueNo for viewers
    updatedData.viewers = updatedData.viewers.map((item, index) => ({
      ...item,
      queueNo: index
    }));

    PUT_DOC_TYPE(updatedData)
      .then((res) => {
        showToast("success", "Uğurlu əməliyyat!", "Dəyişiklik olundu!", 3000);
        navigate(-1);
      })
      .catch((err) => {
        console.log(err);
        showToast("error", "Xəta", error.response.data.Exception[0]);
      })
      .finally(() => {
        setButtonIsLoading(false);
      });

    // console.log(updatedData);
  };

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className="p-error">{errors[name].message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      fetUsers();
      fetchData(id);
    }

    return () => {
      mounted = false;
    };
  }, []);

  const [forceUpdate, setForceUpdate] = useState(false);


  const addUser1 = (e) => {
    e.preventDefault()

    if (selectedUser1) {
      // setValue("workFlows",[...getValues().workFlows,selectedUser1, queueNo ])
      // setSelectedUser1(null);  

      const workFlows = [...getValues().workFlows];
      const newQueueNo = workFlows.length;
      const newWorkFlow = { ...selectedUser1, queueNo: newQueueNo, amount: amount };
      setValue("workFlows", [...workFlows, newWorkFlow]);
      setSelectedUser1(null);
      setAmount(0);
    }
  };

  const addUser2 = (e) => {
    e.preventDefault()

    if (selectedUser2) {
      const viewers = [...getValues().viewers];
      const newQueueNo = viewers.length;
      const newViewer = { ...selectedUser2, queueNo: newQueueNo };
      setValue("viewers", [...viewers, newViewer]);
      setSelectedUser2(null);

      // setValue("viewers",[...getValues().viewers,selectedUser2], queueNo)
      // setSelectedUser2(null);
    }
  };



  const removeUser1 = (id) => {
    const arr = [...getValues().workFlows.filter((e) => e.id !== id)]
    setValue("workFlows", arr);
    setForceUpdate(prevState => !prevState); // Toggle the forceUpdate state



  };

  const removeUser2 = (id) => {
    const arr = [...getValues().viewers.filter((e) => e.id !== id)]
    setValue("viewers", arr);
    setForceUpdate(prevState => !prevState); // Toggle the forceUpdate state


  };



  return (
    <Wrapper>
      <HeaderWrapper>
        <Button
          onClick={() => navigate(-1)}
          label="Geri qayıt"
          icon="pi pi-angle-left"
          text
          style={{ width: "130px" }}
        />
      </HeaderWrapper>

      {!isLoading && !error ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-column gap-2"
        >
          <InputsWrapper>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Məcburidir" }}
              render={({ field, fieldState }) => (
                <InputLabelWrapper>
                  <label
                    htmlFor={field.name}
                    className={classNames({ "p-error": errors.value })}
                  >
                    Sənəd tipinin adı
                  </label>
                  <span className="p-float-label">
                    <InputText
                      id={field.name}
                      value={field.value}
                      className={classNames({ "p-invalid": fieldState.error })}
                      onChange={(e) => field.onChange(e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </span>
                  {getFormErrorMessage(field.name)}
                </InputLabelWrapper>
              )}
            />

            <Controller
              name="description"
              control={control}
              rules={{ required: "Məcburidir" }}
              render={({ field, fieldState }) => (
                <InputLabelWrapper>
                  <label
                    htmlFor={field.name}
                    className={classNames({ "p-error": errors.value })}
                  >
                    Sənəd tipinin açıqlaması
                  </label>
                  <span className="p-float-label">
                    <InputText
                      id={field.name}
                      value={field.value}
                      className={classNames({ "p-invalid": fieldState.error })}
                      onChange={(e) => field.onChange(e.target.value)}
                      style={{ width: "100%" }}

                    />
                  </span>
                  {getFormErrorMessage(field.name)}
                </InputLabelWrapper>
              )}
            />
          </InputsWrapper>
          {id == 1 ? (
            <CheckboxWrapper>
              <Controller
                name="sendToLeader"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Checkbox
                      inputId={field.name}
                      checked={field.value}
                      inputRef={field.ref}
                      className={classNames({ "p-invalid": fieldState.error })}
                      onChange={(e) => field.onChange(e.checked)}
                    />
                    <label
                      htmlFor={field.name}
                      className={classNames({ "p-error": errors.checked })}
                    >
                      Rəhbərə göndər
                    </label>

                  </>
                )}
              />

              <Controller
                name="sendToUpper"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Checkbox
                      inputId={field.name}
                      checked={field.value}
                      inputRef={field.ref}
                      className={classNames({ "p-invalid": fieldState.error })}
                      onChange={(e) => field.onChange(e.checked)}
                    />
                    <label
                      htmlFor={field.name}
                      className={classNames({ "p-error": errors.checked })}
                    >
                      Bir üst rəhbərə göndər
                    </label>

                  </>
                )}
              />
            </CheckboxWrapper>
          ) : (<></>)}

          {isLoadingUser && !errorUser ? (
            <Loading />
          ) : (
            <MainDropdownWrapper>
              {id!=2?(<DropdownWrapper>
                <Dropdown
                  value={selectedUser1}
                  onChange={(e) => {
                    setSelectedUser1(e.value);
                  }}
                  options={users}
                  optionLabel="fullName"
                  placeholder="Təsdiqləyənlər"
                />
                {id == 3 ? (
                  <InputNumber value={amount} onValueChange={(e) => setAmount(e.value)} />
                  
                ) : (<></>)}

                <Button
                  severity="primary"
                  label="Əlavə et"
                  onClick={addUser1}
                />

                <Table>
                  <DataTable
                    value={getValues().workFlows}
                    reorderableRows
                    onRowReorder={(e) => {
                      setValue("workFlows", e.value);
                      setForceUpdate(prevState => !prevState);
                    }}
                    emptyMessage="Təsdiqləyənlər əlavə edilməyib"
                    paginator
                    rows={3}
                    key={forceUpdate}

                  >
                    <Column rowReorder style={{ width: "3rem" }} />
                    <Column field="id" header="id"></Column>
                    <Column field="fullName" header="Ad:"></Column>
                    {id == 3 ? (<Column field="amount" header="Məbləğ:"></Column>) : (null)}
                    <Column
                      style={{ flex: "0 0 4rem", textAlign: "right" }}
                      body={(row) => (
                        <Button
                          icon="pi pi-times"
                          onClick={(e) => {
                            e.preventDefault()

                            removeUser1(row.id);
                          }}
                          size="small"
                          severity="danger"
                        />
                      )}
                    ></Column>
                  </DataTable>
                </Table>
              </DropdownWrapper>):(<></>)}
              

              <DropdownWrapper>
                <Dropdown
                  value={selectedUser2}
                  onChange={(e) => setSelectedUser2(e.value)}
                  options={users}
                  optionLabel="fullName"
                  placeholder="İzləyənlər"
                />
                <Button
                  severity="primary"
                  label="Əlavə et"
                  onClick={addUser2}
                />

                <Table>
                  <DataTable
                    value={getValues().viewers}
                    reorderableRows
                    onRowReorder={(e) => {
                      setValue("viewers", e.value);
                      setForceUpdate(prevState => !prevState);
                    }}
                    emptyMessage="Izləyən əlavə edilməyib"
                    paginator
                    rows={3}
                    key={forceUpdate}

                  >
                    <Column rowReorder style={{ width: "3rem" }} />
                    <Column field="id" header="id"></Column>
                    <Column field="fullName" header="Ad:"></Column>
                    <Column
                      style={{ flex: "0 0 4rem", textAlign: "right" }}
                      body={(row) => (
                        <Button
                          icon="pi pi-times"
                          size="small"
                          severity="danger"
                          onClick={(e) => {
                            e.preventDefault()
                            removeUser2(row.id);
                          }}
                        />
                      )}
                    ></Column>
                  </DataTable>
                </Table>
              </DropdownWrapper>
            </MainDropdownWrapper>
          )}
          <Buttons>
            <Button
              severity="success"
              label="Yadda saxla"
              type="submit"
              size="normal"
              loading={buttonisLoading}
            />
          </Buttons>

        </form>
      ) : isLoading && !error ? (
        <Loading />
      ) : (
        <Error />
      )}


    </Wrapper>
  );
}

const Buttons = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-bottom: 10px;
`;

const InputsWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 16px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Table = styled.div`
  grid-column: 1/3;
`;

const CheckboxWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 36px;
`;
const MainDropdownWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 32px;
  align-items: flex-start;
  // height: 410px;

  @media (max-width: 768px) {
    flex-direction: column;
  }

`;
const DropdownWrapper = styled.div`
  display: grid;
  width: 50%;
  grid-template-columns: 4fr 1fr;
  grid-gap: 8px;

  @media (max-width: 768px) {
    width: 100%;
  }

`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const InputLabelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const HeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;
