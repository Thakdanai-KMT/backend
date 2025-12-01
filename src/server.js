import express from 'express';
import registerRoute from './routes/register.js';
import refreshRoute from './routes/refresh.js';
import loginRoute from './routes/Login.js';

const app = express();

app.use(express.json());

// ใช้งาน API
app.use('/api/auth/register', registerRoute);
app.use('/api/auth/login', loginRoute);
app.use('/api/auth/refresh', refreshRoute);

app.listen(3000, () => console.log('Server running'));
