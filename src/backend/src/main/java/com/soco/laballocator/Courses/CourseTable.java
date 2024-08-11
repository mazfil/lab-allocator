package com.soco.laballocator.Courses;

import com.soco.laballocator.Firebase.FirebaseConnection;

import java.util.List;

/**
 * Stores a static table of information about all of the courses.
 * Can be used to look up courses via their course code.
 */
public class CourseTable {
    static private CourseTable instance = null;
    private Course[] courses;

    // To be called by fb.loadCourses();
    public void initCourses(List<Course> c) {
        courses = new Course[c.size()];
        for (int i = 0; i < courses.length; ++i) {
            courses[i] = c.get(i);
        }
    }

    private CourseTable() {

    }

    public int getTotalNumberOfCourses() {
        return courses.length;
    }

    public Course getCourseFromId(int id) {
        for (Course course : courses) {
            if (course.getId() == id) {
                return course;
            }
        }
        throw new RuntimeException("No course has the give course id");
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
            new FirebaseConnection().loadCourses(); // here to prevent recursion
        }

        return instance;
    }
}
