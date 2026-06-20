/* Dashboard JS */

document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is logged in
    const user = getUser();
    if (!user) {
        window.location.href = '../index.html';
        return;
    }

    // Update user info in sidebar
    const updateUserInfo = () => {
        const userNameEl = document.querySelector('.user-name');
        const userImgEl = document.querySelector('.user-info img');
        const welcomeNameEl = document.querySelector('.text-gradient');
        
        if (userNameEl) userNameEl.textContent = user.name;
        if (welcomeNameEl) welcomeNameEl.textContent = user.name.split(' ')[0];
        if (userImgEl) {
            const formattedName = user.name.trim().replace(/\s+/g, '+');
            userImgEl.src = `https://ui-avatars.com/api/?name=${formattedName}&background=random`;
        }
    };

    // Load enrolled courses
    const loadEnrolledCourses = async () => {
        try {
            const enrolledCourses = await coursesApi.getEnrolled();
            const courseProgressList = document.querySelector('.course-progress-list');
            
            if (courseProgressList && enrolledCourses.length > 0) {
                courseProgressList.innerHTML = enrolledCourses.map(enrollment => {
                    const course = enrollment.course;
                    const progress = enrollment.progress || 0;
                    return `
                        <div class="progress-item">
                            <img src="${course.image}" alt="${course.title}">
                            <div class="progress-info">
                                <div class="info-top">
                                    <h4>${course.title}</h4>
                                    <span>${progress}%</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${progress}%;"></div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');

                // Update stats
                const statCourses = document.querySelector('.stat-card:nth-child(1) h3');
                if (statCourses) statCourses.textContent = enrolledCourses.length;
            }
        } catch (error) {
            console.error('Failed to load enrolled courses:', error);
        }
    };

    // Load activity chart
    const loadActivityChart = () => {
        const ctx = document.getElementById('activityChart').getContext('2d');
        
        // Custom Gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

        // Use user activity from localStorage/backend
        const activity = user.activity || {
            Mon: 2, Tue: 3.5, Wed: 1.5, Thu: 4, Fri: 3, Sat: 2.5, Sun: 5
        };
        const activityData = [
            activity.Mon || 0,
            activity.Tue || 0,
            activity.Wed || 0,
            activity.Thu || 0,
            activity.Fri || 0,
            activity.Sat || 0,
            activity.Sun || 0
        ];
        const totalHours = activityData.reduce((sum, h) => sum + h, 0);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Learning Hours',
                    data: activityData,
                    borderColor: '#6366f1',
                    borderWidth: 3,
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#6366f1',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            color: '#94a3b8'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#94a3b8'
                        }
                    }
                }
            }
        });

        // Update total hours stat
        const statHours = document.querySelector('.stat-card:nth-child(3) h3');
        if (statHours) statHours.textContent = `${Math.round(totalHours)}h`;
    };

    // Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            removeToken();
            removeUser();
            window.location.href = '../index.html';
        });
    }

    // Initialize
    updateUserInfo();
    loadEnrolledCourses();
    loadActivityChart();
});