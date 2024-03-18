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
         * TODO: remove this later
         */
        courses = new Course[3];
        for (int i = 0; i < 3; ++i) {
            courses[i] = new Course(i);
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
            System.out.printf("%s: students = %d, tutors = %d (ratio 1:%d)\n",
                    course.toString(),
                    course.getNumberOfStudents(),
                    course.getNumberOfTutors(),
                    course.getTutorRatio()
            );
        }
    }

    public String getCourseCodeFromId(int id) {
        if (id == 0) {
            return "COMP1100";
        } else if (id == 1) {
            return "COMP2100";
        } else {
            return "COMP2300";
        }
    }

    public int getCourseIdFromCode(String courseCode) {
        /*
         * TODO: implement this properly!
         */

        if (courseCode.equals("COMP1100")) {
            return 0;
        } else if (courseCode.equals("COMP2100")) {
            return 1;
        } else {
            return 2;
        }
    }

    static public CourseTable getInstance() {
        if (instance == null) {
            instance = new CourseTable();
        }
        return instance;
    }
}
