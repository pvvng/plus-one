"use client";

import React, { useEffect, useState } from "react";
import {
  Activity,
  ActivityCalendar,
  BlockElement,
  Props as CalendarProps,
  ThemeInput,
} from "react-activity-calendar";
import * as Tooltip from "@radix-ui/react-tooltip";
import { ActivityData } from "@/lib/generate-past-year-data";
import { toast } from "sonner";
import CustomToast from "./custom-toast";

const explicitTheme: ThemeInput = {
  light: ["#f0f0f0", "#3B82F6"],
  dark: ["#262626", "#3B82F6"],
};

const labels = {
  months: [...Array(12)].map((_, i) => `${i + 1}월`),
  weekdays: ["일", "월", "화", "수", "목", "금", "토"],
  totalCount: "총 {{count}}일 플러스원!",
} satisfies CalendarProps["labels"];

export default function ActivityCalendarWrapper() {
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [activity, setActivity] = useState<ActivityData[]>([]);

  useEffect(() => {
    const getActivities = async () => {
      setIsLoading(true);
      const response = await fetch("/api/activity");
      const json = await response.json();
      setActivity(json.data.activity);
      setTotalCount(json.data.count);
      setIsLoading(false);

      if (!json.success) {
        toast(
          <CustomToast
            success={false}
            message={`스트릭 데이터를 불러오는 중 에러가 발생했습니다.\n새로고침 후 다시 시도해주세요.`}
          />
        );
      }
    };

    getActivities();
  }, []);

  return (
    <section className="w-full flex justify-center items-center p-5">
      <ActivityCalendar
        data={activity}
        blockMargin={5}
        blockRadius={2}
        blockSize={18}
        maxLevel={1}
        loading={isLoading}
        hideColorLegend
        labels={labels}
        totalCount={totalCount}
        fontSize={14}
        weekStart={0}
        theme={explicitTheme}
        renderBlock={(block, activity) => (
          <CalendarBlockTooltip activity={activity}>
            {block}
          </CalendarBlockTooltip>
        )}
      />
    </section>
  );
}

function CalendarBlockTooltip({
  children,
  activity,
}: {
  children: BlockElement;
  activity: Activity;
}) {
  const [year, month, day] = activity.date.split("-");
  const dateString = `${year}년 ${month}월 ${day}일`;

  return (
    <Tooltip.Provider delayDuration={50}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            className="bg-neutral-900/80 text-white px-3 py-1 rounded shadow text-xs 
            font-paperlogy text-center animate-fade-in"
          >
            <p>
              {dateString}: {activity.count > 0 ? "플러스원!" : "클릭하지 않음"}
            </p>
            <Tooltip.Arrow className="fill-neutral-900/80" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
