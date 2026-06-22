/* Dashboard JS */

document.addEventListener('DOMContentLoaded', async () => {
  // Check if user is logged in
  const localUser = getUser();
  if (!localUser) {
    window.location.href = '../index.html';
    return;
  }

  // Load user data from backend
  let user = localUser;
  try {
    user = await authApi.getMe();
    setUser(user);
  } catch (error) {
    console.error('Failed to load user data:', error);
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

    // Use user activity from backend
    let activityData = [0, 0, 0, 0, 0, 0, 0];
    if (user.activityData && user.activityData.length > 0) {
      activityData = user.activityData.map(a => a.hours);
    } else {
      // Default activity if no data
      activityData = [2, 3.5, 1.5, 4, 3, 2.5, 5];
    }
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

    // Update stats
    const statCourses = document.querySelector('.stat-card:nth-child(1) h3');
    const statHours = document.querySelector('.stat-card:nth-child(3) h3');
    
    if (statCourses) statCourses.textContent = user.totalCourses || 0;
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
  await loadEnrolledCourses();
  loadActivityChart();
});