/* Courses Page JS */

const courses = [
    {
        id: 1,
        title: "Full Stack React Mastery",
        category: "Web Development",
        level: "Advanced",
        rating: 4.9,
        students: "12k",
        price: 89.99,
        img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80"
    },
    {
        id: 2,
        title: "Python for Data Science",
        category: "Data Science",
        level: "Beginner",
        rating: 4.8,
        students: "25k",
        price: 74.99,
        img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80"
    },
    {
        id: 3,
        title: "UI/UX Design Essentials",
        category: "UI/UX Design",
        level: "Beginner",
        rating: 4.7,
        students: "15k",
        price: 59.99,
        img: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        title: "Advanced Node.js Patterns",
        category: "Web Development",
        level: "Advanced",
        rating: 4.9,
        students: "8k",
        price: 99.99,
        img: "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=800&q=80"
    },
    {
        id: 5,
        title: "Machine Learning with Python",
        category: "Data Science",
        level: "Intermediate",
        rating: 4.8,
        students: "18k",
        price: 84.99,
        img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80"
    },
    {
        id: 6,
        title: "Flutter Mobile App Dev",
        category: "Mobile Apps",
        level: "Intermediate",
        rating: 4.7,
        students: "10k",
        price: 79.99,
        img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80"
    },
    {
        id: 7,
        title: "Next.js 14 Enterprise Patterns",
        category: "Web Development",
        level: "Advanced",
        rating: 4.9,
        students: "5k",
        price: 129.99,
        img: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&q=80"
    },
    {
        id: 8,
        title: "Deep Learning with PyTorch",
        category: "Data Science",
        level: "Advanced",
        rating: 4.8,
        students: "3k",
        price: 149.99,
        img: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&q=80"
    },
    {
        id: 9,
        title: "Figma for Developers",
        category: "UI/UX Design",
        level: "Beginner",
        rating: 4.6,
        students: "12k",
        price: 39.99,
        img: "https://images.unsplash.com/photo-1541462608141-ad511a7ee596?auto=format&fit=crop&w=800&q=80"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const courseGrid = document.getElementById('course-grid');
    const searchInput = document.getElementById('course-search');
    const courseCount = document.getElementById('course-count');
    const sortSelect = document.getElementById('sort-select');
    const paginationContainer = document.querySelector('.pagination');
    const categoryCheckboxes = document.querySelectorAll('.filters-sidebar .filter-section:nth-child(1) input');
    const levelCheckboxes = document.querySelectorAll('.filters-sidebar .filter-section:nth-child(2) input');
    const ratingCheckboxes = document.querySelectorAll('.filters-sidebar .filter-section:nth-child(3) input');

    let currentPage = 1;
    const itemsPerPage = 6;
    let filteredCoursesList = [...courses];

    function filterAndSortCourses() {
        let filtered = [...courses];
        const searchTerm = searchInput.value.toLowerCase();

        // Search Filter
        if (searchTerm) {
            filtered = filtered.filter(c => 
                c.title.toLowerCase().includes(searchTerm) || 
                c.category.toLowerCase().includes(searchTerm)
            );
        }

        // Category Filter
        const selectedCategories = Array.from(categoryCheckboxes)
            .filter(i => i.checked)
            .map(i => i.parentElement.textContent.trim());
        
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(c => selectedCategories.includes(c.category));
        }

        // Level Filter
        const selectedLevels = Array.from(levelCheckboxes)
            .filter(i => i.checked)
            .map(i => i.parentElement.textContent.trim());
        
        if (selectedLevels.length > 0) {
            filtered = filtered.filter(c => selectedLevels.includes(c.level));
        }

        // Rating Filter (Checkboxes)
        const selectedRatings = Array.from(ratingCheckboxes)
            .filter(i => i.checked)
            .map(i => parseFloat(i.value));
        
        if (selectedRatings.length > 0) {
            const minRating = Math.min(...selectedRatings);
            filtered = filtered.filter(c => c.rating >= minRating);
        }

        // Sorting
        const sortBy = sortSelect.value;
        if (sortBy === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'popular') {
            filtered.sort((a, b) => b.rating - a.rating);
        }

        filteredCoursesList = filtered;
        currentPage = 1; // Reset to first page on filter change
        displayCourses();
    }

    function displayCourses() {
        courseGrid.innerHTML = '';
        courseCount.textContent = filteredCoursesList.length;

        if (filteredCoursesList.length === 0) {
            courseGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No courses found</h3>
                    <p>Try adjusting your search or filters to find what you're looking for.</p>
                </div>
            `;
            if (paginationContainer) paginationContainer.style.display = 'none';
            return;
        }

        if (paginationContainer) paginationContainer.style.display = 'flex';

        // Calculate pagination slice
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedItems = filteredCoursesList.slice(startIndex, endIndex);

        paginatedItems.forEach((course, index) => {
            const courseCard = `
                <div class="course-card" data-aos="fade-up" data-aos-delay="${index * 50}" onclick="window.location.href='course-detail.html?id=${course.id}'">
                    <div class="course-img">
                        <img src="${course.img}" alt="${course.title}" onerror="this.src='https://picsum.photos/id/10/800/500'">
                        <span class="badge">${course.level}</span>
                    </div>
                    <div class="course-info">
                        <div class="course-meta">
                            <span><i class="fas fa-star"></i> ${course.rating}</span>
                            <span><i class="fas fa-users"></i> ${course.students}</span>
                        </div>
                        <h3>${course.title}</h3>
                        <p>${course.category} • ${course.level}</p>
                        <div class="course-footer">
                            <span class="price">$${course.price}</span>
                            <a href="course-detail.html?id=${course.id}" class="btn-sm" onclick="event.stopPropagation()">Learn More <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </div>
                </div>
            `;
            courseGrid.innerHTML += courseCard;
        });

        renderPagination();
    }

    function renderPagination() {
        if (!paginationContainer) return;
        
        const totalPages = Math.ceil(filteredCoursesList.length / itemsPerPage);
        paginationContainer.innerHTML = '';

        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            btn.textContent = i;
            btn.addEventListener('click', () => {
                currentPage = i;
                displayCourses();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            paginationContainer.appendChild(btn);
        }

        // Next button
        if (currentPage < totalPages) {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'page-btn';
            nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextBtn.addEventListener('click', () => {
                currentPage++;
                displayCourses();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            paginationContainer.appendChild(nextBtn);
        }
    }

    // Event Listeners
    if (searchInput) searchInput.addEventListener('input', filterAndSortCourses);
    if (sortSelect) sortSelect.addEventListener('change', filterAndSortCourses);
    categoryCheckboxes.forEach(cb => cb.addEventListener('change', filterAndSortCourses));
    levelCheckboxes.forEach(cb => cb.addEventListener('change', filterAndSortCourses));
    ratingCheckboxes.forEach(r => r.addEventListener('change', filterAndSortCourses));

    // Initial Display
    filterAndSortCourses();

    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 600,
            once: true
        });
    }
});
