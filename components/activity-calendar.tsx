"use client";

import React from "react";
import {
  Activity,
  ActivityCalendar,
  BlockElement,
  Props as CalendarProps,
  ThemeInput,
} from "react-activity-calendar";
import * as Tooltip from "@radix-ui/react-tooltip";
import { generatePastYearData } from "@/lib/generate-past-year-data";

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
  return (
    <section className="w-full flex justify-center items-center p-5">
      <ActivityCalendar
        data={generatePastYearData(new Date().toISOString())}
        blockMargin={5}
        blockRadius={2}
        blockSize={18}
        maxLevel={1}
        hideColorLegend
        labels={labels}
        totalCount={0}
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
