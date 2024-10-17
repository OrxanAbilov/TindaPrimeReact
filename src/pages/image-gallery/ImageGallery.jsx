import React, { useState, useEffect } from "react";
import { Paginator } from "primereact/paginator";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "./ImageGallery.css";
import {
  GET_ALL_GALLERY_PHOTOS,
  GET_PHOTO_DETAIL,
} from "../../features/photo-gallery/services/api";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import { Carousel } from "primereact/carousel";
import { useNavigate } from "react-router-dom";

const ImageGallery = () => {
  const navigate = useNavigate();
  const defaultBeginDate = new Date();
  defaultBeginDate.setDate(defaultBeginDate.getDate() - 100);
  const defaultEndDate = new Date();
  const [firstImage, setFirstImage] = useState(0);
  const [draw, setDraw] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [carouselImages, setCarouselImages] = useState([]);
  const [visible, setVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [beginDate, setBeginDate] = useState(defaultBeginDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [fullImageVisible, setFullImageVisible] = useState(false);
  const [fullImageSrc, setFullImageSrc] = useState("");
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [allFilters, setallFilters] = useState({
    pageSize: 4,
    first: 0,
    draw: 0,
    filters: {
      slS_CODE: "",
      slS_NAME: "",
      clienT_CODE: "",
      clienT_NAME: "",
      doC_TYPE: "",
      beginDate: "",
      endDate: "",
    },
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const filters = {
      ...allFilters.filters,
      beginDate: formatDateToAPI(beginDate),
      endDate: formatDateToAPI(endDate),
    };

    try {
      const response = await GET_ALL_GALLERY_PHOTOS({
        ...allFilters,
        filters: filters,
        start: allFilters.first,
        pageSize: allFilters.pageSize,
      });
      setImages(response.data.data);
      setTotalRecords(response.data.totalRecords);
    } catch (error) {
      console.error("Error fetching data", error);
      setError("Error fetching data");
    }
    setLoading(false);
  };

  const fetchPhotoDetail = async (image) => {
    try {
      const response = await GET_PHOTO_DETAIL(image.doC_TYPE, image.id);
      setCarouselImages(response.data.data);
      setVisible(true);
    } catch (error) {
      console.error("Error fetching photo details", error);
    }
  };

  const formatDateToAPI = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  useEffect(() => {
    fetchData();
  }, [draw]);

  const onPageChange = (event) => {
    const { first, rows } = event;
    setallFilters((prevFilters) => ({
      ...prevFilters,
      first: first,
      pageSize: rows,
    }));
    setDraw((prevDraw) => prevDraw + 1);
  };

  const showImageDialog = (image) => {
    setSelectedImage(image);
    fetchPhotoDetail(image);
  };

  const hideImageDialog = () => {
    setVisible(false);
  };

  const handleButtonClick = () => {
    const currentImage = carouselImages[currentCarouselIndex];
  
    const selectedImage = new URLSearchParams({
      title: currentImage.title,
      filepath: currentImage.filepath,
    }).toString();
    window.open(`/task/task-edit?${selectedImage}`, "_blank");
  
    hideImageDialog();
  };
  

  const handleDateChange = (e, type) => {
    const date = e.value;
    if (type === "begin") {
      setBeginDate(date);
    } else if (type === "end") {
      setEndDate(date);
    }
  };

  const handleSearch = () => {
    setDraw((prevDraw) => prevDraw + 1);
    setallFilters((prevFilters) => ({
      ...prevFilters,
      first: 0,
    }));
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setallFilters((prevFilters) => ({
      ...prevFilters,
      filters: {
        ...prevFilters.filters,
        [field]: value,
      },
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const onCarouselPageChange = (event) => {
    setCurrentCarouselIndex(event.page);
  };

  const renderImages = (images, first) => {
    return images
      .slice(first, first + allFilters.pageSize)
      .map((image, index) => (
        <div className="image-item" key={index}>
          <h4 style={{ margin: "0.3rem" }}>{image.doC_TYPE}</h4>
          <img
            src={image.filepath}
            className="image-thumbnail"
            onClick={() => showImageDialog(image)}
          />
          <div className="image-title">{image.title}</div>
          <div className="image-info">
            <div className="dates">
              <div>{formatDate(image.date)}</div>
            </div>
            <div className="other-info">
              <strong>
                {image.clienT_CODE} - {image.clienT_NAME}
              </strong>
            </div>
            <div className="other-info">
              <strong>
                {image.slS_CODE} - {image.slS_NAME}
              </strong>
            </div>
          </div>
        </div>
      ));
  };

  const renderCarouselImage = (image, index) => {
    const handleDoubleClick = () => {
      setFullImageSrc(image.filepath);
      setFullImageVisible(true);
    };
    return (
      <div
        key={index}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
        onDoubleClick={handleDoubleClick}
      >
        <img
          src={image.filepath}
          alt={image.filename}
          style={{
            maxHeight: "500px",
            width: "auto",
            maxWidth: "100%",
            objectFit: "contain",
          }}
        />
      </div>
    );
  };

  const carouselResponsiveOptions = [
    {
      breakpoint: "1024px",
      numVisible: 3,
      numScroll: 3,
    },
    {
      breakpoint: "768px",
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: "560px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  const renderSearchFields = () => (
    <div className="search-fields-container">
      <InputText
        value={allFilters.filters.clienT_CODE}
        onChange={(e) => handleInputChange(e, "clienT_CODE")}
        placeholder="Müştəri kodu"
        className="search-input"
        onKeyDown={handleKeyDown}
        style={{ width: "170px" }}
      />
      <InputText
        value={allFilters.filters.clienT_NAME}
        onChange={(e) => handleInputChange(e, "clienT_NAME")}
        placeholder="Müştəri adı"
        className="search-input"
        onKeyDown={handleKeyDown}
        style={{ width: "170px" }}
      />
      <InputText
        value={allFilters.filters.slS_CODE}
        onChange={(e) => handleInputChange(e, "slS_CODE")}
        placeholder="Təmsilçi kodu"
        className="search-input"
        onKeyDown={handleKeyDown}
        style={{ width: "170px" }}
      />
      <InputText
        value={allFilters.filters.slS_NAME}
        onChange={(e) => handleInputChange(e, "slS_NAME")}
        placeholder="Təmsilçi adı"
        className="search-input"
        onKeyDown={handleKeyDown}
        style={{ width: "160px" }}
      />
      <Calendar
        value={beginDate}
        onChange={(e) => handleDateChange(e, "begin")}
        placeholder="Start Date"
        className="search-input"
        dateFormat="yy-mm-dd"
        showIcon
        style={{ width: "170px" }}
      />
      <Calendar
        value={endDate}
        onChange={(e) => handleDateChange(e, "end")}
        placeholder="End Date"
        className="search-input"
        dateFormat="yy-mm-dd"
        showIcon
        style={{ width: "170px" }}
      />
      <Button
        icon="pi pi-search"
        onClick={handleSearch}
        className="search-button"
      />
    </div>
  );

  return (
    <div className="image-gallery">
      {renderSearchFields()}

      <div className="images-container">{renderImages(images, firstImage)}</div>
      <Paginator
        first={allFilters.first}
        rows={allFilters.pageSize}
        totalRecords={totalRecords}
        rowsPerPageOptions={[4, 8, 16]}
        onPageChange={onPageChange}
      />

      {selectedImage && (
        <Dialog
          header="Tapşırıq vermə"
          visible={visible}
          style={{
            width: "auto",
            maxWidth: "40vw",
            height: "auto",
            maxHeight: "96vh",
            overflow: "hidden",
          }}
          onHide={hideImageDialog}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Carousel
              value={carouselImages}
              numVisible={1}
              numScroll={1}
              responsiveOptions={carouselResponsiveOptions}
              itemTemplate={renderCarouselImage}
              onPageChange={onCarouselPageChange}
              page={currentCarouselIndex}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "10px 0",
            }}
          >
            <div>
              {selectedImage.slS_NAME}:{" "}
              <strong>{selectedImage.clienT_CODE}</strong>
            </div>
            <Button label="Tapşırıq ver" onClick={handleButtonClick} />
          </div>
        </Dialog>
      )}
      <Dialog
        header="Tam ölçü"
        visible={fullImageVisible}
        style={{
          width: "auto",
          maxWidth: "90vw",
          height: "auto",
          maxHeight: "90vh",
        }}
        onHide={() => setFullImageVisible(false)}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={fullImageSrc}
            alt="Full size"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default ImageGallery;
