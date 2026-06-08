package com.mediqueue.websocket;

import com.mediqueue.dto.AppointmentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class QueueBroadcastService {

    private final SimpMessagingTemplate messagingTemplate;

    // broadcast queue update to all patients in a department
    public void broadcastQueueUpdate(Long departmentId, Object data) {
        messagingTemplate.convertAndSend(
            "/topic/queue/" + departmentId, data
        );
    }

    // send personal update to one patient
    public void sendPatientUpdate(String tokenNumber, AppointmentResponse data) {
        messagingTemplate.convertAndSend(
            "/topic/patient/" + tokenNumber, data
        );
    }

    // broadcast emergency alert to all in department
    public void broadcastEmergency(Long departmentId, Map<String, Object> data) {
        messagingTemplate.convertAndSend(
            "/topic/emergency/" + departmentId, data
        );
    }

    // send "you are next" notification to patient
    public void sendYouAreNext(String tokenNumber, String doctorName) {
        messagingTemplate.convertAndSend(
            "/topic/patient/" + tokenNumber,
            Map.of(
                "type", "YOU_ARE_NEXT",
                "message", "You are next! Dr. " + doctorName + " will call you shortly.",
                "tokenNumber", tokenNumber
            )
        );
    }
}