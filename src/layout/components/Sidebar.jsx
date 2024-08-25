
import { useRef } from 'react';
import 'primeicons/primeicons.css';
import { Ripple } from 'primereact/Ripple';
import styled, { keyframes } from 'styled-components';

import { NavLink } from 'react-router-dom';
import Logo from '../../assets/images/Logo2.png';
import { useSelector } from "react-redux";
import MenuItem from './MenuItem';
import {GET_USER_MENUS} from '../../features/layout/services/api';

import {
  setData,
  setError,
  setIsLoading,
} from "../../features/layout/menuSlice";
import { useState } from 'react';
import { useEffect } from 'react';

export default function HeadlessDemo() {


  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const toast = useRef(null);
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const { userData } = useSelector((state) => state.loginSlice);
  const userType = userData ? userData.userType : null;
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



  return (
    <Wrapper>
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
        `}
      </style>
      <div className="min-h-screen flex relative lg:static surface-ground">
        <div id="app-sidebar-2" className="surface-section h-screen hidden lg:block flex-shrink-0 absolute lg:static left-0 top-0 z-1 border-right-1 surface-border select-none" style={{ width: '100%' }}>
          <div className="flex flex-column h-full">
            <div className="flex align-items-center justify-content-between px-4 pt-3 flex-shrink-0">
              <span className="inline-flex align-items-center gap-2">
                <img src={Logo} alt="Logo"  className='logo' />

                <span className="font-bold text-3xl label-name" style={{ color: "#339967" }}>Tinda</span>
              </span>

            </div>
            <ul className="list-none p-3 m-0 pb-0 mt-3">
              {data.map(item => (
                <MenuItem key={item.id} item={item} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
const fadeIn = keyframes`
 0% { opacity: 0;  }
 100% { opacity:1; }

`

const Wrapper = styled.div`
width: 80px;
word-break:none;
overflow:hidden;
height: 100%;
transition:0.3s all ease-in-out;
.menu-ul{
  padding-left:1rem !important;
}
.label-name{
  display:none !important;
  animation: ${fadeIn} 1s all;
}
.logo{
  width:30px;
}
&:hover{
  .logo{
    width:30px !important;
  }
  width:360px;
  .label-name{
  display:inline !important;
  animation: ${fadeIn} 1s all;
}
.menu-ul{
  padding-left:0 !important;
}
}
/* &  span{
  display:none !important;
} */

@media (max-width:992px){
  display:none;
}
`

