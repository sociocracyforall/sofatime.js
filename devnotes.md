# Dev Notes

## Features
 - ICS Calendar file download link
   - [RFC5545](https://tools.ietf.org/html/rfc5545)
   - Will probably need to include VTIMEZONE if exporting selected timezone vs outputting time with GMT offset.
 - Google/Outlook and other calendar links
   - [Example](https://www.labnol.org/apps/calendar.html)
   - The ICS file that is downloadable from that page is not valid, it's missing PRODID, DTSTAMP/METHOD, and UID for the VEVENT.
 - Google CSV generation.
   -[Details](https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en#zippy=)
   - Probably not worth it since google can import ICS fine and that is a more universal solution.
 - Allow input of format strings for toggling, functions like the 24/not 24 checkbox but allow for arbitrary format strings

## Notes
 - Make more universal than a wordpress plugin? Web component?
 - Standardize CSS class names
 - Standardize user input fields, what is required, how they are input.
    - Google Calendar CSV
