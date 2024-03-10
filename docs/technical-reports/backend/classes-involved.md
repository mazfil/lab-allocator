
# Rooms
There are various classes which handle the different rooms around the school.

## Room
The `Room` object stores data about a particular room. 
For instance, the capacity of the room, and the equipment it has.
`Room`s have an associated ID which can be used to look them up.
Note that only static information about a room is stored here - it does not contain any schedules.

## RoomTable
The RoomTable is a singleton, which acts as a lookup table for getting a `Room` object.

# Courses
A course is a subject taught at the School of Computing (e.g. COMP1130, COMP2400).

## Course
...

## CourseTable
...

# Util
## Time
...

# Scheduling
## Schedule
...

## RoomAllocation
A `RoomAllocation` stores a possible schedule for a particular room.
It consists of a timetable of `Allocations` for the entire week.

## Allocation
An `Allocation` stores what class will run at a particular time, in a particular room, 
and how many of those labs will run simultaneously at that time and place.