// src/layout/DashboardLayout.jsx

import React, { useState, useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
// Note: Corrected the SideNav import path to match the router and previous files.
import SideNav from "../components/SideNav"; 
import Dashbordinnav from "../components/Dashboardinnav";
import Dashboardheader from "../components/Dashboardheader";
import Uppernavbar from "../components/Dashboardpages/Uppernavbar";
import Modal from "../components/Dashboardpages/Project management/Modal";

const pathsWithInnerNav = [
  '/backlog', '/summary', '/list', '/board', '/timeline',
  '/pages',  '/forms', '/calendar',  
   '/goals',  '/releases', '/reports'
];

const DashboardLayout = () => {
  const [isNavOpen, setIsNavOpen] = useState(window.innerWidth >= 768);
  const [projectName, setProjectName] = useState('Scrum Project');
  const location = useLocation();

  // --- ADDED: State for the Invite Member modal ---
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const openModal = () => setIsInviteModalOpen(true);
  const closeModal = () => setIsInviteModalOpen(false);
  // ---------------------------------------------

const showinner = pathsWithInnerNav.some((path) =>
    location.pathname.includes(path)
  );


  useEffect(() => {
    const activeProjectName = localStorage.getItem('activeProjectName');
    if (activeProjectName) {
      setProjectName(activeProjectName);
    } else {
      setProjectName('Scrum Project');
    }
  }, [location.pathname]);

  // useEffect(() => {
  //   if (window.innerWidth < 768) setIsNavOpen(false);
  // }, [location]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setIsNavOpen(false);
      else setIsNavOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleNav = () => setIsNavOpen((prev) => !prev);

  const initialNavItems = [
    { id: "1", text: "Backlog", default: true, description: "View and manage your product backlog." },
    { id: "18", text: "Summary", description: "Get a high-level overview of your project progress." },
    { id: "2", text: "Board", description: "Visualize your workflow on a Kanban or Scrum board." },
    { id: "3", text: "Timeline", description: "Plan and track work on a project timeline." },
  ];
  const otherAvailableOptions = [
    { id: "4", text: "Pages", description: "Create and collaborate on project documentation." },
    { id: "6", text: "Forms", description: "Create forms to collect data and feedback." },
    { id: "7", text: "Calendar", description: "View project tasks and deadlines on a calendar." },
    { id: "10", text: "Goals", description: "Set and monitor project goals and objectives." },
    { id: "11", text: "List", description: "A simple list view of all your tasks and items." },
    { id: "14", text: "Releases", description: "Oversee product releases and versioning." },
    { id: "15", text: "Reports", description: "Generate reports to analyze project progress." },
   
   
  ];
  const allPossibleOptions = [...initialNavItems, ...otherAvailableOptions];
  const [navItems, setNavItems] = useState(
    () => JSON.parse(localStorage.getItem("dashboardNavItems")) || initialNavItems
  );

  useEffect(() => {
    localStorage.setItem("dashboardNavItems", JSON.stringify(navItems));
  }, [navItems]);

  const availableOptions = allPossibleOptions.filter(
    (p) => !navItems.some((n) => n.id === p.id)
  );

  return (
    <div className="h-screen font-sans flex flex-col" style={{ background: "linear-gradient(135deg, #ffffff 0%, #ffffff 100%)", backgroundAttachment: "fixed", backgroundSize: "cover" }}>
      {isNavOpen && window.innerWidth < 768 && (<div onClick={toggleNav} className="fixed inset-0 bg-black/50 z-30 md:hidden"></div>)}
      <div className="md:px-0">
        <Uppernavbar />
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className={`fixed top-0 left-0 h-full p-4 md:p-0 md:relative md:h-full z-40 transition-transform duration-300 ${isNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
          <SideNav isOpen={isNavOpen} openInviteModal={openModal} />
        </div>
        <div className="flex-1 flex flex-col transition-all duration-300 overflow-hidden">
          {showinner && (
            <>
              <Dashboardheader projectName={projectName} />
              <Dashbordinnav
                navItems={navItems}
                setNavItems={setNavItems}
                availableOptions={availableOptions}
              />
            </>
          )}
          <div className="flex-1 overflow-y-auto">
            <Outlet context={{ isInviteModalOpen, openModal, closeModal }} />
          </div>
        </div>
      </div>
      {isInviteModalOpen && (
        <Modal isOpen={isInviteModalOpen} onClose={closeModal} />
      )}
    </div>
  );
};

export default DashboardLayout;