import React, { useState, useEffect, Children } from "react";
import { useLocation, Outlet } from "react-router-dom"; 
import DeveloperSideNav from "../components/developer/DeveloperSideNav";
import DeveloperDashboardinNav from "../components/developer/DeveloperDashboardinNav";
import DeveloperDashboardheader from "../components/developer/DeveloperDashboardheader";
import DeveloperUppernavbar from "../components/developer/DeveloperUppernavbar";

const pathsWithInnerNav = [
  '/projects', '/backlog', '/summary', '/list', '/board', '/timeline',
  '/pages', '/code', '/forms', '/calendar', '/all-work', '/archived-work-items',
  '/deployments', '/goals', '/on-call', '/releases', '/reports', '/security', '/shortcuts'
];

const DeveloperDashboardLayout = ({children}) => {
  const [isNavOpen, setIsNavOpen] = useState(window.innerWidth >= 768);
  const [projectName, setProjectName] = useState('Scrum Project');
  const location = useLocation();

  // --- ADDED: State for the Invite Member modal ---
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const openModal = () => setIsInviteModalOpen(true);
    const closeModal = () => setIsInviteModalOpen(false);
    // ---------------------------------------------

  const showinner = pathsWithInnerNav.some((path) =>
    location.pathname.startsWith(path)
  );

  useEffect(() => {
    const activeProjectName = localStorage.getItem('activeProjectName');
    if (activeProjectName) {
      setProjectName(activeProjectName);
    } else {
      setProjectName('Scrum Project');
    }
  }, [location.pathname]);

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
    { id: "5", text: "Code", description: "Connect your code repositories to your project." },
    { id: "6", text: "Forms", description: "Create forms to collect data and feedback." },
    { id: "7", text: "Calendar", description: "View project tasks and deadlines on a calendar." },
    { id: "12", text: "All work", description: "View all the work items in your project. Use built-in filters and text search to find work items." },
    { id: "8", text: "Archived work items", description: "Access items that have been archived and are no longer active." },
    { id: "9", text: "Deployments", description: "Track your software deployments and release cycles." },
    { id: "10", text: "Goals", description: "Set and monitor project goals and objectives." },
    { id: "11", text: "List", description: "A simple list view of all your tasks and items." },
    { id: "13", text: "On-call", description: "Manage on-call schedules and escalations." },
    { id: "14", text: "Releases", description: "Oversee product releases and versioning." },
    { id: "15", text: "Reports", description: "Generate reports to analyze project progress." },
    { id: "16", text: "Security", description: "Manage security-related tasks and vulnerabilities." },
    { id: "17", text: "Shortcuts", description: "Create shortcuts to important links and resources." },
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
    <div className="h-screen font-sans flex flex-col"
      style={{
        background: "linear-gradient(135deg, #134e5e 0%, #71b280 50%, #d4f1dd 100%)",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
      }}
    >
      {isNavOpen && window.innerWidth < 768 && (
        <div
          onClick={toggleNav}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        ></div>
      )}
      
      {/* Top navbar */}
      <div className="px-4 pt-4 md:px-6 md:pt-6">
        <DeveloperUppernavbar />
      </div>

      {/* Main layout */}
      <div className="flex-1 flex gap-6 p-4 md:p-6 pt-2 md:pt-4 overflow-hidden">
        
        {/* Side Nav */}
        <div
          className={`fixed top-0 left-0 h-full p-4 md:p-0 md:relative md:h-full z-40 transition-transform duration-300 ${
            isNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <DeveloperSideNav isOpen={isNavOpen} openInviteModal={openModal} />
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col transition-all duration-300 overflow-hidden">
          {showinner && (
            <>
              <DeveloperDashboardheader projectName={projectName}/>
              <DeveloperDashboardinNav
                navItems={navItems}
                setNavItems={setNavItems}
                availableOptions={availableOptions}
              />
            </>
          )}

          {/* Outlet for nested routes */}
          <div className="flex-1 overflow-y-auto mt-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboardLayout;