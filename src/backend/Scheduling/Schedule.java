package Scheduling;

import Courses.Course;
import Courses.CourseTable;
import Rooms.Room;
import Rooms.RoomTable;
import Util.Time;

import java.util.*;

public class Schedule {
    /**
     * The allocations of labs to rooms and times in this particular schedule.
     * Each entry in the array refers to a different room, and they are in index order.
     */
    RoomAllocation[] roomAllocations;

    /**
     * Initialises the `roomAllocations` array by creating each of the objects within it.
     * Must be called before using the rest of the object.
     */
    private void initialiseAllocationArray() {
        roomAllocations = new RoomAllocation[RoomTable.getInstance().totalNumberOfRooms()];
        for (int i = 0; i < roomAllocations.length; ++i) {
            roomAllocations[i] = new RoomAllocation(RoomTable.getInstance().getRoomFromId(i));
        }
    }

    /**
     * Places a lab for a course in a random room. If it is impossible for place a lab in any
     * room, it throws a RuntimeException.
     *
     * @param rng A random number generator.
     * @param course The course which should get a single lab placed
     * @return The number of students who were allocated to that lab.
     */
    private int placeLabRandomly(Random rng, Course course) {
        /*
         * We want to randomly allocate it to a room, but rooms might be too full to fit the lab.
         * Generate all room ids, and then we'll go through them randomly until we find one that
         * fits the lab.
         *
         * If we go through all of them and can't find space, then we can't fit the constraints.
         */
        List<Integer> shuffled = new ArrayList<>();
        for (int i = 0; i < RoomTable.getInstance().totalNumberOfRooms(); ++i) {
            shuffled.add(i);
        }
        Collections.shuffle(shuffled);

        while (!shuffled.isEmpty()) {
            int roomId = shuffled.remove(0);
            Room room = RoomTable.getInstance().getRoomFromId(roomId);
            List<Time> times = roomAllocations[roomId].findFreeTimeOfLength(course.getLengthInMinutes());
            List<Time> lecsTimes = course.lecturesTimeList(course.getLectures());
            times.removeAll(new HashSet<>(lecsTimes));

            if (!times.isEmpty()) {
                Time time = times.get(rng.nextInt(times.size()));
                return roomAllocations[roomId].addAllocation(time, course).getCount();
            }
        }

        throw new RuntimeException("constraints seem impossible to resolve");
    }

    private void placeCourseRandomly(Random rng, int courseId) {
        Course course = CourseTable.getInstance().getCourseFromId(courseId);

        int seatsMadeAvailableSoFar = 0;
        while (seatsMadeAvailableSoFar < course.getNumberOfStudents()) {
            seatsMadeAvailableSoFar += placeLabRandomly(rng, course);
        }
    }

    /**
     * Prints out a schedule to the console for debugging purposes.
     */
    public void print() {
        System.out.print("SCHEDULE: \n");

        for (int day = 0; day < Time.NUM_DAYS; ++day) {
            System.out.printf("\n%14s", "");
            for (int i = 0; i < RoomTable.getInstance().totalNumberOfRooms(); ++i) {
                System.out.printf("%-14s ", RoomTable.getInstance().getRoomNameFromId(i));
            }
            System.out.print("\n");

            for (int time = 0; time < Time.NUM_TIME_INDICES; ++time) {
                System.out.printf("%-7s %02d%02d: ",
                        time == 0 ? Time.Day.fromIndex(day).toString().substring(0, 3).toUpperCase() : "",
                        time / 2 + 8,
                        (time % 2) * 30
                );

                for (int i = 0; i < RoomTable.getInstance().totalNumberOfRooms(); ++i) {
                    Allocation allocation = roomAllocations[i].getAllocations()[day][time];
                    if (allocation == null) {
                        System.out.print("---            ");
                    } else if (allocation.isContinuation()) {
                        System.out.printf("%-8s       ", allocation.getCourse());
                    } else {
                        System.out.printf("%-8s:%-3d   ", allocation.getCourse(), allocation.getCount());
                    }
                }
                System.out.print("\n");
            }
        }
        System.out.print("\n");
        System.out.printf("FREE SPACE: %.2f%%\n", getPercentageFree() * 100);
        System.out.printf("FITNESS: %d\n", getFitness());
    }

    /**
     * Creates a new, random lab schedule.
     */
    public Schedule() {
        initialiseAllocationArray();

        Random rng = new Random();

        for (int i = 0; i < CourseTable.getInstance().getTotalNumberOfCourses(); ++i) {
            placeCourseRandomly(rng, i);
        }
    }

    /**
     * The crossover function. From two existing schedules, it creates a new one that has
     * traits based on the two parents. This is used to create the next generation of solutions.
     * @param a The first parent
     * @param b The second parent
     */
    public Schedule(Schedule a, Schedule b) {
        initialiseAllocationArray();
        Random random = new Random();
        int coursesNumber = CourseTable.getInstance().getTotalNumberOfCourses();
        int[] availableSeats = new int[coursesNumber];
        List<AllocationWithRoomAndTime> allAllocationsA = a.convertScheduleToList();
        List<AllocationWithRoomAndTime> allAllocationsB = b.convertScheduleToList();
        while (!allAllocationsA.isEmpty() || !allAllocationsB.isEmpty()) {
            copyAllocationRandomly(allAllocationsA, availableSeats, random);
            copyAllocationRandomly(allAllocationsB, availableSeats, random);
        }
        for (int i = 0; i < coursesNumber; ++i) {
            Course course = CourseTable.getInstance().getCourseFromId(i);
            int enrolledStudents = course.getNumberOfStudents();
            while (availableSeats[i] < enrolledStudents) {
                availableSeats[i] += placeLabRandomly(random, course);
            }
        }
    }

    /**
     * Helper method for crossover function that copy an allocation from a list of AllocationWithRoomAndTime
     * to the current Schedule randomly.
     * The availableSeats is an array of the number of available seats for each course,
     * which avoids adding allocations for a course more than necessary.
     * Do not use this method elsewhere.
     */
    private void copyAllocationRandomly(List<AllocationWithRoomAndTime> allAllocations, int[] availableSeats, Random random) {
        if (!allAllocations.isEmpty()) {
            int randomNumber = random.nextInt(allAllocations.size());
            AllocationWithRoomAndTime allocation = allAllocations.remove(randomNumber);
            RoomAllocation roomAllocation = roomAllocations[allocation.getRoom().getId()];
            Time time = allocation.getTime();
            Course course = allocation.getCourse();
            int length = course.getLengthInMinutes();
            if (roomAllocation.isTimeAndLengthFree(time, length)) {
                if (availableSeats[course.getId()] < course.getNumberOfStudents()) {
                    /*
                     * TODO: Add a condition that avoids adding an allocation
                     *  that happens at the same time as the lecture
                     */
                    availableSeats[course.getId()] += roomAllocation.addAllocation(time, course).getCount();
                }
            }
        }
    }

    /**
     * Helper method for crossover function that converts a Schedule to a list of AllocationWithRoomAndTime.
     * It returns a list of AllocationWithRoomAndTime that contains
     * all allocations of a schedule (excluding continuing allocation).
     */
    private List<AllocationWithRoomAndTime> convertScheduleToList() {
        List<AllocationWithRoomAndTime> allAllocations = new ArrayList<>();
        for (int roomId = 0; roomId < RoomTable.getInstance().totalNumberOfRooms(); ++roomId) {
            Room room = RoomTable.getInstance().getRoomFromId(roomId);
            for (int dayIndex = 0; dayIndex < Time.NUM_DAYS; ++dayIndex) {
                for (int timeIndex = 0; timeIndex < Time.NUM_TIME_INDICES; ++timeIndex) {
                    Time.Day day = Time.Day.fromIndex(dayIndex);
                    Time time = new Time(day, timeIndex);
                    Allocation allocation = roomAllocations[roomId].getAllocations()[dayIndex][timeIndex];
                    if (allocation != null && !allocation.isContinuation()) {
                        Course course = allocation.getCourse();
                        int count = allocation.getCount();
                        allAllocations.add(new AllocationWithRoomAndTime(course, count, false, room, time));
                    }
                }
            }
        }
        return allAllocations;
    }

    /**
     * The mutation function. Makes a small, random change (in place) to the schedule.
     * This is used to try to explore different solutions and find slight improvements.
     */
    public void mutate() {
        Random random = new Random();
        List<AllocationWithRoomAndTime> allAllocations = convertScheduleToList();
        int randomNumber = random.nextInt(allAllocations.size());
        AllocationWithRoomAndTime allocation = allAllocations.get(randomNumber);
        int roomId = allocation.getRoom().getId();
        Time startTime = allocation.getTime();
        Course course = allocation.getCourse();
        roomAllocations[roomId].removeAllocation(startTime);

        List<Time> times = roomAllocations[roomId].findFreeTimeOfLength(course.getLengthInMinutes());

        /*
         * TODO: remove any times that clash with lectures
         */

        if (!times.isEmpty()) {
            Time time = times.get(random.nextInt(times.size()));
            roomAllocations[roomId].addAllocation(time, course);
        }
    }

    /**
     * Calculates the percentage of time that is free across all rooms. This is given by the number of
     * half-hour blocks taken up by labs (across all rooms), divided by the total number of half-hour
     * blocks (across all rooms).
     *
     * @return The percentage free as a value from 0 to 1, where 0 is all half-hour blocks across the school
     * are used, and 1 being that nothing is scheduled.
     */
    public double getPercentageFree() {
        int totalSlots = Time.NUM_DAYS * Time.NUM_TIME_INDICES * RoomTable.getInstance().totalNumberOfRooms();
        int totalUsed = 0;

        for (RoomAllocation allocation: roomAllocations) {
            for (int day = 0; day < Time.NUM_DAYS; ++day) {
                for (int time = 0; time < Time.NUM_TIME_INDICES; ++time) {
                    if (allocation.getAllocations()[day][time] != null) {
                        totalUsed++;
                    }
                }
            }
        }

        /*
         * The `totalUsed / totalSlots` calculation gives the percentage of time used,
         * but we need to negate it to get free time.
         */
        return 1 - (double) totalUsed / (double) totalSlots;
    }

    /**
     * Calculates the fitness value for the current schedule. The fitness value should be
     * deterministic, and higher values indicate a better schedule.
     *
     * @return The fitness value (should be non-negative).
     */
    public int getFitness() {
        double freeSpace = getPercentageFree();

        /*
         * TODO: things that could be considered here are:
         *  - tutor workload (how many back-to-back tutorials?)
         *  - gaps in the day for e.g. drop ins to happen, or for people to study (but not too many!)
         *  - having classes spread throughout the week for variety (e.g. ideally on all days)
         *  - having most classes during e.g. 10am-4pm
         *  - having options for early and late classes for people who, e.g. might have commitments during the day
         *  - room utilisation (already taken care of in the 'freeSpace' variable)
         *  - the number of labs of the same class that runs at the same time
         *      -> generally may want to minimise to increase options for students
         *      -> might *not* want to for really popular times though
         *  - the number of other labs for other classes that run at that time (i.e. minimise clashes)
         *  - having back-to-back labs in the same room (e.g. to save tutors with back-to-back classes walking)
         *  - convener preferences
         *  - at least one room free in each time slot
         *  - even utilisation of all rooms?
         */

        return (int) (
                freeSpace * 10000
                /* TODO: more things go in here later on... */
        );
    }
}
