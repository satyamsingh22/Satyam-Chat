import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { urlencoded } from 'express';
import connectDB from './db/db.js';
import messageRoute from './routes/message.route.js';
import postRoute from './routes/post.route.js';
import userRoute from './routes/user.route.js';
import { app, server } from './socket/socket.js';
import path, { dirname } from 'path'

dotenv.config();
const PORT = process.env.PORT || 8200;

const _dirname = path.resolve()

connectDB()

// Connect to database




app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({extended:true}))
const corsOptions ={
    origin:process.env.URL,
    credentials:true
}
// Route handling
app.use(cors(corsOptions))
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

app.use(express.static(path.join(_dirname,"/frontend/dist")))
app.get("*",(req,res)=>{
    res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"))
})

server.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
