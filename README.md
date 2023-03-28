# Development notes

To build and host for dev work run `npm run dev`. This will call the dev script in package.json
which uses vite to host it and watch for changes.

vite does not do any typechecking. To check run `tsc --watch` in root of repository.

# sofatime Wordpress plugin
### use a shortcode to display a date and time in user's local or chosen timezone

#### HOW TO USE:
Use the installed shortcode [sofatime] to enclose a ISO 8601 date and time, followed by a valid timezone name.

example: 
[sofatime]2020-01-01 15:00 America/New_York[/sofatime]

Valid timezone names include \"UTC\", a name from the [Timezone Database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), or one of the following: Eastern, Central, Mountain, Pacific 
