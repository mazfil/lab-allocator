package com.soco.laballocator.Scheduling;

import com.soco.laballocator.Courses.Course;
import com.soco.laballocator.Courses.CourseTable;
import com.soco.laballocator.Rooms.Room;
import com.soco.laballocator.Rooms.RoomTable;
import com.soco.laballocator.Util.Time;

import java.util.*;

public class Schedule {
    /**
     * The allocations of labs to rooms and times in this particular schedule.
     * Each entry in the array refers to a different room, and they are in index order.
     */
    RoomAllocation[] roomAllocations;
    int numCourses = RoomTable.getInstance().totalNumberOfRooms();


    public record Weighting(double off, double low, double med, double high, double def) {}
    /**
     * A preference for a fitness function that describes how much weighting it should be given
     * @param name name of the preference
     * @param weighting record with predefined values for off, low, med, high, and default
     * @param preference which of the predefined values is currently being used (between 0 and 4, select like an array)
     */
    public record Preference(String name, Weighting weighting, int preference) {}

    Preference[] preferences = new Preference[]{
        new Preference ("freeSpace", new Weighting(0, 0.5, 1, 2, 1), 4),
        new Preference ("betweenTimes", new Weighting(0, 0.5, 1, 2, 1), 4),
        new Preference ("earlyOpts", new Weighting(0, 0.5, 1, 2, 1), 4),
        new Preference ("lateOpts", new Weighting(0, 0.5, 1, 2, 1), 4),
        new Preference ("dateVariance", new Weighting(0, 0.5, 1, 2, 1), 4),
        new Preference ("roomVariance", new Weighting(0, 0.5, 1, 2, 1), 4),
        new Preference ("reduceDupes", new Weighting(0, 0.5, 1, 2, 1), 4),
        new Preference ("alwaysFreeRoom", new Weighting(0, 0.5, 1, 2, 1), 4),
        new Preference ("repeatLabsSameRoom", new Weighting(0, 0.5, 1, 2, 1), 4)
    };

    //variables used for the fitness functions, which the user will eventually set
    public int startTimePreference = 4; //10am
    public int endTimePreference = 16; //4pm
    public int desiredPercentBetween = 70;
    public int beforeTimePreference = 4;
    public int desiredPercentBefore = 15;
    public int afterTimePreference = 16;
    public int desiredPercentAfter = 15;

    /**
     * Initialises the `roomAllocations` array by creating each of the objects within it.
     * Must be called before using the rest of the object.
     */
    private void initialiseAllocationArray() {
        roomAllocations = new RoomAllocation[numCourses];
        for (int i = 0; i < roomAllocations.length; ++i) {
            roomAllocations[i] = new RoomAllocation(RoomTable.getInstance().getRoomFromId(i));
        }
    }

    /**
     * Places a lab for a course in a random room. If it is impossible for place a lab in any
     * room, it throws a RuntimeException.
     *
     * @param rng A random number generator.
     * @param course The course which should get a single lab placed
     * @return The number of students who were allocated to that lab.
     */
    private int placeLabRandomly(Random rng, Course course) {
        /*
         * We want to randomly allocate it to a room, but rooms might be too full to fit the lab.
         * Generate all room ids, and then we'll go through them randomly until we find one that
         * fits the lab.
         *
         * If we go through all of them and can't find space, then we can't fit the constraints.
         */
        List<Integer> shuffled = new ArrayList<>();
        for (int i = 0; i < numCourses; ++i) {
            shuffled.add(i);
        }
        Collections.shuffle(shuffled);

        while (!shuffled.isEmpty()) {
            int roomId = shuffled.remove(0);
            Room room = RoomTable.getInstance().getRoomFromId(roomId);
            List<Time> times = roomAllocations[roomId].findFreeTimeOfLength(course.getLengthInMinutes());
            times.removeAll(course.timesOverlapWithLectures());
            if (!times.isEmpty()) {
                Time time = times.get(rng.nextInt(times.size()));
                return roomAllocations[roomId].addAllocation(time, course).getCount();
            }
        }

        throw new RuntimeException("constraints seem impossible to resolve");
    }

    private void placeCourseRandomly(Random rng, int courseId) {
        Course course = CourseTable.getInstance().getCourseFromId(courseId);

        int seatsMadeAvailableSoFar = 0;
        while (seatsMadeAvailableSoFar < course.getNumberOfStudents()) {
            seatsMadeAvailableSoFar += placeLabRandomly(rng, course);
        }
    }

    /**
     * Prints out a schedule to the console for debugging purposes.
     */
    public void print() {
        System.out.print("SCHEDULE: \n");

        for (int day = 0; day < Time.NUM_DAYS; ++day) {
            System.out.printf("\n%14s", "");
            for (int i = 0; i < numCourses; ++i) {
                System.out.printf("%-14s ", RoomTable.getInstance().getRoomNameFromId(i));
            }
            System.out.print("\n");

            for (int time = 0; time < Time.NUM_TIME_INDICES; ++time) {
                System.out.printf("%-7s %02d%02d: ",
                        time == 0 ? Time.Day.fromIndex(day).toString().substring(0, 3).toUpperCase() : "",
                        time / 2 + 8,
                        (time % 2) * 30
                );

                for (int i = 0; i < numCourses; ++i) {
                    Allocation allocation = roomAllocations[i].getAllocations()[day][time];
                    if (allocation == null) {
                        System.out.print("---            ");
                    } else if (allocation.isContinuation()) {
                        System.out.printf("%-8s       ", allocation.getCourse());
                    } else {
                        System.out.printf("%-8s:%-3d   ", allocation.getCourse(), allocation.getCount());
                    }
                }
                System.out.print("\n");
            }
        }
        System.out.print("\n");
        System.out.printf("FREE SPACE: %.2f\n", getPercentageFree());
        System.out.printf("TIMES WITHIN: %.2f\n", aimForPercentWithin(startTimePreference, endTimePreference, desiredPercentBetween));
        System.out.printf("TIMES BEFORE: %.2f\n", aimForPercentBeforeTime(desiredPercentBefore, beforeTimePreference));
        System.out.printf("TIMES AFTER: %.2f\n", aimForPercentAfterTime(desiredPercentAfter, afterTimePreference));
        System.out.printf("DATE VARIANCE: %.2f\n", getDateVariance());
        System.out.printf("ROOM VARIANCE: %.2f\n", getRoomVariance());
        System.out.printf("AVOID DUPES: %.2f\n", 1000 - getPercentDupes());
        System.out.printf("ALWAYS FREE ROOM: %.2f\n", alwaysRoomFree());
        System.out.printf("REPEAT LABS SAME ROOM: %.2f\n", repeatLabsSameRoom());
        System.out.printf("FITNESS: %d\n", getFitness());
    }

    /**
     * Creates a new, random lab schedule.
     */
    public Schedule() {
        initialiseAllocationArray();

        Random rng = new Random();

        for (int i = 0; i < CourseTable.getInstance().getTotalNumberOfCourses(); ++i) {
            placeCourseRandomly(rng, i);
        }
    }

    /**
     * The crossover function. From two existing schedules, it creates a new one that has
     * traits based on the two parents. This is used to create the next generation of solutions.
     * @param a The first parent
     * @param b The second parent
     */
    public Schedule(Schedule a, Schedule b) {
        initialiseAllocationArray();
        Random random = new Random();
        int coursesNumber = CourseTable.getInstance().getTotalNumberOfCourses();
        int[] availableSeats = new int[coursesNumber];
        List<AllocationWithRoomAndTime> allAllocationsA = a.convertScheduleToList();
        List<AllocationWithRoomAndTime> allAllocationsB = b.convertScheduleToList();
        while (!allAllocationsA.isEmpty() || !allAllocationsB.isEmpty()) {
            copyAllocationRandomly(allAllocationsA, availableSeats, random);
            copyAllocationRandomly(allAllocationsB, availableSeats, random);
        }
        for (int i = 0; i < coursesNumber; ++i) {
            Course course = CourseTable.getInstance().getCourseFromId(i);
            int enrolledStudents = course.getNumberOfStudents();
            while (availableSeats[i] < enrolledStudents) {
                availableSeats[i] += placeLabRandomly(random, course);
            }
        }
    }

    /**
     * Helper method for crossover function that copy an allocation from a list of AllocationWithRoomAndTime
     * to the current Schedule randomly.
     * The availableSeats is an array of the number of available seats for each course,
     * which avoids adding allocations for a course more than necessary.
     * Do not use this method elsewhere.
     */
    private void copyAllocationRandomly(List<AllocationWithRoomAndTime> allAllocations, int[] availableSeats, Random random) {
        if (!allAllocations.isEmpty()) {
            int randomNumber = random.nextInt(allAllocations.size());
            AllocationWithRoomAndTime allocation = allAllocations.remove(randomNumber);
            RoomAllocation roomAllocation = roomAllocations[allocation.getRoom().getId()];
            Time time = allocation.getTime();
            Course course = allocation.getCourse();
            int length = course.getLengthInMinutes();
            if (roomAllocation.isTimeAndLengthFree(time, length)) {
                if (course.timesOverlapWithLectures().contains(time)) {
                    return;
                }
                if (availableSeats[course.getId()] < course.getNumberOfStudents()) {
                    availableSeats[course.getId()] += roomAllocation.addAllocation(time, course).getCount();
                }
            }
        }
    }

    /**
     * Helper method for crossover and mutation function
     * Converts a Schedule to a list of AllocationWithRoomAndTime.
     * It returns a list of AllocationWithRoomAndTime that contains
     * all allocations of a schedule (excluding continuing allocation).
     */
    private List<AllocationWithRoomAndTime> convertScheduleToList() {
        List<AllocationWithRoomAndTime> allAllocations = new ArrayList<>();
        for (int roomId = 0; roomId < numCourses; ++roomId) {
            Room room = RoomTable.getInstance().getRoomFromId(roomId);
            for (int dayIndex = 0; dayIndex < Time.NUM_DAYS; ++dayIndex) {
                for (int timeIndex = 0; timeIndex < Time.NUM_TIME_INDICES; ++timeIndex) {
                    Time.Day day = Time.Day.fromIndex(dayIndex);
                    Time time = new Time(day, timeIndex);
                    Allocation allocation = roomAllocations[roomId].getAllocations()[dayIndex][timeIndex];
                    if (allocation != null && !allocation.isContinuation()) {
                        Course course = allocation.getCourse();
                        int count = allocation.getCount();
                        allAllocations.add(new AllocationWithRoomAndTime(course, count, false, room, time));
                    }
                }
            }
        }
        return allAllocations;
    }

    /**
     * The mutation function. Makes a small, random change (in place) to the schedule.
     * This is used to try to explore different solutions and find slight improvements.
     */
    public void mutate() {
        Random random = new Random();
        moveLabRandomly(random);
    }

    /**
     * Helper method for mutation function
     * Move a random lab to another time in the same room.
     */
    public void moveLabRandomly(Random random) {
        List<AllocationWithRoomAndTime> allAllocations = convertScheduleToList();
        AllocationWithRoomAndTime allocation = allAllocations.get(random.nextInt(allAllocations.size()));
        int roomId = allocation.getRoom().getId();
        Course course = allocation.getCourse();
        roomAllocations[roomId].removeAllocation(allocation.getTime());
        List<Time> times = roomAllocations[roomId].findFreeTimeOfLength(course.getLengthInMinutes());
        times.removeAll(course.timesOverlapWithLectures());
        Time time = times.get(random.nextInt(times.size()));
        roomAllocations[roomId].addAllocation(time, course);
    }

    /**
     * Calculates the fitness value for the current schedule. The fitness value should be
     * deterministic, and higher values indicate a better schedule. Each of the functions
     * that contribute to the fitness output a value between 0 and 1000, and are multiplied
     * by the modifiers in 'preferences'.
     *
     * @return The fitness value (should be non-negative).
     */
    public int getFitness() {

        double fitness = 0;
        fitness += getPercentageFree()*getModifier(preferences[0]);
        fitness += aimForPercentWithin(startTimePreference, endTimePreference, desiredPercentBetween)*getModifier(preferences[1]);
        fitness += aimForPercentBeforeTime(desiredPercentBefore, beforeTimePreference)*getModifier(preferences[2]);
        fitness += aimForPercentAfterTime(desiredPercentAfter, afterTimePreference)*getModifier(preferences[3]);
        fitness += getDateVariance()*getModifier(preferences[4]);
        fitness += getRoomVariance()*getModifier(preferences[5]);
        fitness += 1000 - (getPercentDupes()*getModifier(preferences[6]));
        fitness += alwaysRoomFree()*getModifier(preferences[7]);
        fitness += repeatLabsSameRoom()*getModifier(preferences[8]);
        return (int)fitness;

        /*
         * TODO: things that could be considered here are:
         *  - room utilisation (done)
         *  - having most classes between certain times (done)
         *  - having some classes before a certain time (done)
         *  - having some classes after a certain time (done)
         *  - variance throughout days for each class (done)
         *  - variance throughout rooms for each day (done)
         *  - the number of labs of the same class that runs at the same time (done)
         *      -> generally may want to minimise to increase options for students
         *      -> might *not* want to for really popular times though
         *  - always have a room free (done)
         *  - tutor workload (how many back-to-back tutorials?)
         *  - gaps in the day for e.g. drop ins to happen, or for people to study (but not too many!)         *
         *  - the number of other labs for other classes that run at that time (i.e. minimise clashes)
         *  - having back-to-back labs in the same room (e.g. to save tutors with back-to-back classes walking)
         *  - convener preferences
         */
    }

    /**
     * Calculates the percentage of time that is free across all rooms. This is given by the number of
     * half-hour blocks taken up by labs (across all rooms), divided by the total number of half-hour
     * blocks (across all rooms).
     *
     * @return The percentage free as a value from 0 to 1000, where 0 is all half-hour blocks across the school
     * are used, and 1000 being that nothing is scheduled.
     */
    public double getPercentageFree() {
        int totalSlots = Time.NUM_DAYS * Time.NUM_TIME_INDICES * numCourses;
        int totalUsed = 0;

        for (RoomAllocation allocation: roomAllocations) {
            for (int day = 0; day < Time.NUM_DAYS; ++day) {
                for (int time = 0; time < Time.NUM_TIME_INDICES; ++time) {
                    if (allocation.getAllocations()[day][time] != null) {
                        totalUsed++;
                    }
                }
            }
        }

        /*
         * The `totalUsed / totalSlots` calculation gives the percentage of time used,
         * but we need to negate it to get free time.
         */
        return (1 - (double) totalUsed / (double) totalSlots)*1000;
    }

    /**
     * Returns the variety of the timetable in terms of how "spread out" each
     * course's tuts are among the days of the week.
     * @return A double between 0 and 1000. Values closer to 1000 mean that
     * the timetable has low variety (and is spread out well).
     */
    public double getDateVariance(){
        double fitness = 0;
        int numCourses = CourseTable.getInstance().getTotalNumberOfCourses();
        double blocksUsed[][] = new double[numCourses][Time.NUM_DAYS];
        //make an array that contains, for each course, how many tuts it has on each day
        for(RoomAllocation ra : roomAllocations){
            for(int day = 0; day < Time.NUM_DAYS; day++){
                for(int time = 0; time < Time.NUM_TIME_INDICES; time++){
                    if(ra.timeAllocations[day][time] != null) {
                        Allocation a = ra.timeAllocations[day][time];
                        int courseID = a.getCourse().getId();
                        blocksUsed[courseID][day]++;
                    }
                }
            }
        }
        //calculate the variance between days of each course
        for (int i = 0; i < numCourses; i++){
            double var = variance(blocksUsed[i]);
            //we want the variance to be low (because then there are a good amount of tuts on all days)
            //use 1/sqrt(variance+1), and scale based on the number of courses
            fitness += 1000*Math.pow(var+1, -0.5)/(double)numCourses;
        }
        return fitness;
    }

    /**
     * Returns the variety of the timetable in terms of how "spread out" the
     * tuts are in each room, on each day.
     * @return A double between 0 and 1000. Values closer to 1000 mean that
     * the timetable has low variety (and is spread out well).
     */
    public double getRoomVariance(){
        double fitness = 0;
        int numRooms = numCourses;
        double timesRoomsUsed[][] = new double[Time.NUM_DAYS][numRooms];
        //make an array that contains, for each room, how many tuts it has on each day
        for(RoomAllocation ra : roomAllocations){
            int roomID = ra.getRoom().getId();
            for(int day = 0; day < Time.NUM_DAYS; day++){
                for(int time = 0; time < Time.NUM_TIME_INDICES; time++){
                    if(ra.timeAllocations[day][time] != null) {
                        timesRoomsUsed[day][roomID]++;
                    }
                }
            }
        }
        //calculate the variance between rooms of each day
        for (int i = 0; i < Time.NUM_DAYS; i++){
            double var = variance(timesRoomsUsed[i]);
            //we want the variance to be low (because then there are a good amount of tuts on all days)
            //use 1/sqrt(variance+1), and scale based on the number of courses
            fitness += 1000*Math.pow(var+1, -0.5)/(double)Time.NUM_DAYS;
        }
        return fitness;
    }

    /**
     * Returns a value between 0 and 1000 representing how close the timetable
     * is to having a specific percent of classes before a specific time.
     * @param desiredPercent the desired percent of classes before a time
     * @param start the time the classes should be after (inclusive)
     * @param end the time the classes should be before (inclusive)
     * @return The return value is a curve such that, the close the actual
     * percent of classes is to the desired percent, the more rapidly it approaches 1000.
     */

    public double aimForPercentWithin(int start, int end, double desiredPercent){
        double totalTuts = 0;
        double totalWithin = 0;
        for (RoomAllocation allocation: roomAllocations) {
            for (int day = 0; day < Time.NUM_DAYS; ++day) {
                for (int time = 0; time < Time.NUM_TIME_INDICES; ++time) {
                    if (allocation.getAllocations()[day][time] != null) {
                        totalTuts++;
                        if(time <= end && time >= start){
                            totalWithin++;
                        }
                    }
                }
            }
        }
        //diff = difference between desired and actual percentage (abs)
        //return 1/sqrt(diff/2+1), to get a nice curve
        double diff = Math.abs(desiredPercent -(totalWithin/totalTuts*100));
        return 1000*Math.pow(diff/2+1, -0.5);
    }

    /**
     * Returns a value between 0 and 1000 representing how close the timetable
     * is to having a specific percent of classes before a specific time.
     * @param desiredPercent the desired percent of classes before a time
     * @param before the time the classes should be before (inclusive)
     * @return The return value is a curve such that, the close the actual
     * percent of classes is to the desired percent, the more rapidly it approaches 1000.
     */
    public double aimForPercentBeforeTime(double desiredPercent, int before){
        double totalTuts = 0;
        double totalBefore = 0;
        for (RoomAllocation allocation: roomAllocations) {
            for (int day = 0; day < Time.NUM_DAYS; ++day) {
                for (int time = 0; time < Time.NUM_TIME_INDICES; ++time) {
                    if (allocation.getAllocations()[day][time] != null) {
                        totalTuts++;
                        if(time <= before){
                            totalBefore++;
                        }
                    }
                }
            }
        }
        //diff = difference between desired and actual percentage (abs)
        //return 1/sqrt(diff/2+1), to get a nice curve
        double diff = Math.abs(desiredPercent-(totalBefore/totalTuts*100));
        return 1000*Math.pow(diff/2+1, -0.5);
    }

    /**
     * Returns a value between 0 and 1000 representing how close the timetable
     * is to having a specific percent of classes before a specific time.
     * @param desiredPercent the desired percent of classes before a time
     * @param after the time the classes should be before (inclusive)
     * @return The return value is a curve such that, the close the actual
     * percent of classes is to the desired percent, the more rapidly it approaches 1000.
     */
    public double aimForPercentAfterTime(double desiredPercent, int after){
        double totalTuts = 0;
        double totalAfter = 0;
        for (RoomAllocation ra: roomAllocations) {
            for (int day = 0; day < Time.NUM_DAYS; ++day) {
                for (int time = 0; time < Time.NUM_TIME_INDICES; ++time) {
                    if (ra.timeAllocations[day][time] != null) {
                        totalTuts++;
                        if(time >= after){
                            totalAfter++;
                        }
                    }
                }
            }
        }
        //diff = difference between desired and actual percentage (abs)
        //return 1/sqrt(diff/2+1), to get a nice curve
        double diff = Math.abs(desiredPercent-(totalAfter/totalTuts*100));
        return 1000*Math.pow(diff/2+1, -0.5);
    }

    /**
     * Returns the percentage of timeblocks that are a duplicate of another timeblock
     * (that is, the same time and the same class) as a value between 0 and 1000.
     * The first of such timeblocks is not considered a duplicate - e.g. if there
     * are 3 timeblocks with the same time and class, 2 of them are considered
     * duplicates.
     */
    public double getPercentDupes(){
        double totalBlocks = 0;
        double dupeBlocks = 0;
        int numRooms = numCourses;
        for(int day = 0; day < Time.NUM_DAYS; day++){
            for(int time = 0; time < Time.NUM_TIME_INDICES; time++){
                // for each timeblock (day + time), go through each room and see what tuts there are.
                // if there are any duplicate courses, increment dupeBlocks.
                boolean[] tutExists = new boolean[numRooms];
                for(int room = 0; room < numRooms; room++){
                    Allocation a = roomAllocations[room].timeAllocations[day][time];
                    if(a != null){
                        totalBlocks++;
                        int courseID = a.getCourse().getId();
                        if(tutExists[courseID] == false){
                            tutExists[courseID] = true;
                        }else{
                            dupeBlocks++;
                        }
                    }
                }
            }
        }
        return dupeBlocks/totalBlocks*1000;
    }

    /**
     * Returns the percent of the time that there is at least one free room,
     * as a value between 0 and 1000.
     */
    public double alwaysRoomFree(){
        double numTimeblocks = Time.NUM_DAYS*Time.NUM_TIME_INDICES;
        double numTimeblocksFreeRoom = 0;
        for(int day = 0; day < Time.NUM_DAYS; day++){
            for(int time = 0; time < Time.NUM_TIME_INDICES; time++){
                for(int room = 0; room < numCourses; room++){
                    if(roomAllocations[room].timeAllocations[day][time] == null){
                        numTimeblocksFreeRoom++;
                        break;
                    }
                }
            }
        }
        return numTimeblocksFreeRoom/numTimeblocks*1000;
    }

    /**
     * Returns the percentage of repeating labs that occur in the same room,
     * as a value between 0 and 1000.
     */

    public double repeatLabsSameRoom() {
        double repeatingLabsSameRoom = 0;
        for (int room = 0; room < RoomTable.getInstance().totalNumberOfRooms(); room++) {
            for (int day = 0; day < Time.NUM_DAYS; day++) {
                int prevCourseID = 0;
                int curCourseID = 0;
                for (int time = 0; time < Time.NUM_TIME_INDICES; time++) {
                    Allocation a = roomAllocations[room].timeAllocations[day][time];
                    if (a != null) {
                        curCourseID = a.getCourse().getId();
                        //if 'a' is the start of a lab, and it is the same as the prev lab, it is repeating same room
                        if (!a.isContinuation() && curCourseID == prevCourseID) {
                            repeatingLabsSameRoom++;
                        }
                    }
                    prevCourseID = curCourseID;
                }
            }
        }
        return repeatingLabsSameRoom / numberOfRepeatLabs() * 1000;
    }

    /**
     * Returns the number of repeated labs in the timetable. A repeated lab
     * is when a lab for a course is immediately followed by another lab
     * for that course, in any room.
     */

    public double numberOfRepeatLabs(){
        double repeatingLabs = 0;
        boolean hadLab[] = new boolean[numCourses];
        boolean hasLab[] = new boolean[numCourses];
        for(int day = 0; day < Time.NUM_DAYS; day++){
            for(int time = 0; time < Time.NUM_TIME_INDICES; time++){
                for(int room = 0; room < RoomTable.getInstance().totalNumberOfRooms(); room++){
                    Allocation a = roomAllocations[room].timeAllocations[day][time];
                    if(a != null){
                        int courseID = a.getCourse().getId();
                        //if 'a' is the start of a lab, that course had a lab before, and it isn't the start of the day, it is repeating
                        if(!a.isContinuation() && hadLab[courseID] && time != 0){
                            repeatingLabs++;
                        }
                        hasLab[courseID] = true;
                    }
                }
                hadLab = hasLab;
            }
        }
        return repeatingLabs;
    }

    public double getModifier(Preference pref){
        return switch (pref.preference) {
            case 0 -> pref.weighting.off;
            case 1 -> pref.weighting.low;
            case 2 -> pref.weighting.med;
            case 3 -> pref.weighting.high;
            case 4 -> pref.weighting.def;
            default -> throw new RuntimeException("invalid value for preference");
        };
    }

    //some maths helper functions, not sure if they should be in another class

    public double sum(double[] array){
        double sum = 0;
        for(double d : array){
            sum += d;
        }
        return sum;
    }

    public double mean(double[] array){
        return sum(array)/array.length;
    }

    public double variance(double[] array){
        double mean = mean(array);
        for(int i = 0; i < array.length; i++){
            array[i] = Math.pow((array[i]-mean), 2);
        }
        return sum(array)/array.length;
    }
}

