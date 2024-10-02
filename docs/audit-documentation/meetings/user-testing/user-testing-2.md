02/10/2024 - Belinda Bergin - Client - 09:00

- Should make the list of course in manage data sorted. Or show newly made courses with a different hue or something.
- Automatically remove comp when saving the course.
- Was too fast and didn't show anything that said that it was done and added.
- If you press delete course, it caused a timeout with the server on Alex's computer.
- Add a deselect/select all button for the manage timetable for the rooms.
- Make the filter course dropdown sorted so it is easy to find course numbers.
- Having the select all helps because if you are filtering by one course, you have to reselect all the rooms again if you want to view all the rooms for one course.
- When changing rooms, there are room sizes. You need to check that and warn the user that they might need to make a second room or second tutorial.
- When changing the rooms for a lab, it should warn saying that the rooms overlap with another lab. In our testing, there are two labs that are in the same room at the same time frame.
- Maybe when changing the room, we change the colour of the buttons that would overlap with another lab. For example, you have two labs at the same time, but are currently at two different locations. One is N113, and one is N112. You want to change the room location of the N113 lab, when viewing the rooms to change to, it should block out, or change the colour to red, for the room N112. Saying that it is occupied at that time, they can still change it but there should be a warning saying that there are two labs in the same room at the same time.
- First drag and drop for manage timetable didn't work. It could be user error. Just try and recreate it, if we can't recreate it, wait for it to happen again.
- Have some sort of indicator that the algorithm is running on all the pages. This is so they don't press it over and over again.
- Have a timeout in the backend that won't accept multiple presses of generate the algorithm.
- Have some warnings throughout the process of the program.

- When allocating, try not to leave 30min gaps in rooms, so either leave no gap, or leave an hour or two for drop-ins, but make that low priority to leave a big gap, because it is best to have the rooms used.
- If a room has 3 or 4 half hour gaps, they could all be moved to give a new free slot.
- You can move the courses to 8:00pm to 10:00pm, that should not be happening.

- When exporting the csv, move the start and end time to be next to each other column-wise
- We don't need the id and colour columns in the export.
- When dragging the courses around, you can only drag them to the left, not to the right of the day.
- If you move things around on the manage timetable and then change pages, it does not save, that is fine, but there should be an interrupt that tells the user that they have unsaved work.
- there is an inconsistency with the start and end times where the exported data (at least that is where we can see it) have the time in either HH:MM or HH:MM:SS.

FAQs
- If changes that are dragged are saved.
- Can you overwrite the course, yes you will be able to move labs to the same room, but you will be given a warning about it.
- Can I move to a smaller room. Yes but you will receive a warning.
- Can I edit anything in the algorithm such as the fitness function. No you cannot, however there is supporting documentation in the Github (link) where you can edit it manually, however it should be done by someone with technical knowledge in coding and programming.
