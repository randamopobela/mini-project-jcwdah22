import { Router } from "express";
import myeventController from "../controllers/myevent.controller";
import { organizerGuard, verifyToken } from "../middlewares/auth.middleware";
import { uploader } from "../middlewares/express/uploader";

export const myeventRouter = () => {
  const router = Router();

  router.post(
    "/create",
    verifyToken,
    organizerGuard,
    uploader("IMG", "/images").single("file"),
    myeventController.createEvent
  );

  router.get(
    "/all",
    verifyToken,
    organizerGuard,
    myeventController.getAllmyEvents
  );

  router.get(
    "/:id",
    verifyToken,
    organizerGuard,
    myeventController.getMyEventById
  );

  router.patch(
    "/:id/publish",
    verifyToken,
    organizerGuard,
    myeventController.publishmyEvent
  );

  router.patch(
    "/:id",
    verifyToken,
    organizerGuard,
    uploader("IMG", "/images").single("file"),
    myeventController.editmyEvent
  );

  router.post(
    "/:id/vouchers",
    verifyToken,
    organizerGuard,
    myeventController.createVoucher
  );

  router.delete(
    "/:id",
    verifyToken,
    organizerGuard,
    myeventController.deletemyEvent
  );

  return router;
};
