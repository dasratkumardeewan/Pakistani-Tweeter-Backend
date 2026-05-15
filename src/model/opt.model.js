import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

otpSchema.pre("save", async function () {
  return await bcrypt.hash(this.otp, 10);
});

export const OTP = mongoose.model("OTP", otpSchema);
