package Scheduling;

import Courses.Course;

/**
 * An allocation for a particular room at a particular time.
 */
public class Allocation {
    /**
     * The id of the course which this is an allocation of.
     */
    private final Course course;
    public Course getCourse() {
        return course;
    }

    /**
     * The number of seats that students can use in this room allocation.
     * This is constrained by the physical number of seats, and tutor ratios.
     */
    private final int count;
    public int getCount() {
        return count;
    }

    /**
     * Used to indicate that this is part of an allocation that is longer than
     * 30 minutes - this will be set for all but the first entry.
     */
    private boolean continuation;
    public boolean isContinuation() {return continuation;}

    Allocation(Course course, int count, boolean continuation) {
        this.course = course;
        this.count = count;
        this.continuation = continuation;
    }
}
