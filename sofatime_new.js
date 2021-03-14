function Sofatime(is24, timezone, root = document) {
    dayjs.extend(window.dayjs_plugin_utc)
    dayjs.extend(window.dayjs_plugin_timezone)
    this.root = root
    this.sofatimeComponents = []
    this.state = {}
    //Set the initial state.
    this.setState(this.getLocale())
    //Load all elements with the sofatime wrapper class and create components from them
    this.root.querySelectorAll('.sofatime').forEach(function(el) {
        this.sofatimeComponents.push(new SofatimeComponent(el, this))
    }.bind(this))
}

Sofatime.prototype.getLocale = function() {
    var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    var is24 = !Intl.DateTimeFormat(navigator.locale, {
        hour: 'numeric'
    }).format(0).match(/[A-Z]/)
    return {
        timezone: timezone,
        is24: is24
    }
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
 * @param {HTMLElement} root the root element for this event
 * @param {Sofatime} parent the parent Sofatime component that this belongs to
 */

function SofatimeComponent(root, parent) {
    this.root = root 
    this.parent = parent //Javascript Sofatime object, not a dom node
    this.state = {}
    this.boundElements = {
        is24Checkbox: root.querySelector('.sofatime-24h-checkbox'),
        optionList: root.querySelector('.sofatimezone-select'),
        optionListOptions: null,
        startTime: root.querySelector('sofatime-start-time'),
        endTime: root.querySelector('sofatime-end-time')
    }
    if (this.boundElements.optionList) {
        this.boundElements.optionListOptions = this.boundElements.optionList.querySelectorAll('option')
    }
    this.addEventListeners()
    this.day = null
    this.setState(this.parseInputValues())
    /*
      this.setState({
          timezone: 'America/New_York',
          datetime: '2020-01-01T17:00'
      })
      */
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
    if (state && state.error !== undefined) this.state.error = state.error
    this.render()
}
/**
 * */
SofatimeComponent.prototype.parseInputValues = function() {
    return {
      timezone: "America/New_York",
      datetime: ""
    }
    var inputValue = this.boundElements.displayElements[0]
    if (!inputValue) {
        return {
            error: "Failed find a date input"
        }

    } else {
        var match = inputValue.innerText.match(/([0-9\-]{10}[T ]\S+)\s+(.+)/)
        if (match) {
            return {
                timezone: match[2],
                datetime: match[1]
            }
        } else {
            return {
                error: 'Failed to parse a valid datetime from input'
            }
        }
    }
}

SofatimeComponent.prototype.renderOptionsList = function() {
    if (!this.boundElements.optionList) return;
    var format = (this.parent.state.is24) ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD hh:mma";
    for (var i = 0; i < this.boundElements.optionListOptions.length; i++) {
        var option = this.boundElements.optionListOptions[i]
        option.originalText = option.originalText ? option.originalText : option.innerHTML
        var timezone = option.value
        try {
            var optionText = option.originalText + ' (' + this.day.tz(timezone).format(format).toUpperCase() + ')'
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
        if (this.state.error) {
            console.log(this.state.error)
            this.boundElements.displayElements[0].innerHTML = this.state.error
            this.boundElements.displayElements[0].classList.add('sofatime-error')
            return
        } else {
            this.boundElements.displayElements.forEach(function(el) {
                el.innerHTML = this.day.tz(this.parent.state.timezone).format(format)
            }.bind(this))
        }

        if (this.boundElements.is24Checkbox) {
            this.boundElements.is24Checkbox.checked = this.parent.state.is24
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

window.addEventListener('load', function() {
    console.log("body loaded!")
    window.sofa = new Sofatime()
})
