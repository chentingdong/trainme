import React from 'react';

const CalendarWeekHeader = ({ weekNumber }: { weekNumber: number; }) => {
  return (
    <div className="week-header bg-gray-200 p-2 text-center">
      Week {weekNumber}
    </div>
  );
};

export default CalendarWeekHeader;