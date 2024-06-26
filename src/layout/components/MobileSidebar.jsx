
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/Logo2.png";
import { Button } from "primereact/button";
import { PanelMenu } from "primereact/panelmenu";
import { GET_USER_MENUS } from '../../features/layout/services/api';
import menuSlice from '../../features/layout/menuSlice';
import 'primeicons/primeicons.css';
import {
    setData,
    setError,
    setIsLoading,
} from "../../features/layout/menuSlice";
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from "react";
import { useSelector } from "react-redux";


export default function MobileSidebar({ setIsShowMobileMenu }) {

    const navigate = useNavigate()
    const changeRouteAndHideMobileMenu = (path) => {
        navigate(path)
        setIsShowMobileMenu(false)

    }

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const toast = useRef(null);
    const [data, setData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const { userData } = useSelector((state) => state.loginSlice);
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await GET_USER_MENUS();
            setData(res.data);
            setError(false);
        } catch (error) {
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

    const transformData = (data) => {
        const transformItems = (items) => {
            return items.map(item => {
                const transformedItem = {
                    label: item.label,
                    icon: item.icon,
                    items: item.items ? transformItems(item.items) : []
                };
                if (item.link !== '#') {
                    transformedItem.command = () => changeRouteAndHideMobileMenu(item.link);
                }
                return transformedItem;
            });
        };

        return transformItems(data);
    };

    const items = transformData(data);
    return (
        <MobileWrapper>
            <Header>
                <img src={Logo} alt="Logo" width={30} />
                <Button icon="pi pi-times" rounded text aria-label="Close" onClick={() => setIsShowMobileMenu(false)} />

            </Header>
            <PanelMenu model={items} multiple />

        </MobileWrapper>
    );
}

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 24px 24px;

`;

const MobileWrapper = styled.div`
  animation: slideLeft 0.3s  ease-in-out;
  width: 90%;
  height: 100vh;
  overflow: auto;
  z-index: 99999;
  position: absolute;
  flex-direction: column;
  top: 0;
  left: 0;
  background-color: #fff;
  border-right: 1px solid #ededed;
  display: none;
  @media (max-width:992px){
  display:flex;
  flex-direction: column;
  gap: 12px;
}

@keyframes slideLeft {
    from{
        opacity: 0;
        transform: translateX(-100%);
    }
    to{
        opacity: 1;
        transform: translateX(0%);
    }
    
}

`;
