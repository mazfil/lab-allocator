# Team Meeting #2 - 5/8/2024

*Meeting Minutes by Alex Boxall*

## Attendance (6/7):

- [X] Alex Boxall
- [X] Hexuan Meng
- [X] Filip Mazur
- [X] Edward Nivison
- [ ] Rachel Cao
- [X] Sineeha Kodwani
- [X] Matthew Cawley

## Agenda
- Check everything ready for audit
- What work being done over this week
- ANU server updates
- Meeting with Belinda
- Which database
- Setting up computer?

## Content from the meeting
- Audit
  - Will continue to use GitHub issues and projects for management of tasks
  - Team charter - Matthew said would look into working on it last week - will check with him
  - Statement of work now on GitHub - Belinda said the draft version is all good, just need to have the final one approved
  - Filip already sent that to Belinda for approval
  - Edward working on reflection log
  - Got risk management on landing page
  - Landing page has been shared with the other teams (added to spreadsheet)
  - Will add the visual project schedule to the landing page
  - Filip to send off the landing page to the tutor to ensure shadow team has a copy
  - Matthew to look at team charter from last semester and see if anything needs to be changed
- Work being done over this week
  - Filip
    - Updating the client log
    - Making a change to the front end to add the ability to change lab room
    - Tutor/shadow team communication
    - Look into both MySQL and MongoDB to see if it is feasible for front end
  - Edward
    - Reflection log
    - Checklist for what to fill out when working
    - Talking to ANU about getting server
  - Alex
    - Writing documention for setting up the backend
    - Start looking at working on features on backend
    - Look into both MySQL and MongoDB to see if it is feasible for back end
  - Matthew
    - Look at previous team charter and see if anything needs updating
    - Start looking at working on features on backend
  - Hexuan
    - Start looking at working on features on backend
  - Sineeha
    - Continue working on the frontend UI
- Server updates
  - Strongly prefer Linux (Debian)
  - They can assist setting it up
  - No particular documentation from the ANU
  - Should try to use https
    - Using node should allow us to use https on the front end
    - Backend should (?) support it but it will probably be running on the same server anyway
    - https tested to work
  - ANU team already has setup for certain databases - no Firebase
    - PostgreSQL, MySQL, NoSQL, Redis
- Setting up computer for development
  - Should get IntelliJ if doing backend development work
- GitHub issues
  - Front end has previously put checklists within issues - will now just make separate issues for each 
- Database schema
  - Was already developed, Matthew to send to us so we can see if it still meets requirements
- Meeting with Belinda
  - Need to give Belinda screenshots of the project to demonstrate progress
  - Get the statement of work signed
- Choice of database
  - Database should work using an SQL database
  - MySQL only needs one dependency in Javascript
  - Java has JDBC libraries for both
  - Could also use MongoDB to reduce the amount of work that has to be done/rewritten
  
## Action items:
- Move decision log items across from meeting minutes last week to decision log

## Reflection
- Checklists in GitHub issues makes it difficult to work on issue - easier if it was just split up into multiple issues

## Decisions:
- Won't put checklists within GitHub issues
  - Makes it easier to understand and work on the issue when there's not a huge list of updates that need to be done.
  - We'll now make separate isseus for each
- Will use HTTPS instead of HTTP
  - As required by the ANU team
  - Frontend works already with HTTPS
  - Backend doesn't matter too much as will be running on the same server
  - Database will need to work with HTTPS as frontend code on client browser will need to access database separately (as frontend code accesses database)
- Removed the "flow on effects" requirement from the statement of work - as on the front end you cannot drag classes to one that is already there

