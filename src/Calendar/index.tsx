import React, { useState, useEffect } from "react";

import Header from "./Header";
// import DateRender from "./DateRender";
import RangeRender from "./RangeRender";
import useSelectedData from "./useSelectedData";

import { getMonthOffset, checkDatePropsValidity } from "./util";
// getTodaysDate
import { dateFormatter, getDateFromObject } from "../date-fns";
import { getWeekNames, formatBsDate } from "../CalendarData";

import { DateRange, INepaliCalendar, IDateObject } from "./types";

// import "../nepali_date_picker.css";

const NepaliCalendar = (props: INepaliCalendar) => {
  const {
    // showToday = true,
    defaultValue,
    dateFormat = "yyyy-mm-dd", // TODO
    value,
    onSelect,
    shouldPressOK = true,
    showExtra = true,
    showMonthDropdown = false,
    showYearDropdown = false,
    calendarType,
    disableDate,
    disablePast,
    disableFuture,
    maxDate,
    minDate,
    range,
  } = props;

  useEffect(() => {
    if (value && defaultValue) {
      console.warn("If value is provided defaultValue is ignored.");
    }
  }, [value, defaultValue]);

  useEffect(() => {
    checkDatePropsValidity(
      { maxDate, defaultValue, minDate, value },
      dateFormat,
      calendarType
    );
  }, [dateFormat, defaultValue, maxDate, minDate, value, calendarType]);

  const isAD = calendarType === "AD";
  // //always in ad
  const [selectedData, setSelectedData] = useSelectedData(
    dateFormat,
    isAD,
    value,
    defaultValue
  );

  const [calendarData, setCalendarData] = useState<IDateObject>({
    date: selectedData.date,
    month: selectedData.month,
    year: selectedData.year,
  });

  const changeMonth = (offset: number) => {
    const data = getMonthOffset(calendarData, offset, calendarType);
    if (data) {
      const { year, month, date } = data;

      setCalendarData({ year, month, date: date });
    }
  };

  const onChangeDate = (adDate: IDateObject, bsDate: IDateObject) => {
    const date = getDateFromObject(adDate);
    const formattedDate = isAD
      ? dateFormatter(date, dateFormat)
      : formatBsDate(bsDate, dateFormat);

    if (!value) setSelectedData({ ...adDate });
    typeof onSelect === "function" &&
      onSelect(formattedDate, adDate, bsDate, date); //TODO
  };

  //TODO range check
  const changeYear = (offset: number) => {
    const month = calendarData.month;

    const offsetValue = Number(offset);
    if (isNaN(offsetValue)) {
      throw new TypeError(
        `Expected type of offset for change year function is number instead received ${typeof offset}`
      );
    }
    const year = calendarData.year + offsetValue;

    const date = calendarData.date;
    setCalendarData({ year, month, date });
  };

  const allDays =
    calendarType === "BS"
      ? getWeekNames("np", "short")
      : getWeekNames("en", "short");

  const dateRange: DateRange | null = range
    ? { from: range?.from, to: range?.to, format: range?.format ?? dateFormat }
    : null;

  console.log("just trying this");
  console.log("dateRange", dateRange);
  const x = 100;
  console.log("x", x);

  return (
    <div className="rl-nepali-date-panel-wrapper">
      <div className="rl-nepali-date-panel">
        <Header
          changeYear={changeYear}
          changeMonth={changeMonth}
          month={calendarData.month}
          year={calendarData.year}
          isAD={isAD}
          showExtra={showExtra}
          showMonthDropdown={showMonthDropdown}
          showYearDropdown={showYearDropdown}
        />
        <div className="rl-nepali-date-body">
          <table className="rl-nepali-date-content">
            <thead>
              <tr>
                {allDays &&
                  allDays.map((val, ind) => {
                    return <th key={`${ind}-m`}>{val}</th>;
                  })}
              </tr>
            </thead>
            <tbody>
              <RangeRender
                year={calendarData.year}
                month={calendarData.month}
                selectedData={selectedData}
                isAD={isAD}
                showExtra={showExtra}
                shouldPressOK={shouldPressOK}
                onChangeDate={onChangeDate}
                changeMonth={changeMonth}
                range={dateRange}
                disableDate={disableDate}
                disablePast={disablePast}
                disableFuture={disableFuture}
                maxDate={maxDate}
                minDate={minDate}
                dateFormat={dateFormat}
              />
            </tbody>
          </table>

          {/* {showToday && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                padding: 8,
                paddingBottom: 0,
              }}
            >
              <div
                className="today-btn hand-cursor"
                onClick={() => {
                  setCalendarBSData(
                    todayDateBS.year,
                    todayDateBS.month,
                    todayDateBS.date
                  );
                  onChangeDate(todayDateAD);
                }}
              >
                Today
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default NepaliCalendar;