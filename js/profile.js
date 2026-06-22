document.addEventListener('DOMContentLoaded', async () => {
  // Modal Elements
  const editBtn = document.getElementById('edit-profile-btn');
  const modal = document.getElementById('edit-profile-modal');
  const closeBtn = document.querySelector('.close-modal');
  const cancelBtn = document.querySelector('.close-modal-btn');
  const form = document.getElementById('edit-profile-form');

  // Display Elements
  const displayName = document.getElementById('display-name');
  const displayBio = document.getElementById('display-bio');
  const displayAbout = document.getElementById('display-about');
  const skillsContainer = document.querySelector('.skills-tags');
  const achievementsContainer = document.querySelector('.badges-grid');
  const activityContainer = document.querySelector('.activity-list');
  const certificatesContainer = document.querySelector('.cert-list');
  const statsCourses = document.querySelectorAll('.profile-stats span strong')[0];
  const statsProjects = document.querySelectorAll('.profile-stats span strong')[1];
  const statsPoints = document.querySelectorAll('.profile-stats span strong')[2];

  // Input Elements
  const inputName = document.getElementById('edit-name');
  const inputBio = document.getElementById('edit-bio');
  const inputAbout = document.getElementById('edit-about');

  // Load user data from backend
  const loadUserData = async () => {
    try {
      const user = await authApi.getMe();
      setUser(user);
      
      // Update profile info
      displayName.textContent = user.name || 'Your Name';
      displayBio.textContent = user.bio || 'Your bio';
      displayAbout.textContent = user.about || 'About you';
      
      // Update stats
      if (statsCourses) statsCourses.textContent = user.totalCourses || 0;
      if (statsPoints) statsPoints.textContent = (user.points || 0).toLocaleString();
      
      // Update avatar
      const avatarImg = document.querySelector('.profile-img-container img');
      if (avatarImg) {
        const formattedName = (user.name || 'User').trim().replace(/\s+/g, '+');
        avatarImg.src = `https://ui-avatars.com/api/?name=${formattedName}&background=random`;
      }
      
      // Render skills
      if (skillsContainer) {
        // Clear the container first
        skillsContainer.innerHTML = '';
        
        // Add skill tags
        if (user.skills && user.skills.length > 0) {
          user.skills.forEach(skill => {
            const skillTag = document.createElement('span');
            skillTag.className = 'skill-tag';
            skillTag.innerHTML = `
              ${skill}
              <button class="remove-skill-btn" data-skill="${skill}">
                <i class="fas fa-times"></i>
              </button>
            `;
            skillsContainer.appendChild(skillTag);
          });
          
          // Add remove skill buttons event listeners
          document.querySelectorAll('.remove-skill-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
              e.stopPropagation();
              const skill = e.currentTarget.dataset.skill;
              await removeSkill(skill);
            });
          });
        } else {
          const emptyMsg = document.createElement('p');
          emptyMsg.style.color = '#94a3b8';
          emptyMsg.textContent = 'No skills added yet';
          skillsContainer.appendChild(emptyMsg);
        }
        
        // Check if add skill container already exists before adding it
        let addSkillContainer = document.querySelector('.add-skill-container');
        if (!addSkillContainer) {
          addSkillContainer = document.createElement('div');
          addSkillContainer.className = 'add-skill-container';
          addSkillContainer.style.marginTop = '10px';
          addSkillContainer.innerHTML = `
            <input type="text" id="new-skill-input" placeholder="Add a skill" style="padding: 8px 12px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: white; width: 200px;">
            <button id="add-skill-btn" style="margin-left: 8px; padding: 8px 16px; background: #6366f1; border: none; border-radius: 20px; color: white; cursor: pointer;">Add</button>
          `;
          skillsContainer.parentElement.appendChild(addSkillContainer);
          
          // Add event listeners
          document.getElementById('add-skill-btn').addEventListener('click', addSkill);
          document.getElementById('new-skill-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addSkill();
          });
        }
      }
      
      // Render achievements
      if (achievementsContainer) {
        if (user.achievements && user.achievements.length > 0) {
          achievementsContainer.innerHTML = user.achievements.map(achievement => `
            <div class="badge-item">
              <div class="badge-icon ${achievement.color || 'purple'}">
                <i class="fas ${achievement.icon || 'fa-medal'}"></i>
              </div>
              <p>${achievement.title}</p>
            </div>
          `).join('');
        } else {
          achievementsContainer.innerHTML = '<p style="color: #94a3b8; text-align: center;">No achievements yet</p>';
        }
      }
      
      // Render recent activity
      if (activityContainer) {
        if (user.recentActivity && user.recentActivity.length > 0) {
          activityContainer.innerHTML = user.recentActivity.map(activity => {
            const iconClass = getActivityIcon(activity.type);
            const timeAgo = getTimeAgo(activity.timestamp);
            return `
              <div class="activity-item">
                <div class="activity-icon">
                  <i class="${iconClass}"></i>
                </div>
                <div class="activity-desc">
                  <p>${activity.description}</p>
                  <span>${timeAgo}</span>
                </div>
              </div>
            `;
          }).join('');
        } else {
          activityContainer.innerHTML = '<p style="color: #94a3b8; text-align: center;">No recent activity</p>';
        }
      }
      
      // Render certificates
      if (certificatesContainer) {
        if (user.certificates && user.certificates.length > 0) {
          certificatesContainer.innerHTML = user.certificates.map(cert => `
            <div class="cert-item">
              <i class="fas fa-certificate"></i>
              <div>
                <h4>${cert.courseTitle}</h4>
                <span>Issued ${new Date(cert.issuedAt).toLocaleDateString()}</span>
              </div>
              ${cert.certificateUrl ? `<a href="${cert.certificateUrl}" target="_blank"><i class="fas fa-download"></i></a>` : ''}
            </div>
          `).join('');
        } else {
          certificatesContainer.innerHTML = '<p style="color: #94a3b8; text-align: center;">No certificates yet</p>';
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      // Fallback to localStorage if backend fails
      const localUser = getUser();
      if (localUser) {
        displayName.textContent = localUser.name || 'Your Name';
        displayBio.textContent = localUser.bio || 'Your bio';
        displayAbout.textContent = localUser.about || 'About you';
      }
    }
  };

  // Add a skill
  const addSkill = async () => {
    const input = document.getElementById('new-skill-input');
    const skill = input.value.trim();
    
    if (!skill) return;
    
    try {
      const updatedSkills = await usersApi.addSkill(skill);
      input.value = '';
      await loadUserData(); // Reload to refresh skills
    } catch (error) {
      alert(error.message || 'Failed to add skill');
    }
  };

  // Remove a skill
  const removeSkill = async (skill) => {
    try {
      await usersApi.removeSkill(skill);
      await loadUserData(); // Reload to refresh skills
    } catch (error) {
      alert(error.message || 'Failed to remove skill');
    }
  };

  // Helper to get icon class for activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'lesson': return 'fas fa-play';
      case 'quiz': return 'fas fa-question-circle';
      case 'achievement': return 'fas fa-trophy';
      case 'project': return 'fas fa-code';
      default: return 'fas fa-check';
    }
  };

  // Helper to get time ago string
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const activityDate = new Date(timestamp);
    const diffMs = now - activityDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  // Open Modal
  editBtn.addEventListener('click', () => {
    // Pre-fill form with current display values
    inputName.value = displayName.textContent;
    inputBio.value = displayBio.textContent;
    inputAbout.value = displayAbout.textContent;
    
    modal.classList.add('show');
  });

  // Close Modal Function
  const closeModal = () => {
    modal.classList.remove('show');
  };

  // Close on buttons
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  // Close on outside click
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Handle Form Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      const profileData = {
        name: inputName.value,
        bio: inputBio.value,
        about: inputAbout.value
      };
      
      const updatedUser = await usersApi.updateProfile(profileData);
      setUser(updatedUser);
      
      // Update display elements with new values
      displayName.textContent = updatedUser.name;
      displayBio.textContent = updatedUser.bio;
      displayAbout.textContent = updatedUser.about;

      // Update avatar
      const avatarImg = document.querySelector('.profile-img-container img');
      if (avatarImg) {
        const formattedName = updatedUser.name.trim().replace(/\s+/g, '+');
        avatarImg.src = `https://ui-avatars.com/api/?name=${formattedName}&background=random`;
      }

      // Close modal after saving
      closeModal();

      // Show a brief success message
      const originalBtnText = editBtn.textContent;
      editBtn.textContent = 'Saved!';
      editBtn.style.background = '#10b981';
      setTimeout(() => {
        editBtn.textContent = originalBtnText;
        editBtn.style.background = '';
      }, 2000);
    } catch (error) {
      alert(error.message || 'Failed to update profile');
    }
  });

  // Initialize
  await loadUserData();
});
