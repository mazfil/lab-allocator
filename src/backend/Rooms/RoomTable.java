package Rooms;

/**
 * Stores a static table of information about all of the courses.
 * Can be used to look up courses via their course code.
 */
public class RoomTable {
    static private RoomTable instance = null;
    private final Room[] rooms;

    private RoomTable() {
        /*
         * TODO: later on we might want this to be loaded from disk/database, etc.
         */

        rooms = new Room[]{
            new Room(0, 40, "HN1.23"),      /* Make Room! */
            new Room(1, 40, "HN1.24"),      /* Make Room! */
            new Room(2, 23, "N109"),
            new Room(3, 29, "N111"),
            new Room(4, 26, "N112"),
            new Room(5, 26, "N113"),
            new Room(6, 26, "N114"),
            new Room(7, 61, "N115/6"),
        };
    }

    public int totalNumberOfRooms() {
        return rooms.length;
    }

    public Room getRoomFromId(int id) {
        return rooms[id];
    }

    public String getRoomNameFromId(int id) {
        return rooms[id].toString();
    }

    static public RoomTable getInstance() {
        if (instance == null) {
            instance = new RoomTable();
        }
        return instance;
    }
}
