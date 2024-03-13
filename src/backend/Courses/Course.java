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

    int numLabs;
    int labLengthMinutes;

    int numStudents;
    int numTutors;

    List<Lecture> lectures;
    int tutorRatio;
    int id;

    boolean requiresLabComputers;
    boolean requiresProjectors;

    public int getTutorRatio() {
        return tutorRatio;
    }

    public int getNumberOfLabs() {
        return numLabs;
    }

    public int getLengthInMinutes() {
        return labLengthMinutes;
    }

    Course(int id) {
        this.id = id;

        /*
         * TODO: need to initialise object
         */
    }
}
