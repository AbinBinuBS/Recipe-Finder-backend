import express from 'express';
import authRouter from './routes/authRouter.js';
import session from 'express-session';
import passport from 'passport';
import userRouter from './routes/userRouter.js'
import connectDB from './config/db.js';
import recipeRouter from './routes/recipesRouter.js'
import cors from 'cors'
const app = express();
const port = 3001;

connectDB();


app.use(cors({
  origin: 'https://recipe-finder-beige-three.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'refresh-token'],
  credentials: true,
}));

app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://recipe-finder-beige-three.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, refresh-token');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(204);
});

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'yourSecretKey', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/api',userRouter);
app.use('/api/recipes', recipeRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
