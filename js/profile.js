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
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Update display elements with new values
        displayName.textContent = inputName.value;
        displayBio.textContent = inputBio.value;
        displayAbout.textContent = inputAbout.value;

        // Optionally, update avatar name if we wanted to
        const avatarImg = document.querySelector('.profile-img-container img');
        if (avatarImg) {
            // Replace spaces with + for the UI Avatars API
            const formattedName = inputName.value.trim().replace(/\s+/g, '+');
            avatarImg.src = `https://ui-avatars.com/api/?name=${formattedName}&background=random`;
        }

        // Close modal after saving
        closeModal();

        // Show a brief success message (optional UI enhancement)
        const originalBtnText = editBtn.textContent;
        editBtn.textContent = 'Saved!';
        editBtn.style.background = '#10b981';
        setTimeout(() => {
            editBtn.textContent = originalBtnText;
            editBtn.style.background = '';
        }, 2000);
    });
});
