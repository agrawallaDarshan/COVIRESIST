// console.log("hello");
const table = document.getElementById("covid19Table");
const stateTable = document.getElementById("stateCovid19Table");
const vaccineSlotTable = document.getElementById("vaccineSlotTable");
//https://api.covid19india.org/data.json
//https://api.covid19india.org/state_district_wise.json
//https://api.covid19india.org/v2/state_district_wise.json
//https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=110001&date=31-03-2021
//7849f33f647e49219b3d15c835cac5a0
//https://newsapi.org/v2/top-headlines?country=in&category=health&apiKey=7849f33f647e49219b3d15c835cac5a0
const tableBody = table.getElementsByTagName("tbody");
let flag = true;
let limit = 0;
let defaultRowIndex = 0;
let myRowIndex = 0;

fetch("https://api.covid19api.com/summary").then((apiData) => {
    return apiData.json();
}).then((covidData) => {
    document.getElementById("wConfirmed").innerHTML = covidData.Global.TotalConfirmed;
    document.getElementById("wActive").innerHTML = covidData.Global.TotalConfirmed - covidData.Global.TotalRecovered - covidData.Global.TotalDeaths;
    let array = covidData.Countries;
    document.getElementById("wRecovered").innerHTML = covidData.Global.TotalRecovered;
    document.getElementById("wDeceased").innerHTML = covidData.Global.TotalDeaths;
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        var row = table.insertRow();
        var cell1 = row.insertCell(0);
        cell1.innerHTML = `${element.Country}`;
        var cell2 = row.insertCell(1);
        cell2.innerHTML = `${element.TotalConfirmed}`;
        var cell3 = row.insertCell(2);
        cell3.innerHTML = `${element.NewConfirmed}`;
        var cell4 = row.insertCell(3);
        var arrow = "";
        var active = element.TotalConfirmed - element.TotalRecovered - element.TotalDeaths;
        var todayActive = element.NewConfirmed - element.NewRecovered - element.NewDeaths;
        if (todayActive < 0) {
            arrow = "↓";
        } else {
            arrow = "↑";
        }
        cell4.innerHTML = `${arrow}${active}`;
        var cell5 = row.insertCell(4);
        cell5.innerHTML = `${element.TotalRecovered}`;
        var cell6 = row.insertCell(5);
        cell6.innerHTML = `${element.NewRecovered}`;
        var cell7 = row.insertCell(6);
        cell7.innerHTML = `${element.TotalDeaths}`;
    }
}).catch((error) => {
    console.log(error);
});

fetch("https://api.covid19india.org/data.json").then((stateData) => {
    // console.log(stateData);
    return stateData.json();
}).then((stateCovidData) => {
    let object = stateCovidData.cases_time_series[stateCovidData.cases_time_series.length - 1];
    // console.log(object);
    document.getElementById("idConfirmed").innerHTML = `+${object.dailyconfirmed}`;
    document.getElementById("iConfirmed").innerHTML = object.totalconfirmed;
    document.getElementById("iActive").innerHTML = object.totalconfirmed - object.totalrecovered - object.totaldeceased;
    document.getElementById("idRecovered").innerHTML = `+${object.dailyrecovered}`;
    document.getElementById("iRecovered").innerHTML = object.totalrecovered;
    document.getElementById("idDeceased").innerHTML = `+${object.dailydeceased}`;
    document.getElementById("iDeceased").innerHTML = object.totaldeceased;
    let objectFight = stateCovidData.tested[stateCovidData.tested.length - 1];
    document.getElementById("totalDoses").innerHTML = objectFight.totaldosesadministered;
    document.getElementById("totalTests").innerHTML = objectFight.totalsamplestested;
    let array = stateCovidData.statewise;
    for (let index = 1; index < array.length; index++) {
        const element = array[index];
        var row = stateTable.insertRow();
        var cell1 = row.insertCell(0);
        cell1.innerHTML = `<button class="btnStyle" id="${element.state}" onclick="dropdownContent(this.id, this.parentElement.parentElement)">${element.state}</button>`;
        var cell2 = row.insertCell(1);
        cell2.innerHTML = element.confirmed;
        var cell3 = row.insertCell(2);
        cell3.innerHTML = element.active;
        var cell4 = row.insertCell(3);
        cell4.innerHTML = element.recovered;
        var cell5 = row.insertCell(4);
        cell5.innerHTML = element.deaths;
    }
}).catch((error) => {
    console.log(error);
});

function dropdownContent(stateName, parentName) {
    console.log(flag);
    let districtDataArray = [];
    myRowIndex = parentName.rowIndex + 1;
    defaultRowIndex = parentName.rowIndex + 1;
    if (flag === true) {
        fetch("https://api.covid19india.org/v2/state_district_wise.json").then((districtData) => {
            return districtData.json();
        }).then((districtCovidData) => {
            let array = districtCovidData;
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                if (element.state === stateName) {
                    districtDataArray = element.districtData;
                    for (let index = 0; index < districtDataArray.length; index++) {
                        const element = districtDataArray[index];
                        var row = stateTable.insertRow(myRowIndex);
                        var cell1 = row.insertCell(0);
                        cell1.innerHTML = element.district;
                        var cell2 = row.insertCell(1);
                        cell2.innerHTML = element.confirmed;
                        var cell3 = row.insertCell(2);
                        cell3.innerHTML = element.active;
                        var cell4 = row.insertCell(3);
                        cell4.innerHTML = element.recovered;
                        var cell5 = row.insertCell(4);
                        cell5.innerHTML = element.deceased;
                        myRowIndex = myRowIndex + 1;
                    }
                    limit = districtDataArray.length;
                    break;
                }
            }
        }).catch((error) => {
            console.log(error);
        });
        flag = false;
    } else if (flag === false) {
        for (let index = defaultRowIndex; index < defaultRowIndex + limit; index++) {
            stateTable.deleteRow(defaultRowIndex);
        }
        flag = true;
    }
}

const vaccineSLots = document.getElementById("vaccineSlot");
const inputBox = document.getElementById("inputBox");

function checkSlotsByPin() {
    vaccineSlotTable.style.visibility = "visible";
    if (vaccineSlotTable.rows.length > 2) {
        cleanVaccineTable(vaccineSlotTable.rows.length);
    }
    let val = document.getElementById("pinValue").value.toString();
    fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${val}&date=07-07-2021`).then((vaccineData) => {
        return vaccineData.json();
    }).then((vaccineSlotsAvailability) => {
        let array1 = vaccineSlotsAvailability.sessions;
        for (let index = 0; index < array1.length; index++) {
            const element = array1[index];
            var row = vaccineSlotTable.insertRow();
            var cell1 = row.insertCell(0);
            cell1.innerHTML = element.name;
            var cell2 = row.insertCell(1);
            cell2.innerHTML = element.address;
            var cell3 = row.insertCell(2);
            cell3.innerHTML = element.fee_type;
            var cell4 = row.insertCell(3);
            cell4.innerHTML = element.vaccine;
            var cell5 = row.insertCell(4);
            cell5.innerHTML = element.available_capacity_dose1;
            var cell6 = row.insertCell(5);
            cell6.innerHTML = element.available_capacity_dose2;
            var cell7 = row.insertCell(6);
            cell7.innerHTML = element.min_age_limit;
            var cell8 = row.insertCell(7);
            cell8.innerHTML = `<a href="https://selfregistration.cowin.gov.in/" target="_blank">Cowin</a>`;
        }
    }).catch((error) => {
        console.log(error);
    });
}

function cleanVaccineTable(length) {
    for (let index = 2; index < length; index++) {
        console.log(index);
        vaccineSlotTable.deleteRow(2);
    }
}

const url = `https://newsapi.org/v2/top-headlines?country=in&category=health&apiKey=7849f33f647e49219b3d15c835cac5a0`;
fetch(url).then((data) => {
    return data.json();
}).then((newsdata) => {
    let array = newsdata.articles;
    setInterval(() => {
        document.getElementById("newsBox").innerHTML = `${array[Math.floor(Math.random() * array.length)].title}`;
    }, 10000);
}).catch((error) => {
    console.log(error);
});





