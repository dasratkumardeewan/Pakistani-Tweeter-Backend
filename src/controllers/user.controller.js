import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../model/user.model.js";
import uploadToCloudinary from "../utils/cloudinary.js";
import { sendEmail } from "../service/email.service.js";
import { generateOTP, generateOTPHTML } from "../utils/optGeneration.js";
import { OTP } from "../model/opt.model.js";
import jwt from "jsonwebtoken";
import config from "../conf/conf.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error While Generating Tokens");
  }
};

const register = asyncHandler(async (req, res) => {
  const {
    fullName,
    username,
    email,
    phone,
    password,
    bio,
    country,
    city,
    gender,
    dob,
  } = req.body;

  if (
    [fullName, username, email, phone, password].some(
      (fields) => fields?.trim() === "",
    )
  ) {
    throw new ApiError(400, "All Fields Are Required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }, { phone }],
  });

  if (existedUser) {
    throw new ApiError(400, "User Already Exists");
  }

  const profileImageLocalPath = req.files?.profileImage?.[0].path;
  const coverImageLocalPath = req.files?.coverImage?.[0].path;

  let profileImage;
  let coverImage;

  if (profileImageLocalPath) {
    profileImage = await uploadToCloudinary(profileImageLocalPath);
  }

  if (coverImageLocalPath) {
    coverImage = await uploadToCloudinary(coverImageLocalPath);
  }

  const user = await User.create({
    fullName,
    username,
    email,
    phone,
    password,
    bio,
    country,
    city,
    gender,
    dob,
    profileImage: profileImage?.url || "",
    coverImage: coverImage?.url || "",
    isVerified: false,
  });

  const otp = generateOTP();
  const otpHTML = generateOTPHTML(otp);

  const otpEntry = await OTP.create({
    email,
    user: user._id,
    otp,
  });

  await sendEmail(email, "Your OTP Code", `Your OTP code is: ${otp}`, otpHTML);

  const createdUser = await User.findById(user._id);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        "User Registered Successfully. Please check your email for OTP verification.",
        createdUser,
      ),
    );
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }
  const otpEntry = await OTP.findOne({ email, otp });

  if (!otpEntry) {
    throw new ApiError(400, "Invalid OTP");
  }

  const user = await User.findByIdAndUpdate(
    otpEntry.user,
    {
      isVerified: true,
    },
    {
      new: true,
    },
  );

  await OTP.findByIdAndDelete(otpEntry._id);

  res.status(200).json(new ApiResponse(200, "OTP Verified Successfully"));
});

const login = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!(email || username)) {
    throw new ApiError(400, "Email Or Username is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  } else if (user.isVerified === false) {
    return res
      .status(403)
      .json(
        new ApiResponse(
          403,
          user,
          "Please verify your email before logging in",
        ),
      );
  }

  const passwordValidation = await user.isPasswordCorrect(password);

  if (!passwordValidation) {
    throw new ApiError(400, "Invalid Credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(200, "Login Successful", {
        user: user,
        accessToken,
        refreshToken,
      }),
    );
});

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    refreshToken: "",
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh Token is required");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      config.REFRESH_TOKEN_SECRET,
    );
    const user = await User.findById(decodedToken._id);

    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
      user._id,
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access Token refreshed successfully",
        ),
      );
  } catch (error) {
    throw new ApiError(401, "Invalid Refresh Token");
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile retrieved successfully"));
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current and new passwords are required");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const passwordValidation = await user.isPasswordCorrect(currentPassword);
  if (!passwordValidation) {
    throw new ApiError(400, "Invalid Credentials");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

export {
  register,
  verifyOTP,
  login,
  logout,
  refreshAccessToken,
  getUserProfile,
  changePassword
};
