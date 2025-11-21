import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import authRoutes from './routers/authRoutes'
import registrationRoutes from './routers/registrationRoutes'
import filmRoutes from './routers/filmRoutes'
import reziserRoutes from './routes/reziser'
import glumacRoutes from './routers/glumacRoutes'
import iznajmljivanjeRoutes from './routers/iznajmljivanjeRoutes'
import userRoutes from './routers/userRoutes'


const app = express()
app.use(cors())


mongoose.connect('mongodb://127.0.0.1:27017/diplomski')
const conn = mongoose.connection
conn.once('open', ()=>{
    console.log("DB ok")
})

const router = express.Router()

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Auth routes
app.use('/api/auth', authRoutes);

// Registration routes
app.use('/api/registration', registrationRoutes);

// Film routes
app.use('/api/films', filmRoutes);

// Reziser routes
app.use('/api/reziseri', reziserRoutes);

// Glumac routes
app.use('/api/glumci', glumacRoutes);

// Iznajmljivanje routes
app.use('/api/iznajmljivanja', iznajmljivanjeRoutes);

// User routes
app.use('/api/users', userRoutes);

app.use('/', router)
app.listen(8080, ()=>console.log('Express running on port 8080'))
