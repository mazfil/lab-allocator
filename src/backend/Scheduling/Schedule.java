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
     * A null entry means nothing is scheduled at that time. All classes go for at least an hour,
     * so further 30 minute chunks will be set to an allocation with the course, but with the student
     * count set to zero.
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
            int timeout = 0;
            while (true) {
                if (++timeout > 10000) {
                    System.out.print(
                            """
                            Uh-oh, it looks like it might be impossible to satisfy the given constraints.
                            This may be because there are too few tutors for the amount of students, meaning
                            lots of labs are required - but they don't all fit!
                            """);

                    throw new RuntimeException("constraints seem impossible to resolve");
                }
                int roomId = rng.nextInt(RoomTable.getInstance().totalNumberOfRooms());
                Room room = RoomTable.getInstance().getRoomFromId(roomId);
                List<Time> times = roomAllocations[roomId].findFreeTimeOfLength(course.getLengthInMinutes());
                if (times.isEmpty()) {
                    continue;
                }
                // TODO: remove any times that clash with lectures
                Time time = times.get(rng.nextInt(times.size()));
                int count = Math.min(course.getMaximumClassSize(), room.getMaxCapacity());
                roomAllocations[roomId].addAllocation(time, new Allocation(course, count));
                spacesAvailable += count;
                break;
            }
        }
    }

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
                    } else if (allocation.getCount() == 0) {
                        System.out.printf("%-8s       ", allocation.getCourse());
                    } else {
                        System.out.printf("%-8s:%-3d   ", allocation.getCourse(), allocation.getCount());
                    }
                }
                System.out.print("\n");
            }
        }
        System.out.print("\n");
        System.out.printf("UTILISATION (TRY TO MINIMISE THIS!): %.2f%%\n", getUtilisation() * 100);
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

    public double getUtilisation() {
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

        return (double) totalUsed / (double) totalSlots;
    }

    /**
     * Calculates the fitness value for the current schedule. The fitness value should be
     * deterministic, and higher values indicate a better schedule.
     * @return The fitness value (should be non-negative).
     */
    public int getFitness() {
        /*
         * TODO: things that could be considered here are:
         *  - tutor workload (how many back-to-back tutorials?)
         *  - gaps in the day for e.g. drop ins to happen, or for people to study (but not too many!)
         *  - having classes spread throughout the week for variety (e.g. ideally on all days)
         *  - having most classes during e.g. 10am-4pm
         *  - having options for early and late classes for people who, e.g. might have commitments during the day
         *  - room utilisation
         *  - the number of labs of the same class that runs at the same time
         *      -> generally may want to minimise to increase options for students
         *      -> might *not* want to for really popular times though
         *  - the number of other labs for other classes that run at that time (i.e. minimise clashes)
         *  - having back-to-back labs in the same room (e.g. to save tutors with back-to-back classes walking)
         *  - convener preferences
         *  - even utilisation of all rooms?
         */
        return (int) (10000.0 / getUtilisation());
    }
}
