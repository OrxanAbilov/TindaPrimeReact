import { useRef, useState, useEffect } from 'react';
import 'primeicons/primeicons.css';
import { Ripple } from 'primereact/Ripple';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/Logo2.png';
import { useSelector } from "react-redux";
import MenuItem from './MenuItem';
import { GET_USER_MENUS } from '../../features/layout/services/api';

export default function HeadlessDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [showParentMenus, setShowParentMenus] = useState(false);
  const [activeParentId, setActiveParentId] = useState(null);
  const [showArrow, setShowArrow] = useState(false);
  const toast = useRef(null);
  const { userData } = useSelector((state) => state.loginSlice);
  const userType = userData ? userData.userType : null;
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await GET_USER_MENUS();
      setData(res.data);
      setError(false);
      // Set the first parent menu and its submenu as active on initial load
      if (res.data.length > 0 && res.data[0].items && res.data[0].items.length > 0) {
        setActiveParentId(res.data[0].id);
        setShowParentMenus(false);
      }
    } catch (error) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleParentMenus = () => {
    setShowParentMenus(!showParentMenus);
  };

  const handleParentClick = (item) => {
    if (item.items && item.items.length > 0) {
      setActiveParentId(item.id);
      setShowParentMenus(false);
    } else if (item.link && item.link !== '#') {
      navigate(`/${item.link}`);
    } else {
      setActiveParentId(item.id);
      setShowParentMenus(true);
    }
  };

  const handleMouseEnter = () => {
    setShowArrow(true);
  };

  const handleMouseLeave = () => {
    setShowArrow(false);
    setShowParentMenus(false);
  };

  return (
    <Wrapper onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <style>
        {`
          .active {
            background-color: #339967;
          }
          .active:hover {
            background-color: #30b474;
          }
          a:hover {
            background-color: rgb(239, 238, 238);
          }
          .arrow-button {
            display: ${showArrow ? 'flex' : 'none'};
            align-items: center;
            justify-content: center;
            position: absolute;
            left: -17px;
            top: 50%;
            transform: translateY(-50%);
            width: 40px;
            height: 40px;
            background-color: #339967;
            color: white;
            border-radius: 50%;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            transition: background-color 0.3s, box-shadow 0.3s;
            z-index: 20;
          }
          .arrow-button:hover {
            background-color: #30b474;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
          }
          .arrow-button i {
            font-size: 1.5rem;
          }
          .sidebar-hidden {
            transform: translateX(-100%);
            transition: transform 0.3s ease-in-out;
          }
          .sidebar-visible {
            transform: translateX(0);
            transition: transform 0.3s ease-in-out;
          }
          .parent-menus {
            position: absolute;
            left: 0;
            top: 0;
            width: 220px;
            height: 100%;
            background-color: white;
            border-right: 1px solid #ddd;
            transform: translateX(${showParentMenus ? '0' : '-100%'});
            transition: transform 0.3s ease-in-out;
            z-index: 10;
          }
        `}
      </style>
      <div className="min-h-screen flex relative lg:static surface-ground">
        <div id="app-sidebar-2" className="surface-section h-screen hidden lg:block flex-shrink-0 absolute lg:static left-0 top-0 z-1 border-right-1 surface-border select-none" style={{ width: '100%' }}>
          <div className="flex flex-column h-full relative">
            <div className="flex align-items-center justify-content-between px-4 pt-3 flex-shrink-0">
              <span className="inline-flex align-items-center gap-2">
                <img src={Logo} alt="Logo" width={40} />
                <span className="font-bold text-3xl" style={{ color: "#339967" }}>Tinda</span>
              </span>
            </div>
            {activeParentId && (
              <ul className="list-none p-3 m-0 pb-0 mt-3">
                {data.find(item => item.id === activeParentId).items.map(subItem => (
                  <MenuItem key={subItem.id} item={subItem} />
                ))}
              </ul>
            )}
            <div className="arrow-button" onClick={handleToggleParentMenus}>
              <i className="pi pi-arrow-right"></i>
            </div>
            <div className={`parent-menus ${showParentMenus ? 'sidebar-visible' : 'sidebar-hidden'}`}>
              <ul className="list-none p-3 m-0 pb-0 mt-3">
                {data.map(item => (
                  <li key={item.id}>
                    <div onClick={() => handleParentClick(item)} className="p-ripple p-3 flex align-items-center justify-content-between text-600 cursor-pointer">
                      <span className="font-medium">
                        <i className={`${item.icon} mr-2`}></i>{item.label}
                      </span>
                      <Ripple />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 360px;
  height: 100%;
  @media (max-width: 992px) {
    display: none;
  }
  position: relative;
`;
