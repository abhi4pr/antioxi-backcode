import express from "express";
import {
  addRoutineItem,
  getAllRoutineItems,
  getRoutineItemById,
  updateRoutineItem,
  deleteRoutineItem,
} from "../controllers/dailyRoutineController.js";
import upload, { fileUpload } from "../middleware/uploadMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  fileUpload,
  addRoutineItem
);
router.get("/", authMiddleware, getAllRoutineItems);
router.get("/:id", authMiddleware, getRoutineItemById);
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  fileUpload,
  updateRoutineItem
);
router.delete("/:id", authMiddleware, deleteRoutineItem);

export default router;
