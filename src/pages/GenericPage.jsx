import React from 'react';
// import { useOutletContext } from 'react-router-dom';
import { MenuIcon } from '../components/Icons';
import DashboardLayout from '../layout/DashboardLayout';

const GenericPage = ({ title }) => {
    // const { onToggleNav } = useOutletContext();
    return (
        <DashboardLayout showinner={true}>
        <div className="flex-1 p-10 text-white">
            {/* <button onClick={onToggleNav} className="text-gray-200 mb-4 md:hidden"><MenuIcon/></button> */}
            <h1 className="text-4xl font-bold">{title}</h1>
            <p className="mt-4 text-lg text-gray-200">This is a placeholder page for {title}.</p>
        </div>
        </DashboardLayout>
    );
};
export default GenericPage;