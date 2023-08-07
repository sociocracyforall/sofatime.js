Notes 8/3
---
How should elements behave when there is no valid end date?
endContainer?


Notes 5/1/2023
---
 - use Tom Select? https://www.npmjs.com/package/tom-select
 - updated template.html

Notes 3/27/2023
---

- html template and css. Use base16 color scheme?
- github projects?
- pull tippy back in and finish HTML templating
- Finalize data options. Ditch 24hToggle? Look at toLocaleString options object on mdn
- Think about future updates.
- Polyfill Intl. Finish bundler 


Notes 3/20/2023
---
- Finalize attribute names
```typescript
interface ComponentAttributes {
  // ISOish time string, allow for some variation from standard for convenience (no required T)
  // 2023-03-20T17:46:09.200Z
  data-start: RFC8601-TimeString;    
  data-end: ISOTimeString;    
  data-display-24hToggle: 


  data-start: ISO8601

  data-local-start: 
  data-local-end: 
  data-local-timezone: 
}

```

- DayJS still required? Currently `timezone: dayjs.tz.guess()` is used to guess timezone from input.
- Also used for format string, better options for format string in dayjs, better localization in Intl.
```javascript
  d.tz.guess = function () {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }
```




# for localization:
```javascript
const event = new Date(Date.UTC(2012, 11, 20, 3, 0, 0));
["en-GB", "en-US", "ko-KR", "es-MX"].forEach((locale) =>
  ["full", "long", "medium", "short"].forEach((dateStyle) => {
    console.log(locale, dateStyle);
    console.log(event.toLocaleString(locale, { timeZone: "UTC", dateStyle: dateStyle }));
    console.log("");
  })
);
```




# data-sofatime
# data-display-24h-toggle
# data-display-select
# data-format

data-display-times-only : start | both | end
data-prominent-controls
data-allow-time-zone-select
data-ask-twenty-four


# data-sofatime
# data-format - dayjs format argument
# data-display-24h-toggle
# data-display-select
  data-display-time 


--- 

data-display
  - 24 Hour checkbox
  - Timezone dropdown
  - tippy/prominentControls/hamburger menu

data-sofatime
  - Required time input, single date or hyphen separated start & end

