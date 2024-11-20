"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { FaExclamation, FaExclamationTriangle, FaSadCry } from 'react-icons/fa';
import { FaSortAlphaDown, FaChalkboardTeacher } from 'react-icons/fa';
import BackButton from '@/components/BackButton';

const ShowPage = () => {
    const [users, setUsers] = useState<{ _id: string; nisn: string; name: string; class?: string }[]>([]);
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'symptom' | 'class' | 'suicidal'>('class');
    const [visibleClasses, setVisibleClasses] = useState<{ [key: string]: boolean }>({});
    const router = useRouter();

    useEffect(() => {
        const fetchUsersAndReports = async () => {
            try {
                const [usersResponse, reportsResponse] = await Promise.all([
                    axios.get('/api/users'),
                    axios.get('/api/reports'),
                ]);
                setUsers(usersResponse.data);
                // console.log(reportsResponse.data)
                setReports(reportsResponse.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchUsersAndReports();
    }, []);

    useEffect(() => {
        const classes = users.reduce((acc: { [key: string]: boolean }, user) => {
            if (user.class) {
                acc[user.class] = false; // Initialize all classes as hidden (false)
            }
            return acc;
        }, {});
    
        setVisibleClasses(classes);
    }, [users]);
    

    if (loading) {
        return (
            <div>
                <Navbar />
            <p className="text-lg text-gray-800 flex items-center justify-center min-h-screen">Loading...</p>
            </div>
        )
    }
    if (error) return <p>{error}</p>;

    const suicideCount = reports.filter(
        (report) => report.answers?.mental16 >= 6 
    ).length;


    const filteredUsers = users.filter(
        user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.nisn.includes(searchTerm)
    );

    const submittedCount = users.filter(user =>
        reports.some(report => report.nisn === user.nisn)
    ).length;

    const censorNISN = (nisn: string) => {
        return nisn.slice(0, -4).replace(/./g, '*') + nisn.slice(-4);
    };

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        } else if (sortBy === 'class') {
            return (a.class || '').localeCompare(b.class || '');
        } else if (sortBy === 'symptom') {
            const aSymptoms = reports
                .filter(report => report.nisn === a.nisn)
                .reduce((total, report) => total + (report.physicalSymptoms?.length || 0) + (report.mentalSymptoms?.length || 0), 0);
            const bSymptoms = reports
                .filter(report => report.nisn === b.nisn)
                .reduce((total, report) => total + (report.physicalSymptoms?.length || 0) + (report.mentalSymptoms?.length || 0), 0);
            return bSymptoms - aSymptoms;
        } else if (sortBy === 'suicidal') {
            const aCritical = reports.some(report => report.nisn === a.nisn && report.answers?.mental16 >= 6) ? 1 : 0;
            const bCritical = reports.some(report => report.nisn === b.nisn && report.answers?.mental16 >= 6) ? 1 : 0;
            return bCritical - aCritical;
        }
        return 0; // Default case to ensure a valid number is always returned
    });
    

    const toggleClassVisibility = (className: string) => {
        setVisibleClasses((prev) => ({
            ...prev,
            [className]: !prev[className],
        }));
    };

    const groupedUsers = Object.entries(
        sortedUsers.reduce((acc, user) => {
            if (user.class) {
                if (!acc[user.class]) acc[user.class] = [];
                acc[user.class].push(user);
            }
            return acc;
        }, {} as { [key: string]: { _id: string; nisn: string; name: string; class?: string }[] })
    );

    return (
        <div>
            <Navbar />
            <BackButton />
            <div className="flex flex-col items-center py-10 px-4 bg-gray-50 min-h-screen mt-4">
                <h1 className="text-2xl font-bold mb-2 text-gray-700">Hasil Checkup</h1>


                <p className="text-lg text-gray-600 mb-6 text-center">
    <span className="font-bold">{submittedCount}</span> dari <span className="font-bold">{users.length}</span> telah mengisi quesioner check-up!<br />
    <span className="font-bold">{suicideCount}</span> dari <span className="font-bold">{submittedCount}</span> memiliki indikasi untuk bunuh diri!
</p>

                

                <input
                    type="text"
                    placeholder="Search by name or NISN"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-6 px-4 py-2 border rounded-md w-full max-w-md text-gray-700 focus:outline-none focus:border-blue-500"
                />

<div className="mb-4 p-4 flex flex-wrap gap-2">
    <button
        onClick={() => setSortBy('name')}
        className={`flex items-center px-4 py-2 border rounded-md ${
            sortBy === 'name' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
        }`}
    >
        <FaSortAlphaDown className="mr-2" />
        Name
    </button>
    <button
        onClick={() => setSortBy('symptom')}
        className={`flex items-center px-4 py-2 border rounded-md ${
            sortBy === 'symptom' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
        }`}
    >
        <FaExclamationTriangle className="mr-2" />
        Problem
    </button>
    <button
        onClick={() => setSortBy('class')}
        className={`flex items-center px-4 py-2 border rounded-md ${
            sortBy === 'class' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
        }`}
    >
        <FaChalkboardTeacher className="mr-2" />
        Class
    </button>
    <button
        onClick={() => setSortBy('suicidal')}
        className={`flex items-center px-4 py-2 border rounded-md ${
            sortBy === 'suicidal' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
        }`}
    >
        <FaSadCry className="mr-2" />
        Suicidal
    </button>
</div>

                {groupedUsers.map(([className, classUsers]) => (
                    <div key={className} className="w-full max-w-6xl mb-6">
                        <h1
                            onClick={() => toggleClassVisibility(className)}
                            className="text-xl font-bold text-black cursor-pointer p-2 bg-gray-100 rounded-md shadow-md hover:bg-gray-300 transition-colors"
                        >
                             {className.toUpperCase()} ({classUsers.length} murid) {visibleClasses[className] ? '▲' : '▼'}
                        </h1>

                        {visibleClasses[className] && (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                {classUsers.map((user) => {
                                    const userReports = reports.filter(report => report.nisn === user.nisn);
                                    const latestReport = userReports.length > 0
                                        ? userReports.reduce((latest, report) =>
                                            new Date(report.createdAt) > new Date(latest.createdAt) ? report : latest)
                                        : null;

                                    const totalSymptoms = latestReport 
                                        ? (latestReport.physicalSymptoms?.length || 0) + (latestReport.mentalSymptoms?.length || 0)
                                        : 0;

                                    const bgColor = totalSymptoms >= 7
                                        ? 'bg-red-200'
                                        : totalSymptoms >= 5
                                            ? 'bg-yellow-200'
                                            : latestReport
                                                ? 'bg-green-200'
                                                : 'bg-white';

                                                const isSuicidal = latestReport?.answers?.[`mental16`] >= 6;
                                                const isHandled = latestReport?.handled == true;
                                                // console.log(isHandled)


                                    return (
                                        <div
                                            key={user._id}
                                            onClick={() => router.push(`/stats/${user.nisn}`)}
                                            className={`relative border rounded-lg p-4 shadow hover:shadow-md transition-shadow cursor-pointer ${bgColor}  !user-select-none`}
                                        >
                                           {(isSuicidal || (latestReport && totalSymptoms >= 7 && !latestReport.handled)) && (
    <div className="absolute top-2 right-2 text-red-600 text-lg inline-flex items-center leading-none">
        { !latestReport.handled && <FaExclamation className="m-0 p-0" />}
        {isSuicidal && <FaExclamationTriangle className="m-0 p-0" />}
    </div>
)}


                                            <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
                                            <p className="text-gray-600">{censorNISN(user.nisn)}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShowPage;
