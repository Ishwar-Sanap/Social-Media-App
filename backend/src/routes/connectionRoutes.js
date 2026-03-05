import express from "express";
import {protect} from "../middleware/auth.js";
import {
  acceptConnectionRequest,
  getUserConnections,
  rejectConnectionRequest,
  removeConnection,
  sendConnectionRequest,
} from "../controllers/connectionsController.js";

const connectionRouter = express.Router();

connectionRouter.post("/connect/:userId", protect, sendConnectionRequest);
connectionRouter.post("/accept/:userId",protect, acceptConnectionRequest);
connectionRouter.post("/reject/:userId",protect, rejectConnectionRequest);
connectionRouter.get("/connections", protect, getUserConnections);
connectionRouter.post("/remove/connection/:userId", protect, removeConnection)

export default connectionRouter;