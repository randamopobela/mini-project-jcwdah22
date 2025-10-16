import { Router } from "express";
import eventSController from "../controllers/events.controller";

export const eventRouter = () => {
  const router = Router();

  router.post("/", eventSController.getAllPublicEvents);
  router.get("/categories", eventSController.getAllCategories);
  router.get("/locations", eventSController.getUniqueLocations);
  router.get("/:id", eventSController.getPublicEventById);

  return router;
};
