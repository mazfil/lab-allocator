# Timetable Preferences and the Fitness Function
 This file outlines the preferences that the user can input for the timetable. The genetic algorithm will take these into account when it calculates a timetable's fitness.
 There are (currently) 9 functions it calculates, each of which output a value between 0 and 1000 (for those that output 'percentage', it is still scaled between 0 and 1000):
 
 1. `freeSpace` - the percentage of timeblocks where no tutorial is scheduled.
 2. `betweenTimes` - aims to get a certain percentage of classes between two times, all variables defined by the user:
    a. `startTimePreference`
    b. `endTimePreference`
    c. `desiredTimeBetween`
3. `earlyOpts` - aims to get a certain percentage of classes before a certain time, variables defined by the user:
    a. `beforeTimePreference`
    b. `desiredPercentBefore`
4. `lateOpts` - aims to get a certain percentage of classes after a certain time, variables defined by the user:
    a. `afterTimePreference`
    b. `desiredPercentAfter`
5. `dateVariance` - the variance in the number of classes per day, done for each class and averaged
6. `roomVariance` - the variance in the number of classes per room, done for each day and averaged
7. `reduceDupes` - the percentage of classes that are NOT dupes
8. `alwaysFreeRoom` - the percentage of times for which there is at least one free room
9. `repeatLabsSameRoom` - the percentage of repeat labs that are in the same room

The user can choose, for each of these functions, how much the algorithm should consider it, by choosing off, low, medium, high, or default.
These are doubles (currently set to 0, 0.5, 1, 1.5, 1) that each respective function's output is scaled by - the output of the fitness function is the sum of these scaled values.
They are stored in the `preferences` record.
These values are specific to each function, and we can still finetune them. They are all currently set to default.
Something else to consider would be making it possible to set different preferences for each course.

As a summary, the user preferences include the `preferences` record and the variables of the functions (i.e. those that are indented above).
