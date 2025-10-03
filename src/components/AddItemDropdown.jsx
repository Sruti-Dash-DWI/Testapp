import React, { useState, useEffect, useRef } from 'react';
import { PlusIcon, getIcon } from '../assets/icons.jsx';

const AddItemDropdown = ({ availableOptions, onAddItem }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [previewedOption, setPreviewedOption] = useState(null);
    const [alignLeft, setAlignLeft] = useState(true); 
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        if (isOpen && availableOptions.length > 0) {
            setPreviewedOption(availableOptions[0]);

            const buttonRect = buttonRef.current?.getBoundingClientRect();
            const screenWidth = window.innerWidth;
            if (buttonRect) {
                
                setAlignLeft(buttonRect.x + 550 < screenWidth);
            }
        } else {
            setPreviewedOption(null);
        }
    }, [isOpen, availableOptions]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative ml-2" ref={dropdownRef}>
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
                <PlusIcon />
            </button>

            {isOpen && (
                <div
                    className={`absolute top-full mt-2 w-[550px] 
                    ${alignLeft ? 'left-0' : 'right-0'} 
                    bg-white/90 backdrop-blur-sm border border-gray-200 
                    rounded-md shadow-lg z-20 p-2 flex 
                    max-h-[90vh] overflow-y-auto`}
                >
                    
                    <div className="w-2/5 border-r pr-2">
                        <h4 className="font-semibold text-gray-800 mb-2 px-2">Views</h4>
                        <div className="max-h-80 overflow-y-auto">
                            {availableOptions.length > 0 ? (
                                availableOptions.map(option => (
                                    <button
                                        key={option.id}
                                        onMouseEnter={() => setPreviewedOption(option)}
                                        onClick={() => { onAddItem(option); setIsOpen(false); }}
                                        className={`w-full flex items-center gap-3 p-2 rounded-md text-left text-sm text-gray-700 
                                            ${previewedOption?.id === option.id 
                                                ? 'bg-blue-100 text-blue-700' 
                                                : 'hover:bg-gray-100'
                                            }`}
                                    >
                                        {getIcon(option.text)}
                                        <span>{option.text}</span>
                                    </button>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 px-2">No more items to add.</p>
                            )}
                        </div>
                    </div>

                    
                    <div className="w-3/5 pl-4 flex flex-col items-center justify-center">
                        {previewedOption ? (
                            <>
                                <div className="w-48 h-32 bg-gray-100 rounded-md flex items-center justify-center mb-4 border">
                                    <div className="text-gray-300">
                                        {getIcon(previewedOption.text)
                                            ? React.cloneElement(getIcon(previewedOption.text), { className: 'w-16 h-16' })
                                            : <div className="w-16 h-16 bg-gray-200 rounded"></div>}
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg text-gray-800">{previewedOption.text}</h3>
                                <p className="text-sm text-gray-500 text-center my-2">{previewedOption.description}</p>
                                <button
                                    onClick={() => { onAddItem(previewedOption); setIsOpen(false); }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                                >
                                    Add to navigation
                                </button>
                            </>
                        ) : (
                            <div className="text-center text-gray-500">
                                <p>Select an item to see details.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddItemDropdown;
