import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet, { crossOriginResourcePolicy } from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/post.js";
import userRoutes from "./routes/users.js";
import { register } from './controllers/auth.js';
import { createPost } from './controllers/post.js';
import { verifyToken } from "./middleware/auth.js";


/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(cors());    
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));


/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/assets');
    },
    filenamme: function(req, file, cb) {
        cb(null, file.orignalname);
    },
})

const upload = multer({ storage });

/* Routes */
app.post('/auth/register', upload.single('picture'), register);
app.post('/post/', verifyToken, upload.single('picture'), createPost);
/* ROUTES */
app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/user", userRoutes);


/* MONGOOSE SETUP */

const PORT = process.env.PORT || 8001;
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(PORT, ()=> console.log("Server is listening & db connected..."))
})
.catch((err) => console.log(`Error: ${err}`))
