interface BrasilApiHoliday {
  date: string;
  name: string;
  type: string;
}

export async function fetchHolidaysByYear(
  year: number,
): Promise<BrasilApiHoliday[]> {
  const response = await fetch(
    `https://brasilapi.com.br/api/feriados/v1/${year}?uf=BA`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch holidays from BrasilAPI.");
  }

  const holidays = await response.json();

  return holidays;
}
