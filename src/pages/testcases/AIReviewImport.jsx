import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import * as XLSX from 'xlsx'; 
import { ArrowLeft, FileSpreadsheet, Upload, Download, Save } from 'lucide-react'; // Added Download icon

export default function AIReviewImport() {
    const { projectId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    
    const [rows, setRows] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [modules, setModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState('');
    const [loading, setLoading] = useState(false);
    const [importing, setImporting] = useState(false);
    
    // Data from previous screen (AI Generation)
    const { fileBlob, initialModuleId } = location.state || {};

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const authToken = localStorage.getItem('authToken');

    useEffect(() => {
        if (fileBlob) {
            parseExcelFile(fileBlob);
        }
        if (initialModuleId) {
            setSelectedModule(initialModuleId);
        }
        fetchModules();
    }, [fileBlob]);

    // --- 1. Helper: Fetch Modules for Dropdown ---
    const fetchModules = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/testcase/modules/simple-modules/?project=${projectId}`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (response.ok) {
                const data = await response.json();
                setModules(flattenModules(data));
            }
        } catch (error) {
            console.error("Error fetching modules", error);
        }
    };

    const flattenModules = (nestedModules, depth = 0, result = []) => {
        nestedModules.forEach(mod => {
            result.push({ ...mod, depth });
            if (mod.children) flattenModules(mod.children, depth + 1, result);
        });
        return result;
    };

    
    const parseExcelFile = async (blob) => {
        setLoading(true);
        try {
            const data = await blob.arrayBuffer();
            const workbook = XLSX.read(data);
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); 

            if (jsonData.length > 0) {
                setHeaders(jsonData[0]); 
                setRows(jsonData.slice(1)); 
            }
        } catch (error) {
            alert("Error parsing Excel file. Please ensure it is a valid format.");
        } finally {
            setLoading(false);
        }
    };

   
    const handleCellChange = (rowIndex, colIndex, value) => {
        const newRows = [...rows];
        newRows[rowIndex][colIndex] = value;
        setRows(newRows);
    };

    
    const handleDownloadLocal = () => {
        try {
           
            const newWorksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
            const newWorkbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "TestCases");
            
           
            XLSX.writeFile(newWorkbook, "ai_generated_testcases.xlsx");
        } catch (error) {
            console.error("Download failed", error);
            alert("Failed to download file.");
        }
    };

   
    const handleImport = async () => {
        if (!selectedModule) return alert("Please select a target module.");
        setImporting(true);

        try {
           
            const newWorksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
            const newWorkbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "TestCases");
            const excelBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
            const newBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            
           
            const formData = new FormData();
            formData.append('module', selectedModule);
            formData.append('file', newBlob, 'imported_testcases.xlsx');

            
            const response = await fetch(`${API_BASE_URL}/testcase/cases/import_excel/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
                body: formData
            });

            if (!response.ok) throw new Error("Import failed");

            alert("Test cases imported successfully!");
            navigate(`/project/${projectId}/test-scripts`); // Go back to list

        } catch (error) {
            console.error(error);
            alert("Error importing test cases: " + error.message);
        } finally {
            setImporting(false);
        }
    };

    if (!fileBlob && !loading) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold text-gray-700">No File Loaded</h2>
                <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 underline">Go Back</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <FileSpreadsheet className="w-5 h-5 text-green-600" />
                            Review Generated Cases
                        </h1>
                        <p className="text-xs text-gray-500">Review, edit, or download data before importing</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Target Module:</span>
                        <select 
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={selectedModule}
                            onChange={(e) => setSelectedModule(e.target.value)}
                        >
                            <option value="">-- Select Module --</option>
                            {modules.map(m => (
                                <option key={m.id} value={m.id}>
                                    {'\u00A0'.repeat(m.depth * 3)} 📂 {m.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* NEW: Download Button */}
                    <button 
                        onClick={handleDownloadLocal}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-all"
                        title="Download as Excel to your computer"
                    >
                        <Download className="w-4 h-4" />
                        Save to Device
                    </button>

                    {/* Import Button */}
                    <button 
                        onClick={handleImport} 
                        disabled={importing}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-md disabled:opacity-50"
                    >
                        {importing ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"/> : <Upload className="w-4 h-4" />}
                        {importing ? "Importing..." : "Import Cases"}
                    </button>
                </div>
            </div>

            {/* Editable Table */}
            <div className="flex-1 overflow-auto p-6">
                <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="p-10 text-center text-gray-500">Parsing Excel data...</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-100 sticky top-0 z-10">
                                <tr>
                                    <th className="p-3 border-b border-r text-center w-12 bg-gray-100">#</th>
                                    {headers.map((header, i) => (
                                        <th key={i} className="p-3 border-b border-r text-xs font-bold text-gray-600 uppercase min-w-[150px]">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, rowIndex) => (
                                    <tr key={rowIndex} className="hover:bg-blue-50/30">
                                        <td className="p-3 border-b border-r text-center text-xs text-gray-400 font-mono">{rowIndex + 1}</td>
                                        {headers.map((_, colIndex) => (
                                            <td key={colIndex} className="border-b border-r p-0">
                                                <input 
                                                    className="w-full h-full p-3 bg-transparent outline-none text-sm focus:bg-blue-50 focus:ring-2 focus:ring-inset focus:ring-blue-200"
                                                    value={row[colIndex] || ''}
                                                    onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}