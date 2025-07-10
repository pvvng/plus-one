"use client";

import { ActivityData } from "@/lib/generate-past-year-data";
import { useActivityFilter } from "@/lib/hooks/use-activity-filter";
import CustomToast from "../custom-toast";
import CalendarBlockTooltip from "./block-tooltip";
import DropdownSelector from "./dropdown-sort-selector";
import {
  ActivityCalendar,
  Props as CalendarProps,
  ThemeInput,
} from "react-activity-calendar";
import { RectangleGroupIcon } from "@heroicons/react/24/solid";
import { toast } from "sonner";
import { useEffect } from "react";

const theme: ThemeInput = {
  light: ["#f0f0f0", "#3B82F6"],
  dark: ["#262626", "#3B82F6"],
};

const labels = {
  months: [...Array(12)].map((_, i) => `${i + 1}월`),
  weekdays: ["일", "월", "화", "수", "목", "금", "토"],
  totalCount: "현재 플러스원: {{count}}개",
} satisfies CalendarProps["labels"];

interface ActivityCalendarViewProps {
  success: boolean;
  activity: ActivityData[];
  count: number;
}

export default function ActivityCalendarView({
  success,
  activity: initialActivity,
  count,
}: ActivityCalendarViewProps) {
  const { activity, selected, sortOptions, handleChange } = useActivityFilter({
    initialActivity,
  });

  useEffect(() => {
    if (!success) {
      toast(
        <CustomToast
          success={false}
          message={`스트릭 데이터를 불러오는 중 에러가 발생했습니다.\n새로고침 후 다시 시도해주세요.`}
        />
      );
    }
  }, [success]);

  return (
    <section
      className="w-full max-w-screen-xl mx-auto sm:p-5 p-3 relative border rounded-lg
      border-neutral-50 dark:border-neutral-900 dark:bg-neutral-900 shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-start font-medium text-lg flex items-center gap-1">
          <RectangleGroupIcon className="size-5 text-blue-500" />
          <span>스트릭</span>
        </p>
        <DropdownSelector
          options={sortOptions}
          selected={selected}
          onSelect={handleChange}
        />
      </div>
      <div style={{ direction: "rtl" }} className="mt-5 flex justify-center">
        <ActivityCalendar
          data={activity}
          blockMargin={5}
          blockRadius={2}
          blockSize={20}
          maxLevel={1}
          hideColorLegend
          totalCount={count}
          fontSize={14}
          weekStart={1}
          labels={labels}
          theme={theme}
          renderBlock={(block, activity) => (
            <CalendarBlockTooltip activity={activity}>
              {block}
            </CalendarBlockTooltip>
          )}
        />
      </div>
    </section>
  );
}
