'use strict';

$(function() {

  var myDataRef = new Firebase('https://todds-todo.firebaseio.com');
  var rowCount = 0;
  var fbIDs = [];

  // When something is added to the database (via the firebase push method in the onclick of the
  // Create Item button) this runs and adds a new row to the table. This function also apparently
  // runs whenever the website is loaded and adds all the data to the table from the database.
  myDataRef.on('child_added', function(data) {
    var fbData = data.val();
    fbIDs.push(data.key());
    $('tbody').append(
      '<tr id="row' + rowCount + '">' +
      '<td class="title">' + fbData.title + '</td>' +
      '<td class="dueDate">' + fbData.date + '</td>' +
      '<td class="priority">' + fbData.priority + '</td>' +
      '<td class="isComplete">' + fbData.isComplete + '</td>' +
      '<td><button class="complete" id="itemButton'+ (rowCount++) + '">Completed</button></td>' +
      '</tr>');

    if (fbData.isComplete === 'Yes') {
      $('#row' + (rowCount - 1) + ' .title').css('text-decoration', 'line-through');
      $('#row' + (rowCount - 1) + ' .dueDate').css('text-decoration', 'line-through');
      $('#row' + (rowCount - 1) + ' .priority').css('text-decoration', 'line-through');
    }

    // When the complete button is clicked in one of the row the changes are made to that row
    // and isComplete is updated in the database
    $('.complete').off().on('click', function() {
      var rowNum = $(this).attr('id').slice(-1);
      $('#row' + rowNum + ' .title').css('text-decoration', 'line-through');
      $('#row' + rowNum + ' .dueDate').css('text-decoration', 'line-through');
      $('#row' + rowNum + ' .priority').css('text-decoration', 'line-through');
      $('#row' + rowNum + ' .isComplete').text('Yes');

      var fbDataObj = myDataRef.child(fbIDs[rowNum]);
      fbDataObj.update({
        isComplete: 'Yes'
      });
    });
  });

  // When user creates a new item, save the data of that item into the database, reset form.
  $('#create').on('click', function() {
    var title = $('#title').val();
    var date = $('#dueDate').val();
    var priority = $('#priority').val();
    if (title && date) {
      myDataRef.push({title: title, date: date, priority: priority, isComplete: 'no'});
      $('#title').val('');
      $('#dueDate').val('');
      $('#priority').val('High');
    }
  });
});