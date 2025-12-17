import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { getTestResult } from "../api";
import Loading from "../components/Loading";
import { Brain, CheckCircle, XCircle, ArrowLeft, Trophy, Target } from "lucide-react";

const TestResult = () => {
    const { id } = useParams();
    const location = useLocation();
    const [result, setResult] = useState(location.state?.result || null);
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAnswers, setShowAnswers] = useState(false);

    useEffect(() => {
        loadResult();
    }, [id]);

    const loadResult = async () => {
        try {
            const response = await getTestResult(id);
            setDetails(response.data);
            if (!result) {
                setResult({
                    score: response.data.score,
                    totalQuestions: response.data.totalQuestions,
                    iqScore: response.data.iqScore,
                    percentage: Math.round((response.data.score / response.data.totalQuestions) * 100),
                });
            }
        } catch (err) {
            console.error("Error loading result:", err);
        } finally {
            setLoading(false);
        }
    };

    const getIQCategory = (iq) => {
        if (iq >= 130) return { label: "Маш өндөр", color: "text-purple-600", bg: "bg-purple-100" };
        if (iq >= 120) return { label: "Өндөр", color: "text-blue-600", bg: "bg-blue-100" };
        if (iq >= 110) return { label: "Дундаас дээш", color: "text-green-600", bg: "bg-green-100" };
        if (iq >= 90) return { label: "Дундаж", color: "text-yellow-600", bg: "bg-yellow-100" };
        if (iq >= 80) return { label: "Дундаас доош", color: "text-orange-600", bg: "bg-orange-100" };
        return { label: "Бага", color: "text-red-600", bg: "bg-red-100" };
    };

    if (loading) return <Loading text="Үр дүнг ачаалж байна..." />;

    if (!result) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Үр дүн олдсонгүй</p>
                    <Link to="/test" className="btn-primary mt-4 inline-block">
                        Шинэ тест өгөх
                    </Link>
                </div>
            </div>
        );
    }

    const category = getIQCategory(result.iqScore);

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4">
                <Link to="/results" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6">
                    <ArrowLeft className="w-5 h-5" />
                    Буцах
                </Link>

                {/* Main Result Card */}
                <div className="card text-center mb-6">
                    <div className="flex justify-center mb-6">
                        <div className="w-32 h-32 rounded-full bg-primary-100 flex items-center justify-center">
                            <Brain className="w-16 h-16 text-primary-600" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Таны IQ оноо</h1>

                    <div className="text-7xl font-bold text-primary-600 my-6">{result.iqScore}</div>

                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${category.bg} ${category.color} font-medium mb-6`}>
                        <Trophy className="w-5 h-5" />
                        {category.label}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center justify-center gap-2 text-green-600 mb-1">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-medium">Зөв хариулт</span>
                            </div>
                            <div className="text-3xl font-bold text-green-700">{result.score}</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
                                <Target className="w-5 h-5" />
                                <span className="font-medium">Нийт асуулт</span>
                            </div>
                            <div className="text-3xl font-bold text-gray-700">{result.totalQuestions}</div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <p className="text-gray-600">
                            Зөв хариултын хувь: <span className="font-bold text-gray-900">{result.percentage}%</span>
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mb-6">
                    <Link to="/test" className="flex-1 btn-primary text-center py-3">
                        Дахин тест өгөх
                    </Link>
                    <button onClick={() => setShowAnswers(!showAnswers)} className="flex-1 btn-secondary py-3">
                        {showAnswers ? "Хариултуудыг нуух" : "Хариултуудыг харах"}
                    </button>
                </div>

                {/* Answers Detail */}
                {showAnswers && details?.answers && (
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Хариултын дэлгэрэнгүй</h2>
                        <div className="space-y-4">
                            {details.answers.map((answer, index) => (
                                <div key={index} className={`p-4 rounded-lg border-2 ${answer.isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                                    <div className="flex items-start gap-3">
                                        {answer.isCorrect ? <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" /> : <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />}
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 mb-2">
                                                {index + 1}. {answer.questionText}
                                            </p>
                                            <div className="text-sm space-y-1">
                                                <p>
                                                    <span className="text-gray-500">Таны хариулт:</span>{" "}
                                                    <span className={answer.isCorrect ? "text-green-600" : "text-red-600"}>
                                                        {answer.selectedAnswer || "Хариулаагүй"}
                                                        {answer.selectedAnswer && ` - ${answer[`option${answer.selectedAnswer}`]}`}
                                                    </span>
                                                </p>
                                                {!answer.isCorrect && (
                                                    <p>
                                                        <span className="text-gray-500">Зөв хариулт:</span>{" "}
                                                        <span className="text-green-600">
                                                            {answer.correctAnswer} - {answer[`option${answer.correctAnswer}`]}
                                                        </span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* IQ Scale Reference */}
                <div className="card mt-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">IQ оноон тайлбар</h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-3">
                            <span className="w-24 px-2 py-1 bg-purple-100 text-purple-700 rounded text-center">130+</span>
                            <span className="text-gray-600">Маш өндөр - Онцгой авьяаслаг</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-24 px-2 py-1 bg-blue-100 text-blue-700 rounded text-center">120-129</span>
                            <span className="text-gray-600">Өндөр - Авьяаслаг</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-24 px-2 py-1 bg-green-100 text-green-700 rounded text-center">110-119</span>
                            <span className="text-gray-600">Дундаас дээш</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-24 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-center">90-109</span>
                            <span className="text-gray-600">Дундаж</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-24 px-2 py-1 bg-orange-100 text-orange-700 rounded text-center">80-89</span>
                            <span className="text-gray-600">Дундаас доош</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-24 px-2 py-1 bg-red-100 text-red-700 rounded text-center">80-</span>
                            <span className="text-gray-600">Бага</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestResult;
