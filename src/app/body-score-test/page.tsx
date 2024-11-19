"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import swal from 'sweetalert';
import useSWR from 'swr'

// Question component
interface QuestionProps {
    label: string;
    name: string;
    options: { label: string, value: number }[];
    bestScore: number;
    onChange: (name: string, value: number) => void;
    isFocused: boolean;
    handleFocus: () => void;
    selectedValue: number; 
    focusedindex: number,
    currentindex: number
}

type Question = {
    label: string;
    name: string;
    bestScore: number;
    symptomName: string;
};

type Answer = { [key: string]: number };

const Question: React.FC<QuestionProps> = ({
    label,
    name,
    options,
    bestScore,
    onChange,
    isFocused,
    handleFocus,
    selectedValue,
    focusedindex,
    currentindex
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
        // Adjust button size depending on position with thinner borders
        const sizeMap = [
            'h-12 w-12 border-[3px]', // Thinner border
            'h-10 w-10 border-[3px]',
            'h-8 w-8 border-[3px]',
            'h-6 w-6 border-[3px]', // Thinner border for smaller circles
            'h-8 w-8 border-[3px]',
            'h-10 w-10 border-[3px]',
            'h-12 w-12 border-[3px]'
        ];
        return sizeMap[index] || 'h-6 w-6 border'; // Default size with thinner border
    };
    

    return (
        <div
            className={`mb-4 w-full border-b border-gray-300 pb-4 transition-opacity duration-300 p-4 ${
                isFocused ? "opacity-100" : "opacity-30"
            } p-2 sm:p-4 lg:p-6`}
            onClick={handleFocus}
        >
            {/* Question Label */}
            <div className="text-lg font-semibold text-center text-gray-700 text-2xl">{label}</div>

            {/* Circle Radio Buttons */}
            <div className="flex justify-center items-center gap-2 sm:gap-4 lg:gap-6 mt-4">
                {options.map((option, index) => (
                    <label key={index} className="flex flex-col items-center cursor-pointer">
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            onChange={(e) => onChange(name, parseInt(e.target.value))}
                            className="hidden"
                            disabled={!isFocused}
                        />
                        {/* Circle representing the option */}
                        <span
                            className={`${getSizeClass(index)} rounded-full border-4 flex justify-center items-center ${getColorClass(
                                option.value
                            )}`}
                        >
                            {/* Toggle dot appears if this option is selected */}
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

            {/* Agree and Disagree labels */}
            <div className="flex justify-between mt-4">
                {/* <span className="text-purple-600 text-lg font-semibold">Disagree<br></br>/Rarely<br></br>/Bad</span>
                <span className="text-green-600 text-lg font-semibold">Agree<br></br>/Often<br></br>/Good</span> */}
            </div>
        </div>
    );
};




// Circular ScoreDisplay component
const ScoreDisplay: React.FC<{ label: string, score: number, color: string }> = ({
    label,
    score,
    color,
}) => (
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

interface AnswerSet {
    [key: string]: number;
}

export default function QuestionnaireWithScores() {
     const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [physicalScore, setPhysicalScore] = useState<number>(0);
  const [mentalScore, setMentalScore] = useState<number>(0);
  const [lat, setLat] = useState<number>(0);
  const [lon, setLon] = useState<number>(0);
  const [bodyScore, setBodyScore] = useState<number>(0);
  const [scaledPm25, setScaledPm25] = useState<number>(0); // Scaled PM2.5 value
  const [result, setResult] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [query, setQuery] = useState<string>(""); // Search query for cities
  const [suggestions, setSuggestions] = useState<{ name: string; country: string; lat: number; lon: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string>(""); 
  const [focusindex, setFocusIndex] = useState<number | 0>(0)
  const [alldone, setAlldone] = useState<boolean>(false)
  const [physicalSymptoms, setPhysicalSymptoms] = useState<string[]>([]);
  const [mentalSymptoms, setMentalSymptoms] = useState<string[]>([]);
  const [aisuggestion, setaiSuggestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedName, setSelectedName] = useState<{ nisn: string; name: string } | null>(null);



    const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const physicalQuestions: Question[] = [
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
    
    const mentalQuestions: Question[] = [
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
    
    
    
    function classifySymptoms(answers: Answer) {
        const physicalSymptoms: string[] = [];
        const mentalSymptoms: string[] = [];
    
        const classify = (questions: Question[], symptomsList: string[]) => {
            questions.forEach((q) => {
                const score = answers[q.name];
                const isSymptom =
                    // (q.bestScore === 7 && score <= 2) || // Bad if bestScore is 5, user score 1-2
                    // (q.bestScore === 1 && score >= 5)
                    (q.bestScore === 7 && score <= 2) || // Bad if bestScore is 5, user score 1-2
                    (q.bestScore === 1 && score >= 6)    
                if (isSymptom) {
                    symptomsList.push(q.symptomName); // Adds the symptom name instead of label
                }
            });
        };
    
        // Classify physical and mental symptoms
        classify(physicalQuestions, physicalSymptoms);
        classify(mentalQuestions, mentalSymptoms);
    
        return { physicalSymptoms, mentalSymptoms };
    }
    
    
    
    
    
    

    const allQuestions = [...physicalQuestions, ...mentalQuestions];

    const handleAnswerChange = (name: string, value: number) => {
      setAnswers((prev) => ({ ...prev, [name]: value }));
      
      // Automatically move to the next question when answered
      if (currentQuestionIndex < allQuestions.length - 1) {
          setTimeout(() => {
              setCurrentQuestionIndex(currentQuestionIndex + 1);
              questionRefs.current[currentQuestionIndex + 1]?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
              });
          }, 300);
      }
  };
  
  // Use useEffect to monitor changes in answers
  useEffect(() => {
    // if(scaledPm25 === 0 || scaledPm25 == null) {
    //     setScaledPm25(33)
    // }
    // console.log(scaledPm25)
      if (Object.keys(answers).length === allQuestions.length) {
          console.log("All questions have been answered.");
          setAlldone(true);
          calculateScore(); // Trigger calculateScore once all questions are answered
      }
  }, [answers]);
  
  

    

    const calculateQuestionScore = (answer: number, bestScore: number) => {
        const maxScore = 100; // Maximum score per question
        const scoreDiff = Math.abs(answer - bestScore);
        const score = maxScore - (scoreDiff * (maxScore / 7)); // Reduce score based on the distance from the bestScore (0-6 range)
        return Math.max(score, 0); // Ensure score is not negative
    };
    

    const calculateScore = async () => {
      if (!scaledPm25 || !selectedName) return;
  
      console.log(answers)
      setIsLoading(true); // Set loading to true before API call
  
      const classifiedSymptoms = classifySymptoms(answers);
      setPhysicalSymptoms(classifiedSymptoms.physicalSymptoms);
      setMentalSymptoms(classifiedSymptoms.mentalSymptoms);
  
      const physicalTotal = physicalQuestions.reduce((total, question) => {
          const answer = answers[question.name] || 5;
          return total + calculateQuestionScore(answer, question.bestScore);
      }, 0);
  
      const mentalTotal = mentalQuestions.reduce((total, question) => {
          const answer = answers[question.name] || 5;
          return total + calculateQuestionScore(answer, question.bestScore);
      }, 0);
  
      const physicalPercentage = Math.round(physicalTotal / physicalQuestions.length);
      const mentalPercentage = Math.round(mentalTotal / mentalQuestions.length);
  
      setPhysicalScore(physicalPercentage);
      setMentalScore(mentalPercentage);
  
      const scaledPm25Adjusted = Math.abs(scaledPm25);
      const bodyScoreCalc = Math.round((physicalPercentage + mentalPercentage + scaledPm25Adjusted) / 3);
      const finalBodyScore = Math.max(0, Math.min(100, bodyScoreCalc));
  
      setBodyScore(finalBodyScore);
      setResult(finalBodyScore);
  
      // Determine prompt based on presence of symptoms
      const prompt = (classifiedSymptoms.physicalSymptoms.length > 0 || classifiedSymptoms.mentalSymptoms.length > 0)
          ? `Based on these symptoms: ${JSON.stringify(classifiedSymptoms)}, provide a brief recommendation with specific actions to improve health. Please keep the answer short, in one paragraph, and in Indonesian.`
          : "Provide a brief recommendation to improve overall quality of life with specific actions. Keep it short, in one paragraph, and in Indonesian.";
  
      // Send request to AI suggest API
      try {
          const response = await fetch("/api/ai-suggest", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ prompt })
          });
  
          if (response) {
              const { generatedText } = await response.json();
              setaiSuggestion(generatedText); // Set the AI's suggestion
  
              // Save data to /api/saveData
              await fetch("/api/saveData", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: selectedName.name,
                    // nisn: selectedName.nisn,
                    physicalPercentage,
                    mentalPercentage,
                    bodyScore: finalBodyScore,
                    physicalSymptoms: classifiedSymptoms.physicalSymptoms,
                    mentalSymptoms: classifiedSymptoms.mentalSymptoms,
                    answers,
                    suggestion: generatedText,
                    city: selectedCity
                    
                    // Add answers to the data being saved
                })
              });
          } else {
              console.error("Failed to fetch AI suggestion.");
          }
      } catch (error) {
          console.error("Error during fetch:", error);
      } finally {
          setIsLoading(false); // Stop loading after API call completes
      }
  };
  
    
    


    const calculateScaledPm25 = (pm25Value: number) => {
        if (pm25Value === null || pm25Value === 0) return setScaledPm25(33)
      const maxPm25 = 1000; 
      const invertedScaledValue = Math.max(((maxPm25 - pm25Value) / maxPm25) * 100, 0); 
      const adjustedScaledValue = (invertedScaledValue * 100) / 100;
      
      const absoluteScaledValue = Math.abs(Math.round(adjustedScaledValue));
    
      setScaledPm25(absoluteScaledValue); 
    };
    
  


      const fetchCities = async (query: string) => {
        if (!query) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/city/suggestion?query=${query}`);
          const data = await res.json();
          const citySuggestions = data.map((city: any) => ({
            name: city.name,
            country: city.country,
            lat: city.lat,
            lon: city.lon,
          }));
          if (citySuggestions.length > 0) {
            setLon(citySuggestions[0].lon);
            setLat(citySuggestions[0].lat);
          }
          setSuggestions(citySuggestions);
        } catch (error) {
          console.error('Error fetching city suggestions:', error);
        } finally {
          setLoading(false);
        }
      };
      
      
      const fetchAirPollutionData = async (lat: number, lon: number) => {
        try {
          const res = await fetch(`/api/weather/get?lat=${lat}&lon=${lon}`);
          const data = await res.json();
          
          if (data.pm25Value) {
            // Handle the PM2.5 value
            calculateScaledPm25(data.pm25Value);
          } else {
            console.error('Error fetching PM2.5 data:', data.error);
          }
        } catch (error) {
          console.error('Error fetching air pollution data:', error);
        }
      };
      

    const handleQuestionFocus = (index: number) => {
      // Check if all questions are answered
      const allDone = allQuestions.every((question) => answers[question.name]);
  
      if (allDone) {
          // Scroll to the bottom if all questions are answered
          document.documentElement.scrollIntoView({ behavior: "smooth", block: "end" });
          console.log("All questions are answered, scrolling to the bottom.");
          return; // Exit the function to prevent further execution
      }
  
      // Find the first unanswered question if `allDone` is false
      const firstUnansweredIndex = allQuestions.findIndex((question) => !answers[question.name]);
  
      if (index <= currentQuestionIndex || answers[currentQuestionIndex]) {
          setCurrentQuestionIndex(index);
          questionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
          setFocusIndex(index);
          console.log("focus", index);
      } else if (firstUnansweredIndex !== -1) {
          // Focus on the first unanswered question
          setCurrentQuestionIndex(firstUnansweredIndex);
          questionRefs.current[firstUnansweredIndex]?.scrollIntoView({
              behavior: "smooth",
              block: "center"
          });
          setFocusIndex(firstUnansweredIndex);
          console.log("Please answer the current question before moving to the next one.");
      }
  };
  
    
    

  const handleCitySelection = (city: { name: string; lat: number; lon: number }) => {
    if (!selectedName) {
        swal("Notification", "Silahkan pilih nama terlebih dahulu!", "warning");
        return; 
    }

    // console.log("alldone: ", alldone);
    setSelectedCity(city.name);
    // console.log("test lat: ", city.lat);  
    // console.log("test lon: ", city.lon);
    setSuggestions([]); // Clear suggestions
    fetchAirPollutionData(city.lat, city.lon);
    // console.log(`City selected: ${city.name}`);
    // console.log("djasgdyjfasyjdtfahjsdgaj" + currentQuestionIndex)

    // Fetch PM2.5 data later if needed
};

  const [users, setUsers] = useState<{ NISN: string; name: string }[]>([]);
  const [nameSuggestions, setNameSuggestions] = useState<{ NISN: string; name: string }[]>([]);
  const [nameQuery, setNameQuery] = useState(''); // Query for name search

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/fetchuser');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      console.log(data);
      setUsers(data.users); // Save fetched users to state
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUser(); 
  }, []);
  
  // Update name suggestions based on nameQuery input
  useEffect(() => {
    if (nameQuery) {
      const filteredSuggestions = users.filter(user =>
        user.name.toLowerCase().includes(nameQuery.toLowerCase())
      );
      setNameSuggestions(filteredSuggestions);
    } else {
      setNameSuggestions([]); // Clear suggestions if input is empty
    }
  }, [nameQuery, users]);
  
  // Update city suggestions based on query input
  useEffect(() => {
    if (query) {
      fetchCities(query);
    } else {
      setSuggestions([]); // Clear suggestions if input is empty
    }
  }, [query]);
  

      const handleNameSelection = (user: any) => {
        setSelectedName(user);
        // setQuery(user.name); // Populate input with selected name
        setNameSuggestions([]); // Clear suggestions after selection
      };

    //   console.log(selectedName?.nisn)
    return (
      <div>
          <Navbar />
          <div
  className={`min-h-screen ${
    selectedName?.name === "RAISSA SETIANINGTIAS"
      ? "bg-pink-100"
      : selectedName?.name === "SHABRINA ZAHRA SYITA"
      ? "bg-yellow-300"
      : selectedName?.name === "MUHAMMAD AZZAM RUSKA" || selectedName?.name === "WILLIS RIHATMAN JOKO KANON"
      ? "bg-green-300"
      : "bg-sepia-100"
  } flex items-center justify-center p-4 text-black`}
>

              <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full">
                  {/* Name Selection */}
                  {!selectedCity && (
                      <div className="mt-4 text-center p-4">
                          <div className="mt-4 text-center p-4">
                              <div className="p-4 rounded-lg shadow-md inline-block">
                                  <h1 className="text-3xl font-bold">Kuesioner Kesehatan</h1>
                              </div>
                          </div>
                          <h1 className="text-sm text-center text-gray-600 p-4">Pilih darimana asalmu dan dimana kamu tinggal!</h1>
                          <label className="block text-lg">Nama Kamu:</label>
                          {!selectedName ? (
                              <input
                                  type="text"
                                  value={nameQuery}
                                  onChange={(e) => setNameQuery(e.target.value)} // Update name query
                                  placeholder="Search for a name..."
                                  className="border border-gray-300 rounded p-2 mb-4"
                                  required
                              />
                          ) : (
                              <p className="text-lg">{selectedName.name}</p> // Display the selected name
                          )}
                          <hr className="border-t-2 border-gray-300" />
                          {nameSuggestions.length > 0 && nameQuery && (
                              <ul className="mt-2 border border-gray-300 rounded bg-white">
                                  {nameSuggestions.map((user, index) => (
                                      <li
                                          key={index}
                                          onClick={() => {
                                              handleNameSelection(user); // Handle name selection // Clear name suggestions after selection
                                          }}
                                          className="p-2 cursor-pointer hover:bg-gray-200 text-center"
                                      >
                                          {user.name}
                                      </li>
                                  ))}
                              </ul>
                          )}
  
                          {/* City Selection */}
                          <div className="mt-4 text-center p-4">
                              <label className="block text-lg">Asal Kamu:</label>
                              <input
                                  type="text"
                                  value={query}
                                  onChange={(e) => setQuery(e.target.value)} // Update city query
                                  placeholder="Search for a city..."
                                  className="border border-gray-300 rounded p-2 mb-4"
                                  required
                              />
                              <hr className="border-t-2 border-gray-300" />
                              {loading && <p>Loading...</p>}
                              {suggestions.length > 0 && query && (
                                  <ul className="mt-2 border border-gray-300 rounded bg-white">
                                      {suggestions.map((city, index) => (
                                          <li
                                              key={index}
                                              onClick={() => handleCitySelection(city)} // Handle city selection
                                              className="p-2 cursor-pointer hover:bg-gray-200 text-center"
                                          >
                                              {city.name}, {city.country}
                                          </li>
                                      ))}
                                  </ul>
                              )}
                          </div>
                      </div>
                  )}
  
                  {selectedCity && result === null && (
                      <>
                          <div className="mt-4 text-center p-4">
                              <div className="p-4 rounded-lg shadow-md inline-block">
                                  <h1 className="text-3xl font-bold">Kuesioner Kesehatan</h1>
                              </div>
                          </div>
                          <h1 className="text-sm mb-6 text-center text-gray-600 p-4">
  {selectedName?.name === "RAISSA SETIANINGTIAS" 
    ? "Halo sayangkuu, jangan curang yaaa, aku bisa lihat soalnya" 
    : selectedName?.name === "SHABRINA ZAHRA SYITA" 
    ? "Halo bebek 🦆" 
    : `Hai ${selectedName?.name || 'Pengguna'}. Ini adalah kuesioner kesehatan SMAN 12 Jakarta untuk mengukur kondisi fisik dan mental siswa, memberikan gambaran kesehatan saat ini, dan rekomendasi tindakan untuk meningkatkan kualitas hidup.`}
</h1>

                          <div className="mt-4 text-center text-2xl mb-4">
                              {selectedCity} <br />({scaledPm25}/100)
                              <hr className="border-t-2 mb-4 border-gray-300" />
                          </div>
                          <div className="flex flex-col items-center justify-center text-2xl">
                              {allQuestions.map((question, index) => (
                                  <div
                                      key={index}
                                      ref={(el: any) => (questionRefs.current[index] = el)}
                                      className="w-full"
                                  >
                                      <Question
                                          label={question.label}
                                          name={question.name}
                                          options={[
                                              { label: "1", value: 1 },
                                              { label: "2", value: 2 },
                                              { label: "3", value: 3 },
                                              { label: "4", value: 4 },
                                              { label: "5", value: 5 },
                                              { label: "6", value: 6 },
                                              { label: "7", value: 7 },
                                          ]}
                                          bestScore={question.bestScore}
                                          onChange={handleAnswerChange}
                                          isFocused={index === currentQuestionIndex}
                                          handleFocus={() => handleQuestionFocus(index)}
                                          selectedValue={answers[question.name] || 0}
                                          currentindex={currentQuestionIndex}
                                          focusedindex={focusindex}
                                      />
                                  </div>
                              ))}
                          </div>

                          {alldone && (
                            <div className="mt-8 text-center">
                              <button
                                  onClick={calculateScore} // Call calculateScore on button click
                                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                                  disabled={!alldone}
                              >
                                  Submit
                              </button>
                          </div>
                          )}
  


                          {/* Submit Button */}
                          
                      </>
                  )}
  
                  {result !== null && (
                      <div className="">
                          <div className="mt-2 text-center p-4">
                              <div className="p-4 rounded-lg shadow-md inline-block">
                                  <h1 className="text-3xl font-bold">Hasil Kuesioner Kesehatan</h1>
                              </div>
                          </div>
                          <h1 className="text-sm mb-6 text-center text-gray-600 p-4">
                              Hai {selectedName?.name || 'Pengguna'}, {bodyScore >= 70 ? " kesehatan Anda sangat baik! Terus jaga gaya hidup sehat." : bodyScore >= 63 ? " kesehatan Anda baik, tetapi masih ada ruang untuk perbaikan." : " kesehatan Anda perlu perhatian lebih. Pertimbangkan untuk berkonsultasi dengan profesional kesehatan."}
                          </h1>
  
                          {selectedCity && (
                              <div className="mt-4 text-center text-2xl mb-4">
                                  {selectedCity}
                                  <hr className="border-t-2 mb-4 border-gray-300" />
                              </div>
                          )}
                          <ScoreDisplay label="Nilai Fisik" score={physicalScore} color="bg-green-500" />
                          <ScoreDisplay label="Nilai Mental" score={mentalScore} color="bg-purple-500" />
                          <ScoreDisplay label="Nilai Lingkungan" score={scaledPm25} color="bg-blue-500" />
                          <ScoreDisplay label="Nilai Tubuh" score={bodyScore} color="bg-yellow-500" />
                          <hr className="border-t-2 mb-4 border-gray-300" />
  
                          {isLoading ? (
                              <div className="mt-4 text-center p-4 bg-gray-100 rounded">
                                  <p>Waiting for Google Gemini response...</p>
                              </div>
                          ) : (
                              aisuggestion && (
                                  <div className="mt-4 text-center p-4 bg-gray-100 rounded">
                                      <h2 className="text-lg font-semibold">Rekomendasi AI:</h2>
                                      <p dangerouslySetInnerHTML={{
                                          __html: aisuggestion.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                                      }} />
                                  </div>
                              )
                          )}
  
                          {/* Display Symptoms if any */}
                          {physicalSymptoms.length > 0 && (
                              <div className="mt-4">
                                  <h2 className="text-xl font-semibold">Gejala Fisik:</h2>
                                  <ul className="list-disc list-inside text-red-600">
                                      {physicalSymptoms.map((symptom, index) => (
                                          <li key={index}>{symptom}</li>
                                      ))}
                                  </ul>
                              </div>
                          )}
  
                          {mentalSymptoms.length > 0 && (
                              <div className="mt-4">
                                  <h2 className="text-xl font-semibold">Gejala Mental:</h2>
                                  <ul className="list-disc list-inside text-red-600">
                                      {mentalSymptoms.map((symptom, index) => (
                                          <li key={index}>{symptom}</li>
                                      ))}
                                  </ul>
                              </div>
                          )}
                      </div>
                  )}
              </div>
          </div>
      </div>
  );
      
}
