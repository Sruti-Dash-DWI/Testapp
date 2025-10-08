// src/router/AppRouter.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import GenericPage from "../pages/GenericPage.jsx";
import LoginPage from "../pages/Login.jsx";
import SignupPage from "../pages/Signup.jsx";
import DashboardLayout from "../layout/DashboardLayout.jsx";
import AboutPage from "../pages/AboutUs.jsx";
import Services from "../pages/Services.jsx";
import Projects from "../pages/Projects.jsx";
import BacklogPage from "../components/Dashboardpages/BacklogPage.jsx";
import PageContent from "../components/Dashboardpages/PageContent.jsx";
import Summary from "../components/Dashboardpages/Summary.jsx";
import List from "../components/Dashboardpages/List.jsx";
import Cart from "../pages/sidenav_pages/Cart.jsx";
import Statisticspage from "../pages/sidenav_pages/Statisticspage.jsx";
import Documents from "../pages/sidenav_pages/Documents.jsx";
import Notifications from "../pages/sidenav_pages/Notification.jsx";
import Wallet from "../pages/sidenav_pages/Wallet.jsx";
import Settings from "../pages/sidenav_pages/Settings.jsx";
import Board from "../components/Dashboardpages/Board.jsx";
import Calendar from "../components/Dashboardpages/Calendar.jsx";
import Timeline from "../components/Dashboardpages/Timeline.jsx";

// Developer imports 
import DeveloperProjects from "../pages/developerPages/DeveloperProjects.jsx";

// Tester imports
import TesterProjects from "../pages/testerPages/TesterProjects.jsx";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="services" element={<Services />} />
        <Route path="/generic" element={<GenericPage title="Generic Page" />} />

       
        <Route element={<DashboardLayout />}>
         
          <Route path="/cart" element={<Cart />} />
          <Route path="/statistics" element={<Statisticspage />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/settings" element={<Settings />} />

          
          <Route path='/projects' element={<Projects />} />
          
         
          <Route path='/backlog/:projectId' element={<BacklogPage />} />
          <Route path='/summary/:projectId' element={<Summary />} />
          <Route path='/list/:projectId' element={<List />} />
          <Route path="/board/:projectId" element={<Board />} />
          <Route path="/timeline/:projectId" element={<Timeline />} />
          <Route path="/calendar/:projectId" element={<Calendar />} />

         
          <Route path='/backlog' element={<Projects />} />

          
          <Route path="/pages/:pageId" element={<PageContent page={{ text: 'Pages', description: 'Create, edit, and collaborate on project documentation.' }} />} />
          <Route path="/code/:pageId" element={<PageContent page={{ text: 'Code', description: 'Browse your repositories and connect your work.' }} />} />
          <Route path="/forms/:pageId" element={<PageContent page={{ text: 'Forms', description: 'Create forms to collect information for your project.' }} />} />
          <Route path="/all-work/:pageId" element={<PageContent page={{ text: 'All work', description: 'View all the work items in your project.' }} />} />
          <Route path="/archived-work-items/:pageId" element={<PageContent page={{ text: 'Archived work items', description: 'Access work items that have been archived.' }} />} />
          <Route path="/deployments/:pageId" element={<PageContent page={{ text: 'Deployments', description: 'Track your deployment pipeline and releases.' }} />} />
          <Route path="/goals/:pageId" element={<PageContent page={{ text: 'Goals', description: "Set and track your team's objectives and key results." }} />} />
          <Route path="/on-call/:pageId" element={<PageContent page={{ text: 'On-call', description: 'Manage on-call schedules and alerts.' }} />} />
          <Route path="/releases/:pageId" element={<PageContent page={{ text: 'Releases', description: 'Track software versions and release cycles.' }} />} />
          <Route path="/reports/:pageId" element={<PageContent page={{ text: 'Reports', description: "Generate reports to analyze your team's progress." }} />} />
          <Route path="/security/:pageId" element={<PageContent page={{ text: 'Security', description: 'Manage security vulnerabilities and compliance.' }} />} />
          <Route path="/shortcuts/:pageId" element={<PageContent page={{ text: 'Shortcuts', description: 'Create quick links to important pages or resources.' }} />} />
        </Route>

        {/* Developer Routes */}

        <Route path="/developer/projects" element={<DeveloperProjects />} />

        {/* Tester Routes */}

        <Route path="/tester/projects" element={<TesterProjects />} />
        
      </Routes>
    </Router>
  );
};

export default AppRouter;