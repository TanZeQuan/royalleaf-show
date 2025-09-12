// Handles birthday input and formatting

export const parseBirthdayInput = (text: string): string => {
  // Only allow digits, max 8 for DDMMYYYY
  let cleaned = text.replace(/\D/g, "").slice(0, 8);

  if (cleaned.length >= 5) {
    cleaned = cleaned.replace(/^(\d{2})(\d{2})(\d{1,4})$/, "$1/$2/$3");
  } else if (cleaned.length >= 3) {
    cleaned = cleaned.replace(/^(\d{2})(\d{1,2})$/, "$1/$2");
  }

  return cleaned;
};

export const getDateFromBirthday = (birthdayStr: string): Date | null => {
  const parts = birthdayStr.split("/").map(Number);
  if (parts.length === 3) {
    const [dd, mm, yyyy] = parts;
    const date = new Date(yyyy, mm - 1, dd);
    if (!isNaN(date.getTime())) return date;
  }
  return null;
};

export const formatDateForDisplay = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatDateForApi = (date: Date | null, birthdayStr: string): string => {
  if (date && !isNaN(date.getTime())) return date.toISOString().split("T")[0];

  // fallback: try parsing typed string
  const parsedDate = getDateFromBirthday(birthdayStr);
  if (parsedDate) return parsedDate.toISOString().split("T")[0];

  return "";
};
