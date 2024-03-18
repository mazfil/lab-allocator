package Rooms;

public class Room {
    int maxCapacity;
    int id;

    public int getMaxCapacity() {
        return maxCapacity;
    }

    Room(int id, int maxCapacity) {
        this.id = id;
        this.maxCapacity = maxCapacity;
    }

    @Override
    public String toString() {
        return RoomTable.getInstance().getRoomNameFromId(id);
    }

    // TODO: ...
}
