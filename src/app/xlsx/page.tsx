"use client";
import BackButton from '@/components/BackButton';
import Navbar from '@/components/Navbar';
import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const XlsxPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [previewData, setPreviewData] = useState<Array<{ nisn: string; name: string; class?: string }> | null>(null);
    const [selectedClass, setSelectedClass] = useState<string>(''); // Store the selected class

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            parseFile(e.target.files[0]);
        }
    };

    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission

        if (!previewData) return;

        // If no class exists in the data, use the selected class
        if (!previewData.some(user => user.class && user.class.startsWith("x"))) {
            previewData.forEach((user) => {
                user.class = selectedClass;
            });
        }

        setUploading(true);
        try {
            const response = await fetch('/api/users/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(previewData),
            });

            if (!response.ok) throw new Error('Failed to save data.');

            alert("File uploaded and data saved successfully!");
        } catch (error) {
            console.error("Failed to upload data:", error);
            alert("Failed to save data.");
        } finally {
            setUploading(false);
        }
    };

    const parseFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];

            // Parse JSON with header mapping to nisn and name fields
            const jsonData = XLSX.utils.sheet_to_json<{ [key: string]: any }>(worksheet, { header: 1 });
            const rows = jsonData.slice(1, 37) as Array<Array<string | number>>;

            // Check if class starts with 'x' in the 3rd column
            const parsedPreviewData = rows.map((row) => {
                const classValue = row[2]?.toString().trim(); // Assuming class is in the 3rd column
                return {
                    nisn: row[0]?.toString().padStart(2, '0') || "", // Ensure nisn is a string and pad with 0s
                    name: row[1]?.toString() || "",
                    class: classValue && classValue.startsWith("x") ? classValue : undefined, // Only assign class if it starts with 'x'
                };
            });

            setPreviewData(parsedPreviewData);
        };
        reader.readAsBinaryString(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            parseFile(e.dataTransfer.files[0]);
        }
    };

    const handleClassChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedClass(event.target.value); // Update selected class when a radio button is clicked
    };

    return (
        <div>
            <Navbar />
            <BackButton />
        <div className="flex flex-col items-center py-10 px-4 bg-gray-50 min-h-screen mt-4">
            <h1 className="text-2xl font-bold mb-6 text-gray-700">Upload Your File (.xlsx/.csv)</h1>
            <form onSubmit={handleFileUpload} className="w-full max-w-md">
                <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center 
                                ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        accept=".xlsx,.csv"
                        onChange={handleFileChange}
                        className="hidden"
                        id="fileInput"
                    />
                    <label htmlFor="fileInput" className="cursor-pointer text-blue-600">
                        {file ? (
                            <span className="block font-medium text-gray-700">
                                {file.name} selected
                            </span>
                        ) : (
                            <span className="block font-medium text-gray-500">
                                Drag and drop a file here, or <span className="underline">browse</span>
                            </span>
                        )}
                    </label>
                </div>

                {previewData && (
                    <div className="mt-4 w-full text-center">
                        <h2 className="text-lg font-semibold mb-2 text-gray-700">File Preview</h2>
                        <table className="w-full border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border-b border-gray-300 bg-gray-100">No</th>
                                    <th className="px-4 py-2 border-b border-gray-300 bg-gray-100">NISN</th>
                                    <th className="px-4 py-2 border-b border-gray-300 bg-gray-100">Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {previewData.map((row, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2 border-b border-gray-300">{index + 1}</td>
                                        <td className="px-4 py-2 border-b border-gray-300">{row.nisn}</td>
                                        <td className="px-4 py-2 border-b border-gray-300">{row.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Class selection if no class found in the file */}
                {!previewData?.some(user => user.class && user.class.startsWith("x")) && (
                    <div className="mt-4">
                        <p className="text-sm text-gray-700">For the files, the users are from class:</p>
                        <div className="grid grid-cols-6 gap-4 justify-center">
    {['x-1', 'x-2', 'x-3', 'x-4', 'x-5', 'x-6', 'xi-1', 'xi-2', 'xi-3', 'xi-4', 'xi-5', 'xi-6', 'xii-1', 'xii-2', 'xii-3', 'xii-4', 'xii-5', 'xii-6'].map((value) => (
        <label
            key={value}
            className={`flex items-center justify-center p-4 bg-gray-200 rounded-lg cursor-pointer hover:bg-green-300 ${
                selectedClass === value ? 'bg-green-500 text-white' : ''
            }`}
        >
            <input
                type="radio"
                name="classSelection"
                value={value}
                checked={selectedClass === value}
                onChange={handleClassChange}
                className="hidden"
            />
            <span className="text-center font-medium">{value}</span>
        </label>
    ))}
</div>

                    </div>
                )}

                {/* Upload Button */}
                <div className="mt-4 w-full text-center">
                    <button
                        type="submit"
                        disabled={uploading || (!previewData?.some(user => user.class && user.class.startsWith("x")) && !selectedClass)}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 transition-colors"
                    >
                        {uploading ? "Uploading..." : "Upload and Save"}
                    </button>
                </div>
            </form>
        </div>
        </div>
    );
};

export default XlsxPage;
