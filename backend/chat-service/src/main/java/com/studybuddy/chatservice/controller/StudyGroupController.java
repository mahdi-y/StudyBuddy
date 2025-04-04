package com.studybuddy.chatservice.controller;

import com.studybuddy.chatservice.entity.StudyGroup;
import com.studybuddy.chatservice.service.StudyGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/study-groups")
public class StudyGroupController {

    @Autowired
    private StudyGroupService studyGroupService;

    @PostMapping
    public ResponseEntity<StudyGroup> createStudyGroup(@RequestParam String groupName) {
        StudyGroup studyGroup = studyGroupService.createStudyGroup(groupName);
        return new ResponseEntity<>(studyGroup, HttpStatus.CREATED);
    }

    @PostMapping("/studyGroup/{studyGroupId}/addUser/{userId}")
    public ResponseEntity<String> addUserToStudyGroup(@PathVariable Long studyGroupId, @PathVariable Long userId) {
        studyGroupService.addUserToStudyGroup(userId, studyGroupId);
        return ResponseEntity.ok("User added to study group");
    }

    @GetMapping
    public ResponseEntity<List<StudyGroup>> getAllStudyGroups() {
        List<StudyGroup> studyGroups = studyGroupService.getAllStudyGroups();
        return new ResponseEntity<>(studyGroups, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<StudyGroup>> getStudyGroupsByUserId(@PathVariable Long userId) {
        List<StudyGroup> studyGroups = studyGroupService.getStudyGroupsByUserId(userId);
        return ResponseEntity.ok(studyGroups);
    }

}
