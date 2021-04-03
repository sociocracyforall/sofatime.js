function Sofatime(is24, timezone, root = document) {
  dayjs.extend(window.dayjs_plugin_utc)
  dayjs.extend(window.dayjs_plugin_timezone)
  this.root = root
  this.children = []
  var timezones = [
    { timezone: 'Pacific/Honolulu', baseText: 'Hawaii Time' },
    { optgroup: 'Americas' },
    { timezone: 'America/New_York', baseText: 'New York' },
    { timezone: 'America/Adak', baseText: 'Alaska - Aleutian Islands - Adak' },
    { timezone: 'America/Juneau', baseText: 'Alaska Time' },
    { timezone: 'America/Los_Angeles', baseText: 'Pacific Time' },
    { optgroupEnd: true },
  ]

  this.state = {}
  //Load all elements with the sofatime wrapper class and create components from them
  this.root.querySelectorAll('.sofatime').forEach(
    function (el) {
      this.children.push(new SofatimeComponent(el, this))
    }.bind(this)
  )
  //Set the initial state.
  this.setState(this.getLocale())
  this.setState({ timezones: timezones })
}

Sofatime.prototype.getLocale = function () {
  var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  var is24 = !Intl.DateTimeFormat(navigator.locale, { hour: 'numeric' }).format(0).match(/[A-Z]/)
  return {
    timezone: timezone,
    is24: is24,
  }
}
/**
 * Copies all properties from the new state to Sofatimes state and re-renders all children if there is a change
 * @param {object} state new state value
 */
Sofatime.prototype.setState = function (state) {
  var stateChange = {}
  for (var key in state) {
    if (state.hasOwnProperty(key) && state[key] !== this.state[key]) {
      this.state[key] = state[key]
      stateChange[key] = true
    }
  }

  if (Object.keys(stateChange).length) {
    this.children.forEach(function (c) {
      c.render(stateChange)
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

  this.maxOptionTextLength = 0
  this.boundElements = {
    is24Checkbox: root.querySelector('.sofatime-checkbox'),
    optionList: root.querySelector('.sofatime-select'),
    optionListOptions: [],
    startTimes: root.querySelectorAll('.sofatime-start'),
    endTimes: root.querySelectorAll('.sofatime-end'),
  }

  /* 
  if (this.boundElements.optionList) {
    this.createOptionListHtml(this.parent.state.timezones)
  }
  */
  this.addEventListeners()
  this.dayjsStartTime = null
  this.dayjsEndTime = null
  this.setState({ startDatetime: root.dataset.start, endDatetime: root.dataset.end })
}

SofatimeComponent.prototype.createOptionListHtml = function (options) {
  if (!this.boundElements.optionList) return
  var html = ''
  for (var i = 0; i < options.length; i++) {
    var option = options[i]
    if (option.timezone) {
      this.maxOptionTextLength =
        option.baseText.length > this.maxOptionTextLength ? option.baseText.length : this.maxOptionTextLength
      html += '<option value = "' + option.timezone + '" data-basetext="' + option.baseText + '"></option>\n'
    } else if (option.optgroup) {
      html += '"<optgroup label="' + option.optgroup + '">'
    } else if (option.optgroupEnd) {
      html += '</optgroup>'
    }
  }
  this.maxOptionTextLength += 1
  this.boundElements.optionList.innerHTML = html
  this.boundElements.optionListOptions = this.boundElements.optionList.querySelectorAll('option')
}
/**
 * Adds change listeners for UI components. Note that these will fire when they are changed by the user or by the script that
 * synchronizes 24 time checkbox across different SofatimeComponents
 */
SofatimeComponent.prototype.addEventListeners = function () {
  //Listener for toggling 24 hour time
  if (this.boundElements.is24Checkbox) {
    this.boundElements.is24Checkbox.addEventListener(
      'change',
      function (e) {
        this.parent.setState({
          is24: e.srcElement.checked,
        })
      }.bind(this)
    )
  }

  //Listener for timezone selection dropdown
  if (this.boundElements.optionList) {
    this.boundElements.optionList.addEventListener(
      'change',
      function (e) {
        this.parent.setState({
          timezone: e.srcElement.value,
        })
      }.bind(this)
    )
  }
}

SofatimeComponent.prototype.setState = function (state) {
  // Should check dayjs docs for best way to do
  var stateChange = {}
  state = state ? state : {}

  //Find what parts of the state have changed and copy them to the components state
  for (var key in state) {
    if (state[key] !== this.state[key]) {
      stateChange[key] = true
      this.state[key] = state[key]
    }
  }

  //If there is a start time and it has changed, update the components dayjs object
  if (state.startDatetime && stateChange.startDatetime) {
    this.dayjsStartTime = dayjs(state.startDatetime, this.parent.state.timezone)
  }

  //If there is a end time and it has changed, update the components dayjs object
  if (state.endDatetime && stateChange.endDatetime) {
    this.dayjsEndTime = dayjs(state.endDatetime, this.parent.state.timezone)
  }
  if (state && state.error !== undefined) this.state.error = state.error
  this.state = state
  this.render(stateChange)
}

SofatimeComponent.prototype.render = function (stateChange) {
  if (this.state.error) {
    console.log(this.state.error)
    return
  }

  //If the timezone list changes, re-generate timezone option list html
  if (stateChange.timezones) {
    this.createOptionListHtml(this.parent.state.timezones)
  }

  //Update the checkbox to ensure it matches the global 24 hour state
  if (stateChange.is24 && this.boundElements.is24Checkbox) {
    this.boundElements.is24Checkbox.checked = this.parent.state.is24
  }

  //Render the start & end datetimes
  if (stateChange.startDatetime || stateChange.timezone || stateChange.is24) {
    this.renderDayjsTimes(this.dayjsStartTime, this.boundElements.startTimes, this.parent.state.is24)
  }
  if (stateChange.endDatetime || stateChange.timezone || stateChange.is24) {
    this.renderDayjsTimes(this.dayjsEndTime, this.boundElements.endTimes, this.parent.state.is24)
  }

  //Render the option list
  if (stateChange.timezone || stateChange.is24 || stateChange.timezones) {
    this.renderOptionsList(stateChange)
  }
}

SofatimeComponent.prototype.renderOptionsList = function (stateChange) {
  if (!this.boundElements.optionList) return
  this.boundElements.optionList.value = this.parent.state.timezone
  var format = this.parent.state.is24 ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD hh:mma'

  //If the 24 hour toggle has changed, re-render all options with the time for it's timezone
  if (stateChange.is24 || stateChange.timezones) {
    for (var i = 0; i < this.boundElements.optionListOptions.length; i++) {
      var option = this.boundElements.optionListOptions[i]
      var timezone = option.value
      var optionText = option.dataset.basetext

      while (optionText.length <= this.maxOptionTextLength) {
        optionText += ' '
      }
      optionText = optionText.replace(/ /g, '&nbsp;')
      optionText += '(' + this.dayjsStartTime.tz(timezone).format(format).toUpperCase() + ')'

      if (option.innerHTML !== optionText) {
        option.innerHTML = optionText
      }
    }
  }

  //If the timezone has changed ensure that the selected option matches
  if (stateChange.timezone) {
    this.boundElements.optionList.value = this.parent.state.timezone
  }
}
SofatimeComponent.prototype.renderDayjsTimes = function (day, els, is24) {
  if (!day || !els.length) return
  for (var i = 0; i < els.length; i++) {
    var el = els[i]
    let formatString = el.dataset.format?el.dataset.format:''
    if (is24) {
      formatString = formatString.replace(/h/g, 'H')
    } else {
      formatString = formatString.replace(/H/g, 'h')
      if (el.dataset.ampm) {
        formatString += 'A'
      }
    }
    var formattedString = day.tz(this.parent.state.timezone).format(formatString)
    if (el.innerHTML !== formattedString) {
      el.innerHTML = formattedString
    }
  }
}

window.addEventListener('load', function () {
  console.log('body loaded!')
  window.sofa = new Sofatime()
})
