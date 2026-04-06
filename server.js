const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const pathResolve = require("path");

// Import routes from controller
const apiRoutes = require("./controller/controllers");

// Configure environment variables
dotenv.config({ path: pathResolve.resolve(__dirname, ".env") });

const app = express();

app.set('trust proxy', 1);

// ============ MONGODB CONNECTION ============

console.log("MONGO_URI =", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// ============ MIDDLEWARE ============

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'view')));

// ============ SESSION CONFIGURATION ============

app.use(session({
    secret: process.env.SESSION_SECRET || "campustaste-secret-key-2024",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: "sessions"
    }),
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    }
}));

// ============ HTML ROUTES (STATIC FILES) ============

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "view/index.html")));
app.get("/spot.html", (req, res) => res.sendFile(path.join(__dirname, "view/spot.html")));
app.get("/about.html", (req, res) => res.sendFile(path.join(__dirname, "view/about.html")));
app.get("/profile.html", (req, res) => res.sendFile(path.join(__dirname, "view/profile.html")));

// ============ API ROUTES ============

app.use(apiRoutes);

// ============ SERVER ============

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));