import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import styled from "styled-components";
import CanvasDraw from "react-canvas-draw";

const Container = styled.div`
  padding: 20px;
  width: 100%;
`;

const Title = styled.h1`
  text-align: center;
`;

const FormGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
`;

const StyledInput = styled(InputText)`
  width: 100%;
`;

const StyledTextarea = styled(InputTextarea)`
  width: 100%;
`;

const StyledCalendar = styled(Calendar)`
  width: 100%;
`;

const SubmitButton = styled(Button)`
  width: 100%;
  margin-top: 15px;
`;

const ShowImageButton = styled(Button)`
  margin-top: 20px;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
`;

const CanvasOverlay = styled(CanvasDraw)`
  position: relative;
  z-index: 2;
  max-width: 100%;
  max-height: 100%;
  border: 1px solid #ccc;
`;

const ImageTask = () => {
  const location = useLocation();
  const { selectedImage } = location.state || {};

  const [formData, setFormData] = useState({
    name: "",
    descr: "",
    beginDate: null,
    expireDate: null,
    impId: 0,
  });

  const [dialogVisible, setDialogVisible] = useState(false);

  const canvasRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const showImageDialog = () => {
    setDialogVisible(true);
  };

  const convertToBase64AndClose = () => {
    const drawingCanvas = canvasRef.current;
    if (!drawingCanvas) {
      console.error("CanvasDraw ref not available");
      return;
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = drawingCanvas.canvasContainer.children[1].width;
    canvas.height = drawingCanvas.canvasContainer.children[1].height;

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src =
      "https://images.pexels.com/photos/28927948/pexels-photo-28927948/free-photo-of-dramatic-canyon-landscape-on-remote-island.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

    image.onload = () => {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const drawingDataURL = drawingCanvas.getDataURL();
      const drawingImage = new Image();
      drawingImage.src = drawingDataURL;

      drawingImage.onload = () => {
        context.drawImage(drawingImage, 0, 0);

        const finalDataURL = canvas.toDataURL("image/png");
        console.log("Base64 Merged Image Data:", finalDataURL);

        setDialogVisible(false);
      };
    };

    image.onerror = (e) => {
      console.error("Failed to load the image with cross-origin settings", e);
    };
  };
  return (
    <Container>
      <Title>Image Task</Title>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <div>
            <Label>Name:</Label>
            <StyledInput
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Importance ID:</Label>
            <StyledInput
              name="impId"
              type="number"
              value={formData.impId}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Begin Date:</Label>
            <StyledCalendar
              name="beginDate"
              value={formData.beginDate}
              onChange={(e) => handleDateChange("beginDate", e.value)}
              showIcon
              required
            />
          </div>
          <div>
            <Label>Expire Date:</Label>
            <StyledCalendar
              name="expireDate"
              value={formData.expireDate}
              onChange={(e) => handleDateChange("expireDate", e.value)}
              showIcon
              required
            />
          </div>
          <div>
            <Label>Description:</Label>
            <StyledTextarea
              name="descr"
              value={formData.descr}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>
        </FormGroup>
        <SubmitButton type="submit" label="Submit" />
        <ShowImageButton label="Show Image" onClick={showImageDialog} />
      </form>

      <Dialog
        header={selectedImage?.title}
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        style={{ width: "80vw", maxWidth: "800px" }}
        modal
      >
        {selectedImage && (
          <>
            <ImageContainer>
              <CanvasOverlay
                ref={canvasRef}
                imgSrc="https://images.pexels.com/photos/28927948/pexels-photo-28927948/free-photo-of-dramatic-canyon-landscape-on-remote-island.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                brushRadius={5}
                brushColor="#ff0000"
                hideGrid={true}
                canvasHeight={500}
              />
            </ImageContainer>
          </>
        )}

        <Button
          label="Convert to Base64 & Close"
          onClick={convertToBase64AndClose}
          style={{ marginTop: "20px", width: "100%" }}
        />
        <Button
          label="Undo"
          onClick={() => canvasRef.current?.undo()}
          style={{ marginTop: "10px", width: "100%" }}
        />
      </Dialog>
    </Container>
  );
};

export default ImageTask;
