console.log("loaded sofatime.js")


function Sofatime(container) {
    dayjs.extend(window.dayjs_plugin_utc)
    dayjs.extend(window.dayjs_plugin_timezone)
    this.container = container ? container : document;
    this.sofatimeComponents = []
    this.state = {}

    //Load all elements with the sofatime wrapper class and create components from them
    this.container.querySelectorAll('.sofatime').forEach(function(el) {
        this.sofatimeComponents.push(new SofatimeComponent(el, this))
    }.bind(this))

    //Set the initial state
    this.setState({
        is24: false,
        timezone: 'EST'
    })
}
/**
 * Copies all properties from the new state to Sofatimes state and re-renders all children if there is a change
 * @param {object} state new state value
 */
Sofatime.prototype.setState = function(state) {
    var stateChange = false
    var keys = Object.keys(state)
    for (var i = 0; i < keys.length; i++) {
        if (this.state[keys[i]] !== state[keys[i]]) {
            stateChange = true;
            this.state[keys[i]] = state[keys[i]]
        }
    }
    if (stateChange) {
        console.log(this.state)
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

    document.getElementById('ical_test').href = Sofatime.staticGetICalFormat(this.day, this.parent.state.timezone)

    //Set the 24h state checkbox
    this.element.querySelector('.sofatime-24h-checkbox').checked = this.parent.state.is24
    var format = (this.parent.state.is24) ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD hh:mma";
    try {
        //Set the display time
        var dropdownOptions = this.element.querySelectorAll('.sofatimezone-select option')
        this.element.querySelector('.sofatimezone-select').value = this.parent.state.timezone
        this.element.querySelector('span').innerHTML = this.day.tz(this.parent.state.timezone).format(format)
        for (var i = 0; i < dropdownOptions.length; i++) {
            var dd = dropdownOptions[i]
            let timezone = dd.value.match(/\S+/)
            try {
                dd.innerHTML = timezone[0] + ' ' + this.day.tz(timezone).format(format)
            } catch (e) {
                console.log(e)
            }
        }
        //Set all of the times in the selector dropdown as well as the currently selected option
    } catch (e) {
        console.log(e)
    }
}


document.body.onload = () => {
    console.log("Loaded!")
    try {
        var sofatime = new Sofatime()
        console.log(sofatime)
    } catch (e) {
        console.log(e)
    }
}
