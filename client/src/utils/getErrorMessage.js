// Two different shapes of error response exist across this API:
// - A controller-thrown error (asyncHandler -> errorHandler.js) responds
//   { success: false, message: "..." }.
// - A failed express-validator check (middleware/validate.js) responds
//   { success: false, errors: [{ msg: "...", path: "...", ... }, ...] }
//   with NO top-level `message` at all.
//
// Reading only `err.response?.data?.message` (as most pages here did) means
// every validation failure — a malformed email, a missing required field —
// silently falls through to a generic "something went wrong" toast with no
// indication of what was actually wrong, even though the server sent back
// the real reason. This normalizes both shapes into one string.
export default function getErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  const data = err?.response?.data;
  if (data?.message) return data.message;
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.map((e) => e.msg).filter(Boolean).join(" ") || fallback;
  }
  return fallback;
}
