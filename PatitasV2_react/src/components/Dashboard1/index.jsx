import { Fragment, useContext, useEffect, useState } from "react";
import { Dialog, Menu, Transition, Disclosure } from "@headlessui/react";
import { Link, Outlet } from "react-router-dom";
import { StoreContext } from "@/context/store";
import Logo from "@/assets/logo.png";
import {
  XMarkIcon,
  Bars3CenterLeftIcon,
  BellIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid";
import Icon from "@/components/Icon";
import "./Dashboard1.css";
import Notifications from "../Notifications";
import { navigation, adminNavigation } from "@/router/Menu";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

navigation.forEach((element) => {
  if (element.children) {
    var permissions = [];
    element.children.forEach((element2) => {
      permissions.push(element2.permissions);
    });
    element.permissions = permissions;
  }
});
adminNavigation.forEach((element) => {
  if (element.children) {
    var permissions = [];
    element.children.forEach((element2) => {
      permissions.push(element2.permissions);
    });
    element.permissions = permissions;
  }
});

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false); //notifications
  const store = useContext(StoreContext);

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Notifications open={open} setOpen={setOpen} />

        {/* Mobile Sidebar */}
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden no-print"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-blue-700 pt-5 pb-4">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex flex-shrink-0 items-center px-4">
                    <img className="h-24 w-auto" src={Logo} alt="logo" />
                  </div>
                  <nav
                    className="mt-5 h-full flex-shrink-0 divide-y divide-blue-800 overflow-y-auto"
                    aria-label="Sidebar"
                  >
                    <div className="space-y-1 px-2">
                      <nav className="flex-1 space-y-1" aria-label="Sidebar">
                        {navigation.map((item) =>
                          !item.children &&
                          store.checkPermissions(item?.permissions) ? (
                            <div key={item.name}>
                              <Link
                                to={item.href}
                                className={classNames(
                                  item.current
                                    ? "bg-blue-800 text-white"
                                    : "text-blue-100 hover:text-white hover:bg-blue-600",
                                  "group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-150"
                                )}
                              >
                                <Icon
                                  name={item.icon}
                                  className="mr-4 h-6 w-6 flex-shrink-0 text-blue-200"
                                  aria-hidden="true"
                                />
                                {item.name}
                              </Link>
                            </div>
                          ) : (
                            store.checkPermissionsMenu(item?.permissions) && (
                              <Disclosure
                                as="div"
                                key={item.name}
                                className="space-y-1"
                              >
                                {({ open }) => (
                                  <>
                                    <Disclosure.Button
                                      className={classNames(
                                        item.current
                                          ? "bg-blue-800 text-white"
                                          : "text-blue-100 hover:text-white hover:bg-blue-600",
                                        "group w-full flex items-center pl-2 pr-1 py-2 text-left font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-150"
                                      )}
                                    >
                                      <Icon
                                        name={item.icon}
                                        className={classNames(
                                          open ? "text-white" : "text-gray-300",
                                          "mr-4 h-6 w-6 flex-shrink-0 text-blue-200 transition-colors duration-150"
                                        )}
                                        aria-hidden="true"
                                      />
                                      <span className="flex-1">
                                        {item.name}
                                      </span>
                                      <ChevronDownIcon
                                        className={classNames(
                                          open
                                            ? "text-gray-400 rotate-180"
                                            : "text-gray-300",
                                          "ml-3 h-5 w-5 flex-shrink-0 transform transition-all duration-200 ease-in-out group-hover:text-white"
                                        )}
                                        aria-hidden="true"
                                      />
                                    </Disclosure.Button>
                                    <Disclosure.Panel className="space-y-1 pl-2">
                                      {item.children.map(
                                        (subItem) =>
                                          store.checkPermissions(
                                            subItem?.permissions
                                          ) && (
                                            <Link
                                              key={subItem.name}
                                              to={subItem.href}
                                              className="block"
                                            >
                                              <Disclosure.Button
                                                as="div"
                                                className="group flex w-full items-center rounded-md py-2 pl-6 pr-2 font-medium text-blue-100 hover:text-white hover:bg-blue-600 transition-colors duration-150"
                                              >
                                                <Icon
                                                  name={subItem.icon}
                                                  className="mr-4 h-5 w-5 flex-shrink-0 text-blue-200 group-hover:text-white transition-colors duration-150"
                                                  aria-hidden="true"
                                                />
                                                {subItem.name}
                                              </Disclosure.Button>
                                            </Link>
                                          )
                                      )}
                                    </Disclosure.Panel>
                                  </>
                                )}
                              </Disclosure>
                            )
                          )
                        )}
                      </nav>
                    </div>

                    {store.user.is_admin && (
                      <div className="mt-6 pt-6">
                        <div className="space-y-1 px-2">
                          <nav
                            className="flex-1 space-y-1"
                            aria-label="Admin Sidebar"
                          >
                            {adminNavigation.map((item) =>
                              !item.children &&
                              store.checkPermissions(item?.permissions) ? (
                                <div key={item.name}>
                                  <Link
                                    to={item.href}
                                    className={classNames(
                                      item.current
                                        ? "bg-blue-800 text-white"
                                        : "text-blue-100 hover:text-white hover:bg-blue-600",
                                      "group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-150"
                                    )}
                                  >
                                    <Icon
                                      name={item.icon}
                                      className="mr-4 h-6 w-6 flex-shrink-0 text-blue-200"
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                  </Link>
                                </div>
                              ) : (
                                store.checkPermissionsMenu(
                                  item?.permissions
                                ) && (
                                  <Disclosure
                                    as="div"
                                    key={item.name}
                                    className="space-y-1"
                                  >
                                    {({ open }) => (
                                      <>
                                        <Disclosure.Button
                                          className={classNames(
                                            item.current
                                              ? "bg-blue-800 text-white"
                                              : "text-blue-100 hover:text-white hover:bg-blue-600",
                                            "group w-full flex items-center pl-2 pr-1 py-2 text-left font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-150"
                                          )}
                                        >
                                          <Icon
                                            name={item.icon}
                                            className={classNames(
                                              open
                                                ? "text-white"
                                                : "text-gray-300",
                                              "mr-4 h-6 w-6 flex-shrink-0 text-blue-200 transition-colors duration-150"
                                            )}
                                            aria-hidden="true"
                                          />
                                          <span className="flex-1">
                                            {item.name}
                                          </span>
                                          <ChevronDownIcon
                                            className={classNames(
                                              open
                                                ? "text-gray-400 rotate-180"
                                                : "text-gray-300",
                                              "ml-3 h-5 w-5 flex-shrink-0 transform transition-all duration-200 ease-in-out group-hover:text-white"
                                            )}
                                            aria-hidden="true"
                                          />
                                        </Disclosure.Button>
                                        <Disclosure.Panel className="space-y-1 pl-2">
                                          {item.children.map(
                                            (subItem) =>
                                              store.checkPermissions(
                                                subItem?.permissions
                                              ) && (
                                                <Link
                                                  key={subItem.name}
                                                  to={subItem.href}
                                                  className="block"
                                                >
                                                  <Disclosure.Button
                                                    as="div"
                                                    className="group flex w-full items-center rounded-md py-2 pl-6 pr-2 font-medium text-blue-100 hover:text-white hover:bg-blue-600 transition-colors duration-150"
                                                  >
                                                    <Icon
                                                      name={subItem.icon}
                                                      className="mr-4 h-5 w-5 flex-shrink-0 text-blue-200 group-hover:text-white transition-colors duration-150"
                                                      aria-hidden="true"
                                                    />
                                                    {subItem.name}
                                                  </Disclosure.Button>
                                                </Link>
                                              )
                                          )}
                                        </Disclosure.Panel>
                                      </>
                                    )}
                                  </Disclosure>
                                )
                              )
                            )}
                          </nav>
                        </div>
                      </div>
                    )}
                  </nav>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Desktop Sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col no-print">
          <div className="flex flex-grow flex-col overflow-y-auto bg-gradient-to-b from-blue-700 to-blue-800 pt-5 pb-4 shadow-xl">
            <div className="flex flex-shrink-0 items-center px-4">
              <img className="h-28 w-auto" src={Logo} alt="logo" />
            </div>
            <nav
              className="mt-6 flex flex-1 flex-col divide-y divide-blue-600 overflow-y-auto"
              aria-label="Sidebar"
            >
              <div className="space-y-1 px-2 pb-4">
                <nav className="flex-1 space-y-1" aria-label="Sidebar">
                  {navigation.map((item) =>
                    !item.children &&
                    store.checkPermissions(item?.permissions) ? (
                      <div key={item.name}>
                        <Link
                          to={item.href}
                          className={classNames(
                            item.current
                              ? "bg-blue-600 text-white shadow-md"
                              : "text-blue-100 hover:text-white hover:bg-blue-600",
                            "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150"
                          )}
                        >
                          <Icon
                            name={item.icon}
                            className={classNames(
                              item.current ? "text-white" : "text-blue-200",
                              "mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-150"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </div>
                    ) : (
                      store.checkPermissionsMenu(item?.permissions) && (
                        <Disclosure
                          as="div"
                          key={item.name}
                          className="space-y-1"
                        >
                          {({ open }) => (
                            <>
                              <Disclosure.Button
                                className={classNames(
                                  item.current
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "text-blue-100 hover:text-white hover:bg-blue-600",
                                  "group w-full flex items-center pl-3 pr-2 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-150"
                                )}
                              >
                                <Icon
                                  name={item.icon}
                                  className={classNames(
                                    open ? "text-white" : "text-blue-200",
                                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-150"
                                  )}
                                  aria-hidden="true"
                                />
                                <span className="flex-1">{item.name}</span>
                                <ChevronDownIcon
                                  className={classNames(
                                    open
                                      ? "text-blue-200 rotate-180"
                                      : "text-blue-200",
                                    "ml-2 h-4 w-4 flex-shrink-0 transform transition-all duration-200 ease-in-out"
                                  )}
                                  aria-hidden="true"
                                />
                              </Disclosure.Button>
                              <Disclosure.Panel className="space-y-1 pl-3 pt-1">
                                {item.children.map(
                                  (subItem) =>
                                    store.checkPermissions(
                                      subItem?.permissions
                                    ) && (
                                      <Link
                                        key={subItem.name}
                                        to={subItem.href}
                                        className="block"
                                      >
                                        <Disclosure.Button
                                          as="div"
                                          className={classNames(
                                            subItem.current
                                              ? "bg-blue-600 text-white"
                                              : "text-blue-100 hover:text-white hover:bg-blue-600",
                                            "group flex items-center rounded-md py-2 pl-7 pr-2 text-sm font-medium transition-colors duration-150"
                                          )}
                                        >
                                          <Icon
                                            name={subItem.icon}
                                            className="mr-3 h-4 w-4 flex-shrink-0 text-blue-200 group-hover:text-white transition-colors duration-150"
                                            aria-hidden="true"
                                          />
                                          {subItem.name}
                                        </Disclosure.Button>
                                      </Link>
                                    )
                                )}
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      )
                    )
                  )}
                </nav>
              </div>

              {store.user.is_admin && (
                <div className="pt-4">
                  <div className="px-3 py-2 text-xs font-semibold text-blue-300 uppercase tracking-wider">
                    Administración
                  </div>
                  <nav
                    className="flex-1 space-y-1 px-2 pb-4"
                    aria-label="Admin Sidebar"
                  >
                    {adminNavigation.map((item) =>
                      !item.children &&
                      store.checkPermissions(item?.permissions) ? (
                        <div key={item.name}>
                          <Link
                            to={item.href}
                            className={classNames(
                              item.current
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-blue-100 hover:text-white hover:bg-blue-600",
                              "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150"
                            )}
                          >
                            <Icon
                              name={item.icon}
                              className={classNames(
                                item.current ? "text-white" : "text-blue-200",
                                "mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-150"
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        </div>
                      ) : (
                        store.checkPermissionsMenu(item?.permissions) && (
                          <Disclosure
                            as="div"
                            key={item.name}
                            className="space-y-1"
                          >
                            {({ open }) => (
                              <>
                                <Disclosure.Button
                                  className={classNames(
                                    item.current
                                      ? "bg-blue-600 text-white shadow-md"
                                      : "text-blue-100 hover:text-white hover:bg-blue-600",
                                    "group w-full flex items-center pl-3 pr-2 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-150"
                                  )}
                                >
                                  <Icon
                                    name={item.icon}
                                    className={classNames(
                                      open ? "text-white" : "text-blue-200",
                                      "mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-150"
                                    )}
                                    aria-hidden="true"
                                  />
                                  <span className="flex-1">{item.name}</span>
                                  <ChevronDownIcon
                                    className={classNames(
                                      open
                                        ? "text-blue-200 rotate-180"
                                        : "text-blue-200",
                                      "ml-2 h-4 w-4 flex-shrink-0 transform transition-all duration-200 ease-in-out"
                                    )}
                                    aria-hidden="true"
                                  />
                                </Disclosure.Button>
                                <Disclosure.Panel className="space-y-1 pl-3 pt-1">
                                  {item.children.map(
                                    (subItem) =>
                                      store.checkPermissions(
                                        subItem?.permissions
                                      ) && (
                                        <Link
                                          key={subItem.name}
                                          to={subItem.href}
                                          className="block"
                                        >
                                          <Disclosure.Button
                                            as="div"
                                            className={classNames(
                                              subItem.current
                                                ? "bg-blue-600 text-white"
                                                : "text-blue-100 hover:text-white hover:bg-blue-600",
                                              "group flex items-center rounded-md py-2 pl-7 pr-2 text-sm font-medium transition-colors duration-150"
                                            )}
                                          >
                                            <Icon
                                              name={subItem.icon}
                                              className="mr-3 h-4 w-4 flex-shrink-0 text-blue-200 group-hover:text-white transition-colors duration-150"
                                              aria-hidden="true"
                                            />
                                            {subItem.name}
                                          </Disclosure.Button>
                                        </Link>
                                      )
                                  )}
                                </Disclosure.Panel>
                              </>
                            )}
                          </Disclosure>
                        )
                      )
                    )}
                  </nav>
                </div>
              )}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col lg:pl-64">
          {/* Top Navigation Bar */}
          <div className="sticky top-0 z-30 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white shadow-sm no-print">
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3CenterLeftIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="flex flex-1 justify-between px-4">
              <div className="flex flex-1"></div>

              <div className="ml-4 flex items-center md:ml-6">
                <button
                  type="button"
                  className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => setOpen(!open)}
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon
                    className="h-6 w-6 text-blue-600"
                    aria-hidden="true"
                  />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>

                {/* Profile Dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      {store?.user?.photo_url ? (
                        <img
                          className="h-8 w-8 rounded-full"
                          src={store.user.photo_url}
                          alt="User profile"
                        />
                      ) : (
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                          <span className="text-sm font-medium leading-none text-white">
                            {store.user.name[0].toUpperCase()}
                          </span>
                        </span>
                      )}
                      <span className="ml-3 hidden text-sm font-medium text-gray-700 lg:block">
                        <span className="sr-only">Open user menu for </span>
                        {store?.user?.name}
                      </span>
                      <ChevronDownIcon
                        className="ml-1 hidden h-4 w-4 flex-shrink-0 text-gray-400 lg:block"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="fixed right-4 z-[1000] mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/dashboard/user/profile"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Perfil
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => store.logout()}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block w-full text-left px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Cerrar Sesión
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <main className="flex-1 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
              <div className="relative">
                <div className="bg-white rounded-lg shadow-md p-6 min-h-[calc(100vh-180px)]">
                  <Outlet />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
