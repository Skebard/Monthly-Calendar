//todo CONSTATNS
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAYS_SHORT = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
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
let reminderSelector = document.getElementById("reminder-selector");
let eventDescription = document.getElementById("event-description");
let eventType = document.getElementById("event-type");
let errorTitle = document.getElementById("error-title");
let errorInitialDate = document.getElementById("error-initial-date");




// the events are stored in the localStorage.
let events = []; // variable to upload the events from the localStorage

let myCalendar = new Calendar();
let currentDate = new Date();

//Initialise calendar
myCalendar.updateCurrentDate();
addSelectableMonths();
addSelectableYears();
myCalendar.createMonth(currentDate.getFullYear(),currentDate.getMonth()+1,false,true);

nextMonthBtn.addEventListener("click",e=>myCalendar.displayNextMonth());
previousMonthBtn.addEventListener("click",e=>myCalendar.displayPreviousMonth());
modalContainer.addEventListener("click",(e)=>{closeModal(e)});
btnAddEvent.addEventListener("click",displayFormAddEvent);
btnSaveEvent.addEventListener("click",(e)=>{addEvent(e)});

//set width to the displayed month title according to the length of the month name
selectMonth.addEventListener("click", function () {
    let displayedMonth = selectMonth.value;
    selectMonth.style.width = displayedMonth.length + 2 + "rem";
    if(displayedMonth !== MONTHS[myCalendar.displayedMonth-1]){
        console.log("hiii");
        let newMonth = MONTHS.indexOf(displayedMonth)+1;// +1 cause the function get months from 1 to 12
        myCalendar.hideMonth();
        myCalendar.displayMonth(myCalendar.displayedYear,newMonth);
    }
});
selectYear.addEventListener("click",function(){
    let displayedYear = parseInt(selectYear.value);
    if(displayedYear!== myCalendar.displayedYear){
        myCalendar.hideMonth();
        myCalendar.displayMonth(displayedYear,myCalendar.displayedMonth);
    }
});
function displayFormAddEvent(){
    modalContainer.classList.remove("hide");
    modalAddEvent.classList.remove("hide");

}

function addEvent(event){
    event.preventDefault();
    if(validateForm()===false){
        return false;
    }

    let evInitialDate = new Date(initialDate.value.slice(0,4),parseInt(initialDate.value.slice(5,7))-1,initialDate.value.slice(8,10),initialDateHour.value.slice(0,2),initialDateHour.value.slice(3,5));
    let evEndDate = new Date(endDate.value.slice(0,4),parseInt(endDate.value.slice(5,7))-1,endDate.value.slice(8,10),endDateHour.value.slice(0,2),endDateHour.value.slice(3,5));
    let reminderMinutes = 0;
    reminderSelector.querySelectorAll("option").forEach((el)=>{
        if (reminderSelector.value = el.value){
            reminderMinutes = el.dataset.time;
        }
    });
    let evReminder =  new Date(endDate.value.slice(0,4),parseInt(endDate.value.slice(5,7))-1,endDate.value.slice(8,10),endDateHour.value.slice(0,2),parseInt(endDateHour.value.slice(3,5))-reminderMinutes);
    let newEvent = new Event(eventTitle.value,evInitialDate,new Date(),evEndDate,evReminder,eventDescription.value,eventType.value);
    events.push(newEvent);
    localStorage.setItem("events",JSON.stringify(events));
    modalContainer.classList.add("hide");
    modalAddEvent.classList.add("hide");
    //reset form
    //add event to the calendar
    //check

    let dayElement =document.querySelector("#year-"+evInitialDate.getFullYear() + "> [data-month='" + (evInitialDate.getMonth()+1)+"'] .day-"+evInitialDate.getDate());
    console.log(dayElement);
    if(dayElement === null){
        // the month is not displayed yet. So there is nothing to do
        return false;
    }else{
        let eventContainer = dayElement.querySelector(".events-container");
        if (eventContainer === null){
            console.log("creae event container");
            eventContainer = document.createElement("div");
            eventContainer.classList.add("events-container");
            let newEvent = document.createElement("div");
            newEvent.classList.add("event");
            newEvent.textContent = "my new event";
            eventContainer.appendChild(newEvent);
            
            dayElement.appendChild(eventContainer);
        }else{

        }
    }

    return true;
}

function validateForm(){
    console.log(eventTitle.value);
    if(eventTitle.value===""){
        console.log("remove");
        errorTitle.classList.remove("hide");
        return false;
    }else{
        errorTitle.classList.add("hide");
    }
    if(initialDate.value===""){
        errorInitialDate.classList.remove("hide");
        return false;
    }else{
        errorInitialDate.classList.add("hide");
    }
    return true;
    //store event
}



function closeModal(event){
    let closeModalOptions = [modalContainer,btnCloseModal,btnCancelAdd];
    if(closeModalOptions.indexOf(event.target)!==-1){
        event.preventDefault();
        modalContainer.classList.add("hide");
        Array.from(modalContainer.children).forEach((modal)=>{
            modal.classList.add("hide");
        });
    }
}
function displayModal(HTMLmodal){
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
function updateSelectedDate(year,month){
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
function Event(title,initialDate,creationDate,endDateTime,reminderDate,description,type){
    this.title = title;
    this.initialDate = initialDate;
    this.creationDate = creationDate;
    this.endDate = endDateTime;
    this.reminderDate = reminderDate;
    this.description = description;
    this.type = type;
    this.expired = (endDateTime.getTime()<=new Date().getTime())? true:false;
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

    this.displayedYear;
    this.displayedMonth;
    this.createMonth = function (year, month, hide = false, currentMonth=false) {
        //check if the month already exists
        if (document.querySelector("#year-" + year + " > .month-" + month) !== null) {
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
            this.displayedYear = year;
            this.displayedMonth = month;
            //Update the title for the selected month and year
            updateSelectedDate(year,month);

        }
        let dayNames = document.createElement("ul");
        dayNames.classList.add("week");
        dayNames.classList.add("day-names");
        dayNames.classList.add("long-day-names");
        let dayNamesShort = document.createElement("ul");
        dayNamesShort.classList.add("week");
        dayNamesShort.classList.add("day-names");
        dayNamesShort.classList.add("short-day-names");
        DAYS.forEach((day,index) => {
            let newDay = document.createElement("li");
            let newDayShort = document.createElement("li");
            newDay.textContent = day;
            newDayShort.textContent = DAYS_SHORT[index];
            dayNames.appendChild(newDay);
            dayNamesShort.appendChild(newDayShort);
        });
        newMonth.append(dayNames,dayNamesShort);
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
                let newDayNumber = document.createElement("h2");
                newDayNumber.classList.add("day-number");

                //check if the day belongs to the current month
                if ((displayedDays >= monthTime.firstDay) && (displayedDays < (monthTime.firstDay + monthTime.days))) {
                    newDayNumber.textContent = day + 1; //we add one to the textContent cause months start from 1 not 0
                    newDay.classList.add("day-" + (day + 1));
                    day++;
                    //chekc if the day belongs to the previous month
                } else if (displayedDays <= previousMonth.lastDay) {
                    newDayNumber.textContent = (previousMonth.days - monthTime.firstDay) + 1 + i;
                    newDay.classList.add("day-other-month");
                    newDay.classList.add("day-" + newDayNumber.textContent);
                } else {
                    newMonthDay++;
                    newDayNumber.textContent = newMonthDay;
                    newDay.classList.add("day-other-month");
                    newDay.classList.add("day-" + newMonthDay);
                }

                //Maybe make a function 
                if(day === new Date().getDate() && currentMonth && !added){
                    added=true;
                    let today = document.createElement("div");
                    today.classList.add("today");
                    newDay.classList.add("today-container");
                    today.appendChild(newDayNumber);
                    newDay.appendChild(today);
                }else{
                    newDay.appendChild(newDayNumber);
                }
                
                displayedDays++;
                newWeek.appendChild(newDay);
            }
            newMonth.appendChild(newWeek);
        }

        //check if year exists
        if (document.getElementById("year-" + year) === null) {
            this.createYear(year);
            document.getElementById("year-" + year).appendChild(newMonth);
            return true;
        }
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
        let selectedMonth = document.querySelector("#year-" + year + " > [data-month='" + month+"']");
        if (selectedMonth !== null) {
            selectedMonth.classList.add("hide");
            return true;
        }
        return false;
    }
      //displays the chosen month, if it does not exist it creates it
    // month(mandatory): 1(January)-12(December)
    // Note: if month bigger that 12 or smaller than 0, it will be considered as the next/previous year
    this.displayMonth = function(year,month){
        if(month>12){ 
            month = month%12;
            year = year + 1; 
        }else if( month<1){
            month = 12;
            year = year -1;
        }
        let selectedMonth = document.querySelector("#year-"+year+ " > [data-month='" + month+"']");
        this.displayedYear = year;
        this.displayedMonth = month;
        if (selectedMonth!==null){
            updateSelectedDate(year,month);
            selectedMonth.classList.remove("hide");
            return true;
        }else{
            this.createYear(year);
            this.createMonth(year,month);
            console.log("new year and month created");
            //create the new month
        }
    }

    this.displayNextMonth = function(){
        this.hideMonth();
        this.displayMonth(this.displayedYear,this.displayedMonth+1);
    }
    this.displayPreviousMonth = function(){
        this.hideMonth();
        this.displayMonth(this.displayedYear,this.displayedMonth-1);
    }
}