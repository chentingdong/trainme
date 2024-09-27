"use client";

import { useState, useEffect } from "react";
import CalendarDay from "./CalendarDay";
import "./calendar.scss";
import Loading from "@/app/components/Loading";
import CalenderWeekHeader from "./CalendarWeekHeader";
import { getCurrentWeek } from "@/utils/timeUtils";

type Props = {
  aday: Date; //any day of the week.
  showBgImage?: boolean;
};

export default function CalendarWeek({ aday, showBgImage = false }: Props) {
  const week = getCurrentWeek(aday);

  const backgroundImages = [
    "url(/art/20240725-Arles-7.jpg)",
    "url(/art/20240725-Arles-4.jpg)",
    "url(/art/20240725-Arles-9.jpg)",
    "url(/art/20240725-Arles-1.jpg)",
    "url(/art/20240725-Arles-5.jpg)",
    "url(/art/20240725-Arles-2.jpg)",
    "url(/art/20240725-Arles-3.jpg)",
  ];

  if (week.length === 0) return <Loading />;

  return (
    <div className="calendar-week">
      <CalenderWeekHeader aday={aday} />
      <div className="flex gap-3 justify-between p-2">
        {week.map((date, index) => {
          return (
            <div
              key={index}
              className="w-full bg-cover bg-center"
              style={
                showBgImage ? { backgroundImage: backgroundImages[index] } : {}
              }
            >
              <CalendarDay date={date} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
