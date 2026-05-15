import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../model/user.model.js";
import uploadToCloudinary from "../utils/cloudinary.js";
import { sendEmail } from "../service/email.service.js";
import { generateOTP, generateOTPHTML } from "../utils/optGeneration.js";
import { OTP } from "../model/opt.model.js";

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

export { register, verifyOTP };
