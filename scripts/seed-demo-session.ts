import { PrismaClient, ProjectStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Fixed session ID for demo purposes
const DEMO_SESSION_ID = 'demo-flexivision-session';

async function main() {
  console.log('🌱 Seeding demo session...');

  // Clean up existing demo session if it exists
  const existingProject = await prisma.project.findFirst({
    where: { sessionId: DEMO_SESSION_ID },
  });

  if (existingProject) {
    console.log('🧹 Cleaning up existing demo session...');
    await prisma.generatedPrd.deleteMany({
      where: { projectId: existingProject.id },
    });
    await prisma.interviewAnswer.deleteMany({
      where: { projectId: existingProject.id },
    });
    await prisma.project.delete({
      where: { id: existingProject.id },
    });
  }

  // Create project
  console.log('📝 Creating project...');
  const project = await prisma.project.create({
    data: {
      sessionId: DEMO_SESSION_ID,
      rawIdea:
        'FlexiVision is a mobile app for yoga and mobility training that uses the phone camera for on-device pose tracking, audio feedback, voice control, and local workout history.',
      status: ProjectStatus.COMPLETED,
    },
  });

  // Create interview Q&A
  console.log('💬 Creating interview answers...');
  await prisma.interviewAnswer.createMany({
    data: [
      {
        projectId: project.id,
        sequenceNumber: 1,
        question:
          'What is the primary target audience for FlexiVision?',
        answer:
          'Individual yoga practitioners and fitness enthusiasts who want to practice at home with real-time form feedback. Age range 25-45, tech-savvy, health-conscious.',
      },
      {
        projectId: project.id,
        sequenceNumber: 2,
        question:
          'What are the core features you want to implement first?',
        answer:
          'Real-time pose tracking using device camera, audio feedback for form corrections, voice-activated workout controls, and local storage of workout history without cloud dependency.',
      },
      {
        projectId: project.id,
        sequenceNumber: 3,
        question:
          'What technical constraints or preferences do you have?',
        answer:
          'Must work offline, on-device ML processing for privacy, support iOS and Android, minimal battery drain, accessible UI for all fitness levels.',
      },
      {
        projectId: project.id,
        sequenceNumber: 4,
        question:
          'How do you plan to monetize FlexiVision?',
        answer:
          'Freemium model with basic workouts free, premium subscription ($9.99/month) for advanced programs, custom routines, and detailed analytics.',
      },
    ],
  });

  // Create comprehensive PRD
  console.log('📄 Creating generated PRD...');
  const prdContent = `# FlexiVision - Product Requirements Document

## 1. Executive Summary

**Product Name:** FlexiVision  
**Version:** 1.0.0  
**Document Status:** Draft  
**Last Updated:** ${new Date().toISOString().split('T')[0]}

### Vision Statement
FlexiVision is a mobile application that revolutionizes at-home yoga and mobility training by leveraging on-device computer vision to provide real-time pose tracking, audio feedback, and voice control—all without requiring an internet connection or cloud processing.

### Problem Statement
Current yoga and fitness apps rely on pre-recorded videos without personalized feedback. Users practicing at home often develop poor form, leading to reduced effectiveness and potential injury. Existing pose-tracking solutions require cloud connectivity, raising privacy concerns and limiting accessibility.

### Solution Overview
FlexiVision uses the device's camera and on-device machine learning to track user poses in real-time, providing instant audio feedback for form corrections. The app operates entirely offline, preserving user privacy while offering personalized guidance through voice commands and local workout history.

---

## 2. User Personas

### Primary Persona: Sarah - The Home Yogi
- **Age:** 32
- **Occupation:** Marketing Manager
- **Goals:** Maintain flexibility, reduce stress, practice yoga consistently at home
- **Pain Points:** No real-time feedback on form, difficulty staying motivated, concerns about privacy with camera-based apps
- **Tech Proficiency:** High - comfortable with mobile apps and fitness trackers

### Secondary Persona: Marcus - The Mobility Seeker
- **Age:** 28
- **Occupation:** Software Developer
- **Goals:** Improve posture, reduce back pain from desk work, build consistent stretching routine
- **Pain Points:** Limited time for gym visits, needs guidance on proper form, wants data-driven progress tracking
- **Tech Proficiency:** Very High - early adopter, privacy-conscious

---

## 3. User Stories

### Epic 1: Real-Time Pose Tracking
**US-001:** As a user, I want the app to track my body position using my phone camera so I can receive feedback on my yoga poses without manual input.  
**Acceptance Criteria:**
- Camera feed displays user's body in real-time
- Key body landmarks (joints, spine) are detected and tracked
- Tracking works in various lighting conditions
- Frame rate is minimum 15 FPS for smooth feedback

**US-002:** As a user, I want to receive audio feedback when my form is incorrect so I can adjust my pose immediately.  
**Acceptance Criteria:**
- App compares current pose to reference pose
- Deviation threshold triggers audio cues (e.g., "Straighten your back")
- Feedback is clear, concise, and actionable
- Audio can be customized (volume, voice type)

### Epic 2: Voice Control
**US-003:** As a user, I want to control the app with voice commands so I can navigate workouts hands-free while exercising.  
**Acceptance Criteria:**
- Voice commands work offline
- Supported commands: start, pause, next pose, repeat, finish
- Works with ambient noise typical of home environments
- Visual confirmation of recognized commands

**US-004:** As a user, I want to create custom voice shortcuts for frequently used actions so I can personalize my workout experience.  
**Acceptance Criteria:**
- Users can define custom phrases for standard actions
- Shortcuts are saved locally
- Maximum 10 custom shortcuts per user

### Epic 3: Workout History & Progress
**US-005:** As a user, I want to view my workout history stored locally on my device so I can track my consistency and progress over time.  
**Acceptance Criteria:**
- All workout sessions saved with date, duration, poses completed
- Data stored in device's local database (encrypted)
- History accessible offline
- Export option to CSV format

**US-006:** As a user, I want to see visual progress charts showing my form improvement so I can stay motivated.  
**Acceptance Criteria:**
- Charts display form accuracy over time per pose
- Weekly and monthly views available
- Milestones and achievements highlighted
- Data visualization updates in real-time

### Epic 4: Offline Functionality
**US-007:** As a user, I want the entire app to function without internet connectivity so I can practice anywhere without privacy concerns.  
**Acceptance Criteria:**
- All ML models bundled with app installation
- No network requests during workout sessions
- Workout library accessible offline
- Settings and preferences synced locally

---

## 4. Functional Requirements

### 4.1 Pose Tracking System
- **FR-001:** Implement MediaPipe Pose for real-time skeletal tracking (33 body landmarks)
- **FR-002:** Support both front-facing and rear-facing cameras
- **FR-003:** Maintain tracking accuracy >90% for 15 common yoga poses
- **FR-004:** Detect and handle occlusions (e.g., hand blocking torso)
- **FR-005:** Calculate joint angles and spine alignment for form analysis

### 4.2 Audio Feedback Engine
- **FR-006:** Generate contextual audio cues based on pose deviation
- **FR-007:** Queue multiple feedback messages with priority system
- **FR-008:** Support text-to-speech in English (expandable to other languages)
- **FR-009:** Allow users to adjust feedback frequency (real-time, periodic, on-demand)

### 4.3 Voice Command System
- **FR-010:** Implement on-device speech recognition (iOS: Speech Framework, Android: SpeechRecognizer)
- **FR-011:** Process voice commands with <500ms latency
- **FR-012:** Provide visual feedback for recognized commands
- **FR-013:** Handle misrecognitions gracefully with confirmation prompts

### 4.4 Data Storage & Privacy
- **FR-014:** Store all user data in SQLite database with AES-256 encryption
- **FR-015:** Implement automatic data cleanup for entries >1 year old
- **FR-016:** Provide data export functionality in standard formats
- **FR-017:** Zero network transmission of user images or workout data

### 4.5 Workout Library
- **FR-018:** Pre-package 50 yoga poses with reference images and descriptions
- **FR-019:** Create 10 guided workout routines (beginner to advanced)
- **FR-020:** Allow users to create custom sequences
- **FR-021:** Support pose hold times, transitions, and rest periods

---

## 5. Non-Functional Requirements

### 5.1 Performance
- **NFR-001:** App launch time <3 seconds on mid-range devices
- **NFR-002:** Camera-to-feedback latency <200ms
- **NFR-003:** Battery consumption <5% per 30-minute session
- **NFR-004:** Memory footprint <150MB during active tracking

### 5.2 Compatibility
- **NFR-005:** Support iOS 14+ and Android 10+
- **NFR-006:** Optimize for devices with 3GB+ RAM
- **NFR-007:** Responsive UI for screen sizes 5"-7"

### 5.3 Accessibility
- **NFR-008:** VoiceOver/TalkBack support for visually impaired users
- **NFR-009:** High contrast mode for low vision users
- **NFR-010:** Adjustable font sizes (up to 200%)
- **NFR-011:** Support for both portrait and landscape orientations

### 5.4 Security
- **NFR-012:** No third-party analytics or tracking
- **NFR-013:** Local authentication (biometric or PIN) for app access
- **NFR-014:** Secure deletion of camera frames after processing

---

## 6. Technical Architecture

### 6.1 Technology Stack
- **Mobile Framework:** React Native 0.73+
- **ML Framework:** TensorFlow Lite with MediaPipe Pose
- **Database:** SQLite with SQLCipher encryption
- **State Management:** Redux Toolkit
- **Voice Recognition:** Native iOS Speech Framework / Android SpeechRecognizer
- **Camera:** React Native Camera / Expo Camera

### 6.2 System Architecture

\`\`\`mermaid
graph TD
    A[User Interface Layer] --> B[Workout Controller];
    A --> C[Settings Manager];
    B --> D[Pose Tracking Engine];
    B --> E[Audio Feedback System];
    B --> F[Voice Command Handler];
    D --> G[Camera Module];
    D --> H[ML Model - MediaPipe Pose];
    E --> I[Text-to-Speech Engine];
    F --> J[Speech Recognition];
    B --> K[Local Database];
    K --> L[Workout History];
    K --> M[User Preferences];
    K --> N[Custom Routines];
    
    style D fill:#e1f5ff
    style H fill:#ffe1e1
    style K fill:#e1ffe1
\`\`\`

### 6.3 Data Flow

\`\`\`mermaid
sequenceDiagram
    participant User
    participant UI
    participant Camera
    participant ML Model
    participant Feedback
    participant Database
    
    User->>UI: Start Workout
    UI->>Camera: Initialize Camera
    Camera->>ML Model: Stream Frames
    loop Every Frame
        ML Model->>ML Model: Detect Pose Landmarks
        ML Model->>Feedback: Analyze Form
        alt Form Correct
            Feedback->>UI: Visual Confirmation
        else Form Incorrect
            Feedback->>UI: Audio + Visual Cue
        end
    end
    User->>UI: End Workout
    UI->>Database: Save Session Data
    Database->>UI: Confirm Save
    UI->>User: Show Summary
\`\`\`

---

## 7. Data Model

\`\`\`mermaid
erDiagram
    USER ||--o{ WORKOUT_SESSION : completes
    USER ||--o{ CUSTOM_ROUTINE : creates
    USER ||--|| USER_PREFERENCES : has
    WORKOUT_SESSION ||--o{ POSE_INSTANCE : contains
    POSE_INSTANCE }o--|| POSE_LIBRARY : references
    CUSTOM_ROUTINE ||--o{ POSE_LIBRARY : includes
    
    USER {
        string userId PK
        string deviceId
        datetime createdAt
        datetime lastActiveAt
    }
    
    WORKOUT_SESSION {
        string sessionId PK
        string userId FK
        datetime startTime
        datetime endTime
        int totalPoses
        float avgAccuracy
        int caloriesBurned
    }
    
    POSE_INSTANCE {
        string instanceId PK
        string sessionId FK
        string poseId FK
        datetime timestamp
        int holdDuration
        float accuracyScore
        json landmarkData
    }
    
    POSE_LIBRARY {
        string poseId PK
        string poseName
        string category
        string difficulty
        string description
        json referenceLandmarks
        string imageUrl
    }
    
    CUSTOM_ROUTINE {
        string routineId PK
        string userId FK
        string routineName
        json poseSequence
        int estimatedDuration
        datetime createdAt
    }
    
    USER_PREFERENCES {
        string prefId PK
        string userId FK
        bool audioFeedbackEnabled
        float feedbackVolume
        string voiceType
        bool voiceControlEnabled
        json customVoiceShortcuts
    }
\`\`\`

---

## 8. Implementation Roadmap

\`\`\`mermaid
gantt
    title FlexiVision Development Timeline
    dateFormat YYYY-MM-DD
    section Phase 1: Foundation
    Project Setup & Architecture       :a1, 2024-01-01, 7d
    Camera Integration                 :a2, after a1, 10d
    ML Model Integration (MediaPipe)   :a3, after a2, 14d
    Basic UI Components                :a4, after a1, 12d
    
    section Phase 2: Core Features
    Pose Tracking Engine              :b1, after a3, 21d
    Audio Feedback System             :b2, after a3, 14d
    Voice Command Handler             :b3, after a4, 10d
    Local Database Setup              :b4, after a4, 7d
    
    section Phase 3: Workouts
    Pose Library (50 poses)           :c1, after b1, 14d
    Workout Routines                  :c2, after c1, 10d
    Workout History UI                :c3, after b4, 12d
    Progress Charts                   :c4, after c3, 8d
    
    section Phase 4: Polish
    Performance Optimization          :d1, after c2, 14d
    Accessibility Features            :d2, after c4, 10d
    Security Hardening                :d3, after d1, 7d
    User Testing & Bug Fixes          :d4, after d2, 14d
    
    section Phase 5: Launch
    App Store Submission              :e1, after d4, 7d
    Beta Testing                      :e2, after e1, 14d
    Production Release                :e3, after e2, 3d
\`\`\`

---

## 9. Feature Priority Matrix

| Feature | User Impact | Implementation Effort | Priority | Target Phase |
|---------|-------------|----------------------|----------|--------------|
| Real-Time Pose Tracking | High | High | P0 | Phase 2 |
| Audio Feedback | High | Medium | P0 | Phase 2 |
| Voice Commands | Medium | Medium | P1 | Phase 2 |
| Workout History | High | Low | P0 | Phase 3 |
| Progress Charts | Medium | Medium | P1 | Phase 3 |
| Custom Routines | Medium | Low | P1 | Phase 3 |
| 50-Pose Library | High | Medium | P0 | Phase 3 |
| Offline ML Processing | High | High | P0 | Phase 2 |
| Data Encryption | High | Low | P0 | Phase 2 |
| Custom Voice Shortcuts | Low | Low | P2 | Phase 4 |
| Multi-Language Support | Low | Medium | P3 | Post-Launch |
| Landscape Mode | Low | Low | P2 | Phase 4 |

**Priority Levels:**
- **P0:** Must-have for MVP launch
- **P1:** Should-have for competitive offering
- **P2:** Nice-to-have for enhanced experience
- **P3:** Future enhancement

---

## 10. Risk Assessment & Mitigation

| Risk | Likelihood | Impact | Mitigation Strategy |
|------|------------|--------|---------------------|
| ML Model Accuracy Below Target | High | High | Extensive training data collection, fallback to simpler models, user feedback loop for continuous improvement |
| Battery Drain Exceeds Limits | Medium | High | Profile and optimize ML inference, reduce frame processing rate, implement power-saving modes |
| Device Compatibility Issues | Medium | Medium | Extensive device testing matrix, graceful degradation on low-end devices, minimum spec enforcement |
| Voice Recognition Accuracy | Medium | Medium | Use proven native frameworks, implement command confirmation, allow manual fallback |
| User Adoption Challenges | Medium | High | Comprehensive onboarding flow, tutorial videos, free trial period, influencer partnerships |
| Privacy Concerns | Low | High | Transparent privacy policy, third-party security audit, open-source ML components, user education |
| Competitor Fast-Follower | High | Medium | Build strong brand, focus on user experience, rapid iteration based on feedback, network effects through social features (Phase 2) |
| App Store Rejection | Low | High | Review guidelines compliance checklist, pre-submission testing, legal review of terms and privacy policy |

---

## 11. Success Metrics (KPIs)

### Primary Metrics
- **Daily Active Users (DAU):** Target 10,000 within 3 months post-launch
- **Session Duration:** Average 25+ minutes per workout session
- **Retention Rate:** 40% day-7 retention, 25% day-30 retention
- **Premium Conversion:** 8% of free users convert to paid within 30 days

### Secondary Metrics
- **Pose Accuracy:** 90%+ form detection accuracy across all poses
- **Voice Command Success Rate:** 95%+ recognition accuracy
- **App Store Rating:** Maintain 4.5+ stars
- **Battery Impact:** <5% battery consumption per 30-minute session
- **Crash Rate:** <1% crash-free sessions

### Engagement Metrics
- **Workouts Per Week:** Average 3+ sessions per active user
- **Pose Completion Rate:** 85%+ of started poses are completed
- **Custom Routine Creation:** 30% of users create at least one custom routine

---

## 12. Monetization Strategy

### Free Tier
- Access to 20 basic yoga poses
- 3 guided workout routines (beginner level)
- Limited workout history (last 7 days)
- Basic progress tracking

### Premium Subscription ($9.99/month or $79.99/year)
- Full library of 50+ poses
- 10+ guided routines (all difficulty levels)
- Unlimited workout history and export
- Advanced progress analytics with AI insights
- Custom routine builder (unlimited)
- Priority customer support
- Early access to new features

### Future Revenue Streams (Post-MVP)
- In-app purchases for specialized content (e.g., prenatal yoga, injury recovery)
- B2B licensing to gyms, studios, and corporate wellness programs
- White-label solution for fitness influencers and trainers

---

## 13. Go-to-Market Strategy

### Pre-Launch (Months 1-2)
- Build landing page with email signup for beta access
- Create social media presence (Instagram, TikTok, YouTube)
- Partner with 5-10 yoga influencers for early beta testing
- Produce demo videos showcasing key features

### Launch (Month 3)
- Soft launch in select regions (US, UK, Canada)
- Press release to tech and fitness media outlets
- App Store Optimization (ASO) with targeted keywords
- Paid advertising on Meta and Google (targeting yoga practitioners)
- Referral program: 1 month free premium for each successful referral

### Post-Launch (Months 4-6)
- Gather user feedback and iterate rapidly
- Expand to additional markets (EU, Australia, India)
- Collaborate with fitness apps for cross-promotion
- Host virtual yoga challenges and competitions
- Launch affiliate program for fitness bloggers

---

## 14. Compliance & Legal Considerations

### Privacy Regulations
- **GDPR Compliance:** User consent for data collection, right to data deletion, data portability
- **CCPA Compliance:** Transparent data usage disclosure, opt-out mechanisms
- **COPPA Compliance:** Age verification (13+ requirement), parental consent for minors

### Health & Fitness Disclaimers
- Clear disclaimer that app is not a substitute for professional medical advice
- Warning against overexertion and injury risk
- Emergency contact option within app

### Intellectual Property
- Licensing for any third-party yoga pose images or descriptions
- Trademark registration for "FlexiVision" brand
- Open-source license compliance for ML models and libraries

### Accessibility Standards
- WCAG 2.1 Level AA compliance for UI components
- Testing with assistive technologies (VoiceOver, TalkBack)

---

## 15. AI Coding Agent Prompt

**Objective:** You are tasked with implementing the FlexiVision mobile application as described in this PRD. Focus on building a robust, offline-first yoga and mobility training app with real-time pose tracking, audio feedback, and voice control.

**Technology Stack:**
- React Native 0.73+ for cross-platform mobile development
- TensorFlow Lite with MediaPipe Pose for on-device ML inference
- SQLite with SQLCipher for encrypted local data storage
- Redux Toolkit for state management
- Native iOS Speech Framework and Android SpeechRecognizer for voice commands
- React Native Camera for camera access

**Key Implementation Priorities:**

1. **Camera & Pose Tracking:**
   - Integrate React Native Camera with appropriate permissions handling
   - Load MediaPipe Pose TFLite model and run inference on camera frames
   - Extract 33 body landmarks per frame and calculate joint angles
   - Implement pose comparison algorithm (cosine similarity or angle deviation)
   - Optimize for 15+ FPS on mid-range devices

2. **Audio Feedback System:**
   - Build feedback message queue with priority handling
   - Integrate native TTS engines (iOS: AVSpeechSynthesizer, Android: TextToSpeech)
   - Create contextual feedback templates based on pose deviations
   - Implement user-adjustable feedback frequency settings

3. **Voice Command Handler:**
   - Set up native speech recognition with offline capability
   - Define command vocabulary (start, pause, next, repeat, finish)
   - Implement command confirmation UI with visual feedback
   - Handle misrecognitions gracefully with retry prompts

4. **Local Database Architecture:**
   - Design SQLite schema for User, WorkoutSession, PoseInstance, PoseLibrary, CustomRoutine, UserPreferences
   - Implement SQLCipher encryption for data at rest
   - Create repository pattern for data access layer
   - Build migration strategy for schema updates

5. **Workout Flow Controller:**
   - Implement workout session lifecycle (start, pause, resume, end)
   - Track pose progression and hold times
   - Calculate real-time accuracy scores
   - Save session data locally upon completion

6. **UI Components:**
   - Design camera overlay with skeletal visualization
   - Create workout timer and progress indicators
   - Build settings screen for audio, voice, and privacy preferences
   - Implement workout history list and detail views
   - Design progress charts using charting library (e.g., Victory Native)

7. **Performance Optimization:**
   - Profile and optimize ML inference latency
   - Implement frame skipping strategy for resource management
   - Use native modules for performance-critical operations
   - Monitor and optimize memory usage during tracking

8. **Security & Privacy:**
   - Ensure zero network requests during workout sessions
   - Implement secure camera frame disposal after processing
   - Add biometric/PIN authentication for app access
   - Create data export functionality in CSV format

9. **Testing Strategy:**
   - Unit tests for business logic and data access layers
   - Integration tests for ML model inference pipeline
   - UI automation tests for critical user flows
   - Manual testing on target devices (iOS 14+, Android 10+)

10. **Accessibility Implementation:**
    - Add VoiceOver/TalkBack labels to all interactive elements
    - Implement high contrast mode and adjustable font sizes
    - Support both portrait and landscape orientations
    - Test with assistive technologies

**Development Phases:**

- **Phase 1 (Weeks 1-2):** Project setup, camera integration, basic UI skeleton
- **Phase 2 (Weeks 3-5):** ML model integration, pose tracking engine, audio feedback
- **Phase 3 (Weeks 6-7):** Voice commands, local database, workout flow controller
- **Phase 4 (Weeks 8-9):** Workout library, history tracking, progress charts
- **Phase 5 (Weeks 10-11):** Performance optimization, security hardening, accessibility
- **Phase 6 (Weeks 12-13):** Testing, bug fixes, app store preparation

**Critical Success Factors:**
- Pose tracking accuracy >90% for all 50 target poses
- Camera-to-feedback latency <200ms for responsive user experience
- Battery consumption <5% per 30-minute session
- Complete offline functionality with zero network dependencies
- App Store approval on first submission

**Additional Context:**
- Reference MediaPipe Pose documentation for landmark indices and best practices
- Follow React Native performance guidelines for smooth animations
- Adhere to iOS Human Interface Guidelines and Material Design principles
- Implement comprehensive error handling and logging for debugging

Begin by setting up the React Native project with TypeScript, configuring the necessary dependencies, and establishing the folder structure. Prioritize the pose tracking engine as it's the core differentiator of FlexiVision.

---

## 16. Appendices

### A. Glossary
- **Pose Landmarks:** Key body points (joints, spine) detected by ML model
- **Form Accuracy:** Percentage similarity between user's pose and reference pose
- **On-Device ML:** Machine learning inference performed locally without cloud processing
- **SQLCipher:** Encryption extension for SQLite databases

### B. References
- MediaPipe Pose Documentation: https://google.github.io/mediapipe/solutions/pose
- React Native Documentation: https://reactnative.dev/docs/getting-started
- TensorFlow Lite Guide: https://www.tensorflow.org/lite/guide
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/

### C. Revision History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | ${new Date().toISOString().split('T')[0]} | Product Team | Initial PRD creation |

---

**Document Prepared By:** SpecPilot AI  
**Approval Status:** Pending Review  
**Next Review Date:** TBD
`;

  await prisma.generatedPrd.create({
    data: {
      projectId: project.id,
      sessionId: DEMO_SESSION_ID,
      content: prdContent,
    },
  });

  console.log('✅ Demo session seeded successfully!');
  console.log(`📍 Session ID: ${DEMO_SESSION_ID}`);
  console.log(`🔗 View PRD at: http://localhost:3000/prd/${DEMO_SESSION_ID}`);
  console.log(`🔗 View interview at: http://localhost:3000/app/session/${DEMO_SESSION_ID}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding demo session:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });