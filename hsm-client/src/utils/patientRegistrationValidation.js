const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_NUMBER_PATTERN = /^\d{10,11}$/;
const NAME_MAX_LENGTH = 20;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 72;

export const PHONE_NUMBER_HELPER_TEXT =
  "Use 10 to 11 digits only. Do not include +84, spaces, or punctuation.";

export const PASSWORD_HELPER_TEXT =
  "Password must be between 8 and 72 characters.";

const REQUIRED_FIELDS = [
  ["email", "Email is required"],
  ["password", "Password is required"],
  ["firstName", "First name is required"],
  ["lastName", "Last name is required"],
  ["dateOfBirth", "Date of birth is required"],
  ["gender", "Gender is required"],
  ["bloodGroup", "Blood group is required"],
  ["phoneNumber", "Phone number is required"],
  ["address", "Address is required"],
];

export const validatePatientRegistration = (formData) => {
  for (const [field, message] of REQUIRED_FIELDS) {
    const value = formData[field];
    if (typeof value === "string" ? value.trim() === "" : !value) {
      return message;
    }
  }

  const email = formData.email.trim();
  const firstName = formData.firstName.trim();
  const lastName = formData.lastName.trim();
  const phoneNumber = formData.phoneNumber.trim();

  if (!EMAIL_PATTERN.test(email)) {
    return "Email must be valid";
  }

  if (
    formData.password.length < PASSWORD_MIN_LENGTH ||
    formData.password.length > PASSWORD_MAX_LENGTH
  ) {
    return PASSWORD_HELPER_TEXT;
  }

  if (firstName.length > NAME_MAX_LENGTH) {
    return "First name must be at most 20 characters";
  }

  if (lastName.length > NAME_MAX_LENGTH) {
    return "Last name must be at most 20 characters";
  }

  if (!PHONE_NUMBER_PATTERN.test(phoneNumber)) {
    return PHONE_NUMBER_HELPER_TEXT;
  }

  return "";
};

export const normalizePatientRegistration = (formData) => ({
  ...formData,
  email: formData.email.trim(),
  firstName: formData.firstName.trim(),
  lastName: formData.lastName.trim(),
  phoneNumber: formData.phoneNumber.trim(),
  address: formData.address.trim(),
});
