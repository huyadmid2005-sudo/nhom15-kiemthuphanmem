package vn.edu.it6013.healthcare;

import com.sun.net.httpserver.HttpServer;
import vn.edu.it6013.healthcare.model.*;
import vn.edu.it6013.healthcare.repository.InMemoryDatabase;
import vn.edu.it6013.healthcare.service.*;
import vn.edu.it6013.healthcare.web.HttpUtil;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.file.*;
import java.time.*;
import java.util.Map;

public class Application {
    public static void main(String[] args) throws Exception {
        InMemoryDatabase db = new InMemoryDatabase();
        db.seedBasicData();
        AppointmentService service = new AppointmentService(db);

        LocalDate tomorrow = LocalDate.now().plusDays(1);
        service.createSlots("D001", tomorrow, LocalTime.of(9, 0), LocalTime.of(11, 0), 30);
        service.createSlots("D002", tomorrow.plusDays(1), LocalTime.of(13, 0), LocalTime.of(15, 0), 30);

        int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "8088"));
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

        server.createContext("/", exchange -> {
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                HttpUtil.json(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }
            Path file = Path.of("web", "index.html");
            HttpUtil.html(exchange, 200, Files.readString(file));
        });

        server.createContext("/api/doctors", exchange -> {
            try {
                String body = service.doctors().stream()
                        .map(d -> "{\"id\":\"" + HttpUtil.esc(d.id()) + "\",\"name\":\""
                                + HttpUtil.esc(d.name()) + "\",\"department\":\""
                                + HttpUtil.esc(d.department()) + "\"}")
                        .collect(java.util.stream.Collectors.joining(",", "[", "]"));
                HttpUtil.json(exchange, 200, body);
            } catch (Exception ex) {
                HttpUtil.json(exchange, 500, error(ex));
            }
        });

        server.createContext("/api/slots", exchange -> {
            try {
                if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                    String body = service.availableSlots().stream()
                            .map(s -> "{\"id\":" + s.getId()
                                    + ",\"doctorId\":\"" + HttpUtil.esc(s.getDoctorId()) + "\""
                                    + ",\"date\":\"" + s.getDate() + "\""
                                    + ",\"startTime\":\"" + s.getStartTime() + "\""
                                    + ",\"endTime\":\"" + s.getEndTime() + "\"}")
                            .collect(java.util.stream.Collectors.joining(",", "[", "]"));
                    HttpUtil.json(exchange, 200, body);
                } else if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    Map<String, String> q = HttpUtil.query(exchange);
                    var slots = service.createSlots(
                            q.get("doctorId"),
                            LocalDate.parse(q.get("date")),
                            LocalTime.parse(q.get("start")),
                            LocalTime.parse(q.get("end")),
                            Integer.parseInt(q.get("minutes")));
                    HttpUtil.json(exchange, 201, "{\"created\":" + slots.size() + "}");
                } else {
                    HttpUtil.json(exchange, 405, "{\"error\":\"Method not allowed\"}");
                }
            } catch (DomainException | IllegalArgumentException ex) {
                HttpUtil.json(exchange, 400, error(ex));
            } catch (Exception ex) {
                HttpUtil.json(exchange, 500, error(ex));
            }
        });

        server.createContext("/api/book", exchange -> {
            try {
                if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    HttpUtil.json(exchange, 405, "{\"error\":\"Method not allowed\"}");
                    return;
                }
                Map<String, String> q = HttpUtil.query(exchange);
                Appointment appointment = service.book(
                        q.get("patientId"),
                        Long.parseLong(q.get("slotId")),
                        AppointmentType.valueOf(q.getOrDefault("type", "IN_PERSON")));
                HttpUtil.json(exchange, 201,
                        "{\"appointmentId\":" + appointment.getId()
                                + ",\"status\":\"" + appointment.getStatus() + "\"}");
            } catch (DomainException | IllegalArgumentException | NullPointerException ex) {
                HttpUtil.json(exchange, 400, error(ex));
            } catch (Exception ex) {
                HttpUtil.json(exchange, 500, error(ex));
            }
        });

        server.createContext("/api/cancel", exchange -> {
            try {
                if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    HttpUtil.json(exchange, 405, "{\"error\":\"Method not allowed\"}");
                    return;
                }
                Map<String, String> q = HttpUtil.query(exchange);
                Appointment appointment = service.cancel(Long.parseLong(q.get("appointmentId")));
                HttpUtil.json(exchange, 200,
                        "{\"appointmentId\":" + appointment.getId()
                                + ",\"status\":\"" + appointment.getStatus() + "\"}");
            } catch (DomainException | IllegalArgumentException | NullPointerException ex) {
                HttpUtil.json(exchange, 400, error(ex));
            } catch (Exception ex) {
                HttpUtil.json(exchange, 500, error(ex));
            }
        });

        server.createContext("/api/appointments", exchange -> {
            try {
                Map<String, String> q = HttpUtil.query(exchange);
                String patientId = q.getOrDefault("patientId", "P001");
                String body = service.appointmentsOf(patientId).stream()
                        .map(a -> "{\"id\":" + a.getId()
                                + ",\"patientId\":\"" + HttpUtil.esc(a.getPatientId()) + "\""
                                + ",\"slotId\":" + a.getSlotId()
                                + ",\"doctorId\":\"" + HttpUtil.esc(a.getDoctorId()) + "\""
                                + ",\"type\":\"" + a.getType() + "\""
                                + ",\"status\":\"" + a.getStatus() + "\"}")
                        .collect(java.util.stream.Collectors.joining(",", "[", "]"));
                HttpUtil.json(exchange, 200, body);
            } catch (Exception ex) {
                HttpUtil.json(exchange, 500, error(ex));
            }
        });

        server.setExecutor(null);
        server.start();
        System.out.println("Healthcare System WhiteBox Edition");
        System.out.println("Open: http://localhost:" + port);
        System.out.println("Demo patient: P001 (active), P002 (inactive)");
    }

    private static String error(Exception ex) {
        return "{\"error\":\"" + HttpUtil.esc(ex.getMessage()) + "\"}";
    }
}
