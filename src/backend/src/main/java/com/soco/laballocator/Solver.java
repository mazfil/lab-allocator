package com.soco.laballocator;

import com.soco.laballocator.Courses.CourseTable;
import com.soco.laballocator.Connection.MongoConnection;
import com.soco.laballocator.Scheduling.Schedule;

import java.util.Arrays;
import java.util.Comparator;
import java.util.Random;

public class Solver {
    final static int NUM_GENERATIONS = 20;

    final static int POPULATION_SIZE = 5000;

    /**
     * The number of solutions that are eligible for combining into the next generation. Solutions not
     * in the mating pool get discarded.
     */
    final static int MATING_POOL_SIZE = (POPULATION_SIZE / 10);

    /**
     * The number of solutions that get copied directly across to the next generation without needing
     * to be recombined. This ensures we don't lose the best solutions between generations, but the higher
     * this value is, the more the solutions converge (which may prevent us from escaping a local maxima).
     */
    final static int ELITE_SIZE = (POPULATION_SIZE / 50);

    /**
     * The percentage of crossovers that have a mutation applied to them. Higher values let it 'explore'
     * more solutions, but may also ruin what would have been a good solution.
     */
    final static int MUTATION_PERCENT = 5;



    Schedule[] generateRandomPopulation() {
        boolean warnSlow = false;
        Schedule[] sch = new Schedule[POPULATION_SIZE];

        int properEntries = 0;
        boolean failed = false;
        long startMs = System.currentTimeMillis();
        for (int i = 0; i < POPULATION_SIZE; ++i) {
            if (i != 0) {
                /*
                 * If we're still going after 20 seconds, stop, and just fill up the rest with
                 * duplicates of what we have so far. If we're getting to this point, it's a
                 * very tight fit, and so we're more so just trying to get it to work instead of
                 * trying to get to some amazing optimal solution.
                 *
                 * As we check this after generating a schedule, we know we have at least one.
                 */
                if (System.currentTimeMillis() - startMs > 1000 * 20 || failed) {
                    warnSlow = true;
                    System.out.printf("Generation is slow - will cut off now.\n");
                    int numGoodEntries = i;
                    while (i < POPULATION_SIZE) {
                        System.out.printf("Generating %d/%d - COPY OF ENTRY %d\n", i, POPULATION_SIZE, i % numGoodEntries);
                        sch[i] = sch[i % numGoodEntries];
                        ++i;
                    }
                    break;
                }
            }

            System.out.printf("Generating %d/%d... ", i, POPULATION_SIZE);

            try {
                sch[i] = new Schedule();
                ++properEntries;
                System.out.printf("done\n");
            } catch (RuntimeException e) {
                System.out.printf("uh-oh\n");
                if (i == 0) {
                    System.out.printf("constraints seem impossible to resolve\n");
                    throw e;
                } else {
                    System.out.printf("Could not resolve at i=%d\n", i);
                    failed = true;
                    --i;
                }
            }
        }

        double avgAttempts = ((double) Schedule.scheduleGenerationNumAttempts) / Schedule.scheduleGenerationCount;

        String warningStr = "";
        if (warnSlow || avgAttempts >= 2.0) {
            warningStr += "WARNING: constraints are tight - expect slower performance and less optimal results\n";
            warningStr += "    Average attempts before succeeding: %.1f\n".formatted(avgAttempts);
            warningStr += "    Population generation took %.1f seconds.\n".formatted(
                    (System.currentTimeMillis() - startMs) / 1000.0f
            );
            if (warnSlow) {
                warningStr += "    We stopped looking for new solutions after finding %d/%d\n".formatted(properEntries, POPULATION_SIZE);
            }
        }

        if (warningStr.length() > 0) {
            System.out.printf("%s\n", warningStr);
        }

        return sch;
    }

    public Schedule solve() {
        System.out.printf("Generating the initial population...\n");
        Schedule[] population = generateRandomPopulation();
        System.out.printf("Generated a random population...\n");
        Random rng = new Random();

        population[0].print();
        CourseTable.getInstance().print();

        int generation = 0;
        int totalGen = 0;
        int highestFitness = 0;
        System.out.printf("\n\n");
        while (generation++ < NUM_GENERATIONS) {

            Schedule[] newPopulation = new Schedule[POPULATION_SIZE];

            /*
             * Perform the fitness function on all elements and sort low to high based on that.
             */
            Arrays.sort(population, Comparator.comparingInt(Schedule::getFitness));
            System.out.printf("Starting generation %d... best has %d\n", ++totalGen, highestFitness);

            if (population[population.length - 1].getFitness() > highestFitness) {
                highestFitness = population[population.length - 1].getFitness();

                /* Keep it going for a bit longer if we make an improvement, but not indefinitely */
                if (generation > 10 && totalGen < 100) {
                    generation -= (10 - totalGen / 10);
                }
            }

            /*
             * Transfer the best solutions into the next generation without needing to do crossover.
             */
            System.arraycopy(population, POPULATION_SIZE - ELITE_SIZE, newPopulation, 0, ELITE_SIZE);

            /*
             * Fill up the rest of the next generation with random pairs that have been crossed over.
             */
            for (int i = 0; i < POPULATION_SIZE - ELITE_SIZE; ++i) {
                Schedule a = population[POPULATION_SIZE - MATING_POOL_SIZE + rng.nextInt(MATING_POOL_SIZE)];
                Schedule b = population[POPULATION_SIZE - MATING_POOL_SIZE + rng.nextInt(MATING_POOL_SIZE)];
                try {
                    Schedule c = new Schedule(a, b);
                    if (rng.nextInt(100) < MUTATION_PERCENT) {
                        c.mutate();
                    }
                    newPopulation[i + ELITE_SIZE] = c;
                } catch (RuntimeException e) {
                    /*
                     * This only occurs if we're in a bit of a pickle and can't actually generate a crossover
                     * within a reasonable length of time. In cases where the constraints are this tight, we
                     * are really just looking to get *a* schedule, and not necessarily an optimised one.
                     */
                    newPopulation[i + ELITE_SIZE] = a;
                }
            }

            population = newPopulation;
        }

        Arrays.sort(population, Comparator.comparingInt(Schedule::getFitness));
        population[population.length - 1].print();

        return population[population.length - 1];
    }

    public static void main(String[] args) {
        Schedule solution = new Solver().solve();
        MongoConnection fb = new MongoConnection();
        fb.uploadSchedule(solution);
    }
}
