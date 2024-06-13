/* eslint-disable no-nested-ternary */
import React, { forwardRef, useState } from "react";
import format from "date-fns/format";
import DatePicker from "react-datepicker";
import mn from "date-fns/locale/mn";
import CustomHeader from "./CustomHeader";

const CustomIcon = forwardRef(({ onClick, className = "" }, ref) => {
    return (
        // eslint-disable-next-line react/button-has-type
        <button
            type="button"
            ref={ref}
            className={className}
            onClick={onClick}
            style={{ border: "1px solid #919bc0" }}
        >
            <i className="text-dark-50 flaticon2-calendar-9" />
        </button>
    );
});

const DatePickerRange = ({
    onChange,
    firstPlaceHolder,
    lastPlaceHolder,
    selectedStartDate,
    selectedEndDate,
    placeHolderFontSize,
    showTimeInput,
    showTimeSelect = false,
    ...rest
}) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [mainStartDate, setMainStartDate] = useState(null);
    const [mainEndDate, setMainEndDate] = useState(null);
    const [selectionComplete, toggleSelectionComplete] = useState(false);
    const [isMain, setIsMain] = useState(false);
    const [isStart, setIsStart] = useState(false);
    const [isEnd, setIsEnd] = useState(false);
    const [array] = useState([
        {
            startDate: null,
            endDate: null,
        },
    ]);

    const handleDateChange = (date) => {
        if (!selectionComplete && !mainStartDate) {
            setMainStartDate(date);
            toggleSelectionComplete(false);
            return;
        }

        if (!selectionComplete && mainStartDate && !mainEndDate) {
            setMainEndDate(date);
            toggleSelectionComplete(true);
            return;
        }

        if (selectionComplete && mainStartDate && mainEndDate) {
            setMainStartDate(date);
            setMainEndDate(undefined);
            toggleSelectionComplete(false);
        }
    };

    const handleSelect = (date) => {
        handleDateChange(date);
        setIsMain(true);
    };

    const handleStartDateChange = (date) => {
        if (date) {
            setIsStart(true);
            setStartDate(date);
            setMainStartDate(date);
            array[0].startDate = showTimeInput || showTimeSelect ? format(date, "yyyy-MM-dd HH:mm") : format(date, "yyyy-MM-dd");
            onChange(array);
        }
    };

    const handleEndDateChange = (date) => {
        if (date) {
            setIsEnd(true);
            setEndDate(date);
            setMainEndDate(date);
            array[0].endDate = showTimeInput || showTimeSelect ? format(date, "yyyy-MM-dd HH:mm") : format(date, "yyyy-MM-dd");
            onChange(array);
        }
    };

    const handleMainCalendarClose = () => {
        setIsMain(false);
        if (mainStartDate) {
            setStartDate(mainStartDate);
            array[0].startDate = showTimeInput || showTimeSelect ? format(mainStartDate, "yyyy-MM-dd HH:mm") : format(mainStartDate, "yyyy-MM-dd");
        }

        if (mainEndDate) {
            setEndDate(mainEndDate);
            array[0].endDate = showTimeInput || showTimeSelect ? format(mainEndDate, "yyyy-MM-dd HH:mm") : format(mainStartDate, "yyyy-MM-dd");
        }

        onChange(array);
    };

    const handleFirstCalendarClose = () => {
        setIsStart(false);
    };

    const handleLastCalendarClose = () => {
        setIsEnd(false);
    };

    const handleCalendarOpen = () => {
        setStartDate(undefined);
        setEndDate(undefined);
        setMainStartDate(undefined);
        setMainEndDate(undefined);
        toggleSelectionComplete(false);
        array[0].startDate = null;
        array[0].endDate = null;
        onChange(array);
    };

    return (
        <div className="date-picker-range-container">
            <DatePicker
                style={{ fontSize: placeHolderFontSize ? undefined : 14 }}
                locale={mn}
                selected={
                    startDate
                        ? new Date(startDate)
                        : selectedStartDate
                            ? new Date(selectedStartDate)
                            : null
                }
                previousMonthButtonLabel="Өмнөх сар"
                nextMonthButtonLabel="Дараагийн сар"
                onChange={handleStartDateChange}
                startDate={startDate}
                timeFormat='HH:mm'
                timeIntervals='1'
                dateFormat={showTimeInput || showTimeSelect ? "yyyy-MM-dd HH:mm" : "yyyy-MM-dd"}
                disabled={isMain ? isMain : isEnd ? isEnd : false}
                className="first-datepicker"
                onCalendarClose={handleFirstCalendarClose}
                placeholderText={firstPlaceHolder ? firstPlaceHolder : ""}
                showTimeInput={showTimeInput || false}
                showTimeSelect={showTimeSelect || false}
                {...rest}
                renderCustomHeader={CustomHeader}
            />
            <DatePicker
                locale={mn}
                className="react-datepicker-with-icon"
                onChange={handleDateChange}
                onSelect={handleSelect}
                startDate={mainStartDate}
                endDate={mainEndDate}
                selectsRange
                selectsStart
                selectsEnd
                customInput={<CustomIcon />}
                shouldCloseOnSelect={false}
                onCalendarOpen={handleCalendarOpen}
                onCalendarClose={handleMainCalendarClose}
                renderCustomHeader={CustomHeader}
                {...rest}
            />
            <DatePicker
                locale={mn}
                selected={
                    endDate
                        ? new Date(endDate)
                        : selectedEndDate
                            ? new Date(selectedEndDate)
                            : null
                }
                previousMonthButtonLabel="Өмнөх сар"
                nextMonthButtonLabel="Дараагийн сар"
                onChange={handleEndDateChange}
                endDate={endDate}
                timeFormat='HH:mm'
                timeIntervals='1'
                dateFormat={showTimeInput || showTimeSelect ? "yyyy-MM-dd HH:mm" : "yyyy-MM-dd"}
                disabled={isMain ? isMain : isStart ? isStart : false}
                className="last-datepicker"
                onCalendarClose={handleLastCalendarClose}
                shouldCloseOnSelect={false}
                placeholderText={lastPlaceHolder ? lastPlaceHolder : ""}
                renderCustomHeader={CustomHeader}
                showTimeInput={showTimeInput || false}
                showTimeSelect={showTimeSelect || false}
                {...rest}
            />
        </div>
    );
};

export default DatePickerRange;
