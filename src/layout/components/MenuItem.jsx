import React from 'react';
import { NavLink } from 'react-router-dom';
import { StyleClass } from 'primereact/StyleClass';
import { Ripple } from 'primereact/Ripple';

const MenuItem = ({ item }) => {
  const hasChildren = item.items && item.items.length > 0;
  const btnRef = React.useRef(null);

  return (
    <li>
      {hasChildren ? (
        <>
          <StyleClass nodeRef={btnRef} selector="@next" enterClassName="hidden" enterActiveClassName="slidedown" leaveToClassName="hidden" leaveActiveClassName="slideup">
            <div ref={btnRef} className="p-ripple p-3 flex align-items-center justify-content-between text-600 cursor-pointer">
              <span className="font-medium">
                <i className={`${item.icon} mr-2`}></i>{item.label}
              </span>
              <i className="pi pi-chevron-down"></i>
              <Ripple />
            </div>
          </StyleClass>
          <ul className="list-none p-0 m-0 pl-3 overflow-hidden hidden">
            {item.items.map(subItem => (
              <MenuItem key={subItem.id} item={subItem} />
            ))}
          </ul>
        </>
      ) : (
        <NavLink to={item.link} style={{ textDecoration: "none" }} className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 transition-duration-150 transition-colors w-full">
          <i className={`${item.icon} mr-2`}></i>
          <span className="font-medium">{item.label}</span>
          <Ripple />
        </NavLink>
      )}
    </li>
  );
};

export default MenuItem;