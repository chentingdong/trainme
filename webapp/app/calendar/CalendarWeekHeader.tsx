"use client";

import React from "react";
import { getCurrentWeek } from "@/utils/timeUtils";
import { formatDate } from "date-fns";

type Props = {
  //any day of the week.
  aday: Date;
};

export default function CalendarWeekHeader({ aday }: Props) {
  const week = getCurrentWeek(aday);

  return (
    <div className="flex items-center mx-8">
      <h2 className="mx-2 p-2 rounded-md">
        {formatDate(week[0], "MMMM")} {formatDate(week[0], "dd")} -{" "}
        {formatDate(week[6], "dd")}
      </h2>
    </div>
  );
}
