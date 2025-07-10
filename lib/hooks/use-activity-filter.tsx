import { useState } from "react";
import {
  ActivityData,
  generatePastYearData,
} from "@/lib/generate-past-year-data";
import { getKoreanDate } from "@/lib/get-korean-date";

interface SortOption {
  label: string;
  value: string;
}

export function useActivityFilter({
  initialActivity,
}: {
  initialActivity: ActivityData[];
}) {
  const thisYear = new Date().getFullYear();
  const lastYear = thisYear - 1;

  const sortOptions: SortOption[] = [
    { label: "기본", value: getKoreanDate().split("T")[0] },
    { label: `${lastYear}년`, value: `${lastYear}-12-31` },
    { label: `${thisYear}년`, value: `${thisYear}-12-31` },
  ];

  const [selected, setSelected] = useState(sortOptions[0]);
  const [activity, setActivity] = useState(initialActivity);

  const handleChange = (option: SortOption) => {
    setSelected(option);
    const baseData = generatePastYearData(option.value);

    const activeDates = new Set(
      initialActivity.filter((a) => a.count > 0).map((a) => a.date)
    );

    const merged = baseData.map((entry) =>
      activeDates.has(entry.date) ? { ...entry, count: 1, level: 1 } : entry
    );

    setActivity(merged);
  };

  return {
    activity,
    selected,
    sortOptions,
    handleChange,
  };
}
