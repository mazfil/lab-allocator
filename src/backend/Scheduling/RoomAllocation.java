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

    public void addAllocation(Time time, Allocation allocation) {
        int labLengthChunks = allocation.getCourse().getLengthInMinutes() / 30;
        timeAllocations[time.getDay().getIndex()][time.getIndex()] = allocation;
        for (int i = 1; i < labLengthChunks; ++i) {
            timeAllocations[time.getDay().getIndex()][time.getIndex() + i] = new Allocation(allocation.getCourse(), 0);
        }
    }

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
}
