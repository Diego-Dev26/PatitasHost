import React, { useState } from "react";
import { Bars3Icon } from "@heroicons/react/20/solid";
import "./SideMenu.css";
import { Link } from "react-router-dom";
import Icon from "../Icon";

// Función helper para unir clases
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Componente para cada ítem del menú
const MenuItem = ({ item, isExpanded, store }) => {
  const [isOpen, setIsOpen] = useState(false);

  const isChildActive = (children) =>
    children.some((child) => verifyRuta(child));

  function verifyRuta(child) {
    if (child.href[0] !== "/") {
      return location.pathname
        .split("/")
        .slice(0, -1)
        .join("/")
        .includes("/dashboard/" + child.href.split("/").slice(0, -1).join("/"));
    }
    return location.pathname === child.href;
  }

  return (
    <div className="ml-3 mb-4">
      {!item.children
        ? // Ítem sin hijos
          store.checkPermissions(item.permissions) && (
            <Link
              className={`flex items-center cursor-alias ${
                verifyRuta(item) ? "rounded-l-full active" : ""
              }`}
              to={item.href}
            >
              <div className="p-2">
                <Icon
                  name={item.icon}
                  className="h-6 w-6 border-r-2 rounded-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                {isExpanded && (
                  // Añadida clase label aquí
                  <span className="label block overflow-hidden whitespace-nowrap ml-2 transition-all duration-300">
                    {item.name}
                  </span>
                )}
              </div>
            </Link>
          )
        : // Ítem con hijos
          store.checkPermissionsMenu(item.permissions) && (
            <div>
              <div
                className={`flex items-center cursor-pointer transform transition-all duration-150 ease-in-out active:scale-95 ${
                  isChildActive(item.children) ? "rounded-l-full active" : ""
                }`}
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="p-2">
                  <Icon name={item.icon} className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  {isExpanded && (
                    // Aquí también label en título del grupo
                    <span className="label flex items-center justify-between overflow-hidden whitespace-nowrap ml-2">
                      {item.name}
                      <Icon
                        name={isOpen ? "ChevronDownIcon" : "ChevronRightIcon"}
                        className="h-5 mr-2"
                      />
                    </span>
                  )}
                </div>
              </div>
              <div
                className={classNames("submenu", isOpen ? "max-h-40" : "")}
                style={{ transition: "max-height 0.3s ease-in-out" }}
              >
                {item.children.map((child) =>
                  store.checkPermissions(child.permissions) ? (
                    <Link
                      key={child.href}
                      className={`flex items-center p-2 cursor-alias ${
                        verifyRuta(child) ? "rounded-l-full active" : ""
                      }`}
                      to={child.href}
                    >
                      <Icon
                        name={child.icon}
                        className="h-5 w-5 mr-2 text-white border-r-2 rounded-full"
                      />
                      {isExpanded && (
                        <span className="label block overflow-hidden whitespace-nowrap ml-2">
                          {child.name}
                        </span>
                      )}
                    </Link>
                  ) : null
                )}
              </div>
            </div>
          )}
      <div className="border-top-right-sub" />
    </div>
  );
};

const SideMenu = ({ store, navigation = [], adminNavigation = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [initFixed, setInitFixed] = useState(false);

  const handleMouseEnter = () => {
    if (!isFixed && !initFixed) setIsExpanded(true);
  };
  const handleMouseLeave = () => {
    if (!isFixed && !initFixed) setIsExpanded(false);
  };
  const toggleFixedMenu = () => {
    setInitFixed(true);
    setIsExpanded(false);
    setTimeout(() => {
      setIsFixed(!isFixed);
      setIsExpanded(isFixed);
      setInitFixed(false);
    }, 300);
  };

  return (
    <div
      className={`no-print ${
        isFixed ? "w-65" : "w-14"
      } transition-width duration-300 ease-in-out`}
    >
      <div
        className={classNames("side-menu", isExpanded && "expanded")}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Header hamburguesa */}
        <div className="flex items-center h-12 border-b border-white/30">
          <Bars3Icon
            data-testid="bars-icon"
            onClick={toggleFixedMenu}
            className="h-8 w-8 ml-4 text-white"
          />
        </div>
        {/* Items de navegación */}
        <div className="my-2">
          {navigation.map((item) => (
            <MenuItem
              key={item.name}
              item={item}
              isExpanded={isExpanded}
              store={store}
            />
          ))}
        </div>
        <div className="border-top-right" />
        {/* Items de admin */}
        {store?.user?.is_admin && (
          <div>
            {adminNavigation.map((item) => (
              <MenuItem
                key={item.name}
                item={item}
                isExpanded={isExpanded}
                store={store}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SideMenu;
