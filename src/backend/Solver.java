
import Courses.CourseTable;
import Scheduling.Schedule;

import java.util.Arrays;
import java.util.Comparator;
import java.util.Random;

public class Solver {
    final static int NUM_GENERATIONS = 30;

    final static int POPULATION_SIZE = 10000;

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
        Schedule[] sch = new Schedule[POPULATION_SIZE];
        for (int i = 0; i < POPULATION_SIZE; ++i) {
            sch[i] = new Schedule();
        }
        return sch;
    }

    Schedule solve() {
        System.out.printf("Generating the initial population...\n");
        Schedule[] population = generateRandomPopulation();
        Random rng = new Random();

        population[0].print();
        CourseTable.getInstance().print();

        int generation = 0;
        int highestFitness = 0;
        while (generation++ < NUM_GENERATIONS) {
            //System.out.printf("Starting generation %d... best has %d\n", generation, highestFitness);
            Schedule[] newPopulation = new Schedule[POPULATION_SIZE];

            /*
             * Perform the fitness function on all elements and sort low to high based on that.
             */
            Arrays.sort(population, Comparator.comparingInt(Schedule::getFitness));

            if (population[population.length - 1].getFitness() > highestFitness) {
                highestFitness = population[population.length - 1].getFitness();
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
                Schedule c = new Schedule(a, b);
                if (rng.nextInt(100) < MUTATION_PERCENT) {
                    c.mutate();
                }
                newPopulation[i + ELITE_SIZE] = c;
            }

            population = newPopulation;
        }

        Arrays.sort(population, Comparator.comparingInt(Schedule::getFitness));
        return population[population.length - 1];
    }
}
