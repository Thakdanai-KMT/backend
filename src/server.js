import express from 'express';
import cors from 'cors';
import registerRoute from './routes/register.js';
import loginRoute from './routes/login.js';
import refreshRoute from './routes/refresh.js';

const app = express();

app.use(cors({
  origin: 'https://pos-app-two-tau.vercel.app',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use('/api/auth/register', registerRoute);
app.use('/api/auth/login', loginRoute);
app.use('/api/auth/refresh', refreshRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
