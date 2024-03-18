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

    public Allocation[][] getAllocations() {
        return timeAllocations;
    }

    public Room getRoom() {
        return room;
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

        ArrayList<Time> times = new ArrayList<>();

        int chunks = minutes / 30;

        for (int day = 0; day < Time.NUM_DAYS; ++day) {
            // TODO: ensure not off by one here
            boolean free = true;
            for (int time = 0; time < Time.NUM_TIME_INDICES - chunks; ++time) {
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
}
