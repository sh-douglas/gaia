import { fetchHolidaysByYear } from "../integrations/brasil-api/holidays.client.js";
import { holidaysFeiraDeSantana2026 } from "../config/holidays/feira-de-santana-2026.js";
import { holidaysFeiraDeSantana2027 } from "../config/holidays/feira-de-santana-2027.js";
import { AppError } from "../errors/app.error.js";

class HolidayService {
  async getHolidaysByYear(year: number) {
    if (year !== 2026 && year !== 2027) {
      throw new AppError(
        "Municipal holiday calendar not available for the requested year.",
        503,
        "HOLIDAY_CALENDAR_UNAVAILABLE",
      );
    }

    const holidays = await fetchHolidaysByYear(year).catch(() => {
      throw new AppError(
        "Holiday service temporarily unavailable.",
        503,
        "HOLIDAY_SERVICE_UNAVAILABLE",
      );
    });

    const holidaysDate = holidays.map((holiday) => {
      return holiday.date;
    });

    if (year === 2026) {
      holidaysDate.push(...holidaysFeiraDeSantana2026);
    } else if (year === 2027) {
      holidaysDate.push(...holidaysFeiraDeSantana2027);
    }

    const uniqueHolidays = [...new Set(holidaysDate)];

    return uniqueHolidays;
  }

  async getHolidaysForDeadline(issuedAt: Date) {
    const year = issuedAt.getFullYear();
    const holidays = await this.getHolidaysByYear(year);

    if (issuedAt.getMonth() === 11) {
      const nextYear = year + 1;
      const holidaysNextYear = await this.getHolidaysByYear(nextYear);
      holidays.push(...holidaysNextYear);
    }

    const uniqueHolidays = [...new Set(holidays)];

    return uniqueHolidays;
  }
}

export default new HolidayService();
