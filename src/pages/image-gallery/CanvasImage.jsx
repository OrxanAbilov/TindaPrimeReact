import React, { useEffect, useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import styled from "styled-components";
import { Button } from "primereact/button";
import Loading from "../../components/Loading";

const CanvasImage = ({
  selectedImage,
  onCloseDialog,
  onSave,
  finalDataURL,
  onRemoveFinalDataURL,
}) => {
  const canvasRef = useRef(null);
  const [base64Image, setBase64Image] = useState(null);
  const [newFinalDataURL, setNewFinalDataURL] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 500,
    height: 500,
  });
  const [loading, setLoading] = useState(true); // Add loading state

  const convertImageToBase64 = (url) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = url;

      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        const base64 = canvas.toDataURL("image/png");
        resolve(base64);
      };

      image.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    if (selectedImage?.filepath) {
      convertImageToBase64(selectedImage.filepath)
        .then((base64) => {
          setBase64Image(base64);
          const image = new Image();
          image.src = base64;

          image.onload = () => {
            const maxHeight = 490;
            const aspectRatio = image.width / image.height;
            const scaledWidth = aspectRatio * maxHeight;

            setImageDimensions({
              width: scaledWidth,
              height: maxHeight,
            });
            setLoading(false); // Set loading to false after the image is fully loaded
          };
        })
        .catch((error) => {
          console.error("Image conversion error:", error);
          setLoading(false); // Set loading to false even if there's an error
        });
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
    image.src = finalDataURL || base64Image;

    image.onload = () => {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const drawingDataURL = drawingCanvas.getDataURL();
      const drawingImage = new Image();
      drawingImage.src = drawingDataURL;

      drawingImage.onload = () => {
        context.drawImage(drawingImage, 0, 0);

        const newFinalDataURL = canvas.toDataURL("image/png");
        console.log("Base64 Merged Image Data:", newFinalDataURL);
        setNewFinalDataURL(newFinalDataURL);

        if (onSave) {
          onSave(newFinalDataURL);
        }

        if (onCloseDialog) {
          onCloseDialog();
        }
      };
    };

    image.onerror = (e) => {
      console.error("Failed to load the base64 image", e);
    };
  };

  const handleRemoveAll = () => {
    if (onRemoveFinalDataURL) {
      onRemoveFinalDataURL();
    }
    canvasRef.current.clear();
  };

  return (
    <ImageContainer>
      {loading ? (
        <Loading />
      ) : (
        <>
          <CanvasOverlay
            ref={canvasRef}
            imgSrc={finalDataURL || base64Image}
            brushRadius={2}
            brushColor="#ff0000"
            hideGrid={true}
            canvasWidth={imageDimensions.width}
            canvasHeight={imageDimensions.height}
          />
          <ButtonsContainer>
            <SmallButton
              type="button"
              label="Geri"
              icon="pi pi-undo"
              className="p-button-secondary"
              onClick={() => canvasRef.current?.undo()}
            />
            <SmallButton
              type="button"
              label="Təmizlə"
              icon="pi pi-times"
              className="p-button-danger"
              onClick={handleRemoveAll}
            />
            <SmallButton
              type="button"
              label="Yadda saxla"
              icon="pi pi-save"
              className="p-button-success"
              onClick={convertToBase64AndClose}
            />
          </ButtonsContainer>
        </>
      )}
    </ImageContainer>
  );
};

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
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
