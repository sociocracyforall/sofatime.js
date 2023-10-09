# Development notes

To build and host for dev work run `npm run dev`. This will call the dev script in package.json
which uses vite to host it and watch for changes.

vite does not do any typechecking. To check run `tsc --watch` in root of repository.

## To modify the style and/or layout

Edit `src/template.html`. You can add css, which will be scoped to the web component. You can also modify the DOM structure, adding or removing divs, as long as the divs with IDs remain for the javascript to find them.

## To test

open [index.html](index.html) in your browser

# sofatime Web Component
### Display a date and time in user's local or chosen timezone

#### HOW TO USE:
Use a `sofa-time` tag with `data-start` = a ISO 8601 date and time

example: 
```
<sofa-time data-start="2021-01-01 05:00 UTC" data-end="2021-01-01 05:00 UTC" data-display24toggle="true">
```

Valid timezone names include \"UTC\", a name from the [Timezone Database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), or one of the following: Eastern, Central, Mountain, Pacific 
