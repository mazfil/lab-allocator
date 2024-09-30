# Client Meeting #3- 13/02/2024

*Meeting Minutes by Filip Mazur*

## Attendance ([Attendance]/7):

- [X] Alex Boxall
- [X] Hexuan Meng
- [X] Filip Mazur
- [X] Edward Nivison
- [X] Rachel Cao
- [X] Sineeha Kodwani
- [X] Matthew Cawley

## Agenda:

Front end requirements and who specifically in the admin team will use them (contact details)

What kind of resources do you have familiarity with and would like the UI to look like. Is there something in your mind of what the end product would look like (potential drawing of it).

Some further clarification on the data we are handling and the security needed for it.

Talks on licence as well for the project.

Are we deciding on the capacity of each lab, or do we just go with the maximum of the room's capacity and the tutor:student ratio?

How many 'spare spots' (overall, across all labs) do we normally have to allow for student flexibility.

## Content from the meeting

### Front End

There are many different ways we can design the UI.
- We could have a dashboard that allows the users to either upload/manage data or process the data and make adjustments.
- Having a header containing (Schedulem, View TT, Upload Data, Help & support) and footer with (About, Contact, User Guide)
- Additionally we could look at the bee hive from the first lecture with colour coding for room availability.
- Also could be looking at what the libraries use for room allocation.

We should have an export page in the data upload section.

We should look at finalising design in the next two weeks and presenting a UI prototype to Belinda for testing.

Belinda wants "Something where we can view the information easily"
Add view for single classes, to see the clustering would be ideal.

### Back End

We calculate the amount of labs based on expected enrolements, additionally we arent allocating online labs, only the 7 given locations.
We dont reserve lab spots for extra room (e.g. 100 Students, 10 Labs, NOT 11 for flexibility, there are limited resources.)

We should start with the data being private initially. It is important that our product does not show any information to unauthorised individuals. Only administrative staff should have access.

### Other info for development / design

Admin team enter data to send to Belinda based on data they recieve from MS form. If we need more info we can see if the admin team will be willing to provide for the future. 

The information Belinda receives is used to schedule Lectures, Labs and Tutorials.

Drop-ins are scheduled last, we do not **need** to make room for them, if there is room for them at the end they will be scheduled.

### Tech

We could get access to an ANU server most likely toward the end, not for development. We will need to provide the Tech specs required to the respective staff (provided by Belinda). 

## Future Meetings
For the SoW we should look at including more information about the front end. However, given we now have more of an understanding of how we will develop this it wont be too much of an issue.

Look at scheduling a prototype session with Belinda soon.

Look at doing an agile session with the team to look at the tasks we need to do. 

Add lecture times to draft data. We might need to ask Belinda for the format she receives for this info.