const dayInSeconds = 86400;
const hourInSeconds = 3600;
const workHourByDay = 9;
const startWorkHour = 8;
const endWorkHour = 17;

function getTreatmentTime() {
    var startDate = new Date(document.getElementById('startDate').value);
    var endDate = new Date(document.getElementById('endDate').value);
    if (startDate > endDate){		
		document.getElementById("resultToShow").innerHTML = "Error. Start date must be lower than end Date";	
		return "Error. Start date must be lower than end Date";
	}

    workStartDate = getWorkingDate(startDate);
    workEndDate = getWorkingDate(endDate);
    finalStartDate = getWorkingHour(startDate);
    finalEndDate = getWorkingHour(endDate);
    var secondes = (finalEndDate.getTime() - finalStartDate.getTime()) / 1000;
    var allWorkingDays = secondes / dayInSeconds;
    var allReallyWorkingDays = getCountDaysWithoutHoliday(finalStartDate, finalEndDate);
    var workingSeconds = 0;

    if (allReallyWorkingDays == 1) {
        workingSeconds = getWorkingSeconds(finalStartDate, finalEndDate);
    } else if (allReallyWorkingDays >= 2) {
        var workingFirstDay = getStartWorkingSeconds(finalStartDate);
        var workingLastDay = getEndWorkingSeconds(finalEndDate);
        var workingOtherDays = (allReallyWorkingDays - 2) * hourInSeconds * workHourByDay;
        workingSeconds = workingFirstDay + workingOtherDays + workingLastDay;
    } else {
		document.getElementById("resultToShow").innerHTML = "Error";
        return "Error";
    }
	
	document.getElementById("resultToShow").innerHTML = "The actual working time in seconds is " + workingSeconds + " second(s)";

//alert(workingSeconds);
    return workingSeconds;
}

function getCountDaysWithoutHoliday(startDate, endDate) {
    var countDay = 0;
    var nextDay = startDate;
    do {
        countDay += getCountWorkingDay(nextDay);
        nextDay = setNextDay(nextDay);
    } while (compareDate(nextDay, endDate) < 1)
    return countDay;
}

function compareDate(date1, date2) {
    date1 = getDate(date1);
    date2 = getDate(date2);
    if (date1 > date2)
        return 1
    else if (date1 < date2)
        return -1
    else
        return 0
}

function getDate(date1) {
    return new Date((date1.getYear() + 1900) + "-" + (date1.getMonth() + 1) + "-" + date1.getDate());
}

function getWorkingDate(dateParam) {
    if (isNormalWorkingDay(dateParam) && !isHoliday(dateParam))
        return dateParam
    else
        return nextWorkingDay(dateParam)
}

function getWorkingHour(dateParam) {
    if (isWorkingHour(dateParam) && isWorkingDay(dateParam))
        return dateParam
    else
        return goodWorkingHour(dateParam)
}

function nextWorkingDay(dateParam) {
    var dayDate = new Date(dateParam);
    while (!isNormalWorkingDay(dayDate) || isHoliday(dayDate)) {
        dayDate.setDate(dayDate.getDate() + 1);
    }
    return dayDate;
}

function setNextDay(dateParam) {

    var dayDate = new Date(dateParam);
    dayDate.setDate(dayDate.getDate() + 1);
    return dayDate;
}

function getCountWorkingDay(dateParam) {
    var dayDate = new Date(dateParam);
    if (!isNormalWorkingDay(dayDate) || isHoliday(dayDate))
        return 0;
    else
        return 1;
}

function getStartWorkingSeconds(dateParam) {
    var seconds = 0;
    var endDateDay = new Date(dateParam);
    endDateDay.setHours(endWorkHour);
    endDateDay.setMinutes(0);
    endDateDay.setSeconds(0);
    if (dateParam.getHours() >= startWorkHour && dateParam.getHours() < endWorkHour) {
        seconds = (endDateDay.getTime() - dateParam.getTime()) / 1000;
    }
    return seconds;
}

function getWorkingSeconds(dateParamStart, dateParamEnd) {
    if (dateParamStart.getHours() >= startWorkHour && dateParamStart.getHours() < endWorkHour) {
        seconds = (dateParamEnd.getTime() - dateParamStart.getTime()) / 1000;
    } else if (dateParamStart.getHours() < startWorkHour && dateParamStart.getHours() < endWorkHour) {
        var startDateDay = new Date(dateParamStart);
        startDateDay.setHours(startWorkHour);
        startDateDay.setMinutes(0);
        startDateDay.setSeconds(0);
        seconds = (dateParamEnd.getTime() - startDateDay.getTime()) / 1000;
    } else if (dateParamStart.getHours() >= startWorkHour && dateParamStart.getHours() < endWorkHour) {
        var endDateDay = new Date(dateParamStart);
        endDateDay.setHours(endWorkHour);
        endDateDay.setMinutes(0);
        endDateDay.setSeconds(0);
        seconds = (endDateDay.getTime() - dateParamStart.getTime()) / 1000;
    }
    return seconds;
}

function getEndWorkingSeconds(dateParam) {
    var startDateDay = new Date(dateParam);
    var seconds = 0;
    startDateDay.setHours(startWorkHour);
    startDateDay.setMinutes(0);
    startDateDay.setSeconds(0);
    if (dateParam.getHours() >= startWorkHour && dateParam.getHours() < endWorkHour) {
        seconds = (dateParam.getTime() - startDateDay.getTime()) / 1000;
    }
    return seconds;
}

function isNormalWorkingDay(dateParam) {
    return (dateParam.getDay() != 0 && dateParam.getDay() != 6);
}

function isWorkingHour(dateParam) {
    return (dateParam.getHours() >= startWorkHour && dateParam.getHours() < endWorkHour);
}

function isWorkingDay(dateParam) {
    return isNormalWorkingDay(dateParam) && !isHoliday(dateParam);
}

function goodWorkingHour(dateParam) {
    var result = new Date(dateParam);
    if (isWorkingDay(dateParam)) {
        if (dateParam.getHours() < startWorkHour) {
            result.setHours(startWorkHour);
            result.setMinutes(0);
            result.setSeconds(0);
        }
        if (dateParam.getHours() >= endWorkHour) {
            result.setHours(endWorkHour);
            result.setMinutes(0);
            result.setSeconds(0);
        }
    } else {
        result = nextWorkingDay(dateParam)
        result.setHours(8);
        result.setMinutes(0);
        result.setSeconds(0);
    }
    return result;
}

function isHoliday(dateParam) {
    var holidays = ["0101", "0105", "0708", "1508", "0111", "1511", "2512"];
    var paquesHolidays = getPaqueDay(dateParam);
    paquesHolidays.forEach(item =>
        holidays.push(item));
    var formatDay = dayMonthToString(dateParam.getDate()) + dayMonthToString((dateParam.getMonth() + 1));
    return holidays.includes(formatDay);
}

function getPaqueDay(dateParam) {
    var year = dateParam.getYear() + 1900;
    n = dateParam.getYear();
    a = n - 19 * Math.floor(n / 19);
    ab = 1 + a * 7;
    b = Math.floor(ab / 19);
    bc = 11 * a - b + 4;
    c = bc - 29 * Math.floor(bc / 29);
    d = Math.floor(n / 4);
    de = n - c + d + 31;
    e = de - 7 * Math.floor(de / 7);
    p = 25 - c - e;
    var baseDate = new Date(year + "-03-31");
    if (p > 0.5) {
        baseDate.setDate(baseDate.getDate() + p);
    } else {
        baseDate.setDate(baseDate.getDate() - p);
    }
    var ascencionDate = new Date(baseDate);
    var pentecoteDate = new Date(baseDate);
    ascencionDate.setDate(baseDate.getDate() + 39);
    pentecoteDate.setDate(baseDate.getDate() + 49);
    var paqueDay = dayMonthToString(baseDate.getDate()) + dayMonthToString((baseDate.getMonth() + 1));
    var ascencionDay = dayMonthToString(ascencionDate.getDate()) + dayMonthToString((ascencionDate.getMonth() + 1));
    var pentecoteDay = dayMonthToString(pentecoteDate.getDate()) + dayMonthToString((pentecoteDate.getMonth() + 1));

    return [paqueDay, ascencionDay, pentecoteDay];
}

function dayMonthToString(value) {
    if (value.toString().length == 1)
        value = "0" + value.toString();
    return value;
}
