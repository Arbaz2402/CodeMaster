/* Email Confirmation Page */

document.addEventListener('DOMContentLoaded', async () => {
  // Get token from URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const statusDiv = document.getElementById('confirmation-status');

  // If token exists, try to confirm
  if (token) {
    try {
      statusDiv.innerHTML = `
        <div class="confirmation-loading">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Confirming your email...</p>
        </div>
      `;
      // Call confirm email API
      await authApi.confirmEmail(token);
      statusDiv.innerHTML = `
        <div class="confirmation-success">
          <i class="fas fa-check-circle"></i>
          <p>Email confirmed successfully!</p>
          <a href="../index.html" class="btn-primary" style="margin-top: 1rem; display: inline-block;">Go to Home</a>
        </div>
      `;
    } catch (error) {
      statusDiv.innerHTML = `
        <div class="confirmation-error">
          <i class="fas fa-times-circle"></i>
          <p>${error.message || 'Failed to confirm email'}</p>
        </div>
      `;
    }
  } else {
    statusDiv.innerHTML = `
      <div class="confirmation-info">
        <i class="fas fa-info-circle"></i>
        <p>Enter your email below to resend confirmation</p>
      </div>
    `;
  }

  // Resend confirmation email
  const resendForm = document.getElementById('resend-confirmation-form');
  if (resendForm) {
    resendForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await authApi.resendConfirmation(document.getElementById('resend-email').value);
        alert('Confirmation email resent!');
      } catch (error) {
        alert(error.message || 'Failed to resend email');
      }
    });
  }
});