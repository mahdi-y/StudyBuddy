package com.studybuddy.chatservice.service;

import com.studybuddy.chatservice.entity.Chat;
import com.studybuddy.chatservice.entity.StudyGroup;
import com.studybuddy.chatservice.entity.User;
import com.studybuddy.chatservice.repository.ChatRepository;
import com.studybuddy.chatservice.repository.StudyGroupRepository;
import com.studybuddy.chatservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StudyGroupService {

    @Autowired
    private StudyGroupRepository studyGroupRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public StudyGroup createStudyGroup(String groupName) {
        StudyGroup studyGroup = new StudyGroup();
        studyGroup.setName(groupName);

        Chat chat = new Chat();
        chat.setStudyGroup(studyGroup);
        studyGroup.setChat(chat);

        chatRepository.save(chat);
        return studyGroupRepository.save(studyGroup);
    }

    @Transactional(readOnly = true)
    public List<StudyGroup> getAllStudyGroups() {
        return studyGroupRepository.findAll();
    }

    public void addUserToStudyGroup(Long userId, Long studyGroupId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        StudyGroup studyGroup = studyGroupRepository.findById(studyGroupId)
                .orElseThrow(() -> new IllegalArgumentException("Study group not found"));

        studyGroup.getUsers().add(user);
        studyGroupRepository.save(studyGroup);
    }

    public List<StudyGroup> getStudyGroupsByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return studyGroupRepository.findAllByUsersContaining(user);
    }

}
