import asyncHandler from "express-async-handler";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken, setAuthCookies, jwtRefreshSecret } from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";
import wrapEmail from "../utils/emailTemplate.js";
import { FALLBACK_ADMIN_ID, isFallbackAdminLogin, fallbackAdminUser, fallbackAdminCredentials, isFallbackAdminId } from "../utils/fallbackAdmin.js";

// @desc   Register a new admin/editor user (admin-only in production)
// @route  POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error("A user with this email already exists");
  }

  const user = await User.create({ name, email, password, role: role || "editor" });

  res.status(201).json({
    success: true,
    data: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// @desc   Login and receive access + refresh tokens
// @route  POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  let user = null;
  try {
    user = await User.findOne({ email }).select("+password");
  } catch (dbError) {
    console.warn("Falling back to local admin credentials because the database lookup failed:", dbError.message);
  }

  if (!user) {
    if (isFallbackAdminLogin(email, password)) {
      const accessToken = generateAccessToken(fallbackAdminUser._id);
      const refreshToken = generateRefreshToken(fallbackAdminUser._id);
      setAuthCookies(res, accessToken, refreshToken);
      return res.json({
        success: true,
        data: {
          id: fallbackAdminUser._id,
          name: fallbackAdminUser.name,
          email: fallbackAdminUser.email,
          role: fallbackAdminUser.role,
        },
        accessToken,
      });
    }

    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!(await user.matchPassword(password))) {
    if (isFallbackAdminLogin(email, password)) {
      const accessToken = generateAccessToken(fallbackAdminUser._id);
      const refreshToken = generateRefreshToken(fallbackAdminUser._id);
      setAuthCookies(res, accessToken, refreshToken);
      return res.json({
        success: true,
        data: {
          id: fallbackAdminUser._id,
          name: fallbackAdminUser.name,
          email: fallbackAdminUser.email,
          role: fallbackAdminUser.role,
        },
        accessToken,
      });
    }

    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("This account has been deactivated");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshTokens.push(refreshToken);
  user.lastLogin = new Date();
  await user.save();

  setAuthCookies(res, accessToken, refreshToken);

  res.json({
    success: true,
    data: { id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken,
  });
});

// @desc   Rotate refresh token for a new access token
// @route  POST /api/auth/refresh
export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  if (!token) {
    res.status(401);
    throw new Error("No refresh token provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, jwtRefreshSecret);
  } catch {
    res.status(401);
    throw new Error("Refresh token invalid or expired");
  }

  // The fallback admin isn't a Mongo document — nothing to look up or revoke,
  // just re-issue tokens for it directly (see utils/fallbackAdmin.js).
  if (decoded.id === FALLBACK_ADMIN_ID) {
    const newAccessToken = generateAccessToken(FALLBACK_ADMIN_ID);
    const newRefreshToken = generateRefreshToken(FALLBACK_ADMIN_ID);
    setAuthCookies(res, newAccessToken, newRefreshToken);
    return res.json({ success: true, accessToken: newAccessToken });
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.refreshTokens.includes(token)) {
    res.status(401);
    throw new Error("Refresh token not recognized");
  }

  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
  user.refreshTokens.push(newRefreshToken);
  await user.save();

  setAuthCookies(res, newAccessToken, newRefreshToken);
  res.json({ success: true, accessToken: newAccessToken });
});

// @desc   Logout: invalidate refresh token
// @route  POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    const decoded = jwt.decode(token);
    if (decoded?.id && decoded.id !== FALLBACK_ADMIN_ID) {
      await User.findByIdAndUpdate(decoded.id, { $pull: { refreshTokens: token } });
    }
  }
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ success: true, message: "Logged out" });
});

// @desc   Get current authenticated user
// @route  GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

// @desc   Change the logged-in user's own password (verifies current password first)
// @route  PUT /api/auth/change-password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("Current password and new password are required");
  }
  if (newPassword.length < 8) {
    res.status(400);
    throw new Error("New password must be at least 8 characters");
  }

  // The fallback admin isn't a real Mongo document (see utils/fallbackAdmin.js).
  // Changing its password provisions a real User account with the new password
  // so forgot-password, multi-device sessions, etc. all start working normally
  // from here on instead of relying on the hardcoded env credentials.
  if (isFallbackAdminId(req.user._id)) {
    if (!isFallbackAdminLogin(fallbackAdminCredentials.email, currentPassword)) {
      res.status(401);
      throw new Error("Current password is incorrect");
    }

    const existing = await User.findOne({ email: fallbackAdminCredentials.email });
    if (existing) {
      existing.password = newPassword;
      existing.refreshTokens = [];
      await existing.save();
    } else {
      await User.create({
        name: fallbackAdminUser.name,
        email: fallbackAdminCredentials.email,
        password: newPassword,
        role: "admin",
      });
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.json({ success: true, message: "Password changed. Please log in again with your new password." });
  }

  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (!(await user.matchPassword(currentPassword))) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword;
  user.refreshTokens = []; // force re-login on all devices
  await user.save();

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ success: true, message: "Password changed. Please log in again with your new password." });
});

// @desc   Request password reset email
// @route  POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    // Do not reveal whether the email exists
    return res.json({ success: true, message: "If that email exists, a reset link has been sent." });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 min
  await user.save();

  const resetUrl = `${(process.env.CLIENT_URL || "").split(",")[0]?.trim()}/admin/reset-password/${resetToken}`;

  // Respond immediately — the reset token is already saved. Sending the
  // email is fire-and-forget so a slow/unreachable SMTP server can't hang
  // this request (see contactController.js for the same fix + rationale).
  res.json({ success: true, message: "If that email exists, a reset link has been sent." });

  sendEmail({
    to: user.email,
    subject: "Password Reset - Khilung Kalika Construction Admin",
    html: wrapEmail({
      title: "Reset your password",
      preheader: "This link expires in 15 minutes.",
      bodyHtml: `
        <p>Hi ${user.name},</p>
        <p>We received a request to reset the password on your admin account. Click the button below to choose a new one — this link expires in <strong>15 minutes</strong>.</p>
        <p style="text-align:center;margin:28px 0;">
          <a href="${resetUrl}" style="background:#0b1f3a;color:#f5f3ee;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:13px;font-weight:600;letter-spacing:0.03em;display:inline-block;">Reset Password</a>
        </p>
        <p style="color:#8a8578;font-size:12px;">If you didn't request this, you can safely ignore this email — your password won't change.</p>
      `,
    }),
  }).catch((err) => console.error("Password reset email failed:", err.message));
});

// @desc   Reset password using token
// @route  POST /api/auth/reset-password/:token
export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Reset token is invalid or has expired");
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshTokens = []; // force re-login on all devices
  await user.save();

  res.json({ success: true, message: "Password reset successfully" });
});
