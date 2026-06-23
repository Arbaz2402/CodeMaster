/* Email Confirmation Page */

document.addEventListener('DOMContentLoaded', async () => {
  // Get token from URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const statusDiv = document.getElementById('confirmation-status');
  const authCard = document.querySelector('.auth-card');

  // Add resend form to auth card
  authCard.innerHTML += `
    <div id="resend-form" style="margin-top: 2rem;">
      <h3>Resend Confirmation Email</h3>
      <form id="resend-confirmation-form">
        <div class="form-group">
          <label>Email</label>
          <input type="email" id="resend-email" required>
        </div>
        <button type="submit" class="btn-primary">Resend Email</button>
      </form>
    </div>
  `;

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
          <a href="login.html" class="btn-primary" style="margin-top: 1rem; display: inline-block;">Go to Login</a>
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