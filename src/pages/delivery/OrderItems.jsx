import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GET_ORDER_ITEMS } from '../../features/delivery/services/api';
import { Card } from 'primereact/card';
import './OrderItems.css';

const OrderItems = () => {
    const [searchParams] = useSearchParams();
    const [orderItems, setOrderItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const ficheno = searchParams.get('ficheno');

    useEffect(() => {
        if (ficheno) {
            fetchOrderItems(ficheno);
        }
    }, [ficheno]);

    useEffect(() => {
        filterOrderItems(searchTerm);
    }, [searchTerm, orderItems]);

    const fetchOrderItems = async (ficheno) => {
        setLoading(true);
        try {
            const response = await GET_ORDER_ITEMS({ ficheno });
            setOrderItems(response.data.data);
            setFilteredItems(response.data.data); // Set filteredItems initially
        } catch (error) {
            console.error('Error fetching order items:', error);
        }
        setLoading(false);
    };

    const filterOrderItems = (term) => {
        if (!term) {
            setFilteredItems(orderItems);
        } else {
            const lowerCaseTerm = term.toLowerCase();
            const filtered = orderItems.filter((item) =>
                (item.iteM_NAME && item.iteM_NAME.toLowerCase().includes(lowerCaseTerm)) ||
                (item.iteM_CODE && item.iteM_CODE.toLowerCase().includes(lowerCaseTerm))
            );
            setFilteredItems(filtered);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div style={{width: '100%' }}>
            <div className="search-container" style={{ marginBottom: '20px', textAlign: 'center'}}>
                <input
                    type="text"
                    placeholder="Mal adı və ya kodu ilə axtarış..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                    style={{ padding: '10px', width: '300px', fontSize: '16px' }}
                />
            </div>

            <div className="card-grid">
                {loading ? (
                    <p>Yüklənir...</p>
                ) : (
                    filteredItems.map((item, index) => (
                        <Card 
                            key={index}
                            title={`Mal kodu: ${item.iteM_CODE || 'Bilinmir'}`}
                            subTitle={`Mal adı: ${item.iteM_NAME || 'Bilinmir'}`}
                            className="order-item-card"
                            style={{textAlign: 'center'}}
                        >
                            <div className="card-content">
                            <div className="card-row">
                                <p>Say: <strong>{item.amount.toFixed(2)}  {item.uniT_CODE}</strong></p>
                            </div>
                            <div className="card-row">
                                <p>Qiymət: <span style={{color: '#339967'}}><strong>{item.price.toFixed(2)} ₼</strong></span></p>
                                <p>Endirim: <span style={{color: '#c4ad00'}}><strong>{item.discount.toFixed(2)} ₼</strong></span></p>
                            </div>
                            <div className="card-row">
                                <p>Net: <strong>{item.nettotal.toFixed(2)} ₼</strong></p>
                                <p>Gross: <strong>{item.grosstotal.toFixed(2)} ₼</strong></p>
                            </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default OrderItems;
