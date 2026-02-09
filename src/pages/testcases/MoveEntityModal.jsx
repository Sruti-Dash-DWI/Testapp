import React, { useState } from 'react';
import { X, FolderInput, Check } from 'lucide-react';

export default function MoveEntityModal({ isOpen, onClose, modules, onMove, title, entityName }) {
    const [selectedTarget, setSelectedTarget] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        // If empty string, it might mean "Root" (null) depending on logic, 
        // but usually we want a specific selection. 
        // We pass the value as is.
        onMove(selectedTarget);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40  p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <FolderInput className="w-5 h-5 text-blue-600" />
                        {title}
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full text-gray-400 hover:text-red-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6">
                    <p className="text-sm text-gray-600 mb-4">
                        Select the destination module for <span className="font-bold text-gray-800">{entityName}</span>:
                    </p>
                    
                    <div className="relative">
                        <select 
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                            value={selectedTarget}
                            onChange={(e) => setSelectedTarget(e.target.value)}
                        >
                            <option value="">-- Select Target Module --</option>
                            <option value="root">Root Directory (No Parent)</option>
                            {modules.map((mod) => (
                                <option key={mod.id} value={mod.id}>
                                    {'\u00A0'.repeat(mod.depth * 3)} 📂 {mod.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            ▼
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 rounded-lg transition-all">
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit} 
                        disabled={!selectedTarget}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Check className="w-4 h-4" /> Move Here
                    </button>
                </div>
            </div>
        </div>
    );
}