# Client Meeting #4 - 28/03/2024 1pm-2pm
*Meeting Minutes by Alex*

## Attendance (7/9):

 - [X] Alex Boxall
 - [X] Hexuan Meng
 - [X] Filip Mazur
 - [X] Edward Nivison
 - [X] Sineeha Kodwani
 - [ ] Rachel Cao
 - [ ] Matthew Cawley
 - [X] Belinda Bergin (Client)

## Content from the meeting
- Trying to upload data with a file
  - Clicked on the button for the file upload, then can do drag and drop
  - Ok with predetermined format for the data - headers in a spreadsheet / CSV
  - CSV is fine and probably easier
  - Exiting out of prompt, need to click outside the boundary
- Wanting to change the data for a given class
  - Probably need some kind of confirmation whether or not a given field has been changed
  - Seems pretty intuitive for opening the data editor and then editing things
  - Much more user friendly at the moment than what they are currently using
  - Future flow for an add button to add a manual class
    - "Would be great to have a manual option ... for people (convenors) who miss deadlines ... saves us from uploading another CSV..." (
- Updating the values for the algorithm
- Going back to home screen also seems intuitive
- Results for the outputs
  - Will be labels on each course in the future
  - (Will run out of colours if we don't label them)
  - Happy with the drag and drop interface for moving classes around
  - Will not let individual convenors have access to the drag and drop timetable interface
  - Happy with the other view too for seeing individual classes
  - For rearranging them can just drag and then it throws up a message with 2 options if there is a clash, and then also shows locations to put it
  - Belinda: okay to not validate the locations show (i.e. allow this interface to override e.g. the tutor ratios)
  - Lets you toggle on and off all of the classes
- Table view
  - Good to have for e.g. screenshotting and emailing
  - Days of the week, and then by location
  - Could have it so you can modify how it sorts/displays/filters it 
- List view
  - Be good to e.g. be able to click on COMP1100, and then show a list of when all of the lab times are
- Algorithm will run...
  - Whenever you upload / change the course data
  - Not for edits to the schedule, as that should allow for manual overrides
  - In the future we could run it again on just a single course to prevent clashes, but that's a thought for later
- Status
  - Would show if the algorithm's currently running, complete, error, etc.
  - Belinda: should put the date and time of the last run of the algorithm - can put on status or on the home screen
  - Could even implement a change log - "doesn't have to be particularly user friendly"
- Improvement Belinda has for the prototype:
  - Would want ANU School of Computing and logo on the title page, and make it look more similar to the ANU theming
    - Filip has contacted branding, but hasn't got a response back yet
  - Different colours for courses isn't likely to work because there's so many of them - could e.g. colour based on 1xxx, 2xxx, 3xxx, 4xxx, etc.
  - Put CSIT in front of the Nxxx room names
  - Is it possible to get the whole day on the screen?
    - Can scroll, or we could squish it into the one screen
    - "Try, as it's easier to get a screenshot and then send that around"
  - What information should be seen on each of the boxes in the schedule
    - Course code
    - Lab number (e.g. lab 1, lab 2, ..., lab 7, or shorter "L1", "L2", ..., "L7")
  - Public holidays could be an extension
    - Individual convenors sort out where lab needs to go
  - "Otherwise it looks nice and easy to use... the only thing with the drag and drop:"
    - Do we throw up an alert like "Do you want to make this change?" whenever you change something:
      - Undo button? (even if just the previous one?)
      - Or a popup confirming you want to make a change
      - Could store a log of changes, which then allows it to reverse it and undo it
  - Export button
    - Would just give a copy of what's in the database
    - Belinda: what will the export look like? data file vs screenshot?
       - Could either be JSON or CSV - probably CSV (even if we need to convert the export from Firebase if it stores it in JSON)
       - Belinda: "CSV would be easier"
- Muliple people using the program at once
  - Happy to not allow multiple people access at once
  - Belinda: happy to make it a lock so that only one user can concurrently edit things
 
