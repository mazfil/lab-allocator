package Scheduling;

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
     * @param allocation The class to be allocated, and the number of students to allocate.
     */
    public void addAllocation(Time time, Allocation allocation) {
        int labLengthChunks = allocation.getCourse().getLengthInMinutes() / 30;
        timeAllocations[time.getDay().getIndex()][time.getIndex()] = allocation;

        /*
         * Nearly all classes take up more than half an hour, and so we need to block out
         * any further 30-minute chunks.
         */
        for (int i = 1; i < labLengthChunks; ++i) {
            timeAllocations[time.getDay().getIndex()][time.getIndex() + i] = new Allocation(allocation.getCourse(), 0);
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
}
