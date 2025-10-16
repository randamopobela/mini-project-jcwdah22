import { Router } from "express";
import eventsController from "../controllers/eventS.controller";

export const eventRouter = () => {
  const router = Router();

  router.post("/", eventsController.getAllPublicEvents);
  router.get("/categories", eventsController.getAllCategories);
  router.get("/locations", eventsController.getUniqueLocations);
  router.get("/:id", eventsController.getPublicEventById);

  return router;
};
