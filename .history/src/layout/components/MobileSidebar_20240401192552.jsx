import { useRef } from "react";

import { Ripple } from "primereact/Ripple";
import { StyleClass } from "primereact/StyleClass";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import Logo from "../../assets/images/Logo2.png";
import { Button } from "primereact/button";
import { PanelMenu } from "primereact/panelmenu";

export default function MobileSidebar() {
    const items = [

        {  label: 'Dashboard',
       },
        {
            label: 'ESD',
            items: [
                {
                    label: 'Gələnlər',
                    icon: 'pi pi-inbox',
                  
                },
                {
                    label: 'Göndərilənlər',
                    icon: 'pi pi-send',
                  
                },  {
                    label: 'Tarixçə',
                    icon: 'pi pi-history',
                  
                }
            ]
        },
        {
            label: 'Admin',
            icon: 'pi pi-cloud',
            items: [
                {
                    label: 'Upload',
                    icon: 'pi pi-cloud-upload'
                },
                {
                    label: 'Download',
                    icon: 'pi pi-cloud-download'
                },
                {
                    label: 'Sync',
                    icon: 'pi pi-refresh'
                }
            ]
        },
        {
            label: 'Devices',
            icon: 'pi pi-desktop',
            items: [
                {
                    label: 'Phone',
                    icon: 'pi pi-mobile'
                },
                {
                    label: 'Desktop',
                    icon: 'pi pi-desktop'
                },
                {
                    label: 'Tablet',
                    icon: 'pi pi-tablet'
                }
            ]
        }
    ];
  return (
    <MobileWrapper>
      <Header>
        <img src={Logo} alt="Logo" width={30} />
      <Button icon="pi pi-times" rounded text  aria-label="Cancel" />

      </Header>
      <PanelMenu model={items}  />

    </MobileWrapper>
  );
}

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
`;

const MobileWrapper = styled.div`
  padding: 24px 24px;

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
  gap: 48px;
}

`;