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
import java.net.MalformedURLException;
import java.net.URL;
import java.time.Instant;
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

                int lab_minutes;

                try {
                    lab_minutes = (int) (((Double) course.get("lab_duration")) * 60);
                } catch (ClassCastException e) {
                    lab_minutes = (Integer) course.get("lab_duration");
                }

                courses.add(new Course(
                        i,
                        course.get("course_code").toString(),
                        (Integer) course.get("course_size"),
                        (Integer) course.get("tutors"),
                        lab_minutes
                ));
            }

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        CourseTable.getInstance().initCourses(courses);
    }

    public void clearPreviousResults() {
        /*try {
            String url = "http://laballoc-dev.cecs.anu.edu.au:3001/api/data?collection=timetable_data";
            JSONArray arr = new JSONArray(new JSONTokener(new InputStreamReader((new URL(url).openStream()))));

            for (int i = 0; i < arr.length(); ++i) {

                break;
            }

        } catch (Exception e) {

        }*/


        /*CollectionReference cr = db.collection("timetable").document("backend-test-data").collection("tutorials");
        for (DocumentReference doc: cr.listDocuments()) {
            db.recursiveDelete(doc);
        }*/
    }

    public String timeToDatabaseFormat(int i) {
        int hour = i / 2 + 8;
        int min = (i % 2) * 30;
        return String.format("%d:%02d:00", hour, min);
    }

    public void uploadAllocation(long time, Date date, String code, String lab, Allocation alloc, String roomName, int day, int startTime) {

        /*System.out.printf("The time is: %d\n", Instant.now().getEpochSecond());

        Map<String, Object> addMap = new HashMap<>() {{
            put("daysOfWeek", String.valueOf(day));
            put("startTime", timeToDatabaseFormat(startTime));
            put("endTime", timeToDatabaseFormat(startTime + alloc.getCourse().getLengthInMinutes() / 30));
            put("location", roomName.split(" ")[0]);
            put("id", lab);
            put("title", code);

            put("backgroundColor", "#585868");
            put("borderColor", "#000000");
            put("durationEditable", false);
            put("editable", true);
            put("overlap", true);
        }};

        Map<String, Object> createdField = new HashMap<>() {{
            put("created", date);
        }};
        db.collection("timetable").document(String.valueOf(time)).create(createdField);
        db.collection("timetable").document(String.valueOf(time)).collection("tutorials").document(lab).set(addMap);*/
    }

    public static void main(String[] args) {
        new MongoConnection().uploadSchedule(new Schedule());
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
                                    "dasyOfWeek": "%s",
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
                """.formatted(inner, "9/6/2024, 14:14:14 PM" /*date.toString()*/);

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
