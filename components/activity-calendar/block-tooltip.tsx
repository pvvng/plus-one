"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { Activity, BlockElement } from "react-activity-calendar";

interface CalendarBlockTooltipProp {
  children: BlockElement;
  activity: Activity;
}

export default function CalendarBlockTooltip({
  children,
  activity,
}: CalendarBlockTooltipProp) {
  const [year, month, day] = activity.date.split("-");
  const dateString = `${year}년 ${month}월 ${day}일`;

  return (
    <Tooltip.Provider delayDuration={50}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            className="bg-neutral-900/80 dark:bg-neutral-500/80 text-white px-3 py-1 rounded shadow text-xs 
            font-paperlogy text-center animate-fade-in z-10"
          >
            <p>
              {dateString}: {activity.count > 0 ? "플러스원!" : "클릭하지 않음"}
            </p>
            <Tooltip.Arrow className="fill-neutral-900/80 dark:fill-neutral-500/80" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
