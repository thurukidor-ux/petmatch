import express from "express";
import cors from "cors";

const app = express();

const PORT = 8000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({ message: "Vitejte v API PetMatch!"});
});

app.listen(PORT, () => {
    console.log(`Server PetMatch bezi na adrese http://localhost:${PORT}`);
});