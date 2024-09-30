package com.soco.laballocator.Connection;

import com.soco.laballocator.Courses.Course;
import com.soco.laballocator.Courses.CourseTable;
import com.soco.laballocator.Rooms.RoomTable;
import com.soco.laballocator.Scheduling.Allocation;
import com.soco.laballocator.Scheduling.RoomAllocation;
import com.soco.laballocator.Scheduling.Schedule;
import com.soco.laballocator.Util.Time;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;

import java.io.*;
import java.net.URL;
import java.util.*;
import org.json.*;

import static com.soco.laballocator.Util.Time.Day.*;

public class MongoConnection {

    private static Time.Day jsDayToInternal(String day) {
        return switch (day) {
            case "mon" -> Monday;
            case "tue" -> Tuesday;
            case "wed" -> Wednesday;
            case "thu" -> Thursday;
            case "fri" -> Friday;
            default -> throw new IllegalStateException("Unexpected value: " + day);
        };
    }

    public void loadCourses() {
        List<Course> courses = new ArrayList<>();

        try {
            String url = "http://laballoc-dev.cecs.anu.edu.au:3001/api/data?collection=course_data";

            /* We love Java */
            JSONArray arr = new JSONArray(new JSONTokener(new InputStreamReader((new URL(url).openStream()))));

            for (int i = 0; i < arr.length(); ++i) {
                JSONObject course = arr.getJSONObject(i);

                JSONObject tut_properties = course.getJSONObject("tutorial_properties");

                int lab_minutes = (Integer) tut_properties.get("tut_duration");

                ArrayList<Course.Lecture> lectures = new ArrayList<>();

                JSONArray lecs = course.getJSONArray("lectures");

                int earliestLectureGlobalIndex = Time.NUM_DAYS * Time.NUM_TIME_INDICES;

                for (int j = 0; j < lecs.length(); ++j) {
                    JSONObject lectureDetails = lecs.getJSONObject(j);
                    int hour = lectureDetails.getInt("time");
                    int minute = 0;
                    int lengthMinutes = lectureDetails.getInt("duration") * 60;
                    String dayStr = lectureDetails.getString("day");
                    Time.Day day = jsDayToInternal(dayStr);

                    lectures.add(new Course.Lecture(
                        new Time(day, hour, minute), lengthMinutes
                    ));

                    int globalIndex = day.getIndex() * Time.NUM_TIME_INDICES + (hour - 8) * 2 + minute / 30;
                    if (globalIndex < earliestLectureGlobalIndex) {
                        earliestLectureGlobalIndex = globalIndex;
                    }
                }


                /*
                 * There isn't explicit support for scheduling tutorials only on certain days.
                 * A quite lazy way of fixing that is to just pretend all of the unavailable days
                 * have an enormous all-day-long lecture on them, so nothing will be scheduled there.
                 */
                JSONArray tut_days = tut_properties.getJSONArray("tut_days");
                Set<Time.Day> unavailable_days = new HashSet<>(List.of(new Time.Day[]{
                        Monday, Tuesday, Wednesday, Thursday, Friday
                }));
                for (int j = 0; j < tut_days.length(); ++j) {
                    unavailable_days.remove(jsDayToInternal(tut_days.getString(j)));
                }
                for (Time.Day day : unavailable_days) {
                    System.out.printf("COURSE %s NOT AVAILABLE ON DAY %s\n", course.get("course_code").toString(), day.toString());
                    lectures.add(new Course.Lecture(
                            new Time(day, 8, 0), Time.NUM_TIME_INDICES * 30
                    ));
                }

                /*
                 * We do a similar trick to get "tut_start_time" and "tut_end_time"
                 * implemented without needing to change the rest of the backend.
                 */
                String startTime = tut_properties.getString("tut_start_time");
                String endTime = tut_properties.getString("tut_end_time");
                int startIndex = (Integer.parseInt(startTime.split(":")[0]) - 8) * 2 + (Integer.parseInt(startTime.split(":")[1]) / 30);
                int endIndex = (Integer.parseInt(endTime.split(":")[0]) - 8) * 2 + (Integer.parseInt(endTime.split(":")[1]) / 30);

                if (startIndex != 0) {
                    System.out.printf("COURSE %s has start index %d\n", course.get("course_code").toString(), startIndex);
                    for (int j = 0; j < Time.NUM_DAYS; ++j) {
                        lectures.add(new Course.Lecture(
                                new Time(Time.Day.values()[j], 8, 0), startIndex * 30
                        ));
                    }
                }
                if (endIndex != Time.NUM_TIME_INDICES) {
                    System.out.printf("COURSE %s has end index %d\n", course.get("course_code").toString(), endIndex);
                    for (int j = 0; j < Time.NUM_DAYS; ++j) {
                        lectures.add(new Course.Lecture(
                                new Time(Time.Day.values()[j], endIndex), (Time.NUM_TIME_INDICES - endIndex) * 30
                        ));
                    }
                }

                if (earliestLectureGlobalIndex < Time.NUM_DAYS * Time.NUM_TIME_INDICES && tut_properties.getBoolean("after_lecture")) {
                    System.out.printf("Classes can start with course %s on or after global index %d\n",
                            course.get("course_code").toString(), earliestLectureGlobalIndex
                    );

                    /*
                     * Again, we use the same trick to prevent tutorials going before the first lecture, if requested.
                     * No need to take lecture length into account, as the lecture itself is a lecture and thus blocks
                     * out the time.
                     */
                    for (int j = 0; j < earliestLectureGlobalIndex; ++j) {
                        lectures.add(new Course.Lecture(new Time(Time.Day.values()[j / Time.NUM_TIME_INDICES], j % Time.NUM_TIME_INDICES), 30));
                    }
                }

                courses.add(new Course(
                        i,
                        course.get("course_code").toString(),
                        (Integer) course.get("est_size"),
                        (Integer) course.get("num_tutors"),
                        lab_minutes,
                        lectures
                ));
            }

        } catch (Exception e) {
            e.printStackTrace();
            System.out.printf("That's an error. %s %s %s\n", e.getMessage());
            throw new RuntimeException(e);
        }

        System.out.printf("Backend is loading %d courses...\n", courses.size());

        CourseTable.getInstance().initCourses(courses);
    }

    public String timeToDatabaseFormat(int i) {
        int hour = i / 2 + 8;
        int min = (i % 2) * 30;
        return String.format("%d:%02d:00", hour, min);
    }

    public void uploadSchedule(Schedule result) {

        StringBuilder inner = new StringBuilder();
        HashMap<String, Integer> labCounts = new HashMap<>();

        Date date = new Date();
        long milliseconds = System.currentTimeMillis();

        boolean first = true;
        for (int room = 0; room < RoomTable.getInstance().totalNumberOfRooms(); ++room) {
            RoomAllocation ra = result.roomAllocations[room];
            for (int day = 0; day < Time.NUM_DAYS; ++day) {
                for (int i = 0; i < Time.NUM_TIME_INDICES; ++i) {
                    Allocation alloc = ra.getAllocations()[day][i];
                    if (alloc != null && !alloc.isContinuation()) {
                        String code = alloc.getCourse().toString();
                        int labNum = 1;
                        if (labCounts.containsKey(code)) {
                            labNum = labCounts.get(code) + 1;
                        }
                        labCounts.put(code, labNum);

                        if (!first) {
                            inner.append(",");
                        }
                        first = false;
                        inner.append("""
                                {
                                    "startTime": "%s",
                                    "daysOfWeek": "%s",
                                    "location": "%s",
                                    "title": "%s_%d",
                                    "endTime": "%s",
                                    "courseCode": "%s"
                                }
                                """.formatted(
                                        timeToDatabaseFormat(i),
                                        String.valueOf(day + 1),
                                        RoomTable.getInstance().getRoomFromId(room).toString().split(" ")[0],
                                        code, labNum,
                                        timeToDatabaseFormat(i + alloc.getCourse().getLengthInMinutes() / 30),
                                        String.valueOf(alloc.getCourse().getId())
                        ));
                    }
                }
            }
        }

        String jsonData = """
                {
                    "timetable": [%s],
                    "created": "%s"
                }
                """.formatted(inner, date.toString());

        System.out.printf("%s\n\n\n\n", jsonData);

        HttpClient httpClient = new DefaultHttpClient();
        try {
            HttpPost request = new HttpPost("http://laballoc-dev.cecs.anu.edu.au:3001/api/upload?collection=timetable_data");
            StringEntity params = new StringEntity(jsonData);
            request.addHeader("content-type", "application/json");
            request.addHeader("Accept","application/json");
            request.setEntity(params);
            HttpResponse response = httpClient.execute(request);

            System.out.printf("Request was sent...\n");

            InputStream inputStream = response.getEntity().getContent();
            InputStreamReader inputStreamReader = new InputStreamReader(inputStream);
            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);
            StringBuilder stringBuilder = new StringBuilder();
            String bufferedStrChunk = null;
            while((bufferedStrChunk = bufferedReader.readLine()) != null){
                stringBuilder.append(bufferedStrChunk);
            }
            System.out.printf("%s\n", stringBuilder.toString());

        } catch (Exception ex) {
            System.out.printf("now that's bad.\n");
            ex.printStackTrace();

        } finally {
            httpClient.getConnectionManager().shutdown();
        }
    }
}
