package Scheduling;

import Courses.Course;
import Courses.CourseTable;
import Rooms.RoomTable;
import Util.Time;

import java.util.List;
import java.util.Random;

public class Schedule {
    /*
     * TODO: some data fields
     */

    /**
     * The allocations of labs to rooms and times in this particular schedule.
     * Should be accessed as follows: allocations[roomId][timeIndex].courseId = ...;
     * Internally, most the program should already be using roomId and timeIndexes.
     * However, as an example for how you can generate them yourself from a human-readable
     * format:
     *      allocations[RoomTable.getInstance().getRoomFromName("HN1.24")][new Time(8, 30).getIndex()]
     * A null entry means nothing is scheduled at that time.
     * TODO: work out how to do 'continuing entries' properly... use sentinel value? subclassing might be overkill...
     */
    RoomAllocation[] roomAllocations;

    private void initialiseAllocationArray() {
        roomAllocations = new RoomAllocation[RoomTable.getInstance().totalNumberOfRooms()];
        for (int i = 0; i < roomAllocations.length; ++i) {
            roomAllocations[i] = new RoomAllocation(RoomTable.getInstance().getRoomFromId(i));
        }
    }

    private void placeCourseRandomly(Random rng, int courseId) {
        Course course = CourseTable.getInstance().getCourseFromId(courseId);

        for (int i = 0; i < course.getNumberOfLabs(); ++i) {
            while (true) {
                int roomId = rng.nextInt(RoomTable.getInstance().totalNumberOfRooms());
                List<Time> times = roomAllocations[roomId].findFreeTimeOfLength(course.getLengthInMinutes());
                if (times.isEmpty()) {
                    continue;
                }
                Time time = times.get(rng.nextInt(times.size()));
                int count = roomAllocations[roomId].getMaxLabsPerTutorRatio(course);
                roomAllocations[roomId].addAllocation(time, new Allocation(course, count));
                break;
            }
        }
    }

    /**
     * Creates a new, random lab schedule.
     */
    public Schedule() {
        initialiseAllocationArray();

        /*
         * TODO: fill in with random values...
         */

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

        /*
         * TODO: do a crossover operation...
         */
    }

    /**
     * The mutation function. Makes a small, random change (in place) to the schedule.
     * This is used to try to explore different solutions and find slight improvements.
     */
    public void mutate() {
        /*
         * TODO:
         */
    }

    /**
     * Calculates the fitness value for the current schedule. The fitness value should be
     * deterministic, and higher values indicate a better schedule.
     * @return The fitness value (should be non-negative).
     */
    public int getFitness() {
        /*
         * TODO:
         */
        return 0;
    }
}
