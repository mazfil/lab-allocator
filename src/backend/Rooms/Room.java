package Rooms;

public class Room {
    int maxCapacity;
    int id;
    String name;

    public int getMaxCapacity() {
        return maxCapacity;
    }

    Room(int id, int maxCapacity, String name) {
        this.id = id;
        this.maxCapacity = maxCapacity;
        this.name = name;
    }

    @Override
    public String toString() {
        return String.format("%s (%d)", name, maxCapacity);
    }
}
