function Sofatime(is24, timezone, container = document) {
    dayjs.extend(window.dayjs_plugin_utc)
    dayjs.extend(window.dayjs_plugin_timezone)
    this.container = container
    this.sofatimeComponents = []
    this.state = {}

    //Load all elements with the sofatime wrapper class and create components from them
    this.container.querySelectorAll('.sofatime').forEach(function(el) {
        this.sofatimeComponents.push(new SofatimeComponent(el, this))
    }.bind(this))

    //Set the initial state
    this.setState({
        is24: is24,
        timezone: timezone
    })
}


/**
 * Copies all properties from the new state to Sofatimes state and re-renders all children if there is a change
 * @param {object} state new state value
 */
Sofatime.prototype.setState = function(state) {
    var stateChange = false
    for (var key in state) {
        if (state.hasOwnProperty(key) && state[key] !== this.state[key]) {
            this.state[key] = state[key]
            stateChange = true;
        }
    }
    if (stateChange) {
        this.sofatimeComponents.forEach(function(s) {
            s.render()
        })
    }
}

/**
 * Get a ical formatted string from an entry
 *

BEGIN:VEVENT
UID:19970901T130000Z-123401@example.com
DTSTAMP:19970901T130000Z
DTSTART:19970903T163000Z
DTEND:19970903T190000Z
SUMMARY:Annual Employee Review
CLASS:PRIVATE
CATEGORIES:BUSINESS,HUMAN RESOURCES
END:VEVENT


 * DTSTART should look something like this
 * DTSTART;TZID=America/New_York:19970714T133000
 */
Sofatime.staticGetICalFormat = function(day, timezone) {
    var ical = 'BEGIN:VCALENDAR\n' +
        'VERSION:2.0\n' +
        'PRODID:-//hacksw/handcal//NONSGML v1.0//EN\n' +
        'BEGIN:VEVENT\n'


    ical += 'UID:AF23B2@example.com\n'
    ical += 'DTSTAMP;TZID=' + timezone + day.format(':YYYYMMDDTHHmmss') + '\n'
    ical += 'DTSTART;TZID=' + timezone + day.format(':YYYYMMDDTHHmmss') + '\n'
    ical += 'END:VEVENT'
    ical = 'data:text/calendar,' + ical
    return ical
}

/**
 * Individual event component, part of a Sofatime group
 * @param {HTMLElement} el the root element for this event
 * @param {Sofatime} parent the parent Sofatime component that this belongs to
 */

function SofatimeComponent(el, parent) {
    this.day = null
    this.element = el
    this.parent = parent
    this.parseInputValues()
    this.addEventListeners()
}

/**
 * Only runs once at initial creation
 */
SofatimeComponent.prototype.parseInputValues = function() {
    var sample = '[sofatime]2020-01-01T1' + (Math.floor(Math.random() * 8) + 1) + ':00 America/New_York[/sofatime]'
    var match = sample.match(/\[sofatime\]([0-9:\-TWZ]+)\s+([^[]+)\[\/sofatime\]/)
    if (match) {
        var datetime = match[1]
        var timezone = match[2]
        this.day = dayjs(datetime, timezone)
    }
    this.renderOptionsList()
}


SofatimeComponent.prototype.renderOptionsList = function() {
    //Set the time in all of the dropdowns. This really only needs to be done initially, not on every render unless the componenet event time is being changed.
    var dropdownOptions = this.element.querySelectorAll('.sofatimezone-select option')
    var format = (this.parent.state.is24) ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD hh:mma";
    for (var i = 0; i < dropdownOptions.length; i++) {
        var dd = dropdownOptions[i]
        var timezone = dd.value.match(/\S+/)
        try {
            dd.innerHTML = timezone[0] + ' ' + this.day.tz(timezone).format(format)
        } catch (e) {
            console.log(e)
        }
    }
}




/**
 * Adds change listeners for UI components. Note that these will fire when they are changed by the user or by the script that 
 * synchronizes 24 time checkbox across different SofatimeComponents
 */
SofatimeComponent.prototype.addEventListeners = function() {
    //Listener for toggling 24 hour time
    this.element.querySelector('.sofatime-24h-checkbox').addEventListener('change', function(e) {
        this.parent.setState({
            is24: e.srcElement.checked
        })
    }.bind(this))

    //Listener for timezone selection dropdown
    this.element.querySelector('.sofatimezone-select').addEventListener('change', function(e) {
        this.parent.setState({
            timezone: e.srcElement.value
        })
    }.bind(this))
}


SofatimeComponent.prototype.render = function() {
    //@TEMP Just a quick test of the .ics download
    document.getElementById('ical_test').href = Sofatime.staticGetICalFormat(this.day, this.parent.state.timezone)
    //Set the 24h state checkbox
    this.element.querySelector('.sofatime-24h-checkbox').checked = this.parent.state.is24

    //This should probably just be a prop of the parent
    var format = (this.parent.state.is24) ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD hh:mma";
    try {
        //Set the display time
        this.element.querySelector('span').innerHTML = this.day.tz(this.parent.state.timezone).format(format)
        //This only needs to be re-rendered when is24 changes, should check to avoid re-rendering when only timezone changes.
        this.renderOptionsList()
        //Set the currently selected timezone option
        this.element.querySelector('.sofatimezone-select').value = this.parent.state.timezone
    } catch (e) {
        console.log(e)
    }
}

// Initialize after page is loaded. Note, arrow notation () => is an ES6+ feature.
document.body.onload = () => {
    console.log("Loaded!")
    try {
        window.sofa = new Sofatime(true, 'America/Phoenix')
    } catch (e) {
        console.log(e)
    }
}
