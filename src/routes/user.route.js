import { Router } from "express";
import { register,verifyOTP } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();
router.route("/register").post(
  upload.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  register,
);


router.route("/verify-otp").post(verifyOTP);
export default router;
