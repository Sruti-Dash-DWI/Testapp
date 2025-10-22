import React from 'react';
import { getIcon } from '../../assets/icons.jsx';
import DeveloperDashboardLayout from '../../layout/DeveloperDashboardLayout.jsx';

const DeveloperPageContent = ({ page }) => {
    if (!page) {
        return (
            <DeveloperDashboardLayout>
            <div className="flex-grow p-8 bg-transparent flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold text-gray-800">Page not found</h1>
            </div>
            </DeveloperDashboardLayout>
        );
    }

    return (
        
        <DeveloperDashboardLayout>
        <div className="flex-grow p-8 bg-transparent flex flex-col items-center justify-center">
            <div className="text-center">
                <div className="mx-auto mb-4 text-gray-400">{React.cloneElement(getIcon(page.text), { className: 'w-16 h-16'})}</div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{page.text}</h1>
                <p className="text-gray-500">{page.description}</p>
            </div>
        </div>
       </DeveloperDashboardLayout>
    );
};

export default DeveloperPageContent;
