package Courses;

import Util.Time;

import java.util.ArrayList;
import java.util.List;

public class Course {
    class Lecture {
        // need to import lecture data
        Time startTime;
        int lengthMinutes;


        public Lecture(Time startTime, int lengthMinutes) {
            this.startTime = startTime;
            this.lengthMinutes = lengthMinutes;
        }

        public List<Time> initializeTime(){
            int chunk = (int) Math.ceil((double) this.lengthMinutes / 30);
            List<Time> lectureTime = null;
            int i;
            for (i = 0; i < chunk; i++){
                Time cur = new Time(this.startTime.getDay(),this.startTime.getIndex()+i);
                lectureTime.add(cur);
            }
            return lectureTime;
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

    public List<Lecture> getLectures() { return lectures; }

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

    /**
     * Add all lecture time chunks to a list
     */

    public List<Time> lecturesTimeList() {
        List<Time> lecsTime = new ArrayList<>();
        List<Lecture> lectures = getLectures();
        if (lectures != null) {
            for (Lecture lec : lectures) {
                lecsTime.addAll(lec.initializeTime());
            }
        }else {
            System.out.println("Error: Lectures list is null.");
        }
        return lecsTime;
    }


    @Override
    public String toString() {
        return courseCode;
    }
}
