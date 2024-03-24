package Scheduling;

import Courses.Course;
import Rooms.Room;
import Util.Time;

/**
 * This class is a workaround for implementing the crossover method more easily by
 * converting a Schedule to a list of Allocation with the room and time associated to it.
 * May delete this class completely if having those additional fields in class Allocation.
 */
public class AllocationWithRoomAndTime extends Allocation{
    private final Room room;
    private final Time time;
    AllocationWithRoomAndTime(Course course, int count, boolean continuation, Room room, Time time) {
        super(course, count, continuation);
        this.room = room;
        this.time = time;
    }
    public Room getRoom() {
        return room;
    }

    public Time getTime() {
        return time;
    }
}
