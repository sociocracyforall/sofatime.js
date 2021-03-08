function Sofatime(is24, timezone, root = document) {
    dayjs.extend(window.dayjs_plugin_utc)
    dayjs.extend(window.dayjs_plugin_timezone)
    this.root = root
    this.sofatimeComponents = []
    this.state = {}
    //Set the initial state.
    this.setState({
        is24: is24,
        timezone: timezone
    })
    //Load all elements with the sofatime wrapper class and create components from them
    this.root.querySelectorAll('.sofatime').forEach(function(el) {
        this.sofatimeComponents.push(new SofatimeComponent(el, this))
    }.bind(this))
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
 * Individual event component, part of a Sofatime group
 * @param {HTMLElement} el the root element for this event
 * @param {Sofatime} parent the parent Sofatime component that this belongs to
 */

function SofatimeComponent(root, parent) {
    this.root = root
    this.parent = parent
    this.boundElements = {
        is24Checkbox: root.querySelector('.sofatime-24h-checkbox'),
        optionList: root.querySelector('.sofatimezone-select'),
        displayElements: root.querySelectorAll('span')
    }
    this.addEventListeners()
    this.day = null
    this.setState({
        timezone: 'America/New_York',
        datetime: '2020-01-01T17:00'
    })
}
/**
 * Adds change listeners for UI components. Note that these will fire when they are changed by the user or by the script that 
 * synchronizes 24 time checkbox across different SofatimeComponents
 */
SofatimeComponent.prototype.addEventListeners = function() {
    //Listener for toggling 24 hour time
    if (this.boundElements.is24Checkbox) {
        this.boundElements.is24Checkbox.addEventListener('change', function(e) {
            this.parent.setState({
                is24: e.srcElement.checked
            })
        }.bind(this))
    }

    //Listener for timezone selection dropdown
    if (this.boundElements.optionList) {
        this.boundElements.optionList.addEventListener('change', function(e) {
            this.parent.setState({
                timezone: e.srcElement.value
            })
        }.bind(this))
    }
}
SofatimeComponent.prototype.setState = function(state) {
    // Should check dayjs docs for best way to do
    this.day = dayjs(state.datetime, state.timezone)
    this.render()
}
/**
 * Not currently used for anything
 * */
SofatimeComponent.prototype.parseInputValues = function() {
    var sample = '[sofatime]2020-01-01T1' + (Math.floor(Math.random() * 8) + 1) + ':00 America/New_York[/sofatime]'
    var match = sample.match(/\[sofatime\]([0-9:\-TWZ]+)\s+([^[]+)\[\/sofatime\]/)
    if (match) {
        this.setState({
            timezone: match[2],
            datetime: match[1]
        })
    }

}

SofatimeComponent.prototype.renderOptionsList = function() {
    if (!this.boundElements.optionList) return;
    var dropdownOptions = this.boundElements.optionList.querySelectorAll('option')
    var format = (this.parent.state.is24) ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD hh:mma";
    for (var i = 0; i < dropdownOptions.length; i++) {
        var option = dropdownOptions[i]
        var timezone = option.value.match(/\S+/)
        try {
            var optionText = timezone[0] + ' ' + this.day.tz(timezone).format(format).toUpperCase()
            // Only update options text when changed, this could be more efficiently done in setState
            if (option.innerHTML !== optionText) {
                option.innerHTML = optionText
            }
        } catch (e) {
            console.log(e)
        }
    }
}

SofatimeComponent.prototype.render = function() {
    //This should probably just be a prop of the parent
    var format = (this.parent.state.is24) ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD hh:mma";
    try {
        if(this.boundElements.is24Checkbox) {
          this.boundElements.is24Checkbox.checked = this.parent.state.is24
        }

        //Set the display time
        if (this.boundElements.displayElements) {
            this.boundElements.displayElements.forEach(function(el) {
                el.innerHTML = this.day.tz(this.parent.state.timezone).format(format)
            }.bind(this))
        }
        if (this.boundElements.optionList) {
            //This only needs to be re-rendered when is24 changes, should check to avoid re-rendering when only timezone changes.
            this.renderOptionsList()
            //Set the currently selected timezone option
            this.boundElements.optionList.value = this.parent.state.timezone
        }

    } catch (e) {
        console.log(e)
    }
}

// Initialize after page is loaded. Note, arrow notation () => is an ES6+ feature.
document.body.onload = () => {
    console.log("body loaded!")
    window.sofa = new Sofatime(true, 'America/Phoenix')

}
