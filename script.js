//todo CONSTATNS
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


//todo HTML elements
let selectMonth = document.getElementById("select-month-id");
let selectYear = document.getElementById("select-year-id");
let calendar = document.getElementById("calendar-id");
let nextMonthBtn = document.getElementById("next-month-btn");
let previousMonthBtn = document.getElementById("previous-month-btn");
let btnAddEvent = document.getElementById("btn-add-event-id");
//modal elements
let modalContainer = document.getElementById("modal-container");
let modalAddEvent = document.getElementById("add-event-modal-id");
let btnCloseModal = document.getElementById("btn-close");
let btnCancelAdd = document.getElementById("btn-cancel");
let btnSaveEvent = document.getElementById("btn-save");
let eventTitle = document.getElementById("event-title");
let initialDate = document.getElementById("initial-date");
let initialDateHour = document.getElementById("initial-date-hour-id");
let endDate = document.getElementById("end-date");
let endDateHour = document.getElementById("end-date-hour-id");
let endDateCheckbox = document.getElementById("end-date-checkbox");
let reminderCheckbox = document.getElementById("reminder-checkbox");
let reminderCheckboxLabel = document.getElementById("reminder-checkbox-label");
let reminderSelector = document.getElementById("reminder-selector");
let eventDescription = document.getElementById("event-description");
let eventType = document.getElementById("event-type");
let errorTitle = document.getElementById("error-title");
let errorInitialDate = document.getElementById("error-initial-date");




// the events are stored in the localStorage.
let events = []; // variable to upload the events from the localStorage

let myCalendar = new Calendar();
let currentDate = new Date();

//upload already existing events
loadEvents();
//Initialise calendar
myCalendar.updateCurrentDate();
addSelectableMonths();
addSelectableYears();
myCalendar.createMonth(currentDate.getFullYear(), currentDate.getMonth() + 1, false, true);

nextMonthBtn.addEventListener("click", e => myCalendar.displayNextMonth());
previousMonthBtn.addEventListener("click", e => myCalendar.displayPreviousMonth());
modalContainer.addEventListener("click", (e) => {
    closeModal(e)
});
btnAddEvent.addEventListener("click", displayFormAddEvent);
btnSaveEvent.addEventListener("click", (e) => {
    addEvent(e)
});
endDateCheckbox.addEventListener("click", (e) => {
    if (e.currentTarget.checked) {
        endDate.classList.remove("hide");
        endDateHour.classList.remove("hide");
        reminderCheckboxLabel.classList.remove("hide");
    } else {
        endDate.classList.add("hide");
        endDateHour.classList.add("hide");
        reminderCheckboxLabel.classList.add("hide");
        reminderCheckbox.checked = false;
        reminderSelector.classList.add("hide");
    }
});
reminderCheckbox.addEventListener("click", (e) => {
    if (e.currentTarget.checked) {
        reminderSelector.classList.remove("hide");
    } else {
        reminderSelector.classList.add("hide");
    }
});

//set width to the displayed month title according to the length of the month name
selectMonth.addEventListener("click", function () {
    let displayedMonth = selectMonth.value;
    selectMonth.style.width = displayedMonth.length + 2 + "rem";
    if (displayedMonth !== MONTHS[myCalendar.displayedMonth - 1]) {
        console.log("hiii");
        let newMonth = MONTHS.indexOf(displayedMonth) + 1; // +1 cause the function get months from 1 to 12
        myCalendar.hideMonth();
        myCalendar.displayMonth(myCalendar.displayedYear, newMonth);
    }
});
selectYear.addEventListener("click", function () {
    let displayedYear = parseInt(selectYear.value);
    if (displayedYear !== myCalendar.displayedYear) {
        myCalendar.hideMonth();
        myCalendar.displayMonth(displayedYear, myCalendar.displayedMonth);
    }
});

//load the events from the localStorage to the variable events
//the dates are date objects
function loadEvents() {
    if (localStorage.length === 0) {
        return false;
    }

    events = JSON.parse(localStorage.events);
    //convert strings to date objects
    events.forEach((el) => {
        el.initialDate = new Date(el.initialDate);
        el.creationDate = new Date(el.creationDate);
        el.endDate = new Date(el.endDate);
        el.reminderDate = new Date(el.reminderDate);
    });
}

setInterval(checkDisplayedEvents, 1000);
//check the size of the screen and displays the num of events that fit
function checkDisplayedEvents() {
    function manageDisplayEvents(numEvents) {
        document.querySelectorAll(".month.displayed  .events-container").forEach((con) => {
            con.querySelectorAll(".event.displayed").forEach((ev, i) => {
                if (i > numEvents - 1) {
                    ev.classList.add("hide");
                } else {
                    ev.classList.remove("hide");
                }
            });
            let extraEvents = document.createElement("div");
            extraEvents.classList.add("more-events");
            let preExtraEvents = con.querySelector(".more-events");
            let checkPre = (preExtraEvents === null) ? 0 : -1;
            if ((con.children.length + checkPre - numEvents) > 0) {

                if (preExtraEvents === null) {
                    con.appendChild(extraEvents);
                    extraEvents.textContent = con.children.length - 1 - numEvents + " more";
                    // -1 cause the "x more" is also a child

                } else {
                    preExtraEvents.textContent = con.children.length - 1 - numEvents + " more";
                }

            } else {
                try {
                    preExtraEvents.remove();
                } catch {

                }
            }

        });
    }
    let windowHeight = window.innerHeight;
    if (windowHeight >= 850) {
        manageDisplayEvents(3);
    } else if (windowHeight >= 680) {
        manageDisplayEvents(2);
    } else if (windowHeight >= 530) {
        manageDisplayEvents(1);
    } else {
        manageDisplayEvents(0);

    }

}


function displayFormAddEvent() {
    modalContainer.classList.remove("hide");
    modalAddEvent.classList.remove("hide");

}

function addEvent(event) {
    event.preventDefault();
    if (validateForm() === false) {
        return false;
    }

    let evInitialDate = new Date(initialDate.value.slice(0, 4), parseInt(initialDate.value.slice(5, 7)) - 1, initialDate.value.slice(8, 10), initialDateHour.value.slice(0, 2), initialDateHour.value.slice(3, 5));
    //if an end date is not set, it will be set at 23:59 of the event day
    let evEndDate = new Date(initialDate.value.slice(0, 4), parseInt(initialDate.value.slice(5, 7)) - 1, initialDate.value.slice(8, 10), 23, 59);
    let evReminder = "Invalid date";
    if (endDateCheckbox.checked) {
        evEndDate = new Date(endDate.value.slice(0, 4), parseInt(endDate.value.slice(5, 7)) - 1, endDate.value.slice(8, 10), endDateHour.value.slice(0, 2), endDateHour.value.slice(3, 5));
        let reminderMinutes = 0;
        reminderSelector.querySelectorAll("option").forEach((el) => {
            if (reminderSelector.value = el.value) {
                reminderMinutes = el.dataset.time;
            }
        });
        evReminder = new Date(endDate.value.slice(0, 4), parseInt(endDate.value.slice(5, 7)) - 1, endDate.value.slice(8, 10), endDateHour.value.slice(0, 2), parseInt(endDateHour.value.slice(3, 5)) - reminderMinutes);
    }
    let newEvent = new Event(eventTitle.value, evInitialDate, new Date(), evEndDate, evReminder, eventDescription.value, eventType.children[eventType.selectedIndex].dataset.value);
    events.push(newEvent);
    localStorage.setItem("events", JSON.stringify(events));
    modalContainer.classList.add("hide");
    modalAddEvent.classList.add("hide");
    //reset form
    //add event to the calendar
    //check

    let dayElement = document.querySelector("#year-" + evInitialDate.getFullYear() + "> [data-month='" + (evInitialDate.getMonth() + 1) + "'] .day-" + evInitialDate.getDate() + ".c-month");
    console.log(dayElement);
    if (dayElement !== null) {
        addNewEvent(dayElement, newEvent);
    }

    // the month is not displayed yet. So there is nothing to do
    //check the desired day is in the previous or next month
    //next month >20
    //previous month < 7
    let possibleMonth; // if we are in the first or last month then the year will change
    //this variable facilitates get the right year
    let monthElement;
    if (evInitialDate.getDate() > 20) {
        possibleMonth = new Date(initialDate.value.slice(0, 4), parseInt(initialDate.value.slice(5, 7)), initialDate.value.slice(8, 10));
        console.log("check if other month: ");
        console.log(possibleMonth.getFullYear());
        console.log(evInitialDate.getMonth() + 2);
        monthElement = document.querySelector("#year-" + possibleMonth.getFullYear() + "> [data-month='" + (evInitialDate.getMonth() + 2) + "']");
        if (monthElement === null) {
            console.log("month does not exist");
            return false;
        } else {
            monthElement.querySelectorAll("li.day-other-month").forEach((el) => {
                if (el.classList.contains("day-" + evInitialDate.getDate())) {
                    console.log("EXISTS in a previous month");
                    addNewEvent(el, newEvent);
                    //add events
                }
            });

        }
    } else if (evInitialDate.getDate() < 7) {
        possibleMonth = new Date(initialDate.value.slice(0, 4), parseInt(initialDate.value.slice(5, 7)) - 2, initialDate.value.slice(8, 10));
        monthElement = document.querySelector("#year-" + possibleMonth.getFullYear() + "> [data-month='" + (evInitialDate.getMonth()) + "']");
        if (monthElement === null) {
            console.log("month does not exist");
            return false;
        } else {
            monthElement.querySelectorAll("li.day-other-month").forEach((el) => {
                if (el.classList.contains("day-" + evInitialDate.getDate())) {
                    console.log("EXISTS in a previous month");
                    addNewEvent(el, newEvent);
                    //add events
                }
            });

        }
    } else {
        //the day is not displayed in any month

    }





    return true;
}


// container: HTML element coresponding to the day li
function addNewEvent(container, event) {
    let eventContainer = container.querySelector(".events-container");
    let newEvent = document.createElement("div");
    newEvent.classList.add("event");
    newEvent.classList.add("displayed");
    newEvent.classList.add(event.type);
    if(event.expired === true){
        newEvent.classList.add("expired");
    }
    newEvent.dataset.position = events.indexOf(event);
    let newEventTime = document.createElement("span");
    newEventTime.classList.add("event-time");
    console.log(event);
    console.log(event.initialDate.getDate());
    let eventHours = (event.initialDate.getHours() > 9) ? event.initialDate.getHours() : "0" + "" + event.initialDate.getHours();
    let eventMinutes = (event.initialDate.getMinutes() > 9) ? event.initialDate.getMinutes() : "0" + "" + event.initialDate.getMinutes();
    newEventTime.textContent = eventHours + ":" + eventMinutes;
    newEvent.appendChild(newEventTime);
    newEvent.innerHTML += " " + event.title;

    if (eventContainer === null) {
        console.log("creae event container");
        eventContainer = document.createElement("div");
        eventContainer.classList.add("events-container");
        eventContainer.appendChild(newEvent);
        if (container.classList.contains("today-container")) {
            container.querySelector(".today").appendChild(eventContainer);
        } else {
            container.appendChild(eventContainer);
        }
    } else {
        eventContainer.appendChild(newEvent);

    }
}


function validateForm() {
    console.log(eventTitle.value);
    if (eventTitle.value === "") {
        console.log("remove");
        errorTitle.classList.remove("hide");
        return false;
    } else {
        errorTitle.classList.add("hide");
    }
    if (initialDate.value === "") {
        errorInitialDate.classList.remove("hide");
        return false;
    } else {
        errorInitialDate.classList.add("hide");
    }
    return true;
    //store event
}



function closeModal(event) {
    let closeModalOptions = [modalContainer, btnCloseModal, btnCancelAdd];
    if (closeModalOptions.indexOf(event.target) !== -1) {
        event.preventDefault();
        modalContainer.classList.add("hide");
        Array.from(modalContainer.children).forEach((modal) => {
            modal.classList.add("hide");
        });
    }
}

function displayModal(HTMLmodal) {
    modalContainer.classList.remove("hide");
    HTMLmodal.classList.remove("hide");
}

function addSelectableMonths() {
    MONTHS.forEach((el, index) => {
        let newMonth = document.createElement("option");
        newMonth.textContent = el;
        if (index === new Date().getMonth()) {
            newMonth.selected = true;
            selectMonth.style.width = el.length + 2 + "rem";
        }
        selectMonth.appendChild(newMonth);
    });
}

function addSelectableYears() {
    let currentYear = new Date().getFullYear();
    for (i = currentYear - 20; i < currentYear + 80; i++) {
        let newYear = document.createElement("option");
        newYear.textContent = i;
        if (i === currentYear) {
            newYear.selected = true;
        }
        selectYear.appendChild(newYear);
    }
}
// updates the title of displayed year and month
//month: 1-12
function updateSelectedDate(year, month) {
    Array.from(selectMonth.children).forEach((el, index) => {
        el.selected = false;
        if (index === month - 1) {
            el.selected = true;
            selectMonth.style.width = el.textContent.length + 2 + "rem";
        }
    });
    Array.from(selectYear.children).forEach((el) => {
        el.selected = false;
        if (el.value === String(year)) {
            el.selected = true;
        }
    });
}

//function to create events. We want to store all the information as strings since we 
//will be using 
function Event(title, initialDate, creationDate, endDateTime, reminderDate, description, type) {
    this.title = title;
    this.initialDate = initialDate;
    this.creationDate = creationDate;
    this.endDate = endDateTime;
    this.reminderDate = reminderDate;
    this.description = description;
    this.type = type;
    this.expired = (endDateTime.getTime() <= new Date().getTime()) ? true : false;
}

function Calendar() {

    //returns an object with month infomation
    //firstDay of the month (monday = 0, sunday = 6)
    // lastDay of the month (monday =0, sunday = 6)
    //days in the month
    // year(mandatory): YYYY
    //month( mandatory): 1(january)-12(december)
    function daysInMonth(year, month) {
        let days = new Date(year, month, 0).getDate();
        let firstDay = new Date(year, month - 1, 1).getDay();

        let lastDay = new Date(year, month, 0).getDay();

        return {
            firstDay: (firstDay === 0) ? 6 : (firstDay - 1),
            lastDay: (lastDay === 0) ? 6 : (lastDay - 1),
            days: days
        }
    }


    function displayMonthEvents(year, month) {
        let allDays = document.querySelectorAll("#year-" + year + " > [data-month='" + month + "']" + " .week.days > li");
        allDays.forEach(day => {
            let dayNumber = parseInt(day.querySelector(".day-number").textContent);
            if (day.classList.contains("p-month")) {
                rMonth = month - 1;
                if (rMonth === 0) {
                    rYear = year - 1;
                    rMonth = 12;
                }
            } else if (day.classList.contains("n-month")) {
                rMonth = month + 1;
                if (rMonth > 12) {
                    rYear = year + 1;
                    rMonth = 1;
                }
            } else {
                rMonth = month;
                rYear = year;
            }
            events.forEach(e => {
                let eYear = e.initialDate.getFullYear();
                let eMonth = e.initialDate.getMonth() + 1;
                let eDay = e.initialDate.getDate();
                if (eYear === year && eMonth === rMonth && eDay === dayNumber) {
                    addNewEvent(day, e);
                }
            });
        });
    }
    this.displayedYear;
    this.displayedMonth;
    this.createMonth = function (year, month, hide = false, currentMonth = false) {
        //check if the month already exists
        if (document.querySelector("#year-" + year + " > [data-month='" + month + "']") !== null) {
            console.log("The selected month already extists");
            return false;
        }
        if (month < 1 || month > 12) {
            console.log("Invalid month");
            return false;
        }
        let newMonth = document.createElement("div");
        newMonth.classList.add("month");
        newMonth.dataset.month = month; // add data property to know the month 
        if (hide === true) {
            newMonth.classList.add("hide");
        } else {
            newMonth.classList.add("displayed");
            this.displayedYear = year;
            this.displayedMonth = month;
            //Update the title for the selected month and year
            updateSelectedDate(year, month);

        }
        let dayNames = document.createElement("ul");
        dayNames.classList.add("week");
        dayNames.classList.add("day-names");
        dayNames.classList.add("long-day-names");
        let dayNamesShort = document.createElement("ul");
        dayNamesShort.classList.add("week");
        dayNamesShort.classList.add("day-names");
        dayNamesShort.classList.add("short-day-names");
        DAYS.forEach((day, index) => {
            let newDay = document.createElement("li");
            let newDayShort = document.createElement("li");
            newDay.textContent = day;
            newDayShort.textContent = DAYS_SHORT[index];
            dayNames.appendChild(newDay);
            dayNamesShort.appendChild(newDayShort);
        });
        newMonth.append(dayNames, dayNamesShort);
        let monthTime = daysInMonth(year, month);
        let previousMonth = daysInMonth(year, month - 1);
        let day = 0; //created days of the current month
        let displayedDays = 0; //total number of created days (includes from other months)
        let newMonthDay = 0;
        let added = false; //variable to know if the current day has been already added
        while (day < monthTime.days) {
            let newWeek = document.createElement("ul");
            newWeek.classList.add("week");
            newWeek.classList.add("days");
            for (let i = 0; i < 7; i++) {
                let newDay = document.createElement("li");
                let disYear;
                let disMonth; // variable to set the month of the add event form
                let disDay;
                let newDayNumber = document.createElement("h2");
                newDayNumber.classList.add("day-number");
                disYear = year;
                //check if the day belongs to the current month
                if ((displayedDays >= monthTime.firstDay) && (displayedDays < (monthTime.firstDay + monthTime.days))) {
                    newDayNumber.textContent = day + 1; //we add one to the textContent cause months start from 1 not 0
                    newDay.classList.add("day-" + (day + 1));
                    newDay.classList.add("c-month");
                    day++;
                    disMonth = (month > 9) ? month : ("0" + "" + String(month));

                    //chekc if the day belongs to the previous month
                } else if (displayedDays <= previousMonth.lastDay) {
                    newDayNumber.textContent = (previousMonth.days - monthTime.firstDay) + 1 + i;
                    newDay.classList.add("day-other-month");
                    newDay.classList.add("p-month");
                    newDay.classList.add("day-" + newDayNumber.textContent);
                    if (month === 1) {
                        disYear = year - 1;
                        disMonth = "12";
                    } else {
                        disMonth = ((month - 1) > 9) ? (month - 1) : ("0" + "" + String(month - 1));
                    }
                } else {
                    newMonthDay++;
                    newDayNumber.textContent = newMonthDay;
                    newDay.classList.add("day-other-month");
                    newDay.classList.add("n-month");
                    newDay.classList.add("day-" + newMonthDay);
                    if (month == 12) {
                        disMonth = "01";
                        disYear = year + 1;
                    } else {
                        disMonth = ((month + 1) > 9) ? (month + 1) : ("0" + "" + String(month + 1));
                    }
                }

                let shortcutAdd = document.createElement("span");
                shortcutAdd.classList.add("shortcut-add");
                newDayNumber.appendChild(shortcutAdd);
                //Maybe make a function
                if (day === new Date().getDate() && currentMonth && !added) {
                    added = true;
                    let today = document.createElement("div");
                    today.classList.add("today");
                    newDay.classList.add("today-container");
                    today.appendChild(newDayNumber);
                    newDay.appendChild(today);
                } else {
                    newDay.appendChild(newDayNumber);
                }

                displayedDays++;
                newDay.addEventListener("click", (event) => {
                    if (event.target === event.currentTarget || event.target.classList.contains("shortcut-add") || event.target.classList.contains("today")) {
                        displayFormAddEvent();
                        //set date to right date
                        disDay = (newDayNumber.textContent.length > 1) ? newDayNumber.textContent : ("0" + newDayNumber.textContent);
                        console.log(disYear);
                        console.log(disMonth);
                        console.log(disDay);
                        console.log("set value");
                        initialDate.value = disYear + "-" + disMonth + "-" + disDay;
                        endDate.value = initialDate.value;

                    }
                });
                newWeek.appendChild(newDay);
            }
            newMonth.appendChild(newWeek);
        }

        //check if year exists
        if (document.getElementById("year-" + year) === null) {
            this.createYear(year);
            document.getElementById("year-" + year).appendChild(newMonth);
        } else {

            //append the new month in the right position
            let yearElement = document.getElementById("year-" + year);
            let existentMonths = yearElement.children;
            let posMonths = Array.from(existentMonths).map((el) => {
                return parseInt(el.dataset.month);
            });
            posMonths.push(month);
            posMonths.sort((a, b) => {
                return a - b;
            });
            posNewMonth = posMonths.indexOf(month);
            if (posNewMonth === 0) {
                yearElement.insertAdjacentElement("afterbegin", newMonth);

            } else {
                existentMonths[posNewMonth - 1].insertAdjacentElement("afterend", newMonth);
            }

        }
        displayMonthEvents(year, month);

        return true;
    }
    //creates a new year cotnainer and inserts it in the right position. If such year already exists returns false.
    this.createYear = function (year) {
        if (document.querySelector("#year-" + year) !== null) {
            console.log("year already extists");
            return false;
        }
        let newYear = document.createElement("div");
        newYear.classList.add("year");
        newYear.id = "year-" + year;
        let existingYears = document.querySelectorAll(".year");

        if ((existingYears.length === 0)) {
            calendar.appendChild(newYear);
        } else if ((parseInt(existingYears[0].id.slice(-4)) > year)) {
            document.querySelector("#calendar-id").insertAdjacentElement("afterbegin", newYear);
        } else {
            //find the right position where to insert the year
            let previousYear;
            for (let i = 0; i < existingYears.length; i++) {
                if (parseInt(existingYears[i].id.slice(-4)) < year) {
                    previousYear = existingYears[i];
                } else {
                    break;
                }
            }
            previousYear.insertAdjacentElement("afterend", newYear);
        }
    }
    this.updateCurrentDate = function () {
        let today = new Date();
        document.getElementById("current-day-id").textContent = today.getDate();
        document.getElementById("current-month-id").textContent = MONTHS[today.getMonth()];
        document.getElementById("current-year-id").textContent = today.getFullYear();
    }
    // adds the class hide to the selected month. If the month does not exist returns false
    this.hideMonth = function (year = this.displayedYear, month = this.displayedMonth) {
        let selectedMonth = document.querySelector("#year-" + year + " > [data-month='" + month + "']");
        if (selectedMonth !== null) {
            selectedMonth.classList.add("hide");
            selectedMonth.classList.remove("displayed");
            return true;
        }
        return false;
    }
    //displays the chosen month, if it does not exist it creates it
    // month(mandatory): 1(January)-12(December)
    // Note: if month bigger that 12 or smaller than 0, it will be considered as the next/previous year
    this.displayMonth = function (year, month) {
        if (month > 12) {
            month = month % 12;
            year = year + 1;
        } else if (month < 1) {
            month = 12;
            year = year - 1;
        }
        let selectedMonth = document.querySelector("#year-" + year + " > [data-month='" + month + "']");
        this.displayedYear = year;
        this.displayedMonth = month;
        if (selectedMonth !== null) {
            updateSelectedDate(year, month);
            selectedMonth.classList.remove("hide");
            selectedMonth.classList.add("displayed");
            return true;
        } else {
            this.createYear(year);
            this.createMonth(year, month);
            console.log("new year and month created");
            //create the new month
        }
    }

    this.displayNextMonth = function () {
        this.hideMonth();
        this.displayMonth(this.displayedYear, this.displayedMonth + 1);
    }
    this.displayPreviousMonth = function () {
        this.hideMonth();
        this.displayMonth(this.displayedYear, this.displayedMonth - 1);
    }

}