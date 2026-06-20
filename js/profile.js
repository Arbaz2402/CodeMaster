document.addEventListener('DOMContentLoaded', () => {
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

    // Input Elements
    const inputName = document.getElementById('edit-name');
    const inputBio = document.getElementById('edit-bio');
    const inputAbout = document.getElementById('edit-about');

    // Load user data from localStorage
    const loadUserData = () => {
        const user = getUser();
        if (user) {
            displayName.textContent = user.name || 'Your Name';
            displayBio.textContent = user.bio || 'Your bio';
            displayAbout.textContent = user.about || 'About you';
            
            const avatarImg = document.querySelector('.profile-img-container img');
            if (avatarImg) {
                const formattedName = (user.name || 'User').trim().replace(/\s+/g, '+');
                avatarImg.src = `https://ui-avatars.com/api/?name=${formattedName}&background=random`;
            }
        }
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
    loadUserData();
});