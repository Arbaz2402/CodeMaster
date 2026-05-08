/* Video Learning JS */

document.addEventListener('DOMContentLoaded', () => {
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

    // Notes Functionality (LocalStorage)
    const noteArea = document.getElementById('note-area');
    const saveBtn = document.getElementById('save-note');
    const lessonId = 'react-hooks-lesson'; // Mock lesson ID

    // Load saved note
    const savedNote = localStorage.getItem(`note_${lessonId}`);
    if (savedNote) {
        noteArea.value = savedNote;
    }

    saveBtn.addEventListener('click', () => {
        localStorage.setItem(`note_${lessonId}`, noteArea.value);
        
        // Show feedback
        const originalText = saveBtn.textContent;
        saveBtn.textContent = 'Saved!';
        saveBtn.style.background = '#10b981';
        
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.style.background = '';
        }, 2000);
    });

    // Auto-save every 30 seconds
    setInterval(() => {
        localStorage.setItem(`note_${lessonId}`, noteArea.value);
    }, 30000);

    // Courses Data
    const coursesData = {
        react: {
            title: "Full Stack React Mastery",
            videos: [
                { title: "1. Welcome to the course", duration: "05:00", url: "https://www.youtube.com/embed/Ke90Tje7VS0", completed: true },
                { title: "2. React Basics & Setup", duration: "15:00", url: "https://www.youtube.com/embed/bMknfKXIFA8", completed: true },
                { title: "3. Introduction to React Hooks", duration: "25:00", url: "https://www.youtube.com/embed/O6P86uwfdR0", completed: false },
                { title: "4. useState Deep Dive", duration: "20:00", url: "https://www.youtube.com/embed/O6P86uwfdR0?start=600", completed: false },
                { title: "5. useEffect Lifecycle", duration: "30:00", url: "https://www.youtube.com/embed/0ZJgIjIuY7U", completed: false }
            ]
        },
        css: {
            title: "Modern CSS Layouts",
            videos: [
                { title: "1. Intro to Flexbox", duration: "10:00", url: "https://www.youtube.com/embed/K74l26pE4YA", completed: true },
                { title: "2. Advanced Flexbox Patterns", duration: "22:00", url: "https://www.youtube.com/embed/u044iM9xsWU", completed: false },
                { title: "3. CSS Grid Basics", duration: "18:00", url: "https://www.youtube.com/embed/jV8B24rSN5o", completed: false },
                { title: "4. Responsive Design", duration: "25:00", url: "https://www.youtube.com/embed/srvUrASNj0s", completed: false },
                { title: "5. CSS Animations", duration: "15:00", url: "https://www.youtube.com/embed/YszONjKpgg4", completed: false }
            ]
        },
        python: {
            title: "Python for Data Science",
            videos: [
                { title: "1. Setting up Environment", duration: "08:00", url: "https://www.youtube.com/embed/YYXdXT2l-Gg", completed: false },
                { title: "2. Intro to Pandas", duration: "35:00", url: "https://www.youtube.com/embed/dcqPhpY7tWk", completed: false },
                { title: "3. Data Cleaning", duration: "28:00", url: "https://www.youtube.com/embed/bDhvCp3_lYw", completed: false },
                { title: "4. Matplotlib Basics", duration: "20:00", url: "https://www.youtube.com/embed/3Xc3CA655Ls", completed: false },
                { title: "5. Machine Learning Intro", duration: "45:00", url: "https://www.youtube.com/embed/7eh4d6sabA0", completed: false }
            ]
        },
        js: {
            title: "Advanced JavaScript",
            videos: [
                { title: "1. Closures and Scope", duration: "15:00", url: "https://www.youtube.com/embed/vKJpN5FAeF4", completed: false },
                { title: "2. Prototype Chain", duration: "25:00", url: "https://www.youtube.com/embed/MiKdMjcsFZ4", completed: false },
                { title: "3. Async / Await", duration: "18:00", url: "https://www.youtube.com/embed/V_Kr9OSfDeU", completed: false },
                { title: "4. The Event Loop", duration: "26:00", url: "https://www.youtube.com/embed/8aGhZQkoFbQ", completed: false },
                { title: "5. Design Patterns", duration: "32:00", url: "https://www.youtube.com/embed/0T1yQ0dK1eA", completed: false }
            ]
        }
    };

    const courseSelector = document.getElementById('course-selector');
    const lessonListContainer = document.getElementById('lesson-list-container');
    const dynamicTitle = document.getElementById('dynamic-lesson-title');
    const videoIframe = document.querySelector('.video-wrapper iframe');
    const progressText = document.getElementById('progress-text');
    const progressFill = document.getElementById('progress-fill');

    function renderCourse(courseId) {
        const course = coursesData[courseId];
        let completedCount = 0;
        let html = '';
        
        // Find the first uncompleted video to set as active initially
        let activeIndex = course.videos.findIndex(v => !v.completed);
        if (activeIndex === -1) activeIndex = 0; // If all completed, active is first

        course.videos.forEach((video, index) => {
            if (video.completed) completedCount++;
            
            const isActive = index === activeIndex;
            let iconClass = video.completed && !isActive ? 'fas fa-check-circle' : 'far fa-circle';
            if (isActive) iconClass = 'fas fa-play-circle';
            
            const stateClass = isActive ? 'active' : (video.completed ? 'completed' : '');

            html += `
                <div class="lesson-item ${stateClass}" data-video="${video.url}" data-index="${index}">
                    <div class="lesson-info">
                        <i class="${iconClass}"></i>
                        <span>${video.title}</span>
                    </div>
                    <span class="duration">${video.duration}</span>
                </div>
            `;
        });

        lessonListContainer.innerHTML = html;

        // Calculate and update Progress
        const progressPercent = Math.round((completedCount / course.videos.length) * 100);
        if (progressText) progressText.textContent = `Progress: ${progressPercent}%`;
        if (progressFill) progressFill.style.width = `${progressPercent}%`;

        // Update Header Title for the active video
        const activeVideo = course.videos[activeIndex];
        const cleanTitle = activeVideo.title.replace(/^\d+\.\s*/, '');
        if (dynamicTitle) dynamicTitle.textContent = `${course.title}: ${cleanTitle}`;

        // Set Video Player URL
        if (videoIframe) videoIframe.src = activeVideo.url;

        // Attach click listeners to new items
        attachLessonListeners(course);
    }

    function attachLessonListeners(course) {
        const items = document.querySelectorAll('.lesson-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                // Remove active from all
                items.forEach(i => {
                    i.classList.remove('active');
                    const icon = i.querySelector('.lesson-info i');
                    if (icon) {
                        const isCompleted = i.classList.contains('completed');
                        icon.className = isCompleted ? 'fas fa-check-circle' : 'far fa-circle';
                    }
                });

                // Add active to clicked
                item.classList.add('active');
                const activeIcon = item.querySelector('.lesson-info i');
                if (activeIcon) activeIcon.className = 'fas fa-play-circle';

                // Update Title
                const index = parseInt(item.getAttribute('data-index'));
                const cleanTitle = course.videos[index].title.replace(/^\d+\.\s*/, '');
                if (dynamicTitle) dynamicTitle.textContent = `${course.title}: ${cleanTitle}`;

                // Update Video
                if (videoIframe) videoIframe.src = item.getAttribute('data-video');
            });
        });
    }

    // Handle course selector change
    if (courseSelector) {
        courseSelector.addEventListener('change', (e) => {
            renderCourse(e.target.value);
            // Optionally update URL without reloading
            const url = new URL(window.location);
            url.searchParams.set('course', e.target.value);
            window.history.pushState({}, '', url);
        });
    }

    // Parse URL Parameter for initial load
    const urlParams = new URLSearchParams(window.location.search);
    const initialCourse = urlParams.get('course') || 'react';

    if (courseSelector && coursesData[initialCourse]) {
        courseSelector.value = initialCourse;
    }

    // Initial render
    if (coursesData[initialCourse]) {
        renderCourse(initialCourse);
    } else {
        renderCourse('react'); // Fallback
    }
});
