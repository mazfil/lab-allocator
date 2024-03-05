import java.util.Random;

public class Schedule {
    /*
     * TODO: some data fields
     */

    /**
     * Creates a new, random lab schedule.
     */
    Schedule() {
        /*
         * TODO:
         */
    }

    /**
     * The crossover function. From two existing schedules, it creates a new one that has
     * traits based on the two parents. This is used to create the next generation of solutions.
     * @param a The first parent
     * @param b The second parent
     */
    Schedule(Schedule a, Schedule b) {
        /*
         * TODO:
         */
    }

    /**
     * The mutation function. Makes a small, random change (in place) to the schedule.
     * This is used to try to explore different solutions and find slight improvements.
     */
    void mutate() {
        /*
         * TODO:
         */
    }

    /**
     * Calculates the fitness value for the current schedule. The fitness value should be
     * deterministic, and higher values indicate a better schedule.
     * @return The fitness value (should be non-negative).
     */
    int getFitness() {
        /*
         * TODO:
         */
        return 0;
    }
}
