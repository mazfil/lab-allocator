package Courses;

/**
 * Stores a static table of information about all of the courses.
 * Can be used to look up courses via their course code.
 */
public class CourseTable {
    static private CourseTable instance = null;
    private Course[] courses;

    private CourseTable() {
        /*
         * TODO: here is where we would load in the data from the disk, database, etc.
         */

        /*
         * TODO: initialise `courses`
         */
    }

    public int getTotalNumberOfCourses() {
        return courses.length;
    }

    public Course getCourseFromId(int id) {
        return courses[id];
    }

    public int getCourseIdFromCode(String courseCode) {
        /*
         * TODO: !
         */
        throw new RuntimeException("Not implemented!");
    }

    static public CourseTable getInstance() {
        if (instance == null) {
            instance = new CourseTable();
        }
        return instance;
    }
}
