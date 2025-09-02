// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    //Get toggle buttons
    const signUpToggle = document.getElementById('signUpToggle');
    const signInToggle = document.getElementById('signInToggle');
    
    //get form containers
    const signUpForm = document.getElementById('signUpForm');
    const signInForm = document.getElementById('signInForm');

    //get forms
    const registrationForm = document.getElementById('registrationForm');
    const loginForm = document.getElementById('loginForm');

    //get sign up form elements
    const signUpEmailInput = document.getElementById('signUpEmail');
    const signUpPasswordInput = document.getElementById('signUpPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    //get sign in form elements
    const signInEmailInput = document.getElementById('signInEmail');
    const signInPasswordInput = document.getElementById('signInPassword');
    const rememberMeInput = document.getElementById('rememberMe');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');

    //get error message elements for sign up
    const signUpEmailError = document.getElementById('signUpEmailError');
    const signUpPasswordError = document.getElementById('signUpPasswordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');

    //get error message elements for sign in
    const signInEmailError = document.getElementById('signInEmailError');
    const signInPasswordError = document.getElementById('signInPasswordError');

    //get password requirement elements
    const lengthReq = document.getElementById('length');
    const uppercaseReq = document.getElementById('uppercase');
    const lowercaseReq = document.getElementById('lowercase');
    const numberReq = document.getElementById('number');
    const specialReq = document.getElementById('special');

    //get success message elements
    const signUpSuccessMessage = document.getElementById('signUpSuccessMessage');
    const signInSuccessMessage = document.getElementById('signInSuccessMessage');

    // Simulated user database (in real app, this would be server-side)
    let users = [
        { email: 'demo@example.com', password: 'Demo123!'}
    ];

    //form toggle functionality
    signUpToggle.addEventListener('click', function() {
        showSignUpForm();
    });

    signInToggle.addEventListener('click', function() {
        showSignInForm();
    });

    function showSignUpForm() {
        signUpToggle.classList.add('active');
        signInToggle.classList.remove('active');
        signUpForm.classList.add('active');
        signInForm.classList.remove('active');
        clearAllErrors();
        clearAllForms();
    }

    function showSignInForm() {
        signInToggle.classList.add('active');
        signUpToggle.classList.remove('active');
        signInForm.classList.add('active');
        signUpForm.classList.remove('active');
        clearAllErrors();
        clearAllForms();
    }

    function clearAllErrors() {
        //clear sign up errors
        signUpEmailError.textContent = '';
        signUpPasswordError.textContent = '';
        confirmPasswordError.textContent = '';

        //clear sign in errors
        signInEmailError.textContent = '';
        signInPasswordError.textContent = '';

        //clear input classes
        signUpEmailInput.className = '';
        signUpPasswordInput.className = '';
        confirmPasswordInput.className = '';
        signInEmailInput.className = '';
        signInPasswordInput.className = '';

        //hide success messages
        signUpSuccessMessage.style.display = 'none';
        signInSuccessMessage.style.display = 'none';
    }

    function clearAllForms() {
        registrationForm.reset();
        loginForm.reset();
        updatePasswordRequirements('');
    }

    //email validation function
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    //password strength validation function
    function validatePassword(password) {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?\":{}|<>]/.test(password)
        };
        
        return requirements;
    }

    // Update password requirements visual feedback
    function updatePasswordRequirements(password){
        const requirements = validatePassword(password);

        //update each requirement indicator
        lengthReq.className = requirements.length ? 'valid' : '';
        uppercaseReq.className = requirements.uppercase ? 'valid' : '';
        lowercaseReq.className = requirements.lowercase ? 'valid' : '';
        numberReq.className = requirements.number ? 'valid' : '';
        specialReq.className = requirements.special ? 'valid' : '';

        //return true if all requirements are met
        return Object.values(requirements).every(req => req === true);
    }

    //check if user already exists
    function userExists(email){
        return users.some(user => user.email.toLowerCase() === email.toLowerCase());
    }

    //authenticate user
    function authenticateUser(email, password){
        return users.find(user =>
            user.email.toLowerCase() === email.toLowerCase() &&
            user.password === password
        );
    }

    //add new user to database
    function addUser(email, password){
        users.push({email: email, password: password});
    }

    // SIGN UP FORM VALIDATION

    // real-time email validation for sign up
    signUpEmailInput.addEventListener('input', function() {
        const email = this.value;
        
        if (email === '') {
            signUpEmailError.textContent = '';
            this.className = '';
            return;
        }
        
        if (!validateEmail(email)) {
            signUpEmailError.textContent = 'Please enter a valid email address';
            this.className = 'invalid';
        } else if (userExists(email)) {
            signUpEmailError.textContent = 'This email is already registered';
            this.className = 'invalid';
        } else {
            signUpEmailError.textContent = '';
            this.className = 'valid';
        }
    });

    // real-time password validation for sign up
    signUpPasswordInput.addEventListener('input', function() {
        const password = this.value;
        
        if (password === '') {
            signUpPasswordError.textContent = '';
            this.className = '';
            updatePasswordRequirements('');
            return;
        }
        
        const isPasswordValid = updatePasswordRequirements(password);
        
        if (isPasswordValid) {
            signUpPasswordError.textContent = '';
            this.className = 'valid';
        } else {
            signUpPasswordError.textContent = 'Password does not meet all requirements';
            this.className = 'invalid';
        }
        
        // also validate confirm password if it has a value
        if (confirmPasswordInput.value) {
            validateConfirmPassword();
        }
    });

    // confirm password validation function
    function validateConfirmPassword() {
        const password = signUpPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (confirmPassword === ''){
            confirmPasswordError.textContent = '';
            confirmPasswordInput.className = '';
            return false;
        }
        
        if (password === confirmPassword){
            confirmPasswordError.textContent = '';
            confirmPasswordInput.className = 'valid';
            return true;
        } else {
            confirmPasswordError.textContent = 'Passwords do not match';
            confirmPasswordInput.className = 'invalid';
            return false;
        }
    }

    // real-time confirm password validation
    confirmPasswordInput.addEventListener('input', validateConfirmPassword);

    // SIGN IN FORM VALIDATION

    // real-time email validation for sign in
    signInEmailInput.addEventListener('input', function() {
        const email = this.value;
        
        if (email === '') {
            signInEmailError.textContent = '';
            this.className = '';
            return;
        }
        
        if (validateEmail(email)) {
            signInEmailError.textContent = '';
            this.className = 'valid';
        } else {
            signInEmailError.textContent = 'Please enter a valid email address';
            this.className = 'invalid';
        }
    });

    // real-time password validation for sign in(simpler)
    signInPasswordInput.addEventListener('input', function() {
        const password = this.value;
        
        if (password === '') {
            signInPasswordError.textContent = '';
            this.className = '';
            return;
        }
        
        if (password.length >= 3) {
            signInPasswordError.textContent = '';
            this.className = 'valid';
        } else {
            signInPasswordError.textContent = 'Password is too short';
            this.className = 'invalid';
        }
    });

    // forgot password functionality
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Password reset feature would be implemented here.\\nDemo credentials: demo@example.com / Demo123!');
    });

    // SIGN UP FORM SUBMISSION
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // clear previous messages
        signUpEmailError.textContent = '';
        signUpPasswordError.textContent = '';
        confirmPasswordError.textContent = '';
        signUpSuccessMessage.style.display = 'none';
        
        // get form values
        const email = signUpEmailInput.value.trim();
        const password = signUpPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // validation flags
        let isValid = true;
        
        // validate email
        if (!email) {
            signUpEmailError.textContent = 'Email is required';
            signUpEmailInput.className = 'invalid';
            isValid = false;
        } else if (!validateEmail(email)) {
            signUpEmailError.textContent = 'Please enter a valid email address';
            signUpEmailInput.className = 'invalid';
            isValid = false;
        } else if (userExists(email)) {
            signUpEmailError.textContent = 'This email is already registered';
            signUpEmailInput.className = 'invalid';
            isValid = false;
        } else {
            signUpEmailInput.className = 'valid';
        }
        
        // validate password
        if (!password) {
            signUpPasswordError.textContent = 'Password is required';
            signUpPasswordInput.className = 'invalid';
            isValid = false;
        } else if (!updatePasswordRequirements(password)) {
            signUpPasswordError.textContent = 'Password does not meet all requirements';
            signUpPasswordInput.className = 'invalid';
            isValid = false;
        } else {
            signUpPasswordInput.className = 'valid';
        }
        
        // validate confirm password
        if (!confirmPassword) {
            confirmPasswordError.textContent = 'Please confirm your password';
            confirmPasswordInput.className = 'invalid';
            isValid = false;
        } else if (password !== confirmPassword) {
            confirmPasswordError.textContent = 'Passwords do not match';
            confirmPasswordInput.className = 'invalid';
            isValid = false;
        } else {
            confirmPasswordInput.className = 'valid';
        }
        
        // if all validations pass
        if (isValid) {  
            addUser(email, password); // add user to database     
            
            signUpSuccessMessage.style.display = 'block'; // show success message
            
            console.log('User registered successfully!');
            console.log('Email:', email);
            
            // switch to sign in form after 2 seconds
            setTimeout(function() {
                showSignInForm();
                signInEmailInput.value = email; // pre-fill email
            }, 2000);
        }
    });

    // SIGN IN FORM SUBMISSION
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // clear previous messages
        signInEmailError.textContent = '';
        signInPasswordError.textContent = '';
        signInSuccessMessage.style.display = 'none';
        
        // get form values
        const email = signInEmailInput.value.trim();
        const password = signInPasswordInput.value;
        const rememberMe = rememberMeInput.checked;
        
        // validation flags
        let isValid = true;
        
        // validate email
        if (!email) {
            signInEmailError.textContent = 'Email is required';
            signInEmailInput.className = 'invalid';
            isValid = false;
        } else if (!validateEmail(email)) {
            signInEmailError.textContent = 'Please enter a valid email address';
            signInEmailInput.className = 'invalid';
            isValid = false;
        } else {
            signInEmailInput.className = 'valid';
        }
        
        // validate password
        if (!password) {
            signInPasswordError.textContent = 'Password is required';
            signInPasswordInput.className = 'invalid';
            isValid = false;
        } else {
            signInPasswordInput.className = 'valid';
        }
        
        // if basic validations pass, check authentication
        if (isValid) {
            const user = authenticateUser(email, password);
            
            if (user) {
                // successful sign in
                signInSuccessMessage.style.display = 'block';
                
                console.log('User signed in successfully!');
                console.log('Email:', email);
                console.log('Remember me:', rememberMe);
                
                // simulate redirect or dashboard access
                setTimeout(function() {
                    alert('Welcome! You would now be redirected to your dashboard.');
                    loginForm.reset();
                    signInSuccessMessage.style.display = 'none';
                    signInEmailInput.className = '';
                    signInPasswordInput.className = '';
                }, 2000);
                
            } else {
                // authentication failed
                signInEmailError.textContent = 'Invalid email or password';
                signInPasswordError.textContent = 'Invalid email or password';
                signInEmailInput.className = 'invalid';
                signInPasswordInput.className = 'invalid';
            }
        }
    });

    showSignUpForm(); // initialize with sign up form visible
});