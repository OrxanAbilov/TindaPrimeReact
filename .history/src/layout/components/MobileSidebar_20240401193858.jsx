import { useRef } from "react";

import { Ripple } from "primereact/Ripple";
import { StyleClass } from "primereact/StyleClass";
import styled from "styled-components";
import {  useNavigate } from "react-router-dom";
import Logo from "../../assets/images/Logo2.png";
import { Button } from "primereact/button";
import { PanelMenu } from "primereact/panelmenu";

export default function MobileSidebar({setIsShowMobileMenu}) {
    const navigate = useNavigate()
    const items = [

        {  label: 'Dashboard',
            icon: 'pi pi-home',
            command: ()=>navigate("/dashboard")
            
       },
        {
            label: 'ESD',
            icon: 'pi pi-book',
            items: [
                {
                    label: 'Gələnlər',
                    icon: 'pi pi-inbox',
                    command: ()=>navigate("esd/income")

                  
                },
                {
                    label: 'Göndərilənlər',
                    icon: 'pi pi-send',
                    command: ()=>navigate("esd/outgoing")

                  
                },  {
                    label: 'Tarixçə',
                    icon: 'pi pi-history',
                    command: ()=>navigate("esd/history")

                  
                }
            ]
        },
        {
            label: 'Admin',
            icon: 'pi pi-user-edit',
            items: [
                {
                    label: 'ESD',
                    icon: 'pi pi-book',
                    items:[{
                        label: 'Sənəd tipi',
                    icon: 'pi pi-file',
                    command: ()=>navigate("admin/esd/doctype")

                    }

                    ]
                },
             
            ]
        },
      
    ];
  return (
    <MobileWrapper>
      <Header>
        <img src={Logo} alt="Logo" width={30} />
      <Button icon="pi pi-times" rounded text  aria-label="Close" onClick={()=>setIsShowMobileMenu(false)} />

      </Header>
      <PanelMenu model={items}  multiple />

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

`;
