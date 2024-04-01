
import { useRef } from 'react';

import { Ripple } from 'primereact/Ripple';
import { StyleClass } from 'primereact/StyleClass';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import Logo from '../../assets/images/Logo2.png';
import { useSelector } from "react-redux";

export default function MobileSidebar() {
  const btnRef2 = useRef(null);
  const btnRef3 = useRef(null);
  const btnRef4 = useRef(null);

  const { userData } = useSelector((state) => state.loginSlice);
  const userType = userData ? userData.userType : null;

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
              <img src={Logo} alt="Logo" width={40} />

                <span className="font-bold text-3xl" style={{color: "#339967"}}>Tinda</span>
              </span>

            </div>
            <div className="overflow-y-auto">
              <ul className="list-none p-3 m-0 pb-0 mt-3">
              <li>
                  <NavLink to={"/dashboard"} style={{textDecoration:"none"}} className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 transition-duration-150 transition-colors w-full">
                    <span className="font-medium"><i className="pi pi-home mr-2"></i>Dashboard</span>
                    <Ripple />
                  </NavLink>
                </li>
                <li>
                  <StyleClass nodeRef={btnRef3} selector="@next" enterClassName="hidden" enterActiveClassName="slidedown" leaveToClassName="hidden" leaveActiveClassName="slideup">
                    <div ref={btnRef3} className="p-ripple p-3 flex align-items-center justify-content-between text-600 cursor-pointer">
                      <span className="font-medium"><i className="pi pi-book mr-2"></i>ESD</span>
                      <i className="pi pi-chevron-down"></i>
                      <Ripple />
                    </div>
                  </StyleClass>
                  <ul className="list-none p-0 m-0 pl-3 overflow-hidden hidden">
                    <li>
                      <NavLink to={"/esd/income"}  style={{textDecoration:"none"}}  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 transition-duration-150 transition-colors w-full">
                        <i className="pi pi-inbox
mr-2"></i>
                        <span className="font-medium">Gələnlər</span>
                        <Ripple />
                      </NavLink>
                    </li>


                    <li>
                      <NavLink to={"/esd/outgoing"} style={{textDecoration:"none"}} className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 transition-duration-150 transition-colors w-full">
                        <i className="pi pi-send
mr-2"></i>
                        <span className="font-medium">Göndərilənlər</span>
                        <Ripple />
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to={"/esd/history"} style={{textDecoration:"none"}}   className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 transition-duration-150 transition-colors w-full">
                        <i className="pi pi-history
mr-2"></i>
                        <span className="font-medium" >Tarixçə</span>
                        
                        <Ripple />
                      </NavLink>
                    </li>


                  </ul>
                </li>
              </ul>
              {userType === 1 && (
                <ul className="list-none p-3 m-0 pt-0">
                  <li>
                    <StyleClass nodeRef={btnRef4} selector="@next" enterClassName="hidden" enterActiveClassName="slidedown" leaveToClassName="hidden" leaveActiveClassName="slideup">
                      <div ref={btnRef4} className="p-ripple p-3 flex align-items-center justify-content-between text-600 cursor-pointer">
                        <span className="font-medium"><i className="pi pi-user-edit mr-2"></i>Admin</span>
                        <i className="pi pi-chevron-down"></i>
                        <Ripple />
                      </div>
                    </StyleClass>
                    <ul className="list-none pl-3 p-0 m-0 overflow-hidden hidden">
                      <li>
                        <StyleClass nodeRef={btnRef2} selector="@next" enterClassName="hidden" enterActiveClassName="slidedown" leaveToClassName="hidden" leaveActiveClassName="slideup">
                          <a ref={btnRef2} className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                            <i className="pi pi-book
  mr-2"></i>
                            <span className="font-medium">ESD</span>
                            <i className="pi pi-chevron-down ml-auto mr-1"></i>
                            <Ripple />
                          </a>
                        </StyleClass>
                        <ul className="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out">
                          <li>
                            <NavLink to={"/admin/esd/doctype"}  style={{textDecoration:"none"}} className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 transition-duration-150 transition-colors w-full">
                              <i className="pi pi-file mr-2"></i>
                              <span className="font-medium">Sənəd tipi</span>
                              <Ripple />
                            </NavLink>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              )}

            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}


const Wrapper = styled.div`
width: 360px;
height: 100%;
@media (max-width:992px){
  display:flex;
}
`