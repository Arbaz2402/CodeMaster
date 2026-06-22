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
    
    if (userNameEl) userNameEl.textContent = user.name;
    if (userImgEl) {
      const formattedName = user.name.trim().replace(/\s+/g, '+');
      userImgEl.src = `https://ui-avatars.com/api/?name=${formattedName}&background=random`;
    }
  };

  // Load enrolled courses
  const loadEnrolledCourses = async () => {
    try {
      const enrolledCourses = await coursesApi.getEnrolled();
      const courseProgressList = document.getElementById('enrolled-courses-list');
      
      if (courseProgressList) {
        if (enrolledCourses.length === 0) {
          courseProgressList.innerHTML = `
            <p style="color: #94a3b8; text-align: center; padding: 2rem;">
              You haven't enrolled in any courses yet.
              <a href="courses.html" style="color: #6366f1; text-decoration: underline;">Browse courses</a>
            </p>
          `;
        } else {
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
        }
      }
    } catch (error) {
      console.error('Failed to load enrolled courses:', error);
      const courseProgressList = document.getElementById('enrolled-courses-list');
      if (courseProgressList) {
        courseProgressList.innerHTML = `
          <p style="color: #ef4444; text-align: center; padding: 2rem;">
            Failed to load your courses. Please try again.
          </p>
        `;
      }
    }
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
});