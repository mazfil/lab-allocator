This document will outline some of the approaches to implementing the backend allocation algorithm, and why they may or may not work.

A particular issue is that scheduling and timetabling is NP-hard, and there is no efficient way of solving it.



## Brute Force

The brute force algorithm works by checking all possible combinations of times when labs could run. For each class, all combinations of lab times would be generated, and then the combinations for these across all classes would be generated. This would guarantee that the optimal solution is found, however, it may take a very long time.

This generates an extremely large number of combinations. Even for a very conservative estimate, where there are 10 courses, 5 labs per course, and 20 labs per week where a lab could be scheduled (ie. labs could start at 8am, 11am, 2pm or 5pm; 5 days per week) - this still gives nCr(20, 5)^10 = 15504^10 = 8E41 combinations. Even if we could check 10,000,000 combinations per second, this would still take 2.4E24 *millennia* to solve. This is obviously not a realistic time period.

Realistically, there are closer to 30 COMP courses, and probably closer to 100 times a week a lab could be scheduled (5 days * 10 hours * 2 (for starting on half-hours)). As the number of classes and lab times increases, the time it would take to find a solution increases exponentially.





## Genetic Algorithms

Genetic algorithms are a heuristic-based approach - meaning that not all solutions will be checked (in fact, very few of them will be), but it will try to find a solution that is 'good enough'.

Genetic algorithms try to simulate natural selection, by assigning potential solutions a 'fitness value'. The higher the fitness value, the better the solution is. The fitness value is generated by passing the solution into a 'fitness function' - which in our case will take into account things such as resource allocation, clashes, and the variety in the timetable, etc.

A number of solutions (e.g. 10,000) are generated (usually at random), and called the 'population'. From this, the best solutions (according to the fitness value) are able to combine with each other, forming a new population, forming the next generation. The idea is that traits that give solutions high fitness values (e.g. a particular arrangement of classes) will be preserved into the next generation, and can combine - which can give potentially even better solutions. In the long run, each generation of solutions should get better as high fitness value solutions are kept and recombine, and low fitness value solutions are discarded.

The general process may look like this:

- Generate 10,000 random solutions
 
- Calculate the fitness value for each solution 
 
- The top 100 solutions enter the population for the next generation
 
- 9,900 random pairs of solutions are chosen among those in the top, e.g. 1,000
 
- for each pair, a 'crossover function' is used to generate a new solution based on features of the two solutions in the pair
 
- these 9,900 newly formed solutions enter the population for the next generation
 
- go back to the top, for the next generation to start

In code it might look like:
```
Solution solveWithGA(){
	Solution population[10000] = random solutions
	until we decide to stop {
		// Start of generation

		Solution nextGen[10000] = new Solution[10000]

		// Calculate fitness values
		population.sortBasedOn(x => fitness(x))

		// Transfer the best
		nextGen[0:100] = population[0:100]

		// Combine the top 10% to form the rest of the population
		for (int i = 0; i < 9900; ++i) {
			Solution a = population[rand(0, 1000)]
			Solution b = population[rand(0, 1000)]
			Solution c = crossover(a, b)
			if (rand(0, 10) == 0) {
				c = mutate(c);
			}
			nextGen[i + 100] = c;
		}

		// That forms the next generation
		population = nextGen
	}
	return best from population
}
```

Additionally, we can introduce 'mutations' during the process, e.g. some of the new population may, e.g. have two classes swapped around.

To implement a genetic algorithm for this purpose, we need to do the following:

- create a method of storing a solution
		(it should be a fixed length, maybe an array of times, and the classes at those times?)

- create a crossover function, i.e. a function that can take 2 solutions and generate a third based on those two

- create a fitness function. This is likely going to be quite complex, and have many parameters, and weightings for different parameters that we will have to tune ourselves (e.g. is it better to have less clashes, or better to have better resource allocation?)

- implement the genetic algorithm. All genetic algorithms are basically the same, just with different parameters, crossover functions and fitness functions.

- fine tune the algorithm to give the best results. e.g. what's the population size? what percentage of good solutions are kept directly / crossed over / discarded?

A simple (and very rough) crossover function might look like:

```
Solution crossover(Solution a, Solution b) {
    Solution c = new Solution();
    until c has all classes {
        transfer random lab from `a` to `c`, if its not already in `c`
        transfer random lab from `b` to `c`, if its not already in `c`
        if (room becomes double booked) {
            undo that and try another combination
        }
        if (can't use locations/times from a or b anymore (e.g. due to clashes / double booking) {
            put lab at random time
        }
    } 
    return c
}
```

And the fitness function will be something like:
```			
int fitness(Solution s) {
    int resource_allocation = ...;
    int clashes = ...;
    int variety = ...;
    int other_stuff = ...;

    if (something about the solution means it's really bad, e.g. double bookings) {
        return 0;
    }

    return some_function_of(resource_allocation, clashes, variety, other stuff, etc.);
}
```

Genetic algorithms will only take up to a few minutes to generate solutions in most cases. The issue is that they work randomly, and therefore will not give consistent results (we could seed the RNG generator though to make it consistent), and don't always find an optimal result.