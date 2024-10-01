# Client Meeting #1 - 28/02/2024 3pm-4pm
*Meeting Minutes by Edward Nivison*
## Attendance (7/8):

 - Alex Boxall
 - Hexuan Meng
 - Filip Mazur
 - Edward Nivison
 - Rachel Cao
 - Belinda Bergin (Client)
 - Sineeha Kodwani

## Agenda:
Our first meeting with the client will consist of the team discussing the problem with Belinda and narrowing down the application, features, milestones and the general end product of the project.

From there, we can build the project structure to meet the project requirements and get a Statement of Work (SoW) laid out.

With a plan of action we can begin brainstorming/researching/implementing solutions to the problems that we have laid out.

## Content from the meeting
The meeting with Belinda (Client) was generally a recap and further explanation of what had been discussed in the Team Formation night regarding the type of information that we would have to think about during the project.
### Restrictions
As explained by Belinda, there are certain restrictions that we are going to have to think about when planning out the project. These are:

Tutor to Student Ratios:
1:15 for 1000 level courses
1:23 for 2000 level courses
1:26 for 3000 and 4000 level courses

Computer Lab Sizes:
HN1.23 - 40 students
HN1.24 - 40 students
N109 - 23 students
N111 - 29 students
N112 - 26 students
N113 - 26 students
N114 - 26 students
N115/6 - 61 students

This does not limit classes to being of this size but can instead be +- 5 or so students for (I believe) 2000 level courses and above. This is due to attendance rates never being 100%.
(e.g., Rooms.Room N111 can have 30 - 34 students to allow having 2 tutors, even though there theoretically isn't the space for 30 - 34 students).

Courses.Course code

Student predicted enrollment has a big play in how labs are assigned.

Number of weeks tutorials are run (not to be counted in the beginnings of the project since most (non-weekly still run 8 out of the 12 weeks).

Tutorials must run between the hours of 8am to 8pm (not before or after those times).

Number of tutors.
### A possible database structure for courses.

| Courses.Course Code | Courses.Course Level | Predicted Enrollment | Tutorial Length | Tutors Available | Special Conditions | Block-out times |
| -- | -- | -- | -- | -- | -- |  -- |
| COMP1100 | 1000 | 500 | 2.0 | 30 | After Lectures | Mon 12pm-2pm |
| COMP1110 | 1000 | 500 | 2.0 | 30 | Projectors | Mon 2pm-4pm |

To explain this table that I have created.
Courses.Course Code, Courses.Course Level, Predicted Enrollment, Tutorial Length, Tutors Available are pretty self explanatory, with the tutors and courses usually not exceeding an amount of workload in a day (e.g., no more than two sessions consecutively (just as an example, not definitive)).

Special Cases is going to be a segment of the database where if a Lecturer/Convenor requests the tutorials have something in particular, whether that be that the labs are after the lectures, whether the room has a big enough projector/screen to show slides, and anything else that might be of special request that requires a specific room and/or time slot.

Block-out times are for each of the courses where the labs cannot coincide with the corresponding course lecture(s).

This is just a general definition of the database needed, and is up for change.

## Future Meetings
For future notice. Belinda is sending through some data/information regarding what will likely be Semester 2, 2023 so we can base some real-life information for our model.

For future meetings,

We should be working on completing a Statement of Work and an Audit Landing Page for the Week 3 Audit coming up.
