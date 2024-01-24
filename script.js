$(function () {
  // Function to create a time block
  function createTimeBlock(id, hour, timeClass) {
    var row = document.createElement("div");
    row.id = id;
    row.classList.add("row", "time-block", timeClass);

    var hourDiv = document.createElement("div");
    hourDiv.classList.add("col-2", "col-md-1", "hour", "text-center", "py-3");
    hourDiv.textContent = hour;
    row.appendChild(hourDiv);

    var textarea = document.createElement("textarea");
    textarea.classList.add("col-8", "col-md-10", "description");
    textarea.rows = 3;
    row.appendChild(textarea);

    var button = document.createElement("button");
    button.classList.add("btn", "saveBtn", "col-2", "col-md-1");
    button.setAttribute("aria-label", "save");

    var icon = document.createElement("i");
    icon.classList.add("fas", "fa-save");
    icon.setAttribute("aria-hidden", "true");

    button.appendChild(icon);
    row.appendChild(button);

    return row;
  }

  // Get the container element
  var container = document.getElementById("timeBlocksContainer");

  // Create and append time blocks for standard business hours (9am to 5pm)
  for (var i = 9; i <= 17; i++) {
    var timeClass = i < dayjs().hour() ? "past" : (i === dayjs().hour() ? "present" : "future");
    container.appendChild(createTimeBlock("hour-" + i, i + "AM", timeClass));
  }

  // Add a listener for click events on the save button.
  $(document).on("click", ".saveBtn", function () {
    // Use DOM traversal to get the "hour-x" id of the time-block containing the button.
    var blockId = $(this).closest(".time-block").attr("id");

    // Save user input in local storage using the id as a key.
    var userInput = $(this).siblings(".description").val();
    localStorage.setItem(blockId, userInput);
  });

  // Apply the past, present, or future class to each time block.
  function updateHourClasses() {
    $(".time-block").each(function () {
      var blockHour = parseInt($(this).attr("id").split("-")[1]);
      var timeClass = blockHour < dayjs().hour() ? "past" : (blockHour === dayjs().hour() ? "present" : "future");

      $(this).removeClass("past present future").addClass(timeClass);
    });
  }

  // Get user input from localStorage and set textarea values.
  function loadSavedData() {
    $(".time-block").each(function () {
      var blockId = $(this).attr("id");
      var savedInput = localStorage.getItem(blockId);

      if (savedInput) {
        $(this).find(".description").val(savedInput);
      }
    });
  }

  // Display the current date in the header of the page.
  function displayCurrentDate() {
    $("#currentDay").text(dayjs().format("dddd, MMMM D"));
  }

  // Initial setup
  displayCurrentDate();
  updateHourClasses();
  loadSavedData();

  // Update time block classes every minute
  setInterval(updateHourClasses, 60000);
});
