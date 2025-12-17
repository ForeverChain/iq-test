import { useState, useEffect } from "react";
import { getAllUsers, getAllTransactions, updateTransactionStatus, updateUserBalance, getAdminStats } from "../api";
import Loading from "../components/Loading";
import { Users, CreditCard, TrendingUp, Clock, CheckCircle, XCircle, DollarSign, Brain, RefreshCw } from "lucide-react";

const Admin = () => {
    const [tab, setTab] = useState("dashboard");
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [usersRes, transactionsRes, statsRes] = await Promise.all([getAllUsers(), getAllTransactions(), getAdminStats()]);
            setUsers(usersRes.data);
            setTransactions(transactionsRes.data);
            setStats(statsRes.data);
        } catch (err) {
            console.error("Error loading admin data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        setActionLoading(id);
        try {
            await updateTransactionStatus(id, status);
            await loadData();
        } catch (err) {
            alert(err.response?.data?.error || "Алдаа гарлаа");
        } finally {
            setActionLoading(null);
        }
    };

    const handleUpdateBalance = async (userId, currentBalance) => {
        const newBalance = prompt("Шинэ баланс оруулна уу:", currentBalance);
        if (newBalance === null) return;

        const amount = parseFloat(newBalance);
        if (isNaN(amount) || amount < 0) {
            alert("Зөв дүн оруулна уу");
            return;
        }

        try {
            await updateUserBalance(userId, amount);
            await loadData();
        } catch (err) {
            alert(err.response?.data?.error || "Алдаа гарлаа");
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("mn-MN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "completed":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        <CheckCircle className="w-3 h-3" />
                        Амжилттай
                    </span>
                );
            case "pending":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                        <Clock className="w-3 h-3" />
                        Хүлээгдэж буй
                    </span>
                );
            case "failed":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                        <XCircle className="w-3 h-3" />
                        Цуцлагдсан
                    </span>
                );
            default:
                return null;
        }
    };

    if (loading) return <Loading text="Ачаалж байна..." />;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Админ панел</h1>
                    <button onClick={loadData} className="btn-secondary flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Шинэчлэх
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {[
                        { id: "dashboard", label: "Dashboard", icon: TrendingUp },
                        { id: "users", label: "Хэрэглэгчид", icon: Users },
                        { id: "transactions", label: "Шилжүүлгүүд", icon: CreditCard },
                    ].map((item) => (
                        <button key={item.id} onClick={() => setTab(item.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${tab === item.id ? "bg-primary-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}>
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Dashboard Tab */}
                {tab === "dashboard" && stats && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="card">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Нийт хэрэглэгч</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <Brain className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Нийт тест</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalTests}</p>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Хүлээгдэж буй</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.pendingTransactions}</p>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <DollarSign className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Нийт гүйлгээ</p>
                                    <p className="text-2xl font-bold text-gray-900">₮{parseFloat(stats.totalTransactionVolume || 0).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {tab === "users" && (
                    <div className="card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-gray-600 font-medium">ID</th>
                                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Нэр</th>
                                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Имэйл</th>
                                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Баланс</th>
                                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Үүрэг</th>
                                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Огноо</th>
                                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Үйлдэл</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4">{user.id}</td>
                                            <td className="py-3 px-4 font-medium">{user.username}</td>
                                            <td className="py-3 px-4 text-gray-600">{user.email}</td>
                                            <td className="py-3 px-4 font-medium">₮{parseFloat(user.balance).toLocaleString()}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>{user.role}</span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-500 text-sm">{formatDate(user.createdAt)}</td>
                                            <td className="py-3 px-4">
                                                <button onClick={() => handleUpdateBalance(user.id, user.balance)} className="text-primary-600 hover:text-primary-700 text-sm">
                                                    Баланс өөрчлөх
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Transactions Tab */}
                {tab === "transactions" && (
                    <div className="card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-gray-600 font-medium">ID</th>
                                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Илгээгч</th>
                                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Хүлээн авагч</th>
                                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Дүн</th>
                                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Статус</th>
                                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Огноо</th>
                                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Үйлдэл</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx) => (
                                        <tr key={tx.id} className="border-t border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4">{tx.id}</td>
                                            <td className="py-3 px-4 font-medium">{tx.senderUsername}</td>
                                            <td className="py-3 px-4 font-medium">{tx.receiverUsername}</td>
                                            <td className="py-3 px-4 font-medium">₮{parseFloat(tx.amount).toLocaleString()}</td>
                                            <td className="py-3 px-4">{getStatusBadge(tx.status)}</td>
                                            <td className="py-3 px-4 text-gray-500 text-sm">{formatDate(tx.createdAt)}</td>
                                            <td className="py-3 px-4">
                                                {tx.status === "pending" && (
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleUpdateStatus(tx.id, "completed")} disabled={actionLoading === tx.id} className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200 disabled:opacity-50" title="Баталгаажуулах">
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleUpdateStatus(tx.id, "failed")} disabled={actionLoading === tx.id} className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 disabled:opacity-50" title="Цуцлах">
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {transactions.length === 0 && <div className="text-center py-8 text-gray-500">Шилжүүлэг байхгүй байна</div>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
