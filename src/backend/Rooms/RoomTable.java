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
         * TODO: initialise `rooms`
         */
    }

    public int totalNumberOfRooms() {
        return rooms.length;
    }

    public Room getRoomFromId(int id) {
        return rooms[id];
    }

    public Room getRoomFromName(String name) {
        /*
         * TODO: !
         */
        return null;
    }

    static public RoomTable getInstance() {
        if (instance == null) {
            instance = new RoomTable();
        }
        return instance;
    }
}
