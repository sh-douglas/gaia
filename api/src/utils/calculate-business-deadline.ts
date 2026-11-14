export function calculateBusinessDeadline(
  issuedAt: Date,
  businessDays: number,
  holidays: string[] = [],
): Date {
  const issuedAtCopy = new Date(issuedAt);
  let daysCount = 0;
  while (daysCount < businessDays) {
    const dayOfMonth = issuedAtCopy.getDate();
    issuedAtCopy.setDate(dayOfMonth + 1);
    const year = issuedAtCopy.getFullYear();
    const month = String(issuedAtCopy.getMonth() + 1).padStart(2, "0");
    const day = String(issuedAtCopy.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    const isHoliday = holidays.includes(formattedDate);

    const dayOfWeek = issuedAtCopy.getDay();

    if (dayOfWeek >= 1 && dayOfWeek <= 5 && !isHoliday) {
      daysCount++;
    }
  }

  issuedAtCopy.setHours(23, 59, 59, 999);

  return issuedAtCopy;
}
