/* Course Detail JS */

document.addEventListener('DOMContentLoaded', async () => {
    // Parse URL Parameter
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');
    let course;

    if (courseId) {
        try {
            course = await coursesApi.getById(courseId);
        } catch (error) {
            console.error('Error fetching course:', error);
            document.querySelector('.banner-content h1').textContent = 'Course not found';
            return;
        }
    }

    if (course) {
        // Update DOM Elements
        document.title = `${course.title} | CodeMaster`;
        document.querySelector('.breadcrumb span').textContent = course.category;
        document.querySelector('.banner-content h1').textContent = course.title;
        document.querySelector('.banner-desc').textContent = course.desc;
        
        const metaItems = document.querySelectorAll('.banner-meta .meta-item span');
        if (metaItems.length >= 2) {
            metaItems[0].textContent = `${course.rating} Rating`;
            metaItems[1].textContent = `${course.students} students`;
        }

        const courseImg = document.querySelector('.enroll-card img');
        if (courseImg) courseImg.src = course.img;

        const currentPrice = document.querySelector('.current-price');
        if (currentPrice) currentPrice.textContent = `$${course.price}`;
    }

    // Accordion Logic
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');

            // Close all items
            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('active');
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Enroll Button Logic
    const enrollBtn = document.querySelector('.enroll-btn');
    if (enrollBtn && course) {
        enrollBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const user = getUser();
                if (!user) {
                    alert('Please log in to enroll in this course!');
                    return;
                }
                
                await coursesApi.enroll(course._id);
                alert(`Successfully enrolled in ${course.title}! Redirecting to learning page...`);
                window.location.href = `video-learning.html?course=${course.learningKey}&courseId=${course._id}`;
            } catch (error) {
                console.error('Error enrolling:', error);
                alert(error.message || 'Failed to enroll in course');
            }
        });
    }

    // Free Lesson Button Logic
    const freeLessonBtn = document.querySelector('.btn-outline.btn-full');
    if (freeLessonBtn && course) {
        freeLessonBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `video-learning.html?course=${course.learningKey}&courseId=${course._id}`;
        });
    }

    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true
        });
    }
});
