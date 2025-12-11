//Owner imports
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import GenericPage from "../pages/GenericPage.jsx";
import LoginPage from "../pages/Login.jsx";
import SignupPage from "../pages/Signup.jsx";
import DashboardLayout from "../layout/DashboardLayout.jsx";
import AboutPage from "../pages/AboutUs.jsx";
import Services from "../pages/Services.jsx";
import { FormDashboard, FormEditor } from '../components/Dashboardpages/Form.jsx';

import Projects from "../pages/Projects.jsx";
import BacklogPage from "../components/Dashboardpages/BacklogPage.jsx";
import Board from "../components/Dashboardpages/Board.jsx";
import Calendar from "../components/Dashboardpages/Calendar.jsx";
import Timeline from "../components/Dashboardpages/Timeline.jsx";
import PageContent from "../components/Dashboardpages/PageContent.jsx";
import Summary from "../components/Dashboardpages/Summary.jsx";
import List from "../components/Dashboardpages/List.jsx";
import ForYou from "../pages/teams/ForYou.jsx";
import People from "../pages/teams/People.jsx";
import Teams from "../pages/teams/Teams.jsx";
import TeamDetails from "../pages/teams/TeamDetails.jsx";
//import Statisticspage from "../pages/sidenav_pages/Statisticspage.jsx";
//import Wallet from "../pages/sidenav_pages/Wallet.jsx";
import Documents from "../pages/sidenav_pages/Documents.jsx";
import Notifications from "../pages/sidenav_pages/Notification.jsx";
import Settings from "../pages/sidenav_pages/Settings.jsx";
import GoalsPa from "../components/Dashboardpages/Goals.jsx";

import Dummypage from "../pages/Dummypage.jsx";

// Developer imports
import DeveloperProjects from "../pages/developerPages/DeveloperProjects.jsx";
import DeveloperBacklogPage from "../components/developerDashboardpages/DeveloperBacklog.jsx";
import DevelopersBoard from "../components/developerDashboardpages/DeveloperBoard.jsx";
import DevelopersCalendar from "../components/developerDashboardpages/DeveloperCalendar.jsx";
import DevelopersTimeline from "../components/developerDashboardpages/DeveloperTimeline.jsx";
import DevelopersSummary from "../components/developerDashboardpages/DeveloperSummary.jsx";
import DevelopersList from "../components/developerDashboardpages/DeveloperList.jsx";
import DevelopersPageContent from "../components/developerDashboardpages/DeveloperPageContent.jsx";
import Developerprojectmanager from "../components/developerDashboardpages/Project management developer/DevTeammanagement.jsx";
import DevEditUserModal from "../components/developerDashboardpages/Project management developer/DevEditUserModal.jsx";
import DeveloperDashboardLayout from "../layout/DeveloperDashboardLayout.jsx";
import { DeveloperFormDashboard, DeveloperFormEditor } from '../components/developerDashboardpages/Developerforms.jsx';
import DeveloperTeams from "../components/developerDashboardpages/developerteams/DeveloperTeams.jsx";
import DeveloperPeople from "../components/developerDashboardpages/developerteams/DeveloperPeople.jsx";
import DeveloperTeamDetails from "../components/developerDashboardpages/developerteams/DeveloperTeamDetails.jsx";

import DevDocuments from "../pages/developerPages/sidenav_pages/DevDocuments.jsx";
import DevNotification from "../pages/developerPages/sidenav_pages/DevNotification.jsx";
import DevSettings from "../pages/developerPages/sidenav_pages/DevSettings.jsx";
import DeveloperPageContent from "../components/developerDashboardpages/DeveloperPageContent.jsx";
import DeveloperGoals from "../components/developerDashboardpages/Developergoals.jsx";

// Tester imports
import TesterProjects from "../pages/testerPages/TesterProjects.jsx";
import TesterDocuments from "../pages/testerPages/sidenav_pages/TesterDocuments.jsx";

import TesterNotification from "../pages/testerPages/sidenav_pages/TesterNotification.jsx";
import TesterSettings from "../pages/testerPages/sidenav_pages/TesterSettings.jsx"; 
import TesterDashboardLayout from "../layout/TesterDashboardLayout.jsx";  
import TesterBacklog from "../components/testerDashboardPages/TesterBacklog.jsx";
import TesterSummary from "../components/testerDashboardPages/TesterSummary.jsx";
import TesterBoard from "../components/testerDashboardPages/TesterBoard.jsx";
import TesterCalendar from "../components/testerDashboardPages/TesterCalendar.jsx";
import TesterTimeline from "../components/testerDashboardPages/TesterTimeline.jsx";
import TesterList from "../components/testerDashboardPages/TesterList.jsx";
import TesterPageContent from "../components/testerDashboardPages/TesterPageContent.jsx";
import TesterTeammanagement from "../components/testerDashboardPages/testerProject management/TesterTeammanagement.jsx";
import { TesterFormDashboard, TesterFormEditor } from '../components/testerDashboardPages/Testerforms.jsx';
import TesterTeams from "../components/testerDashboardPages/testerteams/Testerteams.jsx";
import TesterPeople from "../components/testerDashboardPages/testerteams/Testerpeople.jsx";
import TesterTeamDetails from "../components/testerDashboardPages/testerteams/Testerteamdetails.jsx";
import Testergoals from "../components/testerDashboardPages/Testergoals.jsx";

// Project Manager imports
import Projectmanager from "../components/Dashboardpages/Project management/Teammanagement.jsx";
import Pmprojectmanager from "../components/Dashboardpages/projectmanager/Project managementmg/PmTeammanagement.jsx"

import PmProjects from "../pages/projectmanagerpages/PmProjects.jsx";
import SetPasswordPage from "../components/Dashboardpages/Project management/Setpassword.jsx";
import Pmdashboardlayout from "../layout/Pmdasboardlayout.jsx";
import PmBacklogPage from "../components/Dashboardpages/projectmanager/pmpages/Pmbacklogpage.jsx";

import PmDocuments from "../pages/projectmanagerpages/sidenav_pages/Documents.jsx";
import PmNotifications from "../pages/projectmanagerpages/sidenav_pages/Notification.jsx";
import PmSettings from "../pages/projectmanagerpages/sidenav_pages/Settings.jsx";
import PmSummary from "../components/Dashboardpages/projectmanager/pmpages/Pmsummary.jsx";
import PmList from "../components/Dashboardpages/projectmanager/pmpages/Pmlist.jsx";
import PmBoard from "../components/Dashboardpages/projectmanager/pmpages/Pmboard.jsx";
import PmTimeline from "../components/Dashboardpages/projectmanager/pmpages/Pmtimeline.jsx";
import PmCalendar from "../components/Dashboardpages/projectmanager/pmpages/Pmcalendar.jsx";
import PmPageContent from "../components/Dashboardpages/projectmanager/pmpages/Pmpagecontent.jsx";
import { PmFormDashboard, PmFormEditor } from '../components/Dashboardpages/projectmanager/pmpages/Pmforms.jsx';
import PmTeams from "../components/Dashboardpages/projectmanager/pmpages/pmteams/Pmteams.jsx";
import PmPeople from "../components/Dashboardpages/projectmanager/pmpages/pmteams/Pmpeople.jsx";
import PmTeamDetails from "../components/Dashboardpages/projectmanager/pmpages/pmteams/Pmteamdetails.jsx";
import Pmgoals from "../components/Dashboardpages/projectmanager/pmpages/Pmgoals.jsx";

// Scrum Master imports
import SmProjects from "../pages/scrummasterpages/SmProjects.jsx";
import SmBacklogPage from "../components/Smdashboardpages/SmBacklogPage.jsx";
import SmBoard from "../components/Smdashboardpages/SmBoard.jsx";
import SmCalendar from "../components/Smdashboardpages/SmCalendar.jsx";
import SmTimeline from "../components/Smdashboardpages/SmTimeline.jsx";
import SmSummary from "../components/Smdashboardpages/SmSummary.jsx";
import SmList from "../components/Smdashboardpages/SmList.jsx";
import SmPageContent from "../components/Smdashboardpages/SmPageContent.jsx";
import Smprojectmanager from "../components/Smdashboardpages/Project management Sm/SmTeammanagement.jsx";
import SmEditUserModal from "../components/Smdashboardpages/Project management Sm/SmEditUserModal.jsx";
//import DeveloperDashboardLayout from "../layout/DeveloperDashboardLayout.jsx";
import SmDashboardlayout from "../layout/Smdashboardlayout.jsx";
import SmDocuments from "../pages/scrummasterpages/sidenav_pages/SmDocuments.jsx";
import SmNotification from "../pages/scrummasterpages/sidenav_pages/SmNotification.jsx";
import SmSettings from "../pages/scrummasterpages/sidenav_pages/SmSettings.jsx";
import { SmFormDashboard, SmFormEditor } from '../components/Smdashboardpages/SmForm.jsx';
import SmTeams from "../components/Scrummaster/smteams/SmTeams.jsx";
import SmPeople from "../components/Scrummaster/smteams/Smpeople.jsx";
import SmTeamDetails from "../components/Scrummaster/smteams/SmTeamDetails.jsx";
import Smgoals from "../components/Smdashboardpages/Smgoals.jsx";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dummy/:id" element={<Dummypage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="services" element={<Services />} />
        <Route path="/generic" element={<GenericPage title="Generic Page" />} />

        <Route path="/set-password" element={<SetPasswordPage />} />

        
        <Route element={<DashboardLayout />}>
          
          {/* <Route path="/user-details" element={<Projectmanager />} /> */}
          
          <Route path="/documents" element={<Documents />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />

          
          <Route path='/projects' element={<Projects />} />

          <Route path="/teams/for-you" element={<Projectmanager />} />
          <Route path="/teams/people" element={<People />} />
          <Route path="/teams/teams" element={<Teams />} />
          <Route path="/teams/:teamId" element={<TeamDetails />} />
          
          
          <Route path='/backlog/:projectId' element={<BacklogPage />} />
          <Route path='/summary/:projectId' element={<Summary />} />
          <Route path='/list/:projectId' element={<List />} />
          <Route path="/board/:projectId" element={<Board />} />
          <Route path="/timeline/:projectId" element={<Timeline />} />
          <Route path="/calendar/:projectId" element={<Calendar />} />

          
          <Route path='/backlog' element={<Projects />} />
          <Route path="/forms/:projectId" element={<FormDashboard />} />
          <Route path="/forms/:projectId/:formId" element={<FormEditor />} /> 
          <Route path="/goals/:projectId" element={<GoalsPa />} /> 
          
          <Route path="/projects/:projectId/pages" element={<PageContent />} />
          {/* <Route path="/code/:pageId" element={<PageContent page={{ text: 'Code', description: 'Browse your repositories and connect your work.' }} />} /> */}
          <Route path="/forms/:pageId" element={<PageContent page={{ text: 'Forms', description: 'Create forms to collect information for your project.' }} />} />
          <Route path="/all-work/:pageId" element={<PageContent page={{ text: 'All work', description: 'View all the work items in your project.' }} />} />
          <Route path="/archived-work-items/:pageId" element={<PageContent page={{ text: 'Archived work items', description: 'Access work items that have been archived.' }} />} />
          {/* <Route path="/deployments/:pageId" element={<PageContent page={{ text: 'Deployments', description: 'Track your deployment pipeline and releases.' }} />} /> */}
          <Route path="/goals/:pageId" element={<PageContent page={{ text: 'Goals', description: "Set and track your team's objectives and key results." }} />} /> 
          <Route path="/on-call/:pageId" element={<PageContent page={{ text: 'On-call', description: 'Manage on-call schedules and alerts.' }} />} />
          <Route path="/releases/:pageId" element={<PageContent page={{ text: 'Releases', description: 'Track software versions and release cycles.' }} />} />
          <Route path="/reports/:pageId" element={<PageContent page={{ text: 'Reports', description: "Generate reports to analyze your team's progress." }} />} />
          <Route path="/security/:pageId" element={<PageContent page={{ text: 'Security', description: 'Manage security vulnerabilities and compliance.' }} />} />
          <Route path="/shortcuts/:pageId" element={<PageContent page={{ text: 'Shortcuts', description: 'Create quick links to important pages or resources.' }} />} />
        </Route>

        {/* Developer Routes */}
          <Route element={<DeveloperDashboardLayout />}> 
            <Route path="/developer/documents" element={<DevDocuments />} />
            <Route path="/developer/notifications" element={<DevNotification />} />
            <Route path="/developer/settings" element={<DevSettings />} /> 

            <Route path="/developer/projects" element={<DeveloperProjects />} />
            <Route path="/developer/backlog/:projectId" element={<DeveloperBacklogPage />} />
            <Route path="/developer/board/:projectId" element={<DevelopersBoard />} />
            <Route path="/developer/calendar/:projectId" element={<DevelopersCalendar />} />
            <Route path="/developer/timeline/:projectId" element={<DevelopersTimeline />} />
            <Route path="/developer/summary/:projectId" element={<DevelopersSummary />} />
            <Route path="/developer/list/:projectId" element={<DevelopersList />} />
          <Route path="/developer/projects/:projectId/pages" element={<DeveloperPageContent />} />
            <Route path="/developer/dev-user-details" element={<Developerprojectmanager />} />
            <Route path="/developer/dev-user-details/:memberId" element={<DevEditUserModal />} />
            <Route path="/developer/forms/:projectId" element={<DeveloperFormDashboard />} />
          <Route path="/developer/forms/:projectId/:formId" element={<DeveloperFormEditor />} />
          <Route path="/developer/goals/:projectId" element={<DeveloperGoals />} />

          <Route path="/developer/teams/teams" element={<DeveloperTeams />} />
          <Route path="/developer/teams/people" element={<DeveloperPeople />} />
          <Route path="/developer/teams/:teamId" element={<DeveloperTeamDetails />} />
        </Route> 
        
        
        {/* Tester Routes */}

        <Route element={<TesterDashboardLayout />}>
         <Route path="/tester/projects" element={<TesterProjects />} />
        <Route path="/tester/documents" element={<TesterDocuments />} /> 
        <Route path="/tester/notifications" element={<TesterNotification />} />
        <Route path="/tester/settings" element={<TesterSettings />} />
        
        <Route path="/tester/backlog/:projectId" element={<TesterBacklog />} />
        <Route path="/tester/board/:projectId" element={<TesterBoard />} />
        <Route path="/tester/calendar/:projectId" element={<TesterCalendar />} />
        <Route path="/tester/timeline/:projectId" element={<TesterTimeline />} /> 
        <Route path="/tester/summary/:projectId" element={<TesterSummary/>} />
        <Route path="/tester/list/:projectId" element={<TesterList/>} />
        <Route path="/tester/projects/:projectId/pages" element={<TesterPageContent />} />
        <Route path="/tester/tester-user-details" element={<TesterTeammanagement/>} />
        <Route path="/tester/forms/:projectId" element={<TesterFormDashboard />} />
          <Route path="/tester/forms/:projectId/:formId" element={<TesterFormEditor />} />
          <Route path="/tester/goals/:projectId" element={<Testergoals/>}/>

           <Route path="/tester/teams/teams" element={<TesterTeams />} />
          <Route path="/tester/teams/people" element={<TesterPeople />} />
          <Route path="/tester/teams/:teamId" element={<TesterTeamDetails />} />
        </Route>


       {/* Project Manager Routes */}
        <Route element={<Pmdashboardlayout />}>
          <Route path="/pm/projects" element={<PmProjects />} />
          <Route path="/pm/backlog/:projectId" element={<PmBacklogPage />} />

          <Route path="/pm/documents" element={<PmDocuments />} />
          <Route path="/pm/notifications" element={<PmNotifications />} />
          <Route path="/pm/settings" element={<PmSettings />} />

          <Route path="/pm/summary/:projectId" element={<PmSummary />} />
          <Route path="/pm/list/:projectId" element={<PmList />} />
          <Route path="/pm/board/:projectId" element={<PmBoard />} />
          <Route path="/pm/timeline/:projectId" element={<PmTimeline />} />
          <Route path="/pm/calendar/:projectId" element={<PmCalendar />} />
          <Route path="/pm/user-details" element={<Pmprojectmanager />} />
          <Route path="/pm/projects/:projectId/pages" element={<PmPageContent />} />
           <Route path="/pm/forms/:projectId" element={<PmFormDashboard />} />
          <Route path="/pm/forms/:projectId/:formId" element={<PmFormEditor />} />
          <Route path="/pm/goals/:projectId" element={<Pmgoals />} />
         
          <Route path="/pm/teams/teams" element={<PmTeams />} />
          <Route path="/pm/teams/people" element={<PmPeople />} />
          <Route path="/pm/teams/:teamId" element={<PmTeamDetails />} />
        </Route>
        {/* </Route> */}

        {/* {/* Scrum Master Routes */}
        <Route element={<SmDashboardlayout />}> 
          <Route path="/sm/documents" element={<SmDocuments />} />
          <Route path="/sm/notifications" element={<SmNotification />} />
          <Route path="/sm/settings" element={<SmSettings />} /> 

          <Route path="/sm/projects" element={<SmProjects />} />
          <Route path="/sm/backlog/:projectId" element={<SmBacklogPage />} />
          <Route path="/sm/board/:projectId" element={<SmBoard />} />
          <Route path="/sm/calendar/:projectId" element={<SmCalendar />} />
          <Route path="/sm/timeline/:projectId" element={<SmTimeline />} />
          <Route path="/sm/summary/:projectId" element={<SmSummary />} />
          <Route path="/sm/list/:projectId" element={<SmList />} />
          <Route path="/sm/projects/:projectId/pages" element={<SmPageContent />} />
          <Route path="/sm/forms/:projectId" element={<SmFormDashboard />} />
          <Route path="/sm/forms/:projectId/:formId" element={<SmFormEditor />} />
          <Route path="/sm/goals/:projectId" element={<Smgoals />} /> 

          
          <Route path="/sm/user-details" element={<Smprojectmanager />} />
          
         
          <Route path="/sm/teams/teams" element={<SmTeams />} />

          
          <Route path="/sm/teams/people" element={<SmPeople />} />
          
       
          <Route path="/sm/teams/:teamId" element={<SmTeamDetails />} />
          
          {/* ------------------------------------------- */}

          <Route path="/sm/user-details/:memberId" element={<SmEditUserModal />} />
        </Route>
             
          
        
      </Routes>
    </Router>
  );
};


export default AppRouter;
