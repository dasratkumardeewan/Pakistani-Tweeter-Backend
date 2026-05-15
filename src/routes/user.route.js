import { Router } from "express";
import {
  register,
  verifyOTP,
  login,
  logout,
  refreshAccessToken,
  getUserProfile,
  changePassword,
  changeProfileDetails,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

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
router.route("/login").post(login);

// Secured Routes
router.route("/logout").post(verifyJWT, logout);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/profile").get(verifyJWT, getUserProfile);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/change-profile").post(verifyJWT, changeProfileDetails);

export default router;
