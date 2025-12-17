import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getQuestions, submitTest } from "../api";
import Loading from "../components/Loading";
import { AlertCircle, ChevronLeft, ChevronRight, Clock, CheckCircle } from "lucide-react";

const Test = () => {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [startTime] = useState(Date.now());
    const navigate = useNavigate();

    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {
        try {
            const response = await getQuestions();
            setQuestions(response?.data);
        } catch (err) {
            setError("Асуултуудыг ачаалахад алдаа гарлаа");
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (questionId, answer) => {
        setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const handleSubmit = async () => {
        const answeredCount = Object.keys(answers).length;
        if (answeredCount < questions.length) {
            const confirm = window.confirm(`Та ${questions.length - answeredCount} асуултад хариулаагүй байна. Тест илгээх үү?`);
            if (!confirm) return;
        }

        setSubmitting(true);
        try {
            const formattedAnswers = questions.map((q) => ({
                questionId: q.id,
                selectedAnswer: answers[q.id] || "",
            }));

            const response = await submitTest(formattedAnswers);
            navigate(`/result/${response?.data?.result.id}`, { state: { result: response?.data?.result } });
        } catch (err) {
            setError("Тест илгээхэд алдаа гарлаа");
            setSubmitting(false);
        }
    };

    if (loading) return <Loading text="Асуултуудыг ачаалж байна..." />;

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!questions || questions?.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Асуулт олдсонгүй. Дараа дахин оролдоно уу.</p>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];
    const answeredCount = Object.keys(answers).length;
    const progress = (answeredCount / questions?.length) * 100;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4">
                {/* Progress bar */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>
                            Хариулсан: {answeredCount}/{questions.length}
                        </span>
                        <span>
                            Асуулт {currentIndex + 1}/{questions.length}
                        </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                {/* Question navigator */}
                <div className="card mb-6">
                    <div className="flex flex-wrap gap-2">
                        {questions.map((q, i) => (
                            <button key={q.id} onClick={() => setCurrentIndex(i)} className={`w-10 h-10 rounded-lg font-medium transition-colors ${i === currentIndex ? "bg-primary-600 text-white" : answers[q.id] ? "bg-green-100 text-green-700 border border-green-300" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Question card */}
                <div className="card mb-6">
                    <div className="mb-6">
                        <span className="text-sm text-gray-500">Асуулт {currentIndex + 1}</span>
                        <h2 className="text-xl font-semibold text-gray-900 mt-2">{currentQuestion?.questionText}</h2>
                    </div>

                    {currentQuestion?.imageUrl && (
                        <div className="mb-6">
                            <img src={currentQuestion.imageUrl} alt="Question illustration" className="max-w-full rounded-lg" />
                        </div>
                    )}

                    <div className="space-y-3">
                        {["A", "B", "C", "D"].map((option) => (
                            <button
                                key={option}
                                onClick={() => handleAnswer(currentQuestion?.id, option)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${answers[currentQuestion?.id] === option ? "border-primary-600 bg-primary-50 text-primary-700" : "border-gray-200 hover:border-primary-300 hover:bg-gray-50"}`}>
                                <span className="font-medium mr-3">{option}.</span>
                                {currentQuestion[`option${option}`]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                    <button onClick={handlePrev} disabled={currentIndex === 0} className="btn-secondary flex items-center gap-2 disabled:opacity-50">
                        <ChevronLeft className="w-5 h-5" />
                        Өмнөх
                    </button>

                    {currentIndex === questions.length - 1 ? (
                        <button onClick={handleSubmit} disabled={submitting} className="btn-success flex items-center gap-2">
                            {submitting ? "Илгээж байна..." : "Тест дуусгах"}
                            <CheckCircle className="w-5 h-5" />
                        </button>
                    ) : (
                        <button onClick={handleNext} className="btn-primary flex items-center gap-2">
                            Дараах
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Test;
