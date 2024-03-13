
import { useRef } from 'react';

import { Ripple } from 'primereact/Ripple';
import { StyleClass } from 'primereact/StyleClass';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import Logo from '../../assets/images/logo.svg'
export default function HeadlessDemo() {
  const btnRef1 = useRef(null);
  const btnRef2 = useRef(null);
  const btnRef4 = useRef(null);



  return (
    <Wrapper>
      <div className="min-h-screen flex relative lg:static surface-ground">
        <div id="app-sidebar-2" className="surface-section h-screen hidden lg:block flex-shrink-0 absolute lg:static left-0 top-0 z-1 border-right-1 surface-border select-none" style={{ width: '100%' }}>
          <div className="flex flex-column h-full">
            <div className="flex align-items-center justify-content-between px-4 pt-3 flex-shrink-0">
              <span className="inline-flex align-items-center gap-2">
              <img src={Logo} alt="Logo" width={30} />

                <span className="font-semibold text-2xl text-primary">Tinda App</span>
              </span>

            </div>
            <div className="overflow-y-auto">
              <ul className="list-none p-3 m-0">
                <li>
                  <StyleClass nodeRef={btnRef1} selector="@next" enterClassName="hidden" enterActiveClassName="slidedown" leaveToClassName="hidden" leaveActiveClassName="slideup">
                    <div ref={btnRef1} className="p-ripple p-3 flex align-items-center justify-content-between text-600 cursor-pointer">
                      <span className="font-medium">ESD</span>
                      <i className="pi pi-chevron-down"></i>
                      <Ripple />
                    </div>
                  </StyleClass>
                  <ul className="list-none p-0 m-0 overflow-hidden">
                    <li>
                      <NavLink to={"/dashboard/income"}  style={{textDecoration:"none"}}  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                        <i className="pi pi-inbox
mr-2"></i>
                        <span className="font-medium">Gələnlər</span>
                        <Ripple />
                      </NavLink>
                    </li>


                    <li>
                      <NavLink to={"/dashboard/outgoing"} style={{textDecoration:"none"}} className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                        <i className="pi pi-send
mr-2"></i>
                        <span className="font-medium">Göndərilənlər</span>
                        <Ripple />
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to={"/dashboard/history"} style={{textDecoration:"none"}}   className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 transition-duration-150 transition-colors w-full">
                        <i className="pi pi-history
mr-2"></i>
                        <span className="font-medium" >Tarixçə</span>
                        
                        <Ripple />
                      </NavLink>
                    </li>


                  </ul>
                </li>
              </ul>
              <ul className="list-none p-3 m-0">
                <li>
                  <StyleClass nodeRef={btnRef4} selector="@next" enterClassName="hidden" enterActiveClassName="slidedown" leaveToClassName="hidden" leaveActiveClassName="slideup">
                    <div ref={btnRef4} className="p-ripple p-3 flex align-items-center justify-content-between text-600 cursor-pointer">
                      <span className="font-medium">Admin</span>
                      <i className="pi pi-chevron-down"></i>
                      <Ripple />
                    </div>
                  </StyleClass>
                  <ul className="list-none p-0 m-0 overflow-hidden">


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
                          <NavLink to={"/dashboard/admin/esd/doctype"}  style={{textDecoration:"none"}} className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
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
`