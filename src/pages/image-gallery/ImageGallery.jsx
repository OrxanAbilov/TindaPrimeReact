import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Paginator } from 'primereact/paginator';
import { Dialog } from 'primereact/dialog';
import './ImageGallery.css'; // Ensure you have this CSS file

const ImageGallery = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [firstVisit, setFirstVisit] = useState(0);
    const [firstChecklist, setFirstChecklist] = useState(0);
    const [firstDebtCheck, setFirstDebtCheck] = useState(0);
    const rows = 3;

    const [selectedImage, setSelectedImage] = useState(null);
    const [visible, setVisible] = useState(false);

    const visitImages = [
        { id: 1, src: 'http://91.135.242.233:1816/VisitImages/eef3b4e9-d5ab-4e53-8a03-c74443817bba.jpg', alt: 'Visit 1', title: 'Visit Image 1' },
        { id: 2, src: 'http://91.135.242.233:1816/VisitImages/a7bc30b8-eef8-46ed-aadf-6ec5b7e3e03c.jpg', alt: 'Visit 2', title: 'Visit Image 2' },
        { id: 7, src: 'http://91.135.242.233:1816/VisitImages/23eaad99-2f02-4ca4-8c48-d9b608f02d7f.jpg', alt: 'Visit 1', title: 'Visit Image 1' },
        { id: 8, src: 'https://images.pexels.com/photos/210647/pexels-photo-210647.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Visit 2', title: 'Visit Image 2' },
        { id: 9, src: 'https://images.pexels.com/photos/3184404/pexels-photo-3184404.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Visit 1', title: 'Visit Image 1' },
        { id: 10, src: 'https://images.pexels.com/photos/210647/pexels-photo-210647.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Visit 2', title: 'Visit Image 2' },
        { id: 11, src: 'https://images.pexels.com/photos/3184404/pexels-photo-3184404.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Visit 1', title: 'Visit Image 1' },
        { id: 12, src: 'https://images.pexels.com/photos/210647/pexels-photo-210647.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Visit 2', title: 'Visit Image 2' },
    ];

    const checklistImages = [
        { id: 3, src: 'https://images.pexels.com/photos/210158/pexels-photo-210158.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Checklist 1', title: 'Checklist Image 1' },
        { id: 4, src: 'https://images.pexels.com/photos/2333745/pexels-photo-2333745.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Checklist 2', title: 'Checklist Image 2' },
    ];

    const debtCheckImages = [
        { id: 5, src: 'https://images.pexels.com/photos/3746273/pexels-photo-3746273.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'DebtCheck 1', title: 'DebtCheck Image 1' },
        { id: 6, src: 'https://images.pexels.com/photos/4386336/pexels-photo-4386336.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'DebtCheck 2', title: 'DebtCheck Image 2' },
    ];

    const handlePageChange = (category, event) => {
        switch (category) {
            case 'visit':
                setFirstVisit(event.first);
                break;
            case 'checklist':
                setFirstChecklist(event.first);
                break;
            case 'debtCheck':
                setFirstDebtCheck(event.first);
                break;
            default:
                break;
        }
    };

    const showImageDialog = (image) => {
        setSelectedImage(image);
        setVisible(true);
    };

    const hideImageDialog = () => {
        setVisible(false);
    };

    const renderImages = (images, first) => {
        return images.slice(first, first + rows).map((image) => (
            <div key={image.id} className="image-item" onClick={() => showImageDialog(image)}>
                <img src={image.src} alt={image.alt} className="image-thumbnail" />
                <div className="image-title">{image.title}</div>
            </div>
        ));
    };

    return (
        <div className="image-gallery">
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="Visit Images">
                    <div className="images-container">
                        {renderImages(visitImages, firstVisit)}
                    </div>
                    <Paginator
                        first={firstVisit}
                        rows={rows}
                        totalRecords={visitImages.length}
                        onPageChange={(e) => handlePageChange('visit', e)}
                        template="PrevPageLink PageLinks NextPageLink"
                    />
                </TabPanel>
                <TabPanel header="Checklist Images">
                    <div className="images-container">
                        {renderImages(checklistImages, firstChecklist)}
                    </div>
                    <Paginator
                        first={firstChecklist}
                        rows={rows}
                        totalRecords={checklistImages.length}
                        onPageChange={(e) => handlePageChange('checklist', e)}
                        template="PrevPageLink PageLinks NextPageLink"
                    />
                </TabPanel>
                <TabPanel header="DebtCheck Images">
                    <div className="images-container">
                        {renderImages(debtCheckImages, firstDebtCheck)}
                    </div>
                    <Paginator
                        first={firstDebtCheck}
                        rows={rows}
                        totalRecords={debtCheckImages.length}
                        onPageChange={(e) => handlePageChange('debtCheck', e)}
                        template="PrevPageLink PageLinks NextPageLink"
                    />
                </TabPanel>
            </TabView>

            {selectedImage && (
                <Dialog header={selectedImage.title} visible={visible} style={{ width: '50vw' }} onHide={hideImageDialog}>
                    <img src={selectedImage.src} alt={selectedImage.alt} style={{ width: '100%' }} />
                </Dialog>
            )}
        </div>
    );
};

export default ImageGallery;
