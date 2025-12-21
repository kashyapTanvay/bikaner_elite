import express, { Request, Response } from "express";

const app = express();
const PORT = 5000;

app.use(express.json());

app.use("/", (req: Request, res: Response) => {
  res.send("Backend is running 🚀");
});

app.listen(Number(PORT), "127.0.0.1", () => {
  console.log(`Backend listening on http://127.0.0.1:${PORT}`);
});
