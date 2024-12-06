"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import swal from 'sweetalert'
import BackButton from '@/components/BackButton';
import Head from 'next/head';

interface QuestionProps {
    label: string;
    name: string;
    options: { value: number }[];
    bestScore: number;
    selectedValue: number;
    isFocused: boolean;
    handleFocus: () => void;
}

interface Report {
    _id: string; // Ensure this line is added
    name: string;
    nisn: string;
    city: string;
    physicalPercentage: number;
    mentalPercentage: number;
    bodyScore: number;
    physicalSymptoms: string[];
    mentalSymptoms: string[];
    suggestion: string;
    answers: { [key: string]: number };
    handled: boolean;
    createdAt: string;
}

const Question: React.FC<QuestionProps> = ({
    label,
    name,
    options,
    bestScore,
    selectedValue,
    isFocused,
    handleFocus,
}) => {
    const getColorClass = (value: number) => {
        if (value === 1) return "text-red-500 border-red-500";
        if (value === 2) return "text-orange-500 border-orange-500";
        if (value === 3) return "text-yellow-500 border-yellow-500";
        if (value === 4) return "text-yellow-400 border-yellow-400";
        if (value === 5) return "text-green-400 border-green-400";
        if (value === 6) return "text-green-500 border-green-500";
        return "text-green-600 border-green-600";
    };

    const getSizeClass = (index: number) => {
        const sizeMap = [
            'h-12 w-12 border-[3px]',
            'h-10 w-10 border-[3px]',
            'h-8 w-8 border-[3px]',
            'h-6 w-6 border-[3px]',
            'h-8 w-8 border-[3px]',
            'h-10 w-10 border-[3px]',
            'h-12 w-12 border-[3px]'
        ];
        return sizeMap[index] || 'h-6 w-6 border';
    };

    return (
        <div
            className={`mb-4 w-full border-b border-gray-300 pb-4 transition-opacity duration-300 p-4 ${
                isFocused ? "opacity-100" : "opacity-30"
            } p-2 sm:p-4 lg:p-6`}
            onClick={handleFocus}
        >
            <div className="text-lg font-semibold text-center text-gray-700 text-2xl">{label}</div>
            <div className="flex justify-center items-center gap-2 sm:gap-4 lg:gap-6 mt-4">
                {options.map((option, index) => (
                    <label key={index} className="flex flex-col items-center cursor-pointer">
                        <span
                            className={`${getSizeClass(index)} rounded-full border-4 flex justify-center items-center ${getColorClass(
                                option.value
                            )}`}
                        >
                            <span
                                className={`rounded-full transition-colors duration-200 ease-in-out ${
                                    selectedValue === option.value
                                        ? 'bg-current h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8'
                                        : 'bg-transparent h-3 w-3 sm:h-5 sm:w-5 lg:h-7 lg:w-7'
                                }`}
                            />
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
};

const ScoreDisplay: React.FC<{ label: string; score: number; color: string }> = ({ label, score, color }) => (
    <div className="mb-4">
        <div className="text-lg font-semibold">{label}</div>
        <div className="flex items-center mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                <motion.div
                    className={`h-2.5 rounded-full ${color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
            <span className="text-sm font-medium">{score}%</span>
        </div>
    </div>
);


interface ProfilePictureProps {
    username: string;
  }
  
  function ProfilePicture({ username }: ProfilePictureProps) {
    const firstLetter = username.charAt(0).toUpperCase();
    return (
        <div className="flex items-center justify-center mb-4"> {/* Center the profile picture */}
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-200 text-gray-600 text-2xl">
                {firstLetter}
            </div>
        </div>
    );
}


const physicalQuestions = [
    { label: "Seberapa sering Anda berolahraga?", name: "physical1", bestScore: 7, symptomName: "Aktivitas Rendah" },
    { label: "Apakah Anda merasa sehat secara fisik?", name: "physical2", bestScore: 7, symptomName: "Kesehatan Fisik Buruk" },
    // { label: "Apakah Anda memiliki rasa sakit kronis?", name: "physical3", bestScore: 1, symptomName: "Nyeri Kronis" },
    { label: "Bagaimana Anda menilai kekuatan fisik Anda?", name: "physical4", bestScore: 7, symptomName: "Kekuatan Fisik Rendah" },
    { label: "Apakah Anda mendapatkan cukup tidur?", name: "physical5", bestScore: 7, symptomName: "Masalah Tidur" },
    // { label: "Apakah Anda sering merasa lelah sepanjang hari?", name: "physical6", bestScore: 1, symptomName: "Kelelahan" },
    // { label: "Seberapa baik pola makan Anda?", name: "physical7", bestScore: 7, symptomName: "Pola Makan Buruk" },
    // { label: "Seberapa sering Anda merasa sakit atau demam?", name: "physical8", bestScore: 1, symptomName: "Sering Sakit" },
    // { label: "Apakah Anda merasa bugar untuk melakukan aktivitas sehari-hari?", name: "physical9", bestScore: 7, symptomName: "Kebugaran Rendah" },
    { label: "Apakah Anda memiliki masalah dengan berat badan?", name: "physical10", bestScore: 1, symptomName: "Masalah Berat Badan" },
];

const mentalQuestions = [
    { label: "Seberapa sering Anda merasa cemas?", name: "mental1", bestScore: 1, symptomName: "Kecemasan" },
    { label: "Apakah Anda mengalami depresi?", name: "mental2", bestScore: 1, symptomName: "Depresi" },
    { label: "Apakah Anda tetap tenang di bawah tekanan?", name: "mental3", bestScore: 7, symptomName: "Masalah Stres" },
    { label: "Apakah Anda menikmati interaksi sosial?", name: "mental4", bestScore: 7, symptomName: "Penarikan Sosial" },
    { label: "Bagaimana fokus dan konsentrasi Anda?", name: "mental5", bestScore: 7, symptomName: "Konsentrasi Buruk" },
    { label: "Apakah Anda kesulitan tidur karena stres?", name: "mental6", bestScore: 1, symptomName: "Insomnia Terkait Stres" },
    { label: "Seberapa sering Anda merasa bahagia?", name: "mental7", bestScore: 7, symptomName: "Kebahagiaan Rendah" },
    { label: "Apakah Anda mengalami perubahan suasana hati?", name: "mental8", bestScore: 1, symptomName: "Perubahan Suasana Hati" },
    { label: "Bagaimana Anda menilai kesehatan mental Anda secara keseluruhan?", name: "mental9", bestScore: 7, symptomName: "Kesehatan Mental Buruk" },
    { label: "Apakah Anda memiliki dukungan untuk kesehatan mental?", name: "mental10", bestScore: 7, symptomName: "Kurangnya Dukungan" },
    { label: "Apakah Anda sering merasa kewalahan dengan tugas sehari-hari?", name: "mental11", bestScore: 1, symptomName: "Kewalahan" },
    { label: "Seberapa baik Anda dapat mengelola stres?", name: "mental12", bestScore: 7, symptomName: "Masalah Manajemen Stres" },
    { label: "Apakah Anda merasa kesepian meskipun berada di sekitar orang lain?", name: "mental13", bestScore: 1, symptomName: "Kesepian" },
    { label: "Seberapa sering Anda merasa termotivasi untuk melakukan sesuatu?", name: "mental14", bestScore: 7, symptomName: "Motivasi Rendah" },
    { label: "Apakah Anda merasa hidup Anda memiliki tujuan yang jelas?", name: "mental15", bestScore: 7, symptomName: "Kurangnya Tujuan" },
    // School-related questions
    { label: "Apakah kamu merasa ingin mengakhiri hidup?", name: "mental16", bestScore: 1, symptomName: "Keinginan Mengakhiri Hidup" },
    { label: "Apakah kamu merasa tidak mampu menyelesaikan tugas sekolah?", name: "mental17", bestScore: 1, symptomName: "Kesulitan Menyelesaikan Tugas" },
    { label: "Apakah kamu merasa cemas tentang ujian atau tugas besar?", name: "mental18", bestScore: 1, symptomName: "Kecemasan Ujian" },
    { label: "Apakah kamu merasa tidak dihargai di lingkungan sekolah?", name: "mental19", bestScore: 1, symptomName: "Tidak Dihargai" },
    { label: "Apakah kamu merasa sulit bergaul dengan teman-teman di sekolah?", name: "mental20", bestScore: 1, symptomName: "Kesulitan Sosial di Sekolah" },
];

const StatsPage = () => {
    const { id } = useParams();
    const [reportData, setReportData] = useState<Report[] | null>(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPhysicalQuestions, setShowPhysicalQuestions] = useState<boolean[]>([]);
    const [showMentalQuestions, setShowMentalQuestions] = useState<boolean[]>([]);
    const router = useRouter();


    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get(`/api/reports?nisn=${id}`);
                setReportData(response.data);
                // Initialize the show states for physical and mental questions
                setShowPhysicalQuestions(new Array(response.data.length).fill(false));
                setShowMentalQuestions(new Array(response.data.length).fill(false));
            } catch (error) {
                setError('Failed to load report data');
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [id]);

    useEffect(() => {
        if (reportData && reportData.length > 0) {
            document.title = `${reportData[0]?.name}'s Statistics`;
        } else {
            document.title = `${id} Statistics`;
        }
    }, [reportData]);


    const handleCheckboxChange = async (reportId: string, handled: boolean) => {
        // Show loading animation while making the request
        swal({
            title: "Please wait...",
            text: "Updating the report status...",
            icon: "info",
            buttons: undefined, // Disable the button
            closeOnClickOutside: false, // Disable outside click
            closeOnEsc: false, // Disable escape key to close
            content: {
                element: "div",
                attributes: {
                    innerHTML: "<div class='loading-spinner'></div>", // Optional: custom loading spinner
                },
            },
        });
    
        try {
            // Make the API request
            await axios.put('/api/saveData', { id: reportId, handled });
    
            // On success, show success message
            swal("Success!", "The report status has been updated.", "success");
    
            // Update the local state
            setReportData(prevData =>
                prevData ? prevData.map(report =>
                    report._id === reportId ? { ...report, handled } : report
                ) : null
            );
        } catch (error) {
            // Handle any error that occurs
            console.error('Failed to update report status:', error);
            swal("Oops!", "Failed to update the report status. Please try again.", "error");
        }
    };

        const handleDeleteReport = async (reportId: string, remainingReports: number) => {
            swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover this report!",
                icon: "warning",
                buttons: ["Cancel", "Yes, delete it!"],
                dangerMode: true,
            }).then(async (willDelete) => {
                if (willDelete) {
                    try {
                        const response = await axios.delete(`/api/reports`, { data: { _id: reportId } });
        
                        if (response.status === 200) {
                            swal("Poof! The report has been deleted!", {
                                icon: "success",
                            }).then(() => {
                                if (remainingReports > 1) {
                                    // Refresh the current page
                                    window.location.reload();
                                } else {
                                    // Redirect to /list-siswa
                                    router.push("/list-siswa");
                                }
                            });
                        }
                    } catch (error) {
                        console.error("Error deleting report:", error);
                        swal("Oops!", "Failed to delete the report. Please try again.", "error");
                    }
                }
            });
        };
    
    if (loading) {
        return (
            <div>
                <Navbar />
            <p className="text-lg text-gray-800 flex items-center justify-center min-h-screen">Loading...</p>
            </div>
        )
    }

    
    // if (error) return <p>{error}</p>;

    return (
        <>
        {reportData && reportData.length > 0 && (
    <Head>
        <title>{reportData[0]?.name}'s Statistics</title>
        <meta name="description" content={`${reportData[0]?.name}'s detailed statistics`} />
        <meta property="og:title" content={`${reportData[0]?.name}'s Statistics`} />
    </Head>
)}

        
        <div>
            <Navbar />
            <BackButton/>
            <div className="flex flex-col items-center py-10 px-4 bg-gray-50 min-h-screen mt-4">
                {reportData && reportData.length > 0 ? (
                    reportData.map((report: any, index: any) => (
                        <React.Fragment key={index}>
                            <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg mb-10">
                                {index === 0 && (  // Display name and NISN only for the first report
                                    <div>
                                        <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">
                                            <ProfilePicture username={report?.name} />
                                            {report.name}'s Statistics
                                        </h1>
                                        <p className="text-gray-600 mb-6 text-center">{report.nisn}</p>
                                    </div>
                                )}
                                {index !== 0 && (  // Display report number only for subsequent reports
                                    <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center p-4 rounded-lg shadow-md">
                                        Laporan ke-{index + 1}
                                    </h1>
                                )}
                                <div className="mt-4 text-center text-2xl mb-4">
                                    {report.city}
                                    <hr className="border-t-2 mb-4 border-gray-300" />
                                </div>
                                
                                <div className='mt-4'>
                                    <ScoreDisplay label="Physical Health" score={report.physicalPercentage} color="bg-green-500" />
                                    <ScoreDisplay label="Mental Health" score={report.mentalPercentage} color="bg-blue-500" />
                                    <ScoreDisplay label="Body Score" score={report.bodyScore} color="bg-purple-500" />
                                </div>

                                <div className="mt-6">
                                    {(report.physicalSymptoms.length > 0 || report.mentalSymptoms.length > 0) && (
                                        <>
                                            {report.physicalSymptoms.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {report.physicalSymptoms.map((symptom: any, index: any) => (
                                                        <div key={index} className="bg-blue-100 text-blue-800 font-semibold px-4 py-2 rounded-lg shadow-md">
                                                            {symptom}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {report.mentalSymptoms.length > 0 && (
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {report.mentalSymptoms.map((symptom: any, index: any) => (
                                                        <div key={index} className="bg-green-100 text-green-800 font-semibold px-4 py-2 rounded-lg shadow-md">
                                                            {symptom}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                <div className="mt-4 text-center p-4 bg-gray-100 rounded">
                                    <h2 className="text-lg font-semibold">Rekomendasi AI:</h2>
                                    <p dangerouslySetInnerHTML={{
                                        __html: report.suggestion.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                                    }} />
                                </div>
                                <div className="flex items-center mt-4">
                                <input
    type="checkbox"
    checked={report.handled || false}
    onChange={(e) => handleCheckboxChange(report._id, e.target.checked)}
    className="mr-2 w-6 h-6 rounded-full border-2 border-gray-300 checked:bg-blue-500 checked:border-blue-500 focus:outline-none"
/>
<label className="text-gray-700">Sudah Ditangani</label>

                    </div>

                                <div className="mt-6">
                                    {/* Toggle button for Physical Questions */}
                                    <h2
                                        className="text-xl font-semibold text-gray-800 px-4 py-2 rounded-lg shadow-md cursor-pointer"
                                        onClick={() => {
                                            const newShowStates = [...showPhysicalQuestions];
                                            newShowStates[index] = !newShowStates[index];
                                            setShowPhysicalQuestions(newShowStates);
                                        }}
                                    >
                                        Pertanyaan Fisik {showPhysicalQuestions[index] ? '▲' : '▼'}
                                    </h2>
                                    {showPhysicalQuestions[index] && (
                                        <div className="mt-4">
                                            {/* Replace `physicalQuestions` with your actual questions array */}
                                            {physicalQuestions.map((question, qIndex) => (
                                                <Question
                                                    key={qIndex}
                                                    label={question.label}
                                                    name={question.name}
                                                    options={[{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }, { value: 6 }, { value: 7 }]}
                                                    bestScore={question.bestScore}
                                                    selectedValue={report.answers[question.name] || 0}
                                                    isFocused={false}
                                                    handleFocus={() => {}}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Toggle button for Mental Questions */}
                                    <h2
                                        className="text-xl font-semibold text-gray-800 px-4 py-2 rounded-lg shadow-md cursor-pointer mt-6"
                                        onClick={() => {
                                            const newShowStates = [...showMentalQuestions];
                                            newShowStates[index] = !newShowStates[index];
                                            setShowMentalQuestions(newShowStates);
                                        }}
                                    >
                                        Pertanyaan Mental {showMentalQuestions[index] ? '▲' : '▼'}
                                    </h2>
                                    {showMentalQuestions[index] && (
                                        <div className="mt-4">
                                            {/* Replace `mentalQuestions` with your actual questions array */}
                                            {mentalQuestions.map((question, qIndex) => (
                                                <Question
                                                    key={qIndex}
                                                    label={question.label}
                                                    name={question.name}
                                                    options={[{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }, { value: 6 }, { value: 7 }]}
                                                    bestScore={question.bestScore}
                                                    selectedValue={report.answers[question.name] || 0}
                                                    isFocused={false}
                                                    handleFocus={() => {}}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="bg-blue-100 text-blue-800 font-semibold px-3 py-1 rounded-lg shadow-md mb-6 text-left mt-8 w-fit">
                                    {format(new Date(report.createdAt), 'MMMM d, yyyy h:mm a')}
                                </div>
                                <div className="flex justify-start mt-6">
    <button
        onClick={() => handleDeleteReport(report._id, reportData.length)}
        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
    >
        Delete
    </button>
</div>

                            </div>
                        </React.Fragment>
                    ))
                ) : (
                    <div className="flex justify-center items-center min-h-screen text-gray-600 text-xl font-semibold text-center">
                        {id} belum melakukan checkup!
                    </div>
                )}
            </div>
        </div>
        </>
    );
};

export default StatsPage;
