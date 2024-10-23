import React, { useState, useEffect } from "react";
import { Paginator } from "primereact/paginator";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import "./ImageGallery.css";
import {
  GET_ALL_GALLERY_PHOTOS,
  GET_PHOTO_DETAIL,
  GET_CLIENTS_AUTO_COMPLETE,
} from "../../features/photo-gallery/services/api";
import { GET_SALESMAN_FOR_COMBO } from "../../features/clients/services/api";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import { Carousel } from "primereact/carousel";
import { useNavigate } from "react-router-dom";

const ImageGallery = () => {
  const navigate = useNavigate();
  const defaultBeginDate = new Date();
  // defaultBeginDate.setDate(defaultBeginDate.getDate() - 100);
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
  const [salesmen, setSalesmen] = useState([]);
  const [clientSuggestions, setClientSuggestions] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
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

  useEffect(() => {
    const fetchSalesmen = async () => {
      try {
        const response = await GET_SALESMAN_FOR_COMBO();

        if (response && response.data) {
          const formattedSalesmen = response.data.map((salesman) => ({
            label: `${salesman.slS_CODE} - ${salesman.fullName}`,
            value: salesman.slS_CODE,
          }));
          setSalesmen(formattedSalesmen);
        }
      } catch (error) {
        console.error("Error fetching salesmen:", error);
      }
    };

    fetchSalesmen();
  }, []);

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

      console.log("response:", response);
      const updatedImages = response.data.data.map((img) => ({
        ...img,
        deP_ID: image.deP_ID,
        userS_ID: image.userS_ID,
        positioN_ID: image.positioN_ID,
        brancH_ID: image.brancH_ID,
        clienT_CODE: image.clienT_CODE,
        fullname: image.fullname,
      }));

      setCarouselImages(updatedImages);
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
    fetchPhotoDetail(image, {
      deP_ID: image.deP_ID,
      userS_ID: image.userS_ID,
      positioN_ID: image.positioN_ID,
      brancH_ID: image.brancH_ID,
      clienT_CODE: image.clienT_CODE,
      fullname: image.fullname,
    });
  };

  const hideImageDialog = () => {
    setVisible(false);
  };

  const handleButtonClick = () => {
    const currentImage = carouselImages[currentCarouselIndex];

    const selectedImage = new URLSearchParams({
      depId: currentImage.deP_ID,
      userId: currentImage.userS_ID,
      positionId: currentImage.positioN_ID,
      branchId: currentImage.brancH_ID,
      clientCodes: currentImage.clienT_CODE,
      fullName: currentImage.fullname,
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
    const value = e.target.value || "";
    setallFilters((prevFilters) => ({
      ...prevFilters,
      filters: {
        ...prevFilters.filters,
        [field]: value,
      },
    }));
  };

  const searchClients = async (event) => {
    const query = event.query;
    const suggestions = await GET_CLIENTS_AUTO_COMPLETE(query);
    setClientSuggestions(suggestions);
  };

  const handleClientSelect = (e) => {
    const selectedClient = e.value;
    setSelectedClient(selectedClient);

    console.log("SELECTED CLIENT:", selectedClient);

    setallFilters((prevFilters) => ({
      ...prevFilters,
      filters: {
        ...prevFilters.filters,
        clienT_CODE: selectedClient?.code || "",
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

  const getDocTypeLabel = (docType) => {
    switch (docType) {
      case "CHECK_LIST":
        return "Sorğu";
      case "DEBT_CHECK":
        return "Borc yoxlanışı";
      case "VISIT":
        return "Ziyarət";
      default:
        return docType;
    }
  };

  const renderImages = (images, first) => {
    return images
      .slice(first, first + allFilters.pageSize)
      .map((image, index) => (
        <div className="image-item" key={index}>
          <h4 style={{ margin: "0.3rem" }}>
            {getDocTypeLabel(image.doC_TYPE)}
          </h4>
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

  const docTypeOptions = [
    { label: "Sorğu", value: "CHECK_LIST" },
    { label: "Borc yoxlanışı", value: "DEBT_CHECK" },
    { label: "Ziyarət", value: "VISIT" },
  ];

  const renderSearchFields = () => (
    <div className="search-fields-container">
      <AutoComplete
        value={selectedClient}
        suggestions={clientSuggestions}
        completeMethod={searchClients}
        field="name"
        onChange={handleClientSelect}
        onKeyDown={handleKeyDown}
        placeholder="Müştəri"
        className="search-input"
        style={{ width: "200px" }}
      />
      <Dropdown
        value={allFilters.filters.slS_CODE}
        options={salesmen}
        onChange={(e) => handleInputChange(e, "slS_CODE")}
        filter
        placeholder="Təmsilçi"
        showClear
        style={{ width: "200px" }}
      />
      <Dropdown
        value={allFilters.filters.doC_TYPE}
        options={docTypeOptions}
        onChange={(e) => handleInputChange(e, "doC_TYPE")}
        filter
        placeholder="Sənəd tipi"
        showClear
        style={{ width: "200px" }}
      />
      <Calendar
        value={beginDate}
        onChange={(e) => handleDateChange(e, "begin")}
        placeholder="Start Date"
        className="search-input"
        dateFormat="yy-mm-dd"
        showIcon
        style={{ width: "200px" }}
      />
      <Calendar
        value={endDate}
        onChange={(e) => handleDateChange(e, "end")}
        placeholder="End Date"
        className="search-input"
        dateFormat="yy-mm-dd"
        showIcon
        style={{ width: "200px" }}
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
