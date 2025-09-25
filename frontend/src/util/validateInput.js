export function validateUserInput({ email, password, name }) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!email) {
    return { isValid: false, message: "Email is required" };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Invalid email format" };
  }

  if (!password) {
    return { isValid: false, message: "Password is required" };
  }
  if (password.length < 6) {
    return { isValid: false, message: "Password must be at least 6 characters long" };
  }

  // Only check name if it's provided
  if (name !== undefined) {
    if (!name.trim()) {
      return { isValid: false, message: "Name cannot be empty" };
    }
    if (name.length < 2) {
      return { isValid: false, message: "Name must be at least 2 characters long" };
    }
  }

  return { isValid: true, message: "Validation successful" };
}