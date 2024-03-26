package Scheduling;

import Courses.Course;
import Rooms.Room;
import Util.Time;

import java.util.ArrayList;
import java.util.List;

/**
 * The allocation for a particular room. Contains an array of allocations for each
 * day and time in this room.
 */
public class RoomAllocation {
    /**
     * The room this allocation is for.
     */
    Room room;

    /**
     * The allocations at each day and time throughout the week in this room. Accessed as follows:
     * timeAllocations[day][timeIndex], where day is from 0-4, and timeIndex is 0 at 8am, and increases by
     * one every half hour.
     */
    Allocation[][] timeAllocations;

    /**
     * Given a room, constructs a blank allocation for it (with nothing scheduled).
     */
    public RoomAllocation(Room room) {
        this.room = room;

        timeAllocations = new Allocation[Time.NUM_DAYS][];
        for (int i = 0; i < Time.NUM_DAYS; ++i) {
            timeAllocations[i] = new Allocation[Time.NUM_TIME_INDICES];
        }
    }

    /**
     * @return the allocations in this room throughout the week. Accessed the same as `timeAllocations`.
     */
    public Allocation[][] getAllocations() {
        return timeAllocations;
    }

    /**
     * @return the room these allocations refer to
     */
    public Room getRoom() {
        return room;
    }

    /**
     * Allocates a class to this room allocation.
     *
     * @param time The time where the class should go. The day should be set (i.e. not `Day.Irrelevant`).
     * @param course The class to be allocated.
     * @return The allocation for the first 30 minute block of the lab
     */
    public Allocation addAllocation(Time time, Course course) {
        int labLengthChunks = course.getLengthInMinutes() / 30;
        int count = Math.min(course.getMaximumClassSize(), room.getMaxCapacity());
        Allocation initialAllocation = new Allocation(course, count, false);
        timeAllocations[time.getDay().getIndex()][time.getIndex()] = initialAllocation;

        /*
         * Nearly all classes take up more than half an hour, and so we need to block out
         * any further 30-minute chunks.
         */
        for (int i = 1; i < labLengthChunks; ++i) {
            timeAllocations[time.getDay().getIndex()][time.getIndex() + i] = new Allocation(course, count, true);
        }

        return initialAllocation;
    }

    /**
     * Remove a lab in this room which starts at the given time.
     *
     * @param startTime The start time of an existing lab
     */
    public void removeAllocation(Time startTime) {
        int day = startTime.getDay().getIndex();
        int time = startTime.getIndex();
        if (timeAllocations[day][time] == null || timeAllocations[day][time].isContinuation()) {
            throw new RuntimeException("To remove a lab, must give the start time of an existing lab");
        }
        timeAllocations[day][time] = null;
        int i = 1;
        while (time + i < Time.NUM_TIME_INDICES && timeAllocations[day][time + i] != null && timeAllocations[day][time + i].isContinuation()) {
            timeAllocations[day][time + i] = null;
            i++;
        }
    }

    /**
     * Produces a list of all the times throughout the week where a lab of a given length could
     * be scheduled in this room without clashing with anything else.
     *
     * @param minutes The length the lab goes for. Must be a multiple of 30.
     * @return A list containing all possible times the lab could be scheduled in this room.
     */
    List<Time> findFreeTimeOfLength(int minutes) {
        if (minutes % 30 != 0) {
            throw new RuntimeException("minutes % 30 != 0");
        }

        ArrayList<Time> times = new ArrayList<>();

        int chunks = minutes / 30;

        for (int day = 0; day < Time.NUM_DAYS; ++day) {
            for (int time = 0; time < Time.NUM_TIME_INDICES - chunks + 1; ++time) {
                boolean free = true;
                for (int i = 0; i < chunks; ++i) {
                    if (timeAllocations[day][time + i] != null) {
                        free = false;
                        break;
                    }
                }
                if (free) {
                    times.add(new Time(Time.Day.fromIndex(day), time));
                }
            }
        }

        return times;
    }

    /**
     * Given a start time and length in minutes, return if that period is free.
     *
     * @param time The start time of a lab
     * @param minutes The length of the lab
     * @return If the duration is free
     */
    public boolean isTimeAndLengthFree(Time time, int minutes) {
        if (minutes % 30 != 0) {
            throw new RuntimeException("minutes % 30 != 0");
        }
        int chunks = minutes / 30;
        boolean free = true;
        int day = time.getDay().getIndex();
        int timeIndex = time.getIndex();
        for (int i = 0; i < chunks; ++i) {
            if (timeIndex + i >= Time.NUM_TIME_INDICES || timeAllocations[day][timeIndex + i] != null) {
                free = false;
                break;
            }
        }
        return free;
    }
}
