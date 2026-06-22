/* Video Learning JS */

document.addEventListener('DOMContentLoaded', async () => {
    let currentCourse = null;
    let currentLessonIndex = 0;
    let currentEnrollment = null;

    // Tab Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Notes Functionality
    const noteArea = document.getElementById('note-area');
    const saveBtn = document.getElementById('save-note');
    let currentLessonId = null;
    let currentCourseId = null;

    // Load saved note
    const loadNote = async () => {
        if (!currentLessonId || !currentCourseId) return;
        
        try {
            const notes = await notesApi.getByLesson(currentCourseId, currentLessonId);
            if (notes.length > 0) {
                noteArea.value = notes[0].content;
            } else {
                noteArea.value = '';
            }
        } catch (error) {
            console.error('Failed to load note:', error);
        }
    };

    // Save note
    saveBtn.addEventListener('click', async () => {
        if (!currentLessonId || !currentCourseId) {
            alert('Please select a lesson first');
            return;
        }
        
        try {
            await notesApi.save(currentLessonId, currentCourseId, noteArea.value);
            
            // Show feedback
            const originalText = saveBtn.textContent;
            saveBtn.textContent = 'Saved!';
            saveBtn.style.background = '#10b981';
            
            setTimeout(() => {
                saveBtn.textContent = originalText;
                saveBtn.style.background = '';
            }, 2000);
        } catch (error) {
            alert('Failed to save note');
            console.error(error);
        }
    });

    // Auto-save every 30 seconds
    setInterval(async () => {
        if (currentLessonId && currentCourseId && noteArea.value) {
            try {
                await notesApi.save(currentLessonId, currentCourseId, noteArea.value);
            } catch (error) {
                console.error('Auto-save failed:', error);
            }
        }
    }, 30000);

    // DOM Elements
    const courseSelector = document.getElementById('course-selector');
    const lessonListContainer = document.getElementById('lesson-list-container');
    const dynamicTitle = document.getElementById('dynamic-lesson-title');
    const videoIframe = document.querySelector('.video-wrapper iframe');
    const progressText = document.getElementById('progress-text');
    const progressFill = document.getElementById('progress-fill');

    // Load courses for selector
    const loadCourses = async () => {
        try {
            const courses = await coursesApi.getAll();
            courseSelector.innerHTML = courses.map(course => 
                `<option value="${course._id}" style="color: black;">${course.title}</option>`
            ).join('');

            // Parse URL Parameter for initial load
            const urlParams = new URLSearchParams(window.location.search);
            const initialCourseId = urlParams.get('courseId');
            if (initialCourseId) {
                courseSelector.value = initialCourseId;
            }
            
            await loadCourse(courseSelector.value);
        } catch (error) {
            console.error('Failed to load courses:', error);
        }
    };

    // Load course data
    const loadCourse = async (courseId) => {
        try {
            currentCourseId = courseId;
            currentCourse = await coursesApi.getById(courseId);
            
            // Get enrolled courses to check progress
            const enrolledCourses = await coursesApi.getEnrolled();
            currentEnrollment = enrolledCourses.find(e => e.course._id === courseId);
            
            renderCourse();
        } catch (error) {
            console.error('Failed to load course:', error);
        }
    };

    // Render course
    const renderCourse = () => {
        if (!currentCourse) return;
        
        const lessons = currentCourse.lessons || [];
        const completedLessons = currentEnrollment?.completedLessons || [];
        let completedCount = 0;
        let html = '';
        
        // Find the first uncompleted lesson to set as active initially
        let activeIndex = lessons.findIndex(lesson => !completedLessons.includes(lesson._id));
        if (activeIndex === -1) activeIndex = 0; // If all completed, active is first
        currentLessonIndex = activeIndex;

        lessons.forEach((lesson, index) => {
            const isCompleted = completedLessons.includes(lesson._id);
            if (isCompleted) completedCount++;
            
            const isActive = index === activeIndex;
            let iconClass = isCompleted && !isActive ? 'fas fa-check-circle' : 'far fa-circle';
            if (isActive) iconClass = 'fas fa-play-circle';
            
            const stateClass = isActive ? 'active' : (isCompleted ? 'completed' : '');

            html += `
                <div class="lesson-item ${stateClass}" data-index="${index}" data-lesson-id="${lesson._id}">
                    <div class="lesson-info">
                        <i class="${iconClass}"></i>
                        <span>${lesson.title}</span>
                    </div>
                    <span class="duration">${lesson.duration}</span>
                </div>
            `;
        });

        lessonListContainer.innerHTML = html;

        // Calculate and update Progress
        const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;
        if (progressText) progressText.textContent = `Progress: ${progressPercent}%`;
        if (progressFill) progressFill.style.width = `${progressPercent}%`;

        // Update Header Title for the active lesson
        const activeLesson = lessons[activeIndex];
        if (dynamicTitle && activeLesson) {
            dynamicTitle.textContent = `${currentCourse.title}: ${activeLesson.title}`;
        }

        // Set Video Player URL
        if (videoIframe && activeLesson) {
            videoIframe.src = activeLesson.videoUrl;
        }

        // Set current lesson ID for notes
        if (activeLesson) {
            currentLessonId = activeLesson._id;
            loadNote();
        }

        // Attach click listeners to new items
        attachLessonListeners();
    };

    // Attach lesson listeners
    const attachLessonListeners = () => {
        const items = document.querySelectorAll('.lesson-item');
        items.forEach(item => {
            // Click on the icon to toggle completion
            const icon = item.querySelector('.lesson-info i');
            if (icon) {
                icon.addEventListener('click', async (e) => {
                    e.stopPropagation(); // Don't trigger the lesson click
                    const lessonId = item.getAttribute('data-lesson-id');
                    
                    try {
                        await coursesApi.completeLesson(currentCourseId, lessonId);
                        // Reload enrollment to update progress
                        const enrolledCourses = await coursesApi.getEnrolled();
                        currentEnrollment = enrolledCourses.find(e => e.course._id === currentCourseId);
                        renderCourse();
                    } catch (error) {
                        console.error('Failed to toggle lesson completion:', error);
                    }
                });
            }
            
            // Click on the lesson item to switch active lesson
            item.addEventListener('click', async (e) => {
                // Don't trigger if clicking on the icon
                if (e.target.closest('.lesson-info i')) return;
                
                // Remove active from all
                items.forEach(i => {
                    i.classList.remove('active');
                    const iconEl = i.querySelector('.lesson-info i');
                    if (iconEl) {
                        const isCompleted = i.classList.contains('completed');
                        iconEl.className = isCompleted ? 'fas fa-check-circle' : 'far fa-circle';
                    }
                });

                // Add active to clicked
                item.classList.add('active');
                const activeIcon = item.querySelector('.lesson-info i');
                if (activeIcon) activeIcon.className = 'fas fa-play-circle';

                // Update current index and lesson ID
                currentLessonIndex = parseInt(item.getAttribute('data-index'));
                currentLessonId = item.getAttribute('data-lesson-id');
                
                // Load note for new lesson
                loadNote();

                // Update Title
                const lesson = currentCourse.lessons[currentLessonIndex];
                if (dynamicTitle && lesson) {
                    dynamicTitle.textContent = `${currentCourse.title}: ${lesson.title}`;
                }

                // Update Video
                if (videoIframe && lesson) {
                    videoIframe.src = lesson.videoUrl;
                }
            });
        });
    };

    // Handle course selector change
    if (courseSelector) {
        courseSelector.addEventListener('change', async (e) => {
            await loadCourse(e.target.value);
            // Optionally update URL without reloading
            const url = new URL(window.location);
            url.searchParams.set('courseId', e.target.value);
            window.history.pushState({}, '', url);
        });
    }

    // Initialize
    await loadCourses();
});