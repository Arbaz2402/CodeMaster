/* Course Detail JS */

document.addEventListener('DOMContentLoaded', () => {
    // Course Database
    const coursesData = {
        1: { title: "Full Stack React Mastery", category: "Web Development", level: "Advanced", rating: 4.9, students: "12k", price: 89.99, img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80", desc: "Build highly scalable, production-ready web applications with React, Node.js, and modern tools. Learn by building real-world projects.", learningKey: "react" },
        2: { title: "Python for Data Science", category: "Data Science", level: "Beginner", rating: 4.8, students: "25k", price: 74.99, img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80", desc: "Learn Python programming and explore data analysis, visualization, and machine learning techniques.", learningKey: "python" },
        3: { title: "UI/UX Design Essentials", category: "UI/UX Design", level: "Beginner", rating: 4.7, students: "15k", price: 59.99, img: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80", desc: "Master the principles of user interface and user experience design to create beautiful, functional products.", learningKey: "css" },
        4: { title: "Advanced Node.js Patterns", category: "Web Development", level: "Advanced", rating: 4.9, students: "8k", price: 99.99, img: "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=800&q=80", desc: "Deep dive into Node.js architecture, performance optimization, and enterprise-grade design patterns.", learningKey: "js" },
        5: { title: "Machine Learning with Python", category: "Data Science", level: "Intermediate", rating: 4.8, students: "18k", price: 84.99, img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80", desc: "Build intelligent systems and predictive models using Scikit-Learn, Pandas, and Python.", learningKey: "python" },
        6: { title: "Flutter Mobile App Dev", category: "Mobile Apps", level: "Intermediate", rating: 4.7, students: "10k", price: 79.99, img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80", desc: "Create native, cross-platform mobile applications for iOS and Android using Flutter and Dart.", learningKey: "js" },
        7: { title: "Next.js 14 Enterprise Patterns", category: "Web Development", level: "Advanced", rating: 4.9, students: "5k", price: 129.99, img: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&q=80", desc: "Learn Server-Side Rendering, App Router, and full-stack integration with Next.js 14.", learningKey: "react" },
        8: { title: "Deep Learning with PyTorch", category: "Data Science", level: "Advanced", rating: 4.8, students: "3k", price: 149.99, img: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&q=80", desc: "Design, train, and deploy deep neural networks for computer vision and NLP using PyTorch.", learningKey: "python" },
        9: { title: "Figma for Developers", category: "UI/UX Design", level: "Beginner", rating: 4.6, students: "12k", price: 39.99, img: "https://images.unsplash.com/photo-1541462608141-ad511a7ee596?auto=format&fit=crop&w=800&q=80", desc: "Bridge the gap between design and code. Learn how to extract assets, understand spacing, and build from Figma.", learningKey: "css" }
    };

    // Parse URL Parameter
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id') || 1; // Default to 1 if no ID is provided
    const course = coursesData[courseId];

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
    if (enrollBtn) {
        enrollBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const courseTitle = document.querySelector('.banner-content h1').textContent;
            localStorage.setItem('enrolled_course', courseTitle);
            alert(`Successfully enrolled in ${courseTitle}! Redirecting to learning page...`);
            window.location.href = `video-learning.html?course=${course.learningKey}`;
        });
    }

    // Free Lesson Button Logic
    const freeLessonBtn = document.querySelector('.btn-outline.btn-full');
    if (freeLessonBtn) {
        freeLessonBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `video-learning.html?course=${course.learningKey}`;
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
