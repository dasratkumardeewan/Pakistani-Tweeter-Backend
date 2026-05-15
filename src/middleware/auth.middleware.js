import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import config from "../conf/conf.js";
import { User } from "../model/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "Unauthorized");
    }

    const decodedToken = jwt.verify(token, config.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Access Token Expired");
    } else {
      throw new ApiError(401, "Unauthorized");
    }
  }
});
