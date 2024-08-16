This guide explains how to use the "timetable preferences"* settings, which customises the timetable output.

*(whatever this ends up being called within the UI)

In order to decide how "good" a timetable is, the program considers a list of preferences. For each of these preferences, you can decide how strongly it should be considered (if at all), by setting the importance to "off", "low", "medium", or "high". By default, all preferences are set to "medium" importance.
The list of preferences are:
- Free Space: Attempts to create as much free space, over all timeslots, as possible.
- Date Variance: Attempts to spread out classes among all days of the week as perfectly as possible. (This only considers the date, not the time).
- Room Variance: Attempts to spread out classes among all rooms as perfectly as possible.
- Reduce Dupes: Attempts to reduce duplicates. A duplicate is when one class has two labs running simultaneously.
- Always Free Room: Attemps to leave one room free at all times.
- Repeat Labs Same Room: If two labs of the same class are adjacent in time, attempts to place them in the same room.
- As for time of day, you are allowed to specify that a certain percentage of classes should be before, between, and after certain times. You can define what these percentages are, and what these times are. By default, it is set to place 15% of labs before 10a, 15% after 4p, and 70% in between.

Note that setting these preferences does not guarantee that the final timetable will adhere perfectly to them - there are too many preferences for it to do so, hence the phrase "attempts to" in the preference explanations. It is much more likely to perfectly get preferences which are set to a higher priority than other preferences. For the best effect, you shouldn't have too many preferences set to a "high" priority - the importance is the difference between them.

TODO: add screenshots for each preference showing what happens if you turn that preference to high and all other preferences off. Also show a few screenshots using a suite of preferences set in a way that the client might actually set them.
