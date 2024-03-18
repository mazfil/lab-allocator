package Scheduling;

import Courses.Course;
import Courses.CourseTable;
import Rooms.Room;
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
        int spacesAvailable = 0;
        while (spacesAvailable < course.getNumberOfStudents()) {
            while (true) {
                int roomId = rng.nextInt(RoomTable.getInstance().totalNumberOfRooms());
                Room room = RoomTable.getInstance().getRoomFromId(roomId);
                List<Time> times = roomAllocations[roomId].findFreeTimeOfLength(course.getLengthInMinutes());
                if (times.isEmpty()) {
                    continue;
                }
                Time time = times.get(rng.nextInt(times.size()));
                int count = Math.min(course.getMaximumClassSize(), room.getMaxCapacity());
                roomAllocations[roomId].addAllocation(time, new Allocation(course, count));
                spacesAvailable += count;
                break;
            }
        }
    }

    public void print() {
        System.out.printf("SCHEDULE: \n%14s", "");
        for (int i = 0; i < RoomTable.getInstance().totalNumberOfRooms(); ++i) {
            System.out.printf("%-12s ", RoomTable.getInstance().getRoomNameFromId(i));
        }
        System.out.printf("\n");

        for (int day = 0; day < Time.NUM_DAYS; ++day) {
            for (int time = 0; time < Time.NUM_TIME_INDICES; ++time) {
                System.out.printf("%-7s %02d%02d: ",
                        time == 0 ? Time.Day.fromIndex(day).toString().substring(0, 3).toUpperCase() : "",
                        time / 2 + 8,
                        (time % 2) * 30
                );

                for (int i = 0; i < RoomTable.getInstance().totalNumberOfRooms(); ++i) {
                    Allocation allocation = roomAllocations[i].getAllocations()[day][time];
                    if (allocation == null) {
                        System.out.printf("---          ");
                    } else {
                        System.out.printf("%-8s:%-3d ", allocation.getCourse().toString(), allocation.getCount());
                    }
                }
                System.out.printf("\n");
            }
            System.out.printf("\n");
        }

        /*
        System.out.printf("               M 0800   M 0830   M 0900   \n");
        for (RoomAllocation allocation: roomAllocations) {
            System.out.printf("Room %-8s: %s\n", allocation.getRoom().toString(), allocation.toString());
        }
        */

        /*
        StringBuilder sb = new StringBuilder();

        for (int day = 0; day < Time.NUM_DAYS; ++day) {
            for (int time = 0; time < Time.NUM_TIME_INDICES; ++time) {
                Allocation allocation = timeAllocations[day][time];
                if (allocation == null) {
                    sb.append("---      ");
                } else {
                    sb.append(String.format("%-8s " , allocation.getCourse().toString()));
                }
            }
        }

        return sb.toString();
         */
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
