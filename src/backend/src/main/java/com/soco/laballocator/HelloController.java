package com.soco.laballocator;

import com.soco.laballocator.Firebase.FirebaseConnection;
import com.soco.laballocator.Firebase.MongoConnection;
import com.soco.laballocator.Scheduling.Schedule;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.util.concurrent.CompletableFuture;

@RestController
public class HelloController {

    String status = "Ready";

    @GetMapping("/")
    @CrossOrigin
    public String index() {
        System.out.print("THE SERVER SERVED THE HOMEPAGE.\n");
        return "<a href='/start'>Click here to start allocating...</a>";
    }

    Schedule serverResult = null;

    @GetMapping("/res")
    @CrossOrigin
    public String results() {
        if (serverResult == null) {
            return """
                    The backend is still generating the result... please wait...
                    <script>
                            var timer = setTimeout(function() {
                                window.location='/res'
                            }, 3000);
                        </script>""";
        } else {
            // https://stackoverflow.com/questions/8708342/redirect-console-output-to-string-in-java
            ByteArrayOutputStream res = new ByteArrayOutputStream();
            PrintStream ps = new PrintStream(res);
            PrintStream old = System.out;
            System.setOut(ps);
            serverResult.print();
            System.out.flush();
            System.setOut(old);
            return "<code>" + res.toString().replace("\n", "</code><br><code>").replace(" ", "&nbsp;") + "</code>";
        }
    }

    @GetMapping("/status")
    @CrossOrigin
    public String getStatus() {
        return status;
    }

    @GetMapping("/start")
    @CrossOrigin
    public String start() {
        serverResult = null;

        CompletableFuture<Schedule> future = CompletableFuture.supplyAsync(() -> {
            status = "Running";
            Solver solver = new Solver();
            try {
                System.out.printf("A\n");
                Schedule schedule = solver.solve();
                System.out.printf("B\n");
                MongoConnection fb = new MongoConnection();
                System.out.printf("C\n");
                fb.uploadSchedule(schedule);
                schedule.print();
                serverResult = schedule;
                status = "Ready";
                return schedule;

            } catch (Exception e) {
                status = "Error";
                return null;
            }
        });

        return "The backend should be running...<br><a href='/res'>Click here to see results...</a>";
    }
}