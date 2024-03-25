package Scheduling;

import Courses.Course;
import Rooms.Room;
import Util.Time;

import java.util.ArrayList;
import java.util.List;

/**
 * The allocation for a particular room. Contains an array of allocations for each
 * time in this room.
 */
public class RoomAllocation {
    Room room;
    Allocation[][] timeAllocations;

    public RoomAllocation(Room room) {
        this.room = room;

        timeAllocations = new Allocation[Time.NUM_DAYS][];
        for (int i = 0; i < Time.NUM_DAYS; ++i) {
            timeAllocations[i] = new Allocation[Time.NUM_TIME_INDICES];
        }
    }

    public int getMaxLabsPerTutorRatio(Course course) {
        /*
         * Add `course.getTutorRatio() - 1` to cause it to 'round up' the calculation of
         * `room.getMaxCapacity() / course.getTutorRatio()`
         */
        return (room.getMaxCapacity() + course.getTutorRatio() - 1) / course.getTutorRatio();
    }

    public void addAllocation(Time time, Allocation allocation) {
        timeAllocations[time.getDay().getIndex()][time.getIndex()] = allocation;
        /*
         * TODO: probably need to mark further times where the lab is still running...
         */
    }

    List<Time> findFreeTimeOfLength(int minutes) {
        if (minutes % 30 != 0) {
            throw new RuntimeException("minutes % 30 != 0");
        }

        return new ArrayList<>();
    }
}
