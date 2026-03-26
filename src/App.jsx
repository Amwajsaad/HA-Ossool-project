import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// استيراد الصفحات التي أنشأتِها (تأكدي أن الحروف الكبيرة والصغيرة مطابقة لأسماء ملفاتك)
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';

function App() {
    return (
        <BrowserRouter>
            {/* 1. قائمة التنقل (Nav) لتجربة الروابط بسهولة */}
            <nav style={{ padding: '20px', backgroundColor: '#f4f4f4', display: 'flex', gap: '15px' }}>
                <Link to="/">تسجيل الدخول</Link>
                <Link to="/register">إنشاء حساب</Link>
                <Link to="/dashboard">لوحة التحكم</Link>
            </nav>

            {/* 2. تعريف المسارات (Routes) */}
            <div style={{ padding: '20px' }}>
                <Routes>
                    {/* الصفحة الرئيسية تفتح الـ Login */}
                    <Route path="/" element={<Login />} />

                    {/* رابط /register يفتح صفحة التسجيل */}
                    <Route path="/register" element={<Register />} />

                    {/* رابط /dashboard يفتح لوحة التحكم */}
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;