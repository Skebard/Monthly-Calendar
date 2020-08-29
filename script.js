//todo CONSTATNS
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const MONTHS= ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];


//todo HTML elements
let selectMonth = document.getElementById("select-month-id");
let selectYear = document.getElementById("select-year-id");
let calendar = document.getElementById("calendar-id");





let myCalendar = new Calendar();
myCalendar.updateCurrentDate();

addSelectableMonths();
addSelectableYears();

//set width to the displayed month title according to the length of the month name
selectMonth.addEventListener("click",function(){
    selectMonth.style.width = selectMonth.value.length+2+"rem";
});

function addSelectableMonths(){
    MONTHS.forEach((el,index)=>{
        let newMonth = document.createElement("option");
        newMonth.textContent = el;
        if( index === new Date().getMonth()){
            newMonth.selected = true;
            selectMonth.style.width = el.length+2+"rem";
        }
        selectMonth.appendChild(newMonth);
    });
}
function addSelectableYears(){
    let currentYear = new Date().getFullYear();
    for (i=currentYear-20; i<currentYear + 80; i++){
        let newYear = document.createElement("option");
        newYear.textContent = i;
        if( i === currentYear){
            newYear.selected = true;
        }
        selectYear.appendChild(newYear);
    }
}


function Calendar(){

        //returns an object with month infomation
    //firstDay of the month (monday = 0, sunday = 6)
    // lastDay of the month (monday =0, sunday = 6)
    //days in the month
    // year(mandatory): YYYY
    //month( mandatory): 1(january)-12(december)
    function daysInMonth(year,month){
        let days = new Date(year,month,0).getDate();
        let firstDay = new Date(year,month-1,1).getDay();
        
        let lastDay = new Date(year,month,0).getDay();
        
        return {
            firstDay: (firstDay===0)? 6:(firstDay-1),
            lastDay:(lastDay===0)? 6:(lastDay-1),
            days:days
        }
    }

    this.displayedYear;
    this.displayedMonth;
    this.createMonth = function(year,month,hide=false){
        //check if the month already exists
        if(document.querySelector("#year-"+year+" > .month-"+month)!==null){
            console.log("The selected month already extists");
            return false;
        }
        if(month < 1 || month > 12){
            console.log("Invalid month");
            return false;
        }
        let newMonth = document.createElement("div");
        newMonth.classList.add("month");
        newMonth.dataset.month = month; // add data property to know the month 
        if(hide===true){
            newMonth.classList.add("hide");
        }else{
            this.displayedYear = year;
            this.displayedMonth = month;
            //Update the title for the selected month and year
            Array.from(selectMonth.children).forEach((el,index)=>{
                el.selected = false;
                if(index===month-1){
                    el.selected = true;
                    selectMonth.style.width = el.textContent.length+2+"rem";
                }
            });
            Array.from(selectYear.children).forEach((el)=>{
                el.selected=false;
                if(el.value === String(year)){
                    el.selected = true;
                }
            });
        }
        let dayNames = document.createElement("ul");
        dayNames.classList.add("week");
        dayNames.classList.add("day-names");
        DAYS.forEach((day)=>{
            let newDay = document.createElement("li");
            newDay.textContent = day;
            dayNames.appendChild(newDay);
        });
        newMonth.appendChild(dayNames);
        let monthTime= daysInMonth(year,month);
        let previousMonth = daysInMonth(year,month-1);
        let day =0; //created days of the current month
        let displayedDays = 0; //total number of created days (includes from other months)
        let newMonthDay = 0;
        while(day<monthTime.days){
            let newWeek = document.createElement("ul");
            newWeek.classList.add("week");
            newWeek.classList.add("days");
            for(let i=0; i<7; i++){
                let newDay = document.createElement("li");
                let newDayNumber = document.createElement("h2");
                newDayNumber.classList.add("day-number");
                
                //check if the day belongs to the current month
                if((displayedDays>=monthTime.firstDay)&&(displayedDays<(monthTime.firstDay+monthTime.days))){
                    newDayNumber.textContent = day +1;     //we add one to the textContent cause months start from 1 not 0
                    newDay.classList.add("day-"+(day+1));
                    day++;
                //chekc if the day belongs to the previous month
                }else if(displayedDays <= previousMonth.lastDay){
                    newDayNumber.textContent = (previousMonth.days-monthTime.firstDay) +1+ i;
                    newDay.classList.add("day-other-month");
                    newDay.classList.add("day-"+newDayNumber.textContent);
                }else{
                    newMonthDay++;
                    newDayNumber.textContent = newMonthDay;
                    newDay.classList.add("day-other-month");
                    newDay.classList.add("day-"+newMonthDay);
                }
                newDay.appendChild(newDayNumber);
                displayedDays++;
                newWeek.appendChild(newDay);
            }
            newMonth.appendChild(newWeek);
        }

        //check if year exists
        if(document.getElementById("year-"+year)===null){
            this.createYear(year);
            document.getElementById("year-"+year).appendChild(newMonth);
            return true;
        }
        //append the new month in the right position
        let yearElement = document.getElementById("year-"+year);
        let existentMonths = yearElement.children;
        let posMonths = Array.from(existentMonths).map((el)=>{
            return parseInt(el.dataset.month);
        });
        posMonths.push(month);
        posMonths.sort((a,b)=>{
            return a-b;
        });
        posNewMonth = posMonths.indexOf(month);
        if(posNewMonth===0){
            yearElement.insertAdjacentElement("afterbegin",newMonth);
            
        }else{
            existentMonths[posNewMonth-1].insertAdjacentElement("afterend",newMonth);
        }
        return true;
    }
    //creates a new year cotnainer and inserts it in the right position. If such year already exists returns false.
    this.createYear = function(year){
        if(document.querySelector("#year-"+year)!==null){
            console.log("year already extists");
            return false;
        }
        let newYear = document.createElement("div");
        newYear.classList.add("year");
        newYear.id = "year-"+year;
        let existingYears = document.querySelectorAll(".year");

        if((existingYears.length===0)){
            calendar.appendChild(newYear);
        }else if((parseInt(existingYears[0].id.slice(-4))>year)){
            document.querySelector("#calendar-id > .calendar-nav").insertAdjacentElement("afterend",newYear);
        }
        else{
            //find the right position where to insert the year
            let previousYear;
            for(let i = 0; i< existingYears.length; i++){
                if(parseInt(existingYears[i].id.slice(-4)) < year){
                    previousYear = existingYears[i];
                }else{
                    break;
                }
            }
            previousYear.insertAdjacentElement("afterend",newYear);
        }
    }
    this.updateCurrentDate = function(){
        let today = new Date();
       document.getElementById("current-day-id").textContent = today.getDate();
       document.getElementById("current-month-id").textContent = MONTHS[today.getMonth()];
       document.getElementById("current-year-id").textContent = today.getFullYear();
    }
}