import React, { useEffect, useRef } from "react";
import { CalendarType } from "../Calendar/types";
import { getOffsetFormattedDate, isDateValid } from "../date-fns";
// import "../nepali_date_picker.css";

import NepaliCalendarForRange from "../Calendar";
import useDateRange from "./useDateRange";

interface ICalendarRange {
  from: string;
  to: string;
  onChange: (dateFrom: string | null, dateTo: string | null) => void;
  dateFormat: string;
  calendarType: CalendarType;
}

const NepaliCalendarRange = (props: ICalendarRange) => {
  const { from, to, onChange, dateFormat = "yyyy-mm-dd", calendarType } = props;

  const { selectedDate, onDateSelect } = useDateRange(from, to, dateFormat);

  const { from: selectedDateFrom, to: selectedDateTo } = selectedDate;

  console.log("selected", selectedDate);

  //Use Directly on on Select instead
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    const onChange = onChangeRef.current;
    typeof onChange === "function" &&
      onChange(selectedDate.from, selectedDate.to);
  }, [onChangeRef, selectedDate.from, selectedDate.to]);

  const isAD = calendarType === "AD";

  return (
    <div className="rl-range-calendar">
      <NepaliCalendarForRange
        range={{ from: selectedDateFrom, to: selectedDateTo }}
        defaultValue={selectedDateFrom}
        onSelect={(hello, adDate, bsDate) => {
          onDateSelect(isAD ? adDate : bsDate);
        }}
        dateFormat={dateFormat}
        calendarType={calendarType}
        showToday={false}
      />
      <NepaliCalendarForRange
        range={{ from: selectedDateFrom, to: selectedDateTo }}
        defaultValue={
          selectedDateTo == null
            ? selectedDateFrom && isDateValid(selectedDateFrom, dateFormat)
              ? getOffsetFormattedDate(
                  { month: 1 },
                  dateFormat,
                  selectedDateFrom
                )
              : getOffsetFormattedDate({ month: 1 }, dateFormat)
            : selectedDateTo
        }
        onSelect={(hello, adDate, bsDate) => {
          onDateSelect(isAD ? adDate : bsDate);
        }}
        dateFormat={dateFormat}
        calendarType={calendarType}
        showToday={false}
      />
    </div>
  );
};

export default NepaliCalendarRange;