import { Router } from "express";
import myeventController from "../controllers/myevent.controller";
import { organizerGuard, verifyToken } from "../middlewares/auth.middleware";
import { uploader } from "../middlewares/express/uploader";

export const myeventRouter = () => {
  const router = Router();

  router.use(verifyToken, organizerGuard);

  router.post(
    "/create",
    uploader("IMG", "/images").single("file"),
    myeventController.createEvent
  );

  router.get("/all", myeventController.getAllmyEvents);

  router.get("/:id/transactions", myeventController.getTransactionsByEvent);

  router.get("/:id", myeventController.getMyEventById);

  router.patch("/:id/publish", myeventController.publishmyEvent);

  router.patch(
    "/:id",
    uploader("IMG", "/images").single("file"),
    myeventController.editmyEvent
  );

  router.post("/:id/vouchers", myeventController.createVoucher);

  router.delete("/:id", myeventController.deletemyEvent);

  return router;
};
