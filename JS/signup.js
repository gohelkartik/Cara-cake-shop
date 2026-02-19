document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signupForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            alert('Sign Up Successful! (Form would submit to server)');
            form.reset();
        }
    });

    function validateForm() {
        let isValid = true;

        // Reset errors
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

        // Full Name Validation (Simple check)
        const fullName = document.getElementById('fullName').value.trim();
        if (fullName.length < 3) {
            document.getElementById('fullNameError').textContent = 'Full name must be at least 3 characters.';
            isValid = false;
        }

        // Email Validation
        const email = document.getElementById('email').value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            document.getElementById('emailError').textContent = 'Please enter a valid email address.';
            isValid = false;
        }

        // Password Validation (Minimum 8 chars)
        const password = document.getElementById('password').value;
        if (password.length < 8) {
            document.getElementById('passwordError').textContent = 'Password must be at least 8 characters.';
            isValid = false;
        }

        // Confirm Password Validation (Must match)
        const confirmPassword = document.getElementById('confirmPassword').value;
        if (password !== confirmPassword) {
            document.getElementById('confirmPasswordError').textContent = 'Passwords do not match.';
            isValid = false;
        }

        return isValid;
    }
});