/* Courses Page JS */

let courses = [];

document.addEventListener('DOMContentLoaded', async () => {
    const courseGrid = document.getElementById('course-grid');
    const searchInput = document.getElementById('course-search');
    const courseCount = document.getElementById('course-count');
    const sortSelect = document.getElementById('sort-select');
    const paginationContainer = document.querySelector('.pagination');
    const categoryCheckboxes = document.querySelectorAll('.filters-sidebar .filter-section:nth-child(1) input');
    const levelCheckboxes = document.querySelectorAll('.filters-sidebar .filter-section:nth-child(2) input');
    const ratingCheckboxes = document.querySelectorAll('.filters-sidebar .filter-section:nth-child(3) input');

    // Fetch courses from API
    try {
        courses = await coursesApi.getAll();
    } catch (error) {
        console.error('Error fetching courses:', error);
        courseGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error loading courses</h3>
                <p>Please try again later.</p>
            </div>
        `;
        return;
    }

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
                <div class="course-card" data-aos="fade-up" data-aos-delay="${index * 50}" onclick="window.location.href='course-detail.html?id=${course._id}'">
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
                            <a href="course-detail.html?id=${course._id}" class="btn-sm" onclick="event.stopPropagation()">Learn More <i class="fas fa-arrow-right"></i></a>
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
