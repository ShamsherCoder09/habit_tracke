
$(document).ready(function () {
  const calendarEventDate = $('#calendar').data('calendar-events'); 
  console.log(calendarEventDate); 
  $('#calendar').fullCalendar({
    defaultView: 'month',
    dayRender: function (date, cell) {
      var dateString = date.format('YYYY-MM-DD');
      var eventExists = false;
      // Check if an event exists for the current date
      calendarEventDate.forEach(function (event) {
        if (event.date === dateString) {
          eventExists = true;
          return false; // Exit the loop since we found a match
        }
      });

      // Apply CSS styling to the date cell if an event exists
      if (eventExists) {
        cell.css('background-color', '#378006'); // Set the background color to green
        cell.css('color', '#fff'); // Set the text color to white
      }
    }
  });
});
