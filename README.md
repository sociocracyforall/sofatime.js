# Installation
```
git clone -b webc https://github.com/sociocracyforall/sofatime.js
cd sofative.js/
npm install
```

# Editing html/css

## Workflow:
  - from repo `npm run dev`. dev script is in `package.json`
  - load `http://localhost:5174/` or whatever vite says.
  - Edit `src/template.html` or `index.html`, page refreshes when file saved.


## Files

`index.html` is a short test page with `<sofa-time>` components  on it. Component specific input is
done via their element attributes. A simple script updates global sofatime state on an interval 
using data from `testdata` directory.

`template.html` is the html for the component. It is shadowed from the rest of the page so CSS
styles and element ids won't conflict with other components or the parent page. CSS variables are
shared so this would be one way of allowing user styling.

Because of how `template.html` is imported and added to the component, external stylesheet
references inside components may not work or may behave unexpectedly. Stick to styles in a
`<style>` tag. 

# Editing `component.ts` and typechecking
`npm run dev` only converts typescript, it does not do typechecking. Use `tsc --watch`
@TODO

# Building
@TODO

@TODO Update wordpress section.
# sofatime Wordpress plugin
### use a shortcode to display a date and time in user's local or chosen timezone

#### HOW TO USE:
Use the installed shortcode [sofatime] to enclose a ISO 8601 date and time, followed by a valid 
timezone name.

example: 
[sofatime]2020-01-01 15:00 America/New_York[/sofatime]

Valid timezone names include \"UTC\", a name from the [Timezone Database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), or one of the following: Eastern, Central, Mountain, Pacific 

# Notes & TODOs
  - Currenty `data-start` and `data-end` values are fed directly into `new Date()`. No "DWIM" logic.

