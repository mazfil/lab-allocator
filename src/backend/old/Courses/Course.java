package Courses;

import Util.Time;

import java.util.List;

public class Course {
    class Lecture {
        Time startTime;

        /**
         * Rounded up to nearest multiple of 30 minutes.
         */
        int lengthMinutes;
    }

    List<Lecture> lectures;

    String courseCode;

    int labLengthMinutes;
    int numStudents;
    int numTutors;
    int tutorRatio;
    int id;

    public int getMaximumClassSize() {
        return numTutors * tutorRatio;
    }

    public int getNumberOfStudents() {
        return numStudents;
    }

    public int getNumberOfTutors() {
        return numTutors;
    }

    public int getTutorRatio() {
        return tutorRatio;
    }

    public int getLengthInMinutes() {
        return labLengthMinutes;
    }

    Course(int id, String courseCode) {
        this.id = id;
        this.courseCode = courseCode;
        this.tutorRatio = switch (courseCode.charAt(4)) {
            case '1' -> 15;
            case '2' -> 23;
            default  -> 26;
        };

        /*
         * TODO: need to initialise object properly, e.g. from file or database
         */

        this.numStudents = (8 - id) * 55;
        this.labLengthMinutes = id % 3 == 0 ? 120 : 90;
        this.numTutors = 3 + numStudents / 75;
    }

    @Override
    public String toString() {
        return courseCode;
    }
}
