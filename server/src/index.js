import express from "express";
import employeesRouter from "./routes/employees.js";
import statsRouter from "./routes/stats.js";

const app = express();
const PORT = Number(process.env.API_PORT) || 5001;

app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use("/api/employees", employeesRouter);
app.use("/api/stats", statsRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Central error handler (Express needs all 4 params to recognise it)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Malformed JSON body" });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ error: "Payload too large" });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const server = app.listen(PORT, () => {
  console.log(`EMS API running at http://localhost:${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\nPort ${PORT} is already in use by another program.`);
    console.error(`Run the API on another port, e.g.:  API_PORT=5050 npm run server`);
    console.error(`and update the proxy in vite.config.js (or set API_PORT for the frontend too).\n`);
  } else {
    console.error(err);
  }
  process.exit(1);
});
