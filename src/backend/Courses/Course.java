package Courses;

import Util.Time;

public class Course {
    int numLabs;
    int labLengthMinutes;
    Time lectureTime;
    int tutorRatio;
    int id;

    /**
     * Rounded up to nearest multiple of 30 minutes.
     */
    int lectureLengthMinutes;

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
