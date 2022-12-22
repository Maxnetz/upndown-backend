import express from "express";
import cors from "cors";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import morgan from "morgan";

//db and authenticateUser
import connectDB from "./db/connect.js";

// routers
import authRouter from "./routes/authRoutes.js";
import activitiesRouter from "./routes/activitiesRoutes.js";

// middlewares
import notFoundMiddleware from "./middlewares/not-found.js";
import errorHandlerMiddleware from "./middlewares/error-handler.js";
import authenticateUser from "./middlewares/auth.js";

if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}
app.use(cors({ credentials: true, origin: "https://upndown-frontend.vercel.app" }));
app.use(express.json());


app.get("/", (req, res) => {
    res.json({ msg: "welcome" });
});
app.get("/api/v1", (req, res) => {
    res.json({ msg: "API" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/activities", authenticateUser, activitiesRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:%d`, port);
        });
    } catch (error) {
        console.log(error);
    }
};

start();
