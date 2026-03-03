import express from "express";
import {protect} from "../middleware/auth.js";
import {
  acceptConnectionRequest,
  getUserConnections,
  sendConnectionRequest,
} from "../controllers/connectionsController.js";

const connectionRouter = express.Router();

connectionRouter.post("/request/connect/:userId", protect, sendConnectionRequest);
connectionRouter.post("/request/accept/:userId",protect, acceptConnectionRequest);
connectionRouter.get("/connections", protect, getUserConnections);

export default connectionRouter;