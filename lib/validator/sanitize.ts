export const sanitizeInput = (value: FormDataEntryValue | null) => {
  if (typeof value !== "string") return null;
  return value.trim();
};
