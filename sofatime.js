import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

import tippy from 'tippy.js';
//import 'tippy.js/dist/tippy.css';

import jsontemplate from './template.js';
import tzTemplate from './template.json';

function inspect24HourDisplay() {
  return !Intl.DateTimeFormat([], { hour: 'numeric' })
    .format(0).match(/[A-Z]/);
}

function removeAllChildNodes(parentNode) {
  const children = Array.from(parentNode.childNodes);
  children.forEach(function remove(node) {
    parentNode.removeChild(node);
  });
}

function createElement(config) {
  const { document, name, attributes, classes, children } = config;

  const el = document.createElement(name);
  if (attributes !== undefined) {
    Object.keys(attributes).forEach(function addAttribute(attName) {
      if (attributes[attName] !== undefined) {
        el.setAttribute(attName, attributes[attName]);
      }
    });
  }
  if (classes !== undefined) {
    if (attributes !== undefined && attributes.class !== undefined) {
      classes.push(attributes.class);
    }
    el.setAttribute('class', classes.join(' '));
  }
  if (children !== undefined) {
    children.forEach(function appendChild(child) {
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child));
      } else {
        el.appendChild(child);
      }
    });
  }

  return el;
}

function inspectLang(domNode) {
  let lang = 'en';

  const document = (
    domNode.nodeType === Node.DOCUMENT_NODE
    ? domNode
    : domNode.ownerDocument
  );
  const window = (
    document !== undefined
    ? (
        document.parentWindow !== undefined
        ? document.parentWindow
        : document.defaultView
    )
    : undefined
  );

  if (window !== undefined && window.navigator !== undefined
      && Array.isArray(window.navigator.languages)
      && window.navigator.languages.length > 0) {
    lang = window.navigator.languages[0].substr(0, 2);
  }

  return lang;
}

function isDecline(text) {
  return text === 'false' || text === 'no';
}

function isAccept(text) {
  return text === 'true' || text === 'yes';
}

// Some users of this plugin had submitted encoded dates and times such as
// '2022-06-27 19:45 UTC'; it's not hard to convert values in this encoding to
// ISO 8601-encoded values, and we support these legacy values by converting
// them to e.g. '2022-06-27T19:45Z'.  If this function does not recognize the
// legacy encoding, it returns the (trimmed) original encoding.
function processLegacyInputFormat(encodedDateAndTime) {
  encodedDateAndTime = encodedDateAndTime.trim();
  const components = encodedDateAndTime.split(' ');
  if (components.length === 3 && components[2] === 'UTC') {
    return components[0] + 'T' + components[1] + 'Z';
  }
  return encodedDateAndTime;
}

export default function init(config = {}) {
  let { timezone,
        lang,
        use24HourDisplay,
        listingDataName,
        rootDomNode, } = config;
  if (lang === undefined) {
    lang = 'en';
  }
  if (use24HourDisplay === undefined) {
    use24HourDisplay = false;
  }
  if (listingDataName === undefined) {
    listingDataName = 'sofatime';
  }
  if (rootDomNode === undefined) {
    rootDomNode = document;
  }

  const listings = [];
  const componentNodes = rootDomNode.querySelectorAll(
    `[data-${listingDataName}]`
  );

  function updateDisplayOptions(config = {}) {
    let modified = false;
    if (config.timezone !== undefined && config.timezone !== timezone) {
      timezone = config.timezone;
      modified = true;
    }
    if (config.lang !== undefined && config.lang !== lang) {
      lang = config.lang;
      modified = true;
    }
    if (config.use24HourDisplay !== undefined
        && config.use24HourDisplay !== use24HourDisplay) {
      use24HourDisplay = config.use24HourDisplay;
      modified = true;
    }

    if (modified) {
      listings.forEach(function (renderCallback) {
        renderCallback({ timezone, lang, use24HourDisplay, });
      });
    }
  }

  const componentConfig = {
    listingDataName,
    updateCallback: updateDisplayOptions,
  };

  componentNodes.forEach(function (node) {
    componentConfig.rootDomNode = node;
    listings.push(component(componentConfig))
  });

  updateDisplayOptions({
    timezone: dayjs.tz.guess(),
    use24HourDisplay: inspect24HourDisplay(),
    lang: inspectLang(rootDomNode),
  });

  return updateDisplayOptions;
}

/**
 * Individual event component, part of a Sofatime group
 * @param {HTMLElement} domNodeRoot: the root element for this event
 * @param {Function} updateCallback: the function to call on updates
 */

function component(config) {
  const { rootDomNode, updateCallback, listingDataName, } = config;
  const document = rootDomNode.ownerDocument;
  const errors = [];
  const settings = rootDomNode.dataset;
  const displayTimeOnlyStart = ['both', 'start'].includes(
    settings.displayTimesOnly);
  const displayTimeOnlyEnd = ['both', 'end'].includes(
    settings.displayTimesOnly);
  let validityError = false;
  let lang = undefined;
  let rangeStartElement = undefined;
  let rangeEndElement = undefined;
  let toggle24HourDisplay = undefined;
  let toggle24HourDisplayLabel = undefined;
  let timeZoneSelect = undefined;

  let userControlsContainer = rootDomNode;
  let userControlsNodeName = 'span';
  if (!isAccept(settings.prominentControls)) {
    userControlsContainer = createElement({
      document, name: 'div', classes: ['menu',],
    });
    userControlsNodeName = 'div';
  }

  if (!isDecline(settings.askTwentyFour)
      && !isDecline(settings['display-24hToggle'])) {
    toggle24HourDisplay = createElement({
      document, name: 'input',
      attributes: { type: 'checkbox', },
    });
    toggle24HourDisplayLabel = createElement({
      document, name: 'label',
      children: [
        '24h',
        toggle24HourDisplay,
        createElement({
          document, name: 'span', classes: ['custom-checkbox-background',],
        }),
      ],
    });
    toggle24HourDisplay.addEventListener('change', function (e) {
      updateCallback({
        use24HourDisplay: e.srcElement.checked,
      })
    });
    userControlsContainer.appendChild(createElement({
      document, name: userControlsNodeName,
      classes: ['choose-24h-display',],
      children: [
        toggle24HourDisplayLabel,
        /*createElement({
          document, name: 'p',
          children: ['24h',],
        }),*/
      ],
    }));
  }

  if (!isDecline(settings.allowTimeZoneSelect)
      && !isDecline(settings.displaySelect)) {
    timeZoneSelect = createElement({
      document, name: 'select',
    });
    timeZoneSelect.addEventListener('change', function (e) {
      updateCallback({
        timezone: e.srcElement.value,
      })
    });
    userControlsContainer.appendChild(createElement({
      document, name: userControlsNodeName,
      classes: ['select-time-zone',],
      children: [
        createElement({
          document, name: 'label',
          children: ['Time zone',],
        }),
        timeZoneSelect,
      ],
    }));
  }

  // @@TODO@@: Use templating (e.g. with `lodash.template`) for the following:
  const view = document.createElement('span');
  view.classList.add('times', 'range');
  rangeStartElement = document.createElement('span');
  rangeStartElement.classList.add(
    'time-start', 'time', 'date-time-start', 'date-time',
  );
  view.appendChild(rangeStartElement);
  rootDomNode.appendChild(view);

  const bounds = settings[listingDataName].split(' - ');
  let startDateTime = undefined;
  let endDateTime = undefined;
  if (bounds.length > 2) {
    errors.push(
      "Could not parse range: more than one separator (' - ') found.");
  } else {
    startDateTime = dayjs(processLegacyInputFormat(bounds[0]));
    if (!startDateTime.isValid()) {
      errors.push('Start date and time are invalid.');
      validityError = true;
    }

    if (bounds.length === 2) {
      endDateTime = dayjs(processLegacyInputFormat(bounds[1]));
      if (!endDateTime.isValid()) {
        errors.push('End date and time are invalid.');
        validityError = true;
      } else {
        rangeEndElement = document.createElement('span');
        rangeEndElement.classList.add(
          'time-end', 'time', 'date-time-end', 'date-time',
        );
        view.appendChild(rangeEndElement);
      }
    }
  }

  if (errors.length > 0) {
    // Errors will be noted until the component is reloaded.
    errors.forEach(function (error) {
      view.appendChild(createElement({
        document, name: 'span', classes: ['error',], children: [error,],
      }));
    });
  }

  if (!isAccept(settings.prominentControls)
      && userControlsContainer.hasChildNodes()) {
    const menuButtonElement = createElement({
      document, name: 'button', classes: ['menu-button'], children: ['⋮'],
    });
    const inlineComponent = rootDomNode.localName === 'span';
    const menuButton = tippy(rootDomNode, {
      content: menuButtonElement,
      placement: (inlineComponent ? 'top-end' : 'right-start'),
      //trigger: 'manual',
      interactive: true,
      arrow: false,
      offset: [0, (inlineComponent ? 0 : -30)],
      delay: [null, 100],
    });
    const menu = tippy(menuButtonElement, {
      content: userControlsContainer,
      placement: 'bottom-end',
      trigger: 'manual',
      interactive: true,
      arrow: false,
      offset: [0, 0],
    });
    menuButtonElement.addEventListener('click', function () {
      menu.show();
    });
  }

  function render(config) {
    config.format = settings.format;

    if (timeZoneSelect !== undefined && config.lang !== lang) {
      lang = config.lang;
      let tzData = undefined;
      try {
        tzData = require(`./locale/${lang}.json`);
      } catch {
        console.log(
          `No time zone options localization is available for '${lang}'.`
        );
        tzData = require('./locale/en.json');
      }
      timeZoneSelect.appendChild(
        jsontemplate(document, tzTemplate.rootpattern, tzData));
    }

    if (errors.length === 0) {
      config.dateAndTime = startDateTime;
      if (displayTimeOnlyStart) {
        config.displayTimeOnly = true;
      }
      removeAllChildNodes(rangeStartElement);
      rangeStartElement.appendChild(document.createTextNode(
        formatDateAndTime(config)));

      if (endDateTime !== undefined) {
        config.dateAndTime = endDateTime;
        if (displayTimeOnlyEnd) {
          config.displayTimeOnly = true;
        }
        removeAllChildNodes(rangeEndElement);
        rangeEndElement.appendChild(document.createTextNode(
          formatDateAndTime(config)));
      }
    }

    if (toggle24HourDisplay !== undefined) {
      toggle24HourDisplay.checked = config.use24HourDisplay;
      toggle24HourDisplayLabel.classList.toggle(
        'child-checked',
        config.use24HourDisplay,
      );
    }

    if (timeZoneSelect !== undefined) {
      timeZoneSelect.value = config.timezone;
      if (timeZoneSelect.selectedIndex === -1) {
        timeZoneSelect.insertBefore(createElement({
          document, name: 'option',
          attributes: { value: config.timezone, },
          children: [config.timezone,],
        }), timeZoneSelect.firstChild);
        timeZoneSelect.value = config.timezone;
      }
    }
  }
  
  return render;
}

function formatDateAndTime(config = {}) {
  let { dateAndTime, timezone, use24HourDisplay, lang, format,
        displayTimeOnly, } = config;
  if (use24HourDisplay === undefined) {
    use24HourDisplay = false;
  }

  if (lang !== undefined && lang !== 'en') {
    lang = lang.substr(0, 2);
    require(`dayjs/locale/${lang}.js`);
  }

  if(format === 'toLocaleString') {
    const options = { month: "long", day: "numeric", hour: "numeric",
                      minute: "numeric" };
    return dateAndTime.tz(timezone).toDate().toLocaleString(undefined, options);
  }

  if (displayTimeOnly) {
    format = `${use24HourDisplay ? 'HH' : 'h'}:mm${
      use24HourDisplay ? '' : ' a'}`;
  } else if (format === undefined) {
    format = `ddd DD MMMM YYYY ${
      use24HourDisplay ? 'HH' : 'h'}:mm${
      use24HourDisplay ? '' : ' a'}`;
  }
  // Work around the following Day.js issue:
  // <https://github.com/iamkun/dayjs/issues/1813>
  if (timezone === 'Etc/UTC') {
    return dateAndTime.utc().locale(lang).format(format);
  }
  return dateAndTime.tz(timezone).locale(lang).format(format);
}
