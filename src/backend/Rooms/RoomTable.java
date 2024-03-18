package Rooms;

/**
 * Stores a static table of information about all of the courses.
 * Can be used to look up courses via their course code.
 */
public class RoomTable {
    static private RoomTable instance = null;
    private Room[] rooms;

    private RoomTable() {
        /*
         * TODO: here is where we would load in the data from the disk, database, etc.
         */

        /*
         * TODO: remove this later.
         */

        rooms = new Room[2];
        for (int i = 0; i < 2; ++i) {
            rooms[i] = new Room(i, (i + 1) * 30);
        }
    }

    public int totalNumberOfRooms() {
        return rooms.length;
    }

    public Room getRoomFromId(int id) {
        return rooms[id];
    }

    public String getRoomNameFromId(int id) {
        if (id == 0) {
            return "HN1.23";
        } else {
            return "N114";
        }
    }

    public Room getRoomFromName(String name) {
        /*
         * TODO: fix this later.
         */
        if (name.equals("HN1.23")) {
            return rooms[0];
        } else {
            return rooms[1];
        }
    }

    static public RoomTable getInstance() {
        if (instance == null) {
            instance = new RoomTable();
        }
        return instance;
    }
}
