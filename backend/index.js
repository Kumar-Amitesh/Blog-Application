import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import { User } from './models/User.js';
import bcrypt from 'bcrypt';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { BlogDB } from './models/BlogDB.js';

const app = express();
const port = 3000;
const saltRounds = 10;
const secret = 'Hello';

// Configure session management
app.use(session({
    secret: "TOPSECRET",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Use cookie parser to handle cookies
app.use(cookieParser());

// Set up CORS to allow requests from the frontend
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true // Enable sending of credentials (cookies)
};
app.use(cors(corsOptions));

// Parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/testBlog");

// Route to check authentication status using a token
app.get('/', (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        console.log("error");
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    jwt.verify(token, secret, (err, info) => {
        if (err) {
            console.log(err);
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        res.status(200).send("hello");
    });
});

// Route to handle fetching user blogs
app.get('/myBlog', (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        console.log("error");
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    jwt.verify(token, secret, (err, info) => {
        if (err) {
            console.log(err);
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        res.status(200).send("hello");
    });
});

// Route to create a new blog entry
app.get('/create', (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        console.log("error");
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    jwt.verify(token, secret, (err, info) => {
        if (err) {
            console.log(err);
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        res.status(200).send("hello");
    });
});

// Route to post a new blog
app.post('/post', async (req, res) => {
    const message = req.body.message;
    console.log(message);
    try {
        const newBlog = new BlogDB({
            Title: message.title,
            Desc: message.desc
        });
        await newBlog.save();
        res.status(200).json({ message: "Blog posted successfully" });
    } catch (error) {
        return res.status(401).json({ message: "No blog posted" });
    }
});

// Route to get all blogs
app.get("/blogs", async (req, res) => {
    try {
        const blogs = await BlogDB.find();
        res.status(200).json(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to delete a specific blog by ID
app.delete("/deleteOne/:id", async (req, res) => {
    const id = req.params.id;
    const result = await BlogDB.findByIdAndDelete(id);
    if (result) {
        res.status(200).json({ message: 'Blog deleted successfully' });
    } else {
        res.status(404).json({ message: 'Blog not found' });
    }
});

// Route to update a specific blog by ID
app.patch("/update/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const title = req.body;
    console.log(title);
    const result = await BlogDB.findByIdAndUpdate(id, { Title: title.title });
    if (result) {
        const updatedBlog = await BlogDB.findById(id);
        res.status(200).json(updatedBlog);
    } else {
        res.status(404).json({ message: 'Blog not found' });
    }
});

// Route to handle logout by clearing the token cookie
app.get("/logout", (req, res) => {
    res.clearCookie('token');
    res.send("ok");
});

// Route to handle user registration
app.post("/register", async (req, res) => {
    const email = req.body.username;
    const password = req.body.password;
    try {
        const find = await User.find({ email: email });
        if (find.length > 0) {
            res.json({ message: "User already registered." });
        } else {
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    console.log("Error hashing password: ", err);
                } else {
                    const user = new User({
                        email: email,
                        password: hash
                    });
                    await user.save();
                    res.json({ message: "Registered Successfully" });
                }
            });
        }
    } catch (error) {
        console.log(error.message);
    }
});

// Route to handle user login and issue a JWT token
app.post("/login", async (req, res) => {
    const email = req.body.username;
    const password = req.body.password;
    try {
        const find = await User.find({ email: email });
        if (find.length > 0) {
            const storedPassword = find[0].password;
            bcrypt.compare(password, storedPassword, async (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    if (result) {
                        console.log("Success");
                        const token = jwt.sign({ id: find[0].id }, secret, { expiresIn: '1h' });
                        res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 900000 });
                        res.json({ message: "Login Successful", token: token });
                    } else {
                        console.log("failed");
                    }
                }
            });
        } else {
            console.log("User not found");
        }
    } catch (error) {
        console.log(error);
        res.send(JSON.stringify(error.response.data));
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});
