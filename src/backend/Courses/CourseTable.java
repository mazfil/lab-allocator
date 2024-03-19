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

        String[] courseCodes = new String[] {
                "COMP1100", "COMP1140", "COMP2100", "COMP2120",
                "COMP2400", "COMP3600"
        };

        courses = new Course[courseCodes.length];
        for (int i = 0; i < courses.length; ++i) {
            courses[i] = new Course(i, courseCodes[i]);
        }
    }

    public int getTotalNumberOfCourses() {
        return courses.length;
    }

    public Course getCourseFromId(int id) {
        return courses[id];
    }

    public void print() {
        for (Course course: courses) {
            System.out.printf("%s: students = %d, tutors = %d (required ratio 1:%d)\n",
                    course.toString(),
                    course.getNumberOfStudents(),
                    course.getNumberOfTutors(),
                    course.getTutorRatio()
            );
        }
    }

    static public CourseTable getInstance() {
        if (instance == null) {
            instance = new CourseTable();
        }
        return instance;
    }
}
