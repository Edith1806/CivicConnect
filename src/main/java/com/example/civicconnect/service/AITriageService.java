package com.example.civicconnect.service;

import com.example.civicconnect.entity.IssuePriority;
import org.springframework.stereotype.Service;

@Service
public class AITriageService {

    public IssuePriority determinePriority(String description) {
        if (description == null) {
            return IssuePriority.MEDIUM;
        }
        String text = description.toLowerCase();
        
        // High priority keywords indicating danger/safety issues
        if (text.contains("danger") || text.contains("accident") || text.contains("fire") 
                || text.contains("gas leak") || text.contains("injury") || text.contains("collapse")
                || text.contains("broken pipe") || text.contains("sinkhole") || text.contains("hazard")) {
            return IssuePriority.HIGH;
        }
        
        // Low priority keywords indicating minor cosmetic issues
        if (text.contains("cosmetic") || text.contains("paint") || text.contains("graffiti")
                || text.contains("litter") || text.contains("clean up")) {
            return IssuePriority.LOW;
        }
        
        return IssuePriority.MEDIUM;
    }
}
