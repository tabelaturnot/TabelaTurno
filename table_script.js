
    /* ********************************************************************** */
    /* ************************** CONSTANTS ********************************* */
    /* ********************************************************************** */
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const WEEK_DAY_TXT = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
    const MONTH_TXT = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
    const START_PAST_DAYS = 30;
    const SCROLL_TODAY_ANCHOR = 4; 
 
    const HOLIDAYS_SET = new Set(
                        ["01/01", "21/04", "01/05", "07/09", "12/10", "02/11/", "15/11", "25/12",
                        "21/02/2023", "07/04/2023", "08/06/2023", /* Carnaval, Sexta-santa, Corpus-cristi, */
                        "13/02/2024", "29/03/2024", "30/05/2024",
                        "04/03/2025", "18/04/2025", "19/06/2025"]);
    
    const firstDay = new Date("2023-01-22 12:00"); /* Relative to the shift table */
    const tabela23hRefap =
`G1 G2 G3 G4 G5
19 7 F F F
19 7 F F F
F 19 7 F F
F 19 7 F F
F F 7 19 F
F F F 19 7
F F F 19 7
7 F F F 19
7 F F F 19
19 7 F F F
19 7 F F F
F 7 19 F F
F F 19 7 F
F F 19 7 F
F F F 19 7
F F F 19 7
7 F F F 19
7 F F F 19
7 19 F F F
F 19 7 F F
F 19 7 F F
F F 19 7 F
F F 19 7 F
F F F 19 7
F F F 19 7
19 F F F 7
19 7 F F F
19 7 F F F
F 19 7 F F
F 19 7 F F
F F 19 7 F
F F 19 7 F
F F F 7 19
7 F F F 19
7 F F F 19`;

/** GLOBAL VARS */
let arrObjTimeFirst = new Array();

    /* ********************************************************************** */
    /* *********************  HELPERS FUNCTIONS  **************************** */
    /* ********************************************************************** */
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);

    function dateDiffInDays(date1, date2) {
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / _MS_PER_DAY);
        return diffDays;
    }

    Date.prototype.greaterThanOrEqual = function(day, month, year) {
        return (this.getDate() >= day && this.getMonth() >= (month-1) && this.getFullYear() >= year);
    };

    Date.prototype.isEqual = function(day, month, year) {
        return (this.getDate() === day && this.getMonth() === (month-1) && this.getFullYear() === year);
    };

    Date.prototype.withoutTime = function () {
        let dt = new Date(this);
        dt.setHours(0, 0, 0, 0);
        return dt;
    }

    function objOnEvent(obj, event, func) {
        if (typeof obj === "string") {
            obj = $(obj);
        }
        obj.addEventListener(event, func);
        if (event == "click") {
            obj.addEventListener(event, (e) => {
                gtag('event', "click", {"objeto": obj.id });
                console.log("CLICK: ", obj.id);
            });
            
        }
        
    }

    function isDayOffCell(cell) {
        return cell.toString() == "F";
    }

    
    function isHoliday(date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      const dateString = `${day}/${month + 1}/${year}`;
      const dateStringWithoutYear = `${day}/${month + 1}`;
    
      return HOLIDAYS_SET.has(dateString) || HOLIDAYS_SET.has(dateStringWithoutYear);
    }

    /* Function remove classes that starts with input string */
    function removeBodyClassStartsWith(input) {
        let classes = document.body.classList;
        for (let i = 0; i < classes.length; i++) {
            if (classes[i].startsWith(input)) {
                document.body.classList.remove(classes[i]);
            }
        }
    }

    /* Function that change body css class */
    function changeBodyClass(className) {
        document.body.className = className;
    }

    /* ********************************************************************** */
    /* ******************** DATE INIT *************************************** */
    /* ********************************************************************** */

    const arrTmpDaysSplit = tabela23hRefap.trim().split("\n");
    const arrSeqDays = arrTmpDaysSplit.map(k => k.trim().split(" "));
    const groups = arrSeqDays[0];
    const daysLines = arrSeqDays.slice(1); // remove index 0 -> remove groups
    
    let data = new Date();
    //Change it so that it is 7 days in the past.
    const pastDate = data.getDate() - START_PAST_DAYS;
    data.setDate(pastDate);
    let counter = 0;

    /* ********************************************************************** */
    /* ******************** TABLE GEAR FUNCTIONS **************************** */
    /* ********************************************************************** */

    function retDayOffset(diffDays) {
        let indexTab = diffDays % daysLines.length;
        return daysLines[indexTab];
    }

    function ret30SlicesOfDates(dateIn) {
        //let copiedDate2 = new Date(dateIn.getTime());
        let ret = [];
        let diffDays = dateDiffInDays(firstDay, dateIn.withoutTime().getTime());
        for (i = 0; i < 30; i += 1) {
            //copiedDate2.setDate(copiedDate2.getDate() + 1);
            ret.push(retDayOffset(diffDays));
            diffDays++;
        }
        return ret;
    }
    
    /* TODO: Make it functional  */
    function add30DayOnDOM() {
        let ob = $("#tabol");
        ret30SlicesOfDates(data).forEach((k,i) => {
            data.setDate(data.getDate() + 1);

            /* insert li element for month divider */
            if (data.getDate() == 1) {
                let li = document.createElement("li");
                li.classList.add("monthDivider");
                ob.appendChild(li);
                li = $("#tabol > li.header").cloneNode(true);
                li.classList.remove("header");
                li.classList.add("monthGroupDivider");
                li.querySelector("time").innerHTML = data.getFullYear();
                ob.appendChild(li);
            }

            let newli = document.createElement("div"); 
            newli.classList.add("centerdiv");
            let dateObj = document.createElement("time");
            dateObj.dateTime = data.getFullYear() + "-" + (data.getMonth()) + "-" + data.getDate();
            dateObj.innerHTML = data.getDate() + "/<span class='mes'>" + MONTH_TXT[data.getMonth()] + "</span>";
            dateObj.classList.add("date");
            /* Each weak day has a unique class: wD_0, wd_2... to wD_6 */
            dateObj.classList.add("wD_" + data.getDay());
        
            /* If year first day */
            if (data.getMonth() == 0 && data.getDate() == 1) {
                arrObjTimeFirst.push(dateObj);
            }

            counter++;
            
            /* Inserting TODAY date ? */
            if (counter == START_PAST_DAYS) { 
                dateObj.setAttribute('id', 'todayDate');
            }

            /* Virutal anchor trick for nice scroll */
            if (counter == (START_PAST_DAYS - SCROLL_TODAY_ANCHOR)) { 
                dateObj.setAttribute('id', 'scroolCenter');
            }
            if (isHoliday(data)) {
                dateObj.classList.add("holiday");
            }

            let weekDay = document.createElement("time");
            weekDay.dateTime = data.getFullYear() + "-" + (data.getMonth()) + "-" + data.getDate();
            weekDay.innerHTML = WEEK_DAY_TXT[data.getDay()];
            weekDay.classList.add("wD");
            weekDay.classList.add("wD_" + data.getDay());
            if (isHoliday(data)) {    
                weekDay.classList.add("holiday");
            }

            newli.appendChild(dateObj);
            newli.appendChild(weekDay);

            k.forEach((dk, ii) => {
                let tabElm = document.createElement("span");
                tabElm.classList.add("tabElm");
                tabElm.classList.add("dt_" + ii);
                tabElm.innerHTML = dk.toString();
                if (isDayOffCell(dk)) {
                    tabElm.classList.add("F");
                }
                newli.appendChild(tabElm);
            });
            let realli = document.createElement("li"); 
            realli.appendChild(newli);
            ob.appendChild(realli);
        });
    }

    
    /* ********************************************************************** */
    /* ************************ EVENT HANDLERS ****************************** */
    /* ********************************************************************** */

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", onDOMLoaded);
    } else { 
        onDOMLoaded();
    }

function onDOMLoaded() {

    function load_content(page) {
        $("#mainContainer header h1").innerHTML = page.slice(1);
        if (page == "/Refap") {
            add30DayOnDOM();
            /*add30DayOnDOM();*/
        }
    }

    objOnEvent("#mainContainer header h1", 'click', (elm) => {
        if (elm.target.innerHTML == "Refap") {
        elm.target.innerHTML = "tabelaturno.github.io/TabelaTurno/Refap";
        elm.target.style.fontSize = "0.9em";
        } else {
            elm.target.innerHTML = "Refap";
            elm.target.style.fontSize = "1.3em";
        }
    });

    objOnEvent(document, 'DOMContentLoaded', (e) => {
        const url = new URL(window.location);
        let params = new URLSearchParams(url.search);
        let page = params.get("p");
        if (page !== null) {
            window.history.pushState(page, '',  page);
            load_content(page);
        } else {
            // Load default
            load_content("/Refap");
        }
    });

    window.addEventListener("popstate", event => {
                console.log("EVENT STATE", event.state, "EVENT ", event);
                // Load content for this tab/page
                load_content(event.state);
            });


    objOnEvent(document, 'scroll', () => {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;
    
        const scrolledAlmostBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight - 300;
    
        if (scrolledAlmostBottom) {
            add30DayOnDOM(); 
        }

        arrObjTimeFirst.forEach((k,i) => {
            //TODO.
        });

        // Automatizar independente da data
        let ano2025 = $("#tabol time[datetime='2025-0-1']");
        
        if (ano2025 != null) {
            if ((scrollTop + 100) >= ano2025.offsetTop) {
                $("#tabol > li.header > time.tabElm.date").innerHTML = "2025";
                
                let ano2026 = $("#tabol time[datetime='2026-0-1']");
                if (ano2026 != null) {
                    if ((scrollTop + 100) >= ano2026.offsetTop) {
                        $("#tabol > li.header > time.tabElm.date").innerHTML = "2026";
                    } 
                }

            } else {
                if ($("#tabol > li.header > time.tabElm.date").innerHTML != "2024") {
                    $("#tabol > li.header > time.tabElm.date").innerHTML = "2024";
                }
            }
        }
    });

    
    const backmenu = $('#backMenu');
    const menu_icon = $('#menu-icon');

    objOnEvent(menu_icon, 'click', () => {
        
        backmenu.classList.toggle('visible');
        let menu = $('nav.menu');
        menu.classList.toggle('visible');
        document.body.classList.toggle("stop-scrolling");
        
    });
    
    objOnEvent(backmenu, 'click', () => {
        menu_icon.click();
    });

    objOnEvent('#app-icon', 'click', () => {
        scroolToToday();
    });

    objOnEvent('#linkMenuHoje', 'click', () => { 
        scroolToToday();
        menu_icon.click();  // Close menu

    });

    objOnEvent('#linkMais30Dias', 'click', () => { 
        add30DayOnDOM();
        window.scrollBy(0, window.innerHeight + 120); 
        menu_icon.click();  // Close menu
    });

    objOnEvent('#linkAnoQueVem', 'click', () => { 
        add30DayOnDOM();
        add30DayOnDOM();
        add30DayOnDOM();
        add30DayOnDOM();
        add30DayOnDOM();
        window.scrollBy(0, document.querySelectorAll('[datetime="2024-0-1"]')[0].offsetTop);
        menu_icon.click();  // Close menu
    });


    objOnEvent('#chkTemaEscuro', 'click', () => {
        themeRadioCheck();
    });

    objOnEvent('#chkTemaClaro', 'click', () => {
        themeRadioCheck();
    });

    objOnEvent('#chkAccessibleColorMode', 'click', () => {
        document.body.classList.toggle("accessibleColorMode");
        localStorage.setItem("accessibleColorMode", $('#chkAccessibleColorMode').checked);
    });
    
    objOnEvent('#chkLinhaDivisoriaDia', 'click', () => {
        document.body.classList.toggle("chkLinhaDivisoriaDia");
        localStorage.setItem("chkLinhaDivisoriaDia", $('#chkLinhaDivisoriaDia').checked);
    });

    objOnEvent('#chkLinhaDivisoria', 'click', () => {
        document.body.classList.toggle("chkLinhaDivisoria");
        localStorage.setItem("chkLinhaDivisoria", $('#chkLinhaDivisoria').checked);
    });

    objOnEvent('#chkGrupoDivisoria', 'click', () => {
        document.body.classList.toggle("chkGrupoDivisoria");
        localStorage.setItem("chkGrupoDivisoria", $('#chkGrupoDivisoria').checked);
    });
    
    function themeRadioCheck() {
        let tema = $('#chkTemaEscuro').checked;
        if (tema) {
            setGlobalTheme("dark");
        } else {
            setGlobalTheme("light");
        }
    }

    function setGlobalTheme(theme) {
        if (theme == "dark") {
            document.body.classList.add("dark");
            document.querySelector('meta[name="theme-color"]').setAttribute('content',  '#000000');
            localStorage.setItem("themeColor", "dark");
            $('#chkTemaEscuro').checked = true;
            $('#chkTemaClaro').checked = false;
        } else {
            document.body.classList.remove("dark");
            document.querySelector('meta[name="theme-color"]').setAttribute('content',  '#ffffff');
            localStorage.setItem("themeColor", "");
            $('#chkTemaEscuro').checked = false;
            $('#chkTemaClaro').checked = true;
        }
    }
    const style = (function() {
        // Create the <style> tag
        var style = document.createElement("style");
        // WebKit hack
        style.appendChild(document.createTextNode(""));
        document.head.appendChild(style); // Add the <style> element to the page
        return style;
    })();
    
    Array.from($$(".gR")).forEach(function(element) {
        // TODO: coloca funcao padrao objEvent.
        element.addEventListener('click', (elm) => {
        
            let gR_class = elm.target.classList[2];
            let boolSameClass = false;

            if (document.styleSheets[1].cssRules.length > 0) {
                boolSameClass = document.styleSheets[1].cssRules[0].selectorText == "." + gR_class;
                document.styleSheets[1].deleteRule(0);
                localStorage.setItem("selectedGR", "");
            }

            if (!boolSameClass) {
                document.styleSheets[1].insertRule("." + gR_class + " {  background-color: var(--bg-gr-selec); font-weight: bold; }", 0);
                localStorage.setItem("selectedGR", gR_class);
            }
        });
    });

    const radioFontSize = $$(".caixa input[type=radio]");
    Array.from(radioFontSize).forEach(function(radio) {
        
        if (radio.value == localStorage.getItem("fontSize")) {
            radio.checked = true;
        }
      
        objOnEvent(radio, 'click', (elm) => {
            removeBodyClassStartsWith("fontSize_"); /*fontSize_1 */
            document.body.classList.add("fontSize_" + elm.target.value);
            localStorage.setItem("fontSize", elm.target.value);
        });
        
    });


    function scroolToToday() {
        $("#scroolCenter").scrollIntoView();
    }

    

    /* ********************************************************************** */
    /* **************** USER SETINGS AT LOCALSTORAGE ************************ */
    /* ********************************************************************** */

    if(!localStorage.getItem('fontSize')) {
        populateStorage();
    } else {
        setStyles();
    }

    function populateStorage() {
        localStorage.setItem('themeColor', ''); /* other is "dark_mode" */
        localStorage.setItem('accessibleColorMode', false);
        localStorage.setItem('fontSize', '2'); /* 1 or 2 or 3 */
        localStorage.setItem('groupSelected', '');
        localStorage.setItem("selectedGR", "");
        localStorage.setItem("chkLinhaDivisoriaDia", true);
        localStorage.setItem("chkLinhaDivisoria", false);
        localStorage.setItem("chkGrupoDivisoria", true); /* default is true */
        localStorage.setItem("visitsCount", 0);
        setStyles();
    }

    function setStyles() {

        let themeColor = localStorage.getItem('themeColor');
        let accessibleColorMode =  localStorage.getItem('accessibleColorMode');
        let fontSize = localStorage.getItem('fontSize');
        let groupSelected = localStorage.getItem('selectedGR');
        let chkLinhaDivisoriaDia = localStorage.getItem('chkLinhaDivisoriaDia');
        let chkLinhaDivisoria = localStorage.getItem('chkLinhaDivisoria');
        let chkGrupoDivisoria = localStorage.getItem("chkGrupoDivisoria");
        localStorage["visitsCount"] = parseInt(localStorage["visitsCount"]) + 1;

        setGlobalTheme(themeColor);

        if (accessibleColorMode == 'true') {
            document.body.classList.add('accessibleColorMode');
            $('#chkAccessibleColorMode').checked = true;
        }

        if (!document.body.classList.contains('fontSize_2')) {
            removeBodyClassStartsWith("fontSize_");
            document.body.classList.add("fontSize_" + fontSize);
        }

        if (groupSelected != '') {
            document.styleSheets[1].insertRule("." + groupSelected + " {  background-color: var(--bg-gr-selec);  }", 0);
        }

        if (chkLinhaDivisoriaDia == 'true') {
            document.body.classList.add('chkLinhaDivisoriaDia');
            $('#chkLinhaDivisoriaDia').checked = true;
        }

        if (chkLinhaDivisoria == 'true') {
            document.body.classList.add('chkLinhaDivisoria');
            $('#chkLinhaDivisoria').checked = true;
        }

        if (chkGrupoDivisoria == 'true') {
            document.body.classList.add('chkGrupoDivisoria');
            $('#chkGrupoDivisoria').checked = true;
        }

   
        objOnEvent(document, 'readystatechange', (e) => {
            if (document.readyState == "complete") {
                let timer = setTimeout(function () { // Wait 50ms and set scrool to TODAY
                    scroolToToday();
                }, 40);
            }
        }); 

    }
       
    }

    try { 
        if (typeof window.ethereum.autoRefreshOnNetworkChange !== "undefined") {
            window.ethereum.autoRefreshOnNetworkChange = false;
        }
    } catch (error) {
        //Nothing;
    }

    /* ********************************************************************** */
    /* *************************  ANALITCS  ********************************* */
    /* ********************************************************************** */

    // function that list all propriets of localStorage
    function LocalStorageValues() {
        var output = {};
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            var value = localStorage.getItem(key);
            output = {...output, [key]: value};
        }
        return output;
    }

    window.dataLayer = window.dataLayer || [] ;
    function gtag(){dataLayer.push(arguments);}
    gtag( 'js', new Date () ) ;

    gtag(   'config',    'GTM-5Z7CPHL', {
            'user_properties': localStorage,
    });

    // Feature detects Navigation Timing API support.
    if (window.performance) {
        // Gets the number of milliseconds since page load
        // (and rounds the result since the value must be an integer).
        
        objOnEvent(document, 'readystatechange', (e) => {
            if (document.readyState == "complete") {
                var timeSincePageLoad = Math.round(performance.now()); 
                // Sends the timing event to Google Analytics.
                gtag('event', 'timing_complete', {
                    'name': 'load',
                    'value': timeSincePageLoad,
                    'event_category': 'JS Dependencies'
                });
            }
        }); 
        
        
    }
    

