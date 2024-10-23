import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import styled from "styled-components";
import CanvasImage from "../image-gallery/CanvasImage";
import { Dropdown } from "primereact/dropdown";
import { AutoComplete } from "primereact/autocomplete";
import {
  GET_ALL_DEPARTMENTS,
  GET_POSITIONS_BY_DEPARTMENT,
  GET_ALL_BRANCHES,
  GET_ALL_IMPORTANCES,
  GET_USERS_FOR_COMBO_AUTOCOMPLETE,
  GET_USERS_OF_TASK,
  POST_NEW_TASK
} from "../../features/task/services/api";
import { BiTrash } from "react-icons/bi";
import ClientCodeDialog from "./ClientCodeDialog";

const TaskEdit = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [branches, setBranches] = useState([]);
  const [userInput, setUserInput] = useState(queryParams.get("fullName") || "");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [importances, setImportances] = useState([]);
  const [additionalUserInput, setAdditionalUserInput] = useState("");
  const [additionalUsers, setAdditionalUsers] = useState([]);
  const [clientCodes, setClientCodes] = useState([]);
  const [clientsDialogVisible, setClientsDialogVisible] = useState(false);
  const [finalDataURL, setFinalDataURL] = useState(null);

  const selectedImage = {
    filepath: queryParams.get("filepath"),
  };
  const depId = parseInt(queryParams.get("depId"), 10) || 0;
  const userId = parseInt(queryParams.get("userId"), 10) || 0;
  const positionId = parseInt(queryParams.get("positionId"), 10) || 0;
  const branchId = parseInt(queryParams.get("branchId"), 10) || 0;
  const fullName = queryParams.get("fullName") || "";
  const clientCodesFromURL = queryParams.get("clientCodes")
    ? queryParams.get("clientCodes").split(",")
    : [];


    const getBase64FromImagePath = async (imagePath) => {
      try {
        const response = await fetch(imagePath);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        const blob = await response.blob();
        const reader = new FileReader();
        
        return new Promise((resolve, reject) => {
          reader.onloadend = () => {
            const base64String = reader.result;
            const pureBase64 = base64String.split(',')[1];
            resolve(pureBase64);
          };
          reader.onerror = (error) => {
            reject(error);
          };
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error('Error fetching the image:', error);
      }
    };
    
    if (selectedImage.filepath) {
      getBase64FromImagePath(selectedImage.filepath)
        .then((pureBase64) => {
          formData.files[0].base64 = pureBase64; 
        })
        .catch((error) => {
          console.error('Error converting to Base64:', error);
        });
    }
    
  
  const [formData, setFormData] = useState({
    name: "",
    descr: "",
    beginDate: null,
    expireDate: null,
    impId: 0,
    depId: depId || 0,
    positionId: positionId || 0,
    branchId: branchId || 0,
    userId: userId || 0,
    userIds: [],
    files: [
      {
        fileName: "",
        base64: "",
      },
    ],
    clientCodes: clientCodesFromURL || [],
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      const departmentsRes = await GET_ALL_DEPARTMENTS();
      setDepartments(departmentsRes);

      const branchesRes = await GET_ALL_BRANCHES();
      const formattedBranches = branchesRes.map((branch) => ({
        id: branch.id,
        name: `${branch.branchName} (${branch.branchCode})`,
      }));
      setBranches(formattedBranches);

      const importancesRes = await GET_ALL_IMPORTANCES();
      const formattedImportances = importancesRes.map((importance) => ({
        id: importance.id,
        name: importance.descr,
      }));
      setImportances(formattedImportances);
    };

    fetchInitialData();
  }, []);

  const handleUserSearch = async (event) => {
    const searchTerm = event.query;
    if (searchTerm.length >= 1) {
      const usersRes = await GET_USERS_FOR_COMBO_AUTOCOMPLETE(searchTerm);
      setFilteredUsers(usersRes);
    }
  };

  const handleUserSelect = (e) => {
    setUserInput(e.value.fullName);
    setFormData((prevData) => ({
      ...prevData,
      userId: e.value.id,
    }));
  };

  const handleDepartmentChange = async (e) => {
    const selectedDepId = e.value;
    setFormData((prevData) => ({
      ...prevData,
      depId: selectedDepId,
      positionId: null,
    }));

    const positionsRes = await GET_POSITIONS_BY_DEPARTMENT(selectedDepId);
    setPositions(positionsRes);

    if (positionsRes.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        positionId: positionsRes[0].id,
      }));
    }
  };

  useEffect(() => {
    if (formData.depId) {
      const fetchPositions = async () => {
        const positionsRes = await GET_POSITIONS_BY_DEPARTMENT(formData.depId);
        setPositions(positionsRes);

        if (positionsRes.length > 0 && !formData.positionId) {
          setFormData((prevData) => ({
            ...prevData,
            positionId: positionsRes[0].id,
          }));
        }
      };

      fetchPositions();
    }
  }, [formData.depId]);

  const handleBranchChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      branchId: e.value,
    }));
  };

  const handleImportanceChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      impId: e.value,
    }));
  };

  const handleAdditionalUserSelect = (e) => {
    const selectedUser = e.value;

    if (!formData.userIds.includes(selectedUser.id)) {
      setAdditionalUsers((prevUsers) => [
        ...prevUsers,
        { id: selectedUser.id, fullName: selectedUser.fullName },
      ]);

      setFormData((prevData) => ({
        ...prevData,
        userIds: [...prevData.userIds, selectedUser.id],
      }));
    } else {
      console.log(`User with ID ${selectedUser.id} is already added.`);
    }

    setAdditionalUserInput("");
  };

  const removeUser = (userId) => {
    setAdditionalUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== userId)
    );

    setFormData((prevData) => ({
      ...prevData,
      userIds: prevData.userIds.filter((id) => id !== userId),
    }));
  };

  const handleChange = ({ target: { name: fieldName, value } }) => {

    setFormData((prevData) => {
      const newData = { ...prevData, [fieldName]: value };

      return newData;
    });
  };
  
  const handleDateChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveImage = (base64Image) => {
    setFormData((prevState) => ({
      ...prevState,
      files: [
        {
          fileName: selectedImage.fileName || "imageEdited.png",
          base64: base64Image,
        },
      ],
    }));
    setFinalDataURL(base64Image);
  };

  const handleRemoveFinalDataURL = () => {
    setFinalDataURL(null);
  };

  const handleAddCodes = (codes) => {
    setClientCodes((prevCodes) => {
      const newCodes = codes.filter((code) => !prevCodes.includes(code));

      if (newCodes.length === 0) {
        return prevCodes;
      }

      const updatedCodes = [...prevCodes, ...newCodes];

      setFormData((prevData) => ({
        ...prevData,
        clientCodes: updatedCodes,
      }));

      return updatedCodes;
    });
  };

  const handleRemoveCode = (code) => {
    setClientCodes((prevCodes) => {
      const updatedCodes = prevCodes.filter((c) => c !== code);

      setFormData((prevData) => ({
        ...prevData,
        clientCodes: updatedCodes,
      }));

      return updatedCodes;
    });
  };
  

  const handleFetchUsers = async (type, id) => {
    try {
      const users = await GET_USERS_OF_TASK(id, type);

      
      if (users.length > 0) {
        const firstUser = users[0];
        setUserInput(firstUser.fullName);
        setFormData((prevData) => ({
          ...prevData,
          userId: firstUser.id,
          userIds: users.slice(1).map((user) => user.id), 
        }));
  
        setAdditionalUsers(
          users.slice(1).map((user) => ({ id: user.id, fullName: user.fullName }))
        );
      } else {
        setFormData((prevData) => ({
          ...prevData,
          userId: null,
          userIds: [],
        }));
        setUserInput('');
        setAdditionalUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("formData before update", formData);
  
    if (formData.files) {
      formData.files = formData.files.map(file => {
        if (finalDataURL) { 
          return {
            ...file,
            base64: finalDataURL.split(',')[1]
          };
        }
        return file;
      });
    }
  
    console.log("formData after update", formData);
  
    // Uncomment the code below to submit the form data
    // try {
    //   const response = await POST_NEW_TASK(formData); 
    //   console.log("Task successfully created:", response);
    // } catch (error) {
    //   console.error("Failed to create task:", error);
    // }
  };
  
    
  const handleCloseDialog = () => {
    setDialogVisible(false);
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <div>
            <Label>Başlıq:</Label>
              <StyledInput
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
          </div>
          <div>
            <Label>Başlama vaxtı:</Label>
            <InputWrapper>
              <StyledCalendar
                name="beginDate"
                value={formData.beginDate}
                onChange={(e) => handleDateChange("beginDate", e.value)}
                showIcon
                required
                dateFormat="dd-mm-yy"
              />
            </InputWrapper>
          </div>
          <div>
            <Label>Bitmə vaxtı:</Label>
            <InputWrapper>
              <StyledCalendar
                name="expireDate"
                value={formData.expireDate}
                onChange={(e) => handleDateChange("expireDate", e.value)}
                showIcon
                required
                dateFormat="dd-mm-yy"
              />
            </InputWrapper>
          </div>
        </FormGroup>

        <FormGroup>
          <div>
            <Label>Şöbə:</Label>
            <InputWrapper>
              <StyledDropdown
                value={formData.depId}
                options={departments}
                onChange={handleDepartmentChange}
                optionLabel="name"
                optionValue="id"
                placeholder="Şöbə seçin"
                showClear
                filter
                filterBy="name"
                required
              />
              <Button
                type="button"
                icon="pi pi-plus"
                onClick={() => handleFetchUsers(1, formData.depId)} // Trigger fetch for Şöbə
              />
            </InputWrapper>
          </div>
          <div>
            <Label>Vəzifə:</Label>
            <InputWrapper>
              <StyledDropdown
                value={formData.positionId}
                options={positions}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    positionId: e.value,
                  }))
                }
                optionLabel="positionName"
                optionValue="id"
                placeholder="Vəzifə seçin"
                showClear
                filter
                filterBy="positionName"
              />
              <Button
                type="button"
                icon="pi pi-plus"
                onClick={() => handleFetchUsers(2, formData.positionId)} // Trigger fetch for Vəzifə
              />
            </InputWrapper>
          </div>
          <div>
            <Label>İş yeri:</Label>
            <InputWrapper>
              <StyledDropdown
                value={formData.branchId}
                options={branches}
                onChange={handleBranchChange}
                optionLabel="name"
                optionValue="id"
                placeholder="İş yeri seçin"
                showClear
                filter
                filterBy="name"
              />
              <Button
                type="button"
                icon="pi pi-plus"
                onClick={() => handleFetchUsers(3, formData.branchId)} // Trigger fetch for İş yeri
              />
            </InputWrapper>
          </div>
          <div>
            <Label>Dərəcə:</Label>
            <StyledDropdown
              value={formData.impId}
              options={importances}
              onChange={handleImportanceChange}
              optionLabel="name"
              optionValue="id"
              placeholder="Dərəcə seçin"
              showClear
              filter
              filterBy="name"
            />
          </div>
          <div>
            <Label>İstifadəçi:</Label>
            <StyledAutoComplete
              value={userInput}
              suggestions={filteredUsers}
              completeMethod={handleUserSearch}
              field="fullName"
              onChange={(e) => setUserInput(e.value)}
              onSelect={handleUserSelect}
              placeholder="İstifadəçi seçin"
              style={{ width: "100%" }}
              required
            />
          </div>
          <div>
            <Label>File</Label>
            <ShowImageButton
              type="button"
              onClick={() => setDialogVisible(true)}
            >
              Şəkili düzənlə
            </ShowImageButton>
          </div>
        </FormGroup>

        <div>
          <Label>Açıqlama:</Label>
          <StyledTextarea
            name="descr"
            value={formData.descr}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <div
            style={{
              width: "48%",
              padding: "10px",
              borderRadius: "8px",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            <Label>Əlavə istifadəçi:</Label>
            <StyledAutoComplete
              value={additionalUserInput}
              suggestions={filteredUsers}
              completeMethod={handleUserSearch}
              field="fullName"
              onChange={(e) => setAdditionalUserInput(e.value)}
              onSelect={handleAdditionalUserSelect}
              placeholder="Əlavə istifadəçi seçin"
            />
            <div style={{ marginTop: "10px" }}>
              <ul style={{ listStyleType: "none", padding: "0" }}>
                {additionalUsers.map((user) => (
                  <li
                    key={user.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px",
                      margin: "4px 0",
                      backgroundColor: "#e9ecef",
                      borderRadius: "5px",
                    }}
                  >
                    <span>{user.fullName}</span>
                    <Button
                      icon={<BiTrash />}
                      className="p-button-danger p-button-text"
                      onClick={() => removeUser(user.id)}
                      style={{ marginLeft: "10px" }}
                      type="button"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            style={{
              width: "48%",
              padding: "10px",
              borderRadius: "8px",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            <Label>Müştərilər:</Label>
            <Button type="button" onClick={() => setClientsDialogVisible(true)}>
              Əlavə et
            </Button>
            <div style={{ marginTop: "10px" }}>
              <ul style={{ listStyleType: "none", padding: "0" }}>
                {formData.clientCodes.map((code) => (
                  <li
                    key={code}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px",
                      margin: "4px 0",
                      backgroundColor: "#e9ecef",
                      borderRadius: "5px",
                    }}
                  >
                    {code}
                    <Button
                      icon={<BiTrash />}
                      className="p-button-danger p-button-text"
                      onClick={() => handleRemoveCode(code)}
                      style={{ marginLeft: "10px" }}
                      type="button"
                    />
                  </li>
                ))}
              </ul>
            </div>
            <ClientCodeDialog
              visible={clientsDialogVisible}
              onHide={() => setClientsDialogVisible(false)}
              onAddCodes={handleAddCodes}
            />
          </div>
        </div>
        <ButtonContainer>
          <SubmitButton type="submit" label="Yadda saxla" />
        </ButtonContainer>
      </form>

      <Dialog
        header="Dəyişdir"
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        style={{ maxWidth: "1200px" }}
        modal
      >
        <CanvasImage
          selectedImage={selectedImage}
          onCloseDialog={handleCloseDialog}
          onSave={handleSaveImage}
          finalDataURL={finalDataURL}
          onRemoveFinalDataURL={handleRemoveFinalDataURL} // Pass the remove function
        />
      </Dialog>
    </Container>
  );
};

const FormGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 15px;
`;

const Container = styled.div`
  padding: 20px;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
`;

const StyledComponent = styled.div`
  width: 100%;
  box-sizing: border-box;
`;

const StyledInput = styled(StyledComponent).attrs({ as: InputText })``;
const StyledDropdown = styled(StyledComponent).attrs({ as: Dropdown })``;
const StyledTextarea = styled(StyledComponent).attrs({ as: InputTextarea })``;
const StyledCalendar = styled(StyledComponent).attrs({ as: Calendar })``;

const StyledAutoComplete = styled(AutoComplete)`
  width: 100%;
  .p-autocomplete-input {
    width: 100%;
    box-sizing: border-box;
  }
`;

const SubmitButton = styled(Button)`
  width: 14%;
  margin-left: auto;
`;

const ShowImageButton = styled(Button)`
  display: flex;
  align-items: center;
  border: none;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;
const InputWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export default TaskEdit;
