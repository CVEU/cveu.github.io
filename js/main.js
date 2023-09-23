// Get the timezone
// If it's already in storage, just grab from there
if (!sessionStorage.getItem('timezone')) {
    var tz = jstz.determine() || 'UTC';
    sessionStorage.setItem('timezone', tz.name());
}
var currTz = sessionStorage.getItem('timezone');

// Display timezone
$(".local-timezone").each(function (index, element) {
    // element == this
    // $(this).html("Time in " + currTz);
    $(this).html("" + currTz);
});

$(".local-day").each(function (index, element) {
    var momentTime = moment(element.dataset.time);
    var tzTime = momentTime.tz(currTz);
    var formattedDay = tzTime.format('YYYY-MM-DD hh:mm A');
    // element == this
    $(this).html(formattedDay);
});

$(".local-time").each(function (index, element) {
    var momentTime = moment(element.dataset.time);
    var tzTime = momentTime.tz(currTz);
    var formattedTime = tzTime.format('hh:mm A');
    // element == this
    $(this).html(formattedTime);
});
// var momentTime = moment(stamp);

// // Adjust using Moment Timezone
// var tzTime = momentTime.tz(currTz);

// // Format the time back to normal
// var formattedTime = tzTime.format('h:mm A');