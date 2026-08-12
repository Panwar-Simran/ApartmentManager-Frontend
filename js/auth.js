// ─── LOGIN ────────────────────────────────────

// If already logged in → redirect to dashboard

/*if(window.location.pathname.includes('login.html')){
    if(getToken()){
        redirectToDashboard();
    }
}*/


//Login Form Submit
const loginForm =document.getElementById('loginForm')
if(loginForm){
    loginForm.addEventListener('submit', async function(e) {
         e.preventDefault();
        const email=document.getElementById('email').value;
        const password=document.getElementById('password').value;
        const loginBtn=document.getElementById('loginBtn');

        // Show loading

        loginBtn.innerHTML='<span class="spinner-border spinner-border-sm"></span> Signing in...';
        //showing loading image 
        loginBtn.disabled = true;//to prevent user for multiple form submission

        try{

            const data=await apiCall('/api/auth/login', 'POST',
                {
                      email: email,
                      password: password

            }//json body)
        );//data

          // Save to localStorage
          saveToken(data.token);
          saveRole(data.role);
          savePasswordChanged(data.isPasswordChanged);

          // Check if password needs to be changed

          if(!data.isPasswordChanged){//if password not changes then move to change password page
            window.location.href = 'change-password.html';
                return;
          }//if

           // Redirect based on role
           //else password is changed
            redirectToDashboard();   

        }//try

        catch(error){
            showError('message',error.message);
            loginBtn.innerHTML='Sign in';
            loginBtn.disabled = false;

        }//catch
 }//async function 
)}//if of login form check


// Toggle password visibility
const togglePassword = document.getElementById('togglePassword');
if(togglePassword){
    togglePassword.addEventListener('click', function(){
        const passwordInput = document.getElementById('password');
        const eyeIcon = document.getElementById('eyeIcon');


        if(passwordInput.type=='password'){
            passwordInput.type = 'text';
            eyeIcon.classList.remove('bi-eye');
            eyeIcon.classList.add('bi-eye-slash');
        }
         else {
            passwordInput.type = 'password';
            eyeIcon.classList.remove('bi-eye-slash');
            eyeIcon.classList.add('bi-eye');
        }

    });
}


// ─── CHANGE PASSWORD ──────────────────────────────

const changePasswordForm = document.getElementById('changePasswordForm');
if (changePasswordForm){

    // Check if logged in
    checkAuth();

    changePasswordForm.addEventListener('submit', async function(e){
      e.preventDefault();// prevrents form refreshing after submitting

       const currentPassword = document.getElementById('currentPassword').value;
       const newPassword = document.getElementById('newPassword').value;
       const confirmPassword = document.getElementById('confirmPassword').value;
       const changeBtn = document.getElementById('changeBtn');

       // Client side validation
        if (newPassword !== confirmPassword) {
            showError('message', 'New passwords do not match!');
            return;
        }

        if (newPassword.length < 6) {
            showError('message', 'Password must be at least 6 characters!');
            return;
        }

        // Show loading
        changeBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Changing...';
        changeBtn.disabled = true;

        try{
            await apiCall('/api/auth/change-password', 'POST',{
                currentPassword: currentPassword,
                newPassword: newPassword,
                confirmPassword: confirmPassword
            });

            // Update localStorage
            savePasswordChanged(true);

            showSuccess('message', 'Password changed successfully! Redirecting...');

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                redirectToDashboard();
            }, 2000);
        }//try

        catch(error){
            showError('message', error.message);
            changeBtn.innerHTML = 'Change Password';
            changeBtn.disabled = false;
        }//catch
    }//async func 
    );//even listener

}//if


// ─── HELPER FUNCTION ──────────────────────────────

function  redirectToDashboard(){
    const role=getRole();
    if(role=='PRADHANA'){
         window.location.href = 'pradhana-dashboard.html';
    }
    else{
        window.location.href = 'member-dashboard.html';
    }
}