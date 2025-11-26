// Validate email format
export const emailValidator = (v: string): boolean => {
  // Must include @ and valid domain format
  const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return regex.test(v);
};

// Validate password strength
export const passwordValidator = (v: string): boolean => {
  // Must include at least one number, one uppercase letter, and be at least 6 characters long
  const regex = /^(?=.*[0-9])(?=.*[A-Z]).{6,}$/;
  return regex.test(v);
};