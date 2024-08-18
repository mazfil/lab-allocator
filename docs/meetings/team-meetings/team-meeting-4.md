# Team Meeting #4- 19/08/2024

*Meeting Minutes by Alex*

## Attendance (6/7):

- [X] Alex Boxall
- [ ] Hexuan Meng
- [X] Filip Mazur
- [X] Edward Nivison
- [X] Rachel Cao
- [X] Sineeha Kodwani
- [X] Matthew Cawley

## Agenda:

- Talk over the VM we got from the SoCo Facility team
- Talk about user testing
- Have a demonstration we can show the user testing if we can.
- Organise with Belinda about talking with some staff members
- Giving the documents/images/videos that Belinda wanted.
- Talk about Audit 2 next week.
- LDAP Authentication
- Branches
- Shadow team document

## Content from the meeting

- Still need some more signatures for the statement of work and team charter
- VM from SoCo Facility team
  - Have tried to get it to work, doesn't seem to be working
  - Giving permission denied error when trying in the password
  - Will need to go back to SoCo facilities team
  - Will ask them about trying to get more people onto the dev server
- User testing
  - Filip has made a few mock ups of colour schemes on the timetable page
    - Those will be sent off to the two users and Belinda to get their input on what colour schemes they prefer
    - A few different ones will be developed in that kind of realm (e.g. shades, random, etc.)
  - Next week we will start getting actual user testing
  - Ability to change the tutorial room was added last night
  - Remaining changes will be UI changes on the manage timetable page, and ability to go back and edit old timetables (not a priority)
  - Should try to get the manage data page done before testing (this is the page that lists all of the course information)
  - Concern with Firebase at the moment we have daily(?) usage limits that we can quite easily exceed
  - Would be good to the database set up before we start user testing so we don't hit the limits
  - About page? Not implemented at the moment
  - Deliverable: will get them to actually use the front end
  - Backend - going to generate a some schedules that can be sent off to see how well they compare to what they would create
  - Data management page - almost done, will push tonight
- Organise with Belinda about talking with some staff members
  - Technically done - already have the names of 2 staff members (Filip knows)
- Giving documents/images/videos that Belinda wanted
  - Be good to show these artefacts on the GitHub repo
- Audit 2
  - Filip not able to make the morning meeting next week, able to text if needed
  - Ensure team charter and statement of work is fully signed
  - Ensure that we're following up on our reflections
  - Should expand more on the resources and costs section about the server
- Review Hexuan's pull request and merge 
- LDAP authentication
  - Login feature stops you accessing things on the front end without being logged in
  - Seems to be an npm page `https://www.npmjs.com/package/ldap-authentication` which seems to allow you to check if the user is able to log in
  - Need to check for security issues with this!!!
- Branches
  - The two frontend branches are still being used so will not be deleted at the moment
- Shadow team document
  - Shadow team sent a week 3 fortnight report
  - 

## Action Items
- Should expand more on the resources and costs section about the server
- More emphasis on tutors/shadows being stakeholders in the project
- Setup of MongoDB server
- Ensure we have risk register
- Create slideshow for audit, can get it going in the tutorial this week
  - What the project is
  - Setup on GitHub / GitHub projects
  - Project status
    - Server
    - Front end
    - Database
    - Backend
  - Live demonstration   
  - Future plans -> timeline
  - Decision log
  - Reflection log
- Need to let Belinda know we're making some minor changes to the statement of work and get that reapproved
- Need to invite Belinda to the audit
- Need to find a time at the audit
