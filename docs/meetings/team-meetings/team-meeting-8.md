# Team Meeting #8- 16/09/2024

*Meeting Minutes by Alex*

## Attendance (5/7):

- [X] Alex Boxall
- [ ] Hexuan Meng
- [X] Filip Mazur
- [X] Edward Nivison
- [ ] Rachel Cao
- [X] Sineeha Kodwani
- [X] Matthew Cawley

## Agenda:

- `after_lecture` flag
- Follow-up on frontend tasks (manage data page, conflict overlap, documentation and api/database integration), colour scheme development
- Manage data page using incorrect data format
- User testing *minimum testing product*
- Final data format / data for testing and next sem (ensuring system is designed for this input)
- Backend updates

## Content from the meeting
- Accessing frontend, go to `http://laballoc-dev.cecs.anu.edu.au:3000` - Filip has it set up so it starts when logged in, but will make it so it always runs
- There is another folder where the actual server runs out of - frontend updates can still happen without updating that 
- After lecture flag for classes
  - Originally going to based on the first lecture of the week
  - Uploading the data as CSV allows you to change this flag on the front end, need to finalise the manage data page for it
- Front end tasks
  - Manage data page, manage timetable still to go
  - Upload data should be finished with the database - when CSV is uploaded it will be pushed to the database
  - Need to check with Belinda for the format of the output of the Microsoft Form
  - Want to make sure we have next semester's data so we know what looks like
  - Rachel was looking at frontend clash problem
    - When you try to change the room of a lecture it doesn't detect a clash - not sure why
  - Also need to look at editing previous timetables - not going to be too big of a task
  - Rest of frontend should use the database
  - Manage data page 
    - Matthew will take a look into it this week
    - Need to make sure the page is actually working
    - Data format has changed since then, need to check/update it
- API
  - Should be pretty much finished
  - Right now if you upload a new course data file it just completely overwrites the old one
  - Could archive it - not sure if worth it as they should have the CSV locally anyway
  - Timetable upload does store previous ones, but by default you just get the most recent when you ask the API
- Documentation
  - Done the documentation, not working on frontend yet
  - Also been looking at getting a stylesheet set up so we can get consistent theming for the whole website
  - Recommended to have a main app stylesheet - and then within each page you add more specific stylesheets
- Colour scheme development
  - Filip will be working on it today - will be pretty similar to what we already had
  - Tweaks to make it more usable
- 
