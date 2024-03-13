
# Contribution Process

## Branches
...

## Pull Requests
...

# Testing
...

# Code Style

## Naming
Use the normal Java naming conventions, with `camelCase` for method, field and variable names, and `UppercasedCamelCase` for classes, enumerations and interfaces. Constant values should be in `UPPERCASE_WITH_UNDERSCORES`.

Getters should be of form `getXYZ()`, and setters `setXYZ()`.

## Indentation
Use 4 spaces. Don't use tabs, as they can cause a mess especially when code is moved between different computers and IDEs.

## Line Width
Lines should be kept to a reasonable length (e.g. 120 characters wide). If you have to scroll the page to the right while coding on a laptop, it's probably too long.

## Javadoc Comments
Classes, methods and fields should generally have Javadoc comments. Try not to just repeat the method or field name - instead try to add information about e.g. special cases, how it handles errors, assumptions it makes, etc.

There are cases where Javadocs aren't needed, or can be shortened - for example when writing getters and setters, or other code that would otherwise have repetitive comments. e.g. This is bad:
```java
/**
 * The name of the course.
 */
String name;

/**
 * Returns the name of the course
 * @return The name of the course
 */
String getName() {
    return name;
}

/**
 * Returns the level of the course
 * @return The level of the course
 */
int getLevel() {
    return level;
}
```

This is better:
```java
/**
 * The course code (e.g. COMP1130, COMP2400). In cases where the course
 * goes by multiple codes (e.g. COMP2300/ENGN2219), it will go by the
 * lowest-numbered COMP code.
 */
String name;
String getName() {
    return name;
}

/**
 * Returns the level of the course (e.g. 2 for COMP2400, etc.)
 */
int getLevel() {
    return level;
}
```

## In-Code Comments
Comments should be added where necessary to add additional information about *why* the code is doing something. Comments should not explain the *what*, this should be evident from the code (try to use https://en.wikipedia.org/wiki/Self-documenting_code).

e.g. This is bad
```java
/*
 * Calculate the total number of hours - subtracting one.
 */
 int totalHours = 0;
 for (Thingy a : lotsOfThings) {
    a += a.hours() - 1;
 }
```

e.g. This is good
```java
int totalHours = 0;
for (Thingy a : lotsOfThings) {
    /*
     * Need to subtract one because <give good reason here>
     */ 
    a += a.hours() - 1;
}
```

Alex prefers `/* */` comments for consistency with Javadoc comments, and because most useful comments will often span multiple lines (especially as we are keeping to a line-width limit). If you do use this style, ensure each line starts with ` *`, as follows:
```java
/*
 * Comment goes here...
 * And might continue onto the next line!
 */
```

## .gitignore
It should already be setup, but the output files, and the IDE specific settings should be in the `.gitignore` to reduce the number of merge conflicts later on.
