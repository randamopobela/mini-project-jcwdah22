import { Router } from "express";
import myeventController from "../controllers/myevent.controller";
import { organizerGuard, verifyToken } from "../middlewares/auth.middleware";
import { uploader } from "../middlewares/express/uploader";

export const myeventRouter = () => {
    const router = Router();

    router.use(verifyToken);
    router.use(organizerGuard);

    router.post(
        "/create",
        uploader("IMG", "/images").single("eventPicture"),
        myeventController.createEvent
    );

    router.get("/all", myeventController.getAllmyEvents);

    router.get("/:id/sales-report", myeventController.getSalesReport);

    router.get("/:id/attendees", myeventController.getAttendeesByEvent);

    router.patch(
        "/:id",
        uploader("IMG", "/images").single("eventPicture"),
        myeventController.editmyEvent
    );
    router.get("/:id/dashboard-stats", myeventController.getDashboardStats);

    router.get("transactions", myeventController.getMyTransactions);

    router.get("/:id/transactions", myeventController.getTransactionsByEvent);

    router.patch("/:id/cancel", myeventController.cancelEvent);

    router.delete("/:id", myeventController.deletemyEvent);
    router.patch(
        "/transactions/:transactionId/accept",
        myeventController.acceptTransaction
    );

    router.patch(
        "/transactions/:transactionId/reject",
        myeventController.rejectTransaction
    );

    router.get("/:id", myeventController.getMyEventById);

    router.patch("/:id/publish", myeventController.publishmyEvent);

    router.patch(
        "/:id",
        uploader("IMG", "/images").single("file"),
        myeventController.editmyEvent
    );

    router.post("/:id/vouchers", myeventController.createVoucher);

    // router.get("/:id/vouchers", myeventController.getVouchersByEvent);

    router.delete("/:id", myeventController.deletemyEvent);

    return router;
};
