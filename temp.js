const timeZones = [
  "GMT",
  "Europe/Madrid",
  "America/New_York",
  "Asia/Tokyo",
];
const winter = new Date("2012-01-01");
const summer = new Date("2012-08-01");
display(summer)
console.log()
display(winter)

function display(timestamp) {
  let displayDate;
  for (timeZone of timeZones) {
    displayDate = Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: timeZone,
    }).format(timestamp);
    console.log("%s @ %s", displayDate, timeZone);
  }
}

