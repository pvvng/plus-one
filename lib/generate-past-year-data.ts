type ActivityData = {
  date: string;
  count: number;
  level: number;
};

export function generatePastYearData(baseDate: string): ActivityData[] {
  const end = new Date(baseDate); // 기준일
  const start = new Date(end);
  start.setFullYear(end.getFullYear() - 1); // 1년 전

  const result: ActivityData[] = [];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    result.push({ date: dateStr, count: 0, level: 0 });
  }

  return result;
}
