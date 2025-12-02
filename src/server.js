import express from 'express';
import registerRoute from './routes/register.js';
import refreshRoute from './routes/refresh.js';
import loginRoute from './routes/Login.js';
import cors from 'cors';

const app = express(); // สร้าง app ก่อน

app.use(cors()); // เรียกใช้ CORS หลังจากสร้าง app
app.use(express.json());

// ใช้งาน API
app.use('/api/auth/register', registerRoute);
app.use('/api/auth/login', loginRoute);
app.use('/api/auth/refresh', refreshRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
