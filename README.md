# IQ Test Web Application

Бүрэн функциональ IQ тест вэб аппликейшн. Node.js, Express, MySQL, React, Tailwind CSS ашигласан.

## 🚀 Онцлогууд

### Backend

-   ✅ Node.js + Express REST API
-   ✅ MySQL өгөгдлийн сан + Drizzle ORM
-   ✅ JWT authentication
-   ✅ Нууц үг bcrypt-ээр хэшлэгдсэн
-   ✅ Input validation (express-validator)

### Frontend

-   ✅ Vite + React
-   ✅ Tailwind CSS - орчин үеийн дизайн
-   ✅ Responsive дизайн (гар утас, таблет)
-   ✅ Recharts - график харуулах

### IQ Тест

-   ✅ 30 IQ тестийн асуулт (20 санамсаргүй сонгогдоно)
-   ✅ 4 сонголттой олон сонголтын асуулт
-   ✅ IQ оноо автоматаар бодогдоно
-   ✅ Тестийн түүх хадгалагдана

### Мөнгөн шилжүүлэг

-   ✅ Хэрэглэгч хооронд шилжүүлэг үүсгэх
-   ✅ Админ баталгаажуулалт шаардлагатай
-   ✅ Статус: pending → completed/failed
-   ✅ Баланс автоматаар шинэчлэгдэнэ

## 📁 Бүтэц

```
iq test/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── index.js      # Database connection
│   │   │   ├── schema.js     # Drizzle schema
│   │   │   └── seed.js       # Seed data
│   │   ├── middleware/
│   │   │   └── auth.js       # JWT middleware
│   │   ├── routes/
│   │   │   ├── auth.js       # Auth routes
│   │   │   ├── test.js       # Test routes
│   │   │   ├── transactions.js
│   │   │   └── admin.js
│   │   └── index.js          # Entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🐳 Docker-оор ажиллуулах

### Шаардлага

-   Docker Desktop суулгасан байх

### Ажиллуулах

```bash
# Project folder руу орох
cd "iq test"

# Docker containers ажиллуулах
docker-compose up --build

# Background-д ажиллуулах
docker-compose up --build -d
```

### Хандах

-   **Frontend**: http://localhost:5173
-   **Backend API**: http://localhost:3001

### Зогсоох

```bash
docker-compose down

# Volume-тай хамт устгах
docker-compose down -v
```

## 💻 Локал хөгжүүлэлт

### Шаардлага

-   Node.js 20+
-   MySQL 8.0

### Backend тохиргоо

```bash
cd backend

# Dependencies суулгах
npm install

# .env файл үүсгэх
cp .env.example .env
# DATABASE_URL засах

# Database tables үүсгэх
npm run db:push

# Seed data оруулах
npm run db:seed

# Server ажиллуулах
npm run dev
```

### Frontend тохиргоо

```bash
cd frontend

# Dependencies суулгах
npm install

# .env файл үүсгэх
cp .env.example .env

# Development server ажиллуулах
npm run dev
```

## 📝 API Endpoints

### Auth

-   `POST /api/auth/register` - Бүртгүүлэх
-   `POST /api/auth/login` - Нэвтрэх
-   `GET /api/auth/me` - Хэрэглэгчийн мэдээлэл

### Test

-   `GET /api/test/questions` - Асуултууд авах
-   `POST /api/test/submit` - Тест илгээх
-   `GET /api/test/history` - Түүх харах
-   `GET /api/test/result/:id` - Дэлгэрэнгүй үр дүн

### Transactions

-   `GET /api/transactions/balance` - Баланс
-   `POST /api/transactions/transfer` - Шилжүүлэг үүсгэх
-   `GET /api/transactions/history` - Түүх
-   `GET /api/transactions/users/search` - Хэрэглэгч хайх

### Admin

-   `GET /api/admin/users` - Бүх хэрэглэгч
-   `GET /api/admin/stats` - Статистик
-   `PATCH /api/transactions/admin/:id/status` - Статус өөрчлөх

## 👤 Туршилтын дансууд

| Имэйл            | Нууц үг  | Үүрэг |
| ---------------- | -------- | ----- |
| admin@iqtest.com | admin123 | admin |
| user@iqtest.com  | user123  | user  |

## 🛠 Технологи

### Backend

-   Node.js
-   Express.js
-   MySQL
-   Drizzle ORM
-   JWT
-   bcryptjs
-   express-validator

### Frontend

-   React 18
-   Vite
-   React Router
-   Axios
-   Tailwind CSS
-   Recharts
-   Lucide React (icons)

### DevOps

-   Docker
-   Docker Compose
-   Nginx

## 📄 License

MIT
