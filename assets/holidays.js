function showHolidays(){
	var year = document.getElementById('txtyear').value;
	var holidays = getAllHolidays(year);
	console.log(year);
	console.log(holidays);
    const elmt = document.querySelector('#holidaysList');
    elmt.textContent = '';
    elmt.appendChild(createLiItem({name:"Année",value:year, text:year}));
    holidays.forEach(item =>
        elmt.appendChild(createLiItem(item))
    );
}

function createLiItem(item) {
    let li = document.createElement('li');
    li.innerHTML = "<strong>" + item.name + " : </strong> <span class='textStyle'>" + item.text + "</span>";
    return li;
}

function getAllHolidays(year) {
    var holidays = [{name:"Jour de l'an",value : "0101", text:1+"er".sup()+" Janvier"}, {name:"Fête du travail", value:"0105", text:1+"er"+" Mai"}, {name:"Jour de l'indépendance", value:"0708", text:"7 Août"}, {name:"Assomption",value:"1508", text:"15 Août"}, {name:"Toussaint", value:"0111", text:1+"er".sup()+" Novembre"}, {name:"Journée de la paix", value:"1511", text: "15 Novembre"}, {name:"Noël", value:"2512", text:"25 Décembre"}];
    var paqueAscencionPentecoteDays = getPaqueAscencionPentecoteDays(year);
    paqueAscencionPentecoteDays.forEach(item =>
        holidays.push(item));
    return holidays;
}

function getPaqueAscencionPentecoteDays(year) {
    n = year - 1900;
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
    var paqueDay = {name:"Pâques",value:dayMonthToString(baseDate.getDate()) + dayMonthToString((baseDate.getMonth() + 1)), text:baseDate.getDate() + " " + baseDate.toLocaleString('fr-FR', { month: 'long' })};
    var ascencionDay = {name:"Ascension", value:dayMonthToString(ascencionDate.getDate()) + dayMonthToString((ascencionDate.getMonth() + 1)), text:ascencionDate.getDate() + " " + ascencionDate.toLocaleString('fr-FR', { month: 'long' })};
    var pentecoteDay = {name:"Pentecôte",value:dayMonthToString(pentecoteDate.getDate()) + dayMonthToString((pentecoteDate.getMonth() + 1)), text:pentecoteDate.getDate() + " " + pentecoteDate.toLocaleString('fr-FR', { month: 'long' })};

    return [paqueDay, ascencionDay, pentecoteDay];
}

function dayMonthToString(value) {
    if (value.toString().length == 1)
        value = "0" + value.toString();
    return value;
}
