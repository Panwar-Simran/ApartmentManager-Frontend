// ─── LOGIN ────────────────────────────────────

// If already logged in → redirect to dashboard

if(window.location.pathname.includes('login.html')){
    if(getToken()){
        redirectToDashboard();
    }
}


//Login Form Submit
const loginForm =document.getElementById('loginForm')
if(loginForm){
    loginForm.addEventListener('submit', async function(e) {
        const email=document.getElementById('email').ariaValueMax;
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
