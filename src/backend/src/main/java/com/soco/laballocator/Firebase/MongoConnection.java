package com.soco.laballocator.Firebase;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
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
import org.springframework.web.client.RestTemplate;

import java.io.*;
import java.net.URL;
import java.util.*;
import org.json.*;

public class MongoConnection {

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

                courses.add(new Course(
                        i,
                        course.get("course_code").toString(),
                        (Integer) course.get("est_size"),
                        (Integer) course.get("num_tutors"),
                        lab_minutes
                ));
            }

        } catch (Exception e) {
            System.out.printf("That's an error.\n");
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
                                    "title": "%s",
                                    "endTime": "%s",
                                    "id": "%s"
                                }
                                """.formatted(
                                        timeToDatabaseFormat(i),
                                        String.valueOf(day + 1),
                                        RoomTable.getInstance().getRoomFromId(room).toString().split(" ")[0],
                                        code,
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
