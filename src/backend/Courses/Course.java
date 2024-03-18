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

    int labLengthMinutes;
    int numStudents;
    int numTutors;
    int tutorRatio;
    int id;

    public int getMaximumClassSize() {
        return Math.min(numStudents, numTutors * tutorRatio);
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

    Course(int id) {
        this.id = id;

        /*
         * TODO: need to initialise object
         */

        this.tutorRatio = 23;
        this.numStudents = (8 - id) * 55;
        this.labLengthMinutes = id % 3 == 0 ? 120 : 90;
        this.numTutors = 12;
    }

    @Override
    public String toString() {
        return CourseTable.getInstance().getCourseCodeFromId(id);
    }
}
