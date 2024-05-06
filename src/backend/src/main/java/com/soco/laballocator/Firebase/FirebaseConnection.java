package com.soco.laballocator.Firebase;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.*;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.soco.laballocator.Courses.Course;
import com.soco.laballocator.Courses.CourseTable;
import com.soco.laballocator.Rooms.RoomTable;
import com.soco.laballocator.Scheduling.Allocation;
import com.soco.laballocator.Scheduling.RoomAllocation;
import com.soco.laballocator.Scheduling.Schedule;
import com.soco.laballocator.Util.Time;

import java.io.*;
import java.util.*;

public class FirebaseConnection {
    static public Firestore db = null;

    public FirebaseConnection() {
        if (db != null) {
            return;
        }

        FileInputStream serviceAccount = null;
        try {
            String privateKeyFile = System.getProperty("user.home") + "/soco-lab-allocator-firebase-adminsdk-47s5x-29bbde27c5.json";
            System.out.printf("SECRET KEY IS AT %s\n", privateKeyFile);
            serviceAccount = new FileInputStream(privateKeyFile);
            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();
            FirebaseApp.initializeApp(options);

            db = FirestoreClient.getFirestore();

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * This function does all sorts of hideous asynchronous nonsense and casts between
     * generic objects types willy-nilly. "Here be dragons"
     */
    public void loadCourses() {
        List<Course> courses = new ArrayList<>();
        CollectionReference cr = db.collection("course_data_testing");

        // Prevent any asynchronous shenanigans by predetermining the ids instead of doing
        // an increment to a 'global' variable in a async handler
        HashMap<String, Integer> idHash = new HashMap<>();
        int id = 0;
        for (DocumentReference dr: cr.listDocuments()) {
            idHash.put(dr.getId(), id++);
        }
        for (DocumentReference dr: cr.listDocuments()) {
            dr.addSnapshotListener((value, error) -> {
                // The calls to .toString() are *required*. It will break otherwise.
                int students = Integer.parseInt(value.get("est_size").toString());
                int tutors = Integer.parseInt(value.get("num_tutors").toString());
                Map<String, Object> tutSize = (Map<String, Object>) value.get("tutorial_properties");
                synchronized (courses) {
                    courses.add(new Course(
                            idHash.get(dr.getId()),
                            dr.getId(),
                            students,
                            tutors,
                            Integer.parseInt(tutSize.get("tut_duration").toString())
                    ));
                }
            });
            dr.get();
        }

        // TODO: This is *very* cursed but we need to wait for all that stuff above to finish
        //       before we return from this function
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        CourseTable.getInstance().initCourses(courses);
    }

    public void clearPreviousResults() {
        CollectionReference cr = db.collection("timetable").document("backend-test-data").collection("tutorials");
        for (DocumentReference doc: cr.listDocuments()) {
            db.recursiveDelete(doc);
        }
    }

    public String timeToDatabaseFormat(int i) {
        int hour = i / 2 + 8;
        int min = (i % 2) * 30;
        return String.format("%d:02%d:00", hour, min);
    }

    public void uploadAllocation(String code, String lab, Allocation alloc, String roomName, int day, int startTime) {
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
        db.collection("timetable").document("backend-test-data").collection("tutorials").document(lab).set(addMap);
    }

    public void uploadSchedule(Schedule result) {
        clearPreviousResults();

        HashMap<String, Integer> labCounts = new HashMap<>();

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
                        uploadAllocation(
                                code,
                                String.format("%s_%d", code, labNum),
                                alloc,
                                RoomTable.getInstance().getRoomFromId(room).toString(),
                                day + 1,
                                i
                        );
                    }
                }
            }
        }

        System.out.printf("DONE!\n");

        /*
        DocumentReference dr = db.collection("test-backend-result").document("sample_run").collection("tutorials").document("COMP1100_1");
        dr.addSnapshotListener(new EventListener<DocumentSnapshot>() {
            @Override
            public void onEvent(@Nullable DocumentSnapshot value, @Nullable FirestoreException error) {
                System.out.printf("That's probably good...? %s\n", value.get("course_size"));
            }
        });

        clearPreviousResults();

        Map<String, Object> addMap = new HashMap<>() {{
            put("daysOfWeek", "3");
            put("startTime", "15:30:00");
            put("endTime", "17:30:00");
            put("location", "N114");
            put("id", "COMP1100_1");
            put("title", "COMP1100");

            put("backgroundColor", "#585868");
            put("borderColor", "#000000");
            put("durationEditable", false);
            put("editable", true);
            put("overlap", "true");
        }};
        db.collection("timetable").document("backend-test-data").collection("tutorials").document("COMP1100_3").set(addMap);
        */

    }
}
