package Util;

public class Time {
    public enum Day {
        Monday,
        Tuesday,
        Wednesday,
        Thursday,
        Friday,
        Irrelevant;

        public static Day fromIndex(int index) {
            return switch (index) {
                case 0 -> Monday;
                case 1 -> Tuesday;
                case 2 -> Wednesday;
                case 3 -> Thursday;
                case 4 -> Friday;
                default -> Irrelevant;
            };
        }

        public int getIndex() {
            return switch (this) {
                case Monday -> 0;
                case Tuesday -> 1;
                case Wednesday -> 2;
                case Thursday -> 3;
                case Friday -> 4;
                case Irrelevant -> throw new RuntimeException("Time object not assigned to a given day!");
            };
        }
    }

    static public final int NUM_TIME_INDICES = (20 - 8) * 2;
    static public final int NUM_DAYS = 5;

    private final int timeIndex;
    private final Day day;

    public Time(Day day, int index) {
        if (index < 0 || index >= NUM_TIME_INDICES) {
            throw new RuntimeException("CourseTime out of range! (past 8pm or before 8am!)");
        }
        this.day = day;
        this.timeIndex = index;
    }

    public Time(Day day, int hour, int minute) {
        if (minute % 30 != 0) {
            throw new RuntimeException("CourseTime cannot be created on a non-multiple of 30 minutes!");
        }
        if (hour < 8 ||  hour >= 20) {
            throw new RuntimeException("CourseTime out of range! (past 8pm or before 8am!)");
        }
        this.day = day;
        this.timeIndex = (hour - 8) * 2 + (minute == 30 ? 1 : 0);
    }

    public Time(int index) {
        this(Day.Irrelevant, index);
    }

    public Time(int hour, int minute) {
        this(Day.Irrelevant, hour, minute);
    }

    public int getIndex() {
        return timeIndex;
    }

    public Day getDay() {
        return day;
    }
}
