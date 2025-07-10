"use client";

import React, { useEffect } from "react";
import {
  ActivityCalendar,
  Props as CalendarProps,
  ThemeInput,
} from "react-activity-calendar";
import { ActivityData } from "@/lib/generate-past-year-data";
import { toast } from "sonner";
import CustomToast from "../custom-toast";
import CalendarBlockTooltip from "./block-tooltip";
import { RectangleGroupIcon } from "@heroicons/react/24/solid";

const explicitTheme: ThemeInput = {
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
  activity,
  count,
}: ActivityCalendarViewProps) {
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
      className="w-full max-w-screen-sm mx-auto sm:p-5 p-3 relative border rounded-lg
      border-neutral-50 dark:border-neutral-900 dark:bg-neutral-900 shadow"
    >
      <p className="text-start font-medium flex items-center gap-1">
        <RectangleGroupIcon className="size-4 text-blue-500 " />
        <span>스트릭</span>
      </p>
      <div style={{ direction: "rtl" }} className="mt-3">
        <ActivityCalendar
          data={activity}
          blockMargin={5}
          blockRadius={2}
          blockSize={20}
          maxLevel={1}
          hideColorLegend
          labels={labels}
          totalCount={count}
          fontSize={14}
          weekStart={1}
          theme={explicitTheme}
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
