import { Router } from "express";
import userController from "../controllers/user.controller";
import { uploader } from "../middlewares/express/uploader";
import { verifyToken } from "../middlewares/auth.middleware";

export const userRouter = () => {
    const router = Router();

    router.post("/update", userController.update);
    router.post(
        "/profile-picture",
        verifyToken,
        uploader("PROFILE", "/images/profile").single("profilePicture"),
        userController.changeProfilePicture.bind(userController)
    );
    router.patch("/deactivate", userController.deactivate);

    return router;
};
