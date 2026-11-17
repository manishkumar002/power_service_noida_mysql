const express = require("express");
const path = require("path");
const cors = require("cors");
const errorMiddleware = require("./middleware/error");
const authRoutes = require("./routes/webapi");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use("/api", authRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const frontendDist = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendDist));

app.get(/^(?!\/api).*/, (req, res, next) => {
  if (req.method !== "GET") return next();
  res.sendFile(path.join(frontendDist, "index.html"), (err) => {
    if (err) {
      res.status(200).send(
        "Frontend not built. Run: npm run build:client OR npm run dev:all",
      );
    }
  });
});

app.use(errorMiddleware);

module.exports = app;
