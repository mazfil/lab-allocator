package com.soco.laballocator.Courses;

import com.soco.laballocator.Util.Time;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Course {
    class Lecture {
        // need to import lecture data
        Time startTime;
        int lengthMinutes;

        public Lecture(Time startTime, int lengthMinutes) {
            this.startTime = startTime;
            this.lengthMinutes = lengthMinutes % 30 == 0 ? lengthMinutes : (lengthMinutes / 30 + 1) * 30;
        }
    }


    List<Lecture> lectures;

    String courseCode;

    int labLengthMinutes;
    int numStudents;
    int numTutors;
    int tutorRatio;
    int id;

    public int getId() {
        return id;
    }

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
        this.lectures = new ArrayList<>();

    }

    /**
     * Return all starting times for a lab that may overlap with the lectures
     */

    public Set<Time> timesOverlapWithLectures() {
        Set<Time> lecturesTime = new HashSet<>();
        for (Lecture lec : lectures) {
            int lectureChunk = lec.lengthMinutes / 30;
            int labChunk = labLengthMinutes / 30;
            for (int i = 1 - labChunk; i < lectureChunk; i++){
                Time time = new Time(lec.startTime.getDay(),lec.startTime.getIndex() + i);
                lecturesTime.add(time);
            }
        }
        return lecturesTime;
    }


    @Override
    public String toString() {
        return courseCode;
    }
}
