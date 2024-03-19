# Team Meeting #5 19/03/2024

*Meeting Minutes by Filip/Alex*

## Attendance (7/7):

- [X] Alex Boxall
- [X] Hexuan Meng
- [X] Filip Mazur
- [X] Edward Nivison
- [X] Rachel Cao
- [X] Sineeha Kodwani
- [X] Matthew Cawley

## Agenda:

- Everyone's progress throughout last week, and plans for this week
- Any questions for (SoCo Admin)?
- Front end interface thoughts, should we start rough development?
- Audit 2 and SoW discussion (including the creation of an agenda)
- Go over project charter

## Content from the meeting
- Progress for the last week
  - Filip:
    - Been working on Figma
    - The main flows are modelled, the upload and editing of data
  - Matthew:
    - Made a draft verion of the project character
    - Also started working on the database design
  - Sineeha and Rachel:
    - Been working on front end as well
    - Adding the schedule view page and the detailed view
    - Might also add a calendar on the home page
  - Hexuan:
    - Been looking through the backend code, happy to help on that
  - Edward:
    - Haven't done much more such the tutorial meeting
    - Done the decision logs, etc.
  - Alex:
    - Updated the backend code to generate random schedules
- Comments on the UI design
  - Use of a map? Or just click on the buttons for each room?
  - Map does not seem all that relevant - as no data will actually come from the map
  - Could add a list view to see all the information
  - Will need to add a way of changing the days of the week
- Work on the backend
  - Fitness value function (Scheduler.fitness)
  - Crossover
  - Method of loading in the data (Course.java)
  - Need to a framework for linking the backend with the frontend - e.g. something like Java Spring Boot
  - Single user vs. multi-user
    - Assuming one user will work on it at a time and there won't be conflicts
    - We will only really be expecting one person to be using it at a time
  - Storing the backend's results and rollback/undo
  - Could also have adjustable parameters for the backend, for e.g. prioritising certain parts of the evaluation
- Questions for SoCo
  - Contact details that we got from Belinda don't seem to be the ones that are actually collecting the data.
  - Belinda seems to be compiling the course data and sorting out labs from there
  - Person who used to do it left the position, so she's doing it for Semester 2 this year
  - Doesn't seem like there's anyone else to talk to within the admin staff
  - Don't know if they will refill the position 
- 

## Future Meetings

*Enter future meeting notes here*
