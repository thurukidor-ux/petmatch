import { Router } from "express";
import { upload } from "../middlewares/uploadMiddleware.js";
import {
  uploadDocument,
  getDocument,
} from "../controllers/documentController.js";

const router = Router();

router.post("/", upload.single("file"), uploadDocument);

router.get("/:id", getDocument);

export default router;
