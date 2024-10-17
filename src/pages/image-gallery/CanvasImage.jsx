import React, { useEffect, useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import styled from "styled-components";
import { Button } from "primereact/button";

const CanvasImage = ({ selectedImage, onCloseDialog, onSave }) => {
  const canvasRef = useRef(null);
  const [finalDataURL, setFinalDataURL] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 500,
    height: 500,
  });

  useEffect(() => {
    if (selectedImage?.filepath) {
      const image = new Image();
      image.src = selectedImage.filepath;

      const handleImageLoad = () => {
        const maxHeight = 490;
        const aspectRatio = image.naturalWidth / image.naturalHeight;

        const scaledWidth = aspectRatio * maxHeight;

        setImageDimensions({
          width: scaledWidth,
          height: maxHeight,
        });
      };

      image.onload = handleImageLoad;
      return () => {
        image.onload = null;
      };
    }
  }, [selectedImage?.filepath]);

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
    image.src = `https://cors-anywhere.herokuapp.com/${selectedImage.filepath.replace(/\\/g, "/")}`;

    image.onload = () => {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const drawingDataURL = drawingCanvas.getDataURL();
      const drawingImage = new Image();
      drawingImage.src = drawingDataURL;

      drawingImage.onload = () => {
        context.drawImage(drawingImage, 0, 0);
        const finalDataURL = canvas.toDataURL("image/png");
        console.log("Base64 Merged Image Data:", finalDataURL);
        setFinalDataURL(finalDataURL);

        if (onSave) {
          onSave(finalDataURL);
        }
        

        if (onCloseDialog) {
          onCloseDialog();
        }
      };
    };

    image.onerror = (e) => {
      console.error("Failed to load the image with cross-origin settings", e);
    };
  };

  return (
    <ImageContainer>
      <CanvasOverlay
        ref={canvasRef}
        imgSrc={finalDataURL || `https://cors-anywhere.herokuapp.com/${selectedImage.filepath.replace(/\\/g, "/")}`}
        brushRadius={3}
        brushColor="#ff0000"
        hideGrid={true}
        canvasWidth={imageDimensions.width}
        canvasHeight={imageDimensions.height}
      />
      <ButtonsContainer>
        <SmallButton
          type="button" // Prevents form submission
          label="Geri"
          icon="pi pi-undo"
          className="p-button-secondary"
          onClick={() => canvasRef.current?.undo()}
        />
        <SmallButton
          type="button" // Prevents form submission
          label="Yadda saxla"
          icon="pi pi-save"
          className="p-button-success"
          onClick={convertToBase64AndClose}
        />
      </ButtonsContainer>
    </ImageContainer>
  );
};

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column; /* Change to column to stack elements */
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
  border: 1px solid #ccc;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
`;

const SmallButton = styled(Button)`
  flex: 1;
  margin-right: 10px;
  font-size: 0.85rem;
  padding: 0.5rem 1rem;
  height: 2.5rem;

  &:last-child {
    margin-right: 0;
  }
`;

export default CanvasImage;
