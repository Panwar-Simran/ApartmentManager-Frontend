const BASE_URL='http://localhost:8080';  //declaring const base url

// ─── TOKEN FUNCTIONS ──────────────────────────────

function saveToken(token){
    localStorage.setItem('token', token);//key val pair
}

function getToken(){
    return localStorage.getItem('token');
}

// ─── ROLE FUNCTIONS ───────────────────────────────

function saveRole(role){
    localStorage.setItem('role',role);
}

function getRole(){
    return localStorage.getItem('role');
}

// ─── PASSWORD CHANGED FUNCTIONS ───────────────────

function savePasswordChanged(value){
    localStorage.setItem('isPasswordChanged', value);
}

function getPasswordChanged() {
    return localStorage.getItem('isPasswordChanged');
}


// ─── AUTH CHECK FUNCTIONS ─────────────────────────

// If not logged in → redirect to login

function checkAuth(){
    if(!getToken()){
        window.location.href='login.html';
    }
}


// If password not changed → redirect to change password
function checkPasswordChanged(){
    if (getPasswordChanged() === 'false') {
        window.location.href = 'change-password.html';
    }
}

// If wrong role → redirect to login
function checkRole(requiredRole) {
    if (getRole() !== requiredRole) {
        alert('Access denied!');
        window.location.href = 'login.html';
    }
}



// ─── LOGOUT ───────────────────────────────────────

function logout(){
    localStorage.clear();
    window.location.href='login.html';
}

// ─── API CALL FUNCTION ────────────────────────────

// Common function to call backend APIs
// Used by all JS files

async function apiCall(endpoint,method, body){
    try{
       const headers={
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
       };

        const options = {
            method: method,
            headers: headers
        };

        // Add body only for POST and PUT
        if(body){
            options.body=JSON.stringify(body);//convert js object to json object
            //at backend -> deserilization json->java object
            //response from backend->serialization-> java to json object
        }

        const response=await fetch(BASE_URL+endpoint, options);
        const data = await response.json();

         if (!response.ok) {
            throw new Error(data.error || 'Something went wrong');
        }

        return data;
         
    }
    catch(error){
         throw error;
    }
}//func


// ─── MESSAGE FUNCTIONS ────────────────────────────

// Show red error message

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle me-2"></i>
                ${message}
            </div>`;
    }
}


// Show green success message
function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="alert alert-success">
                <i class="bi bi-check-circle me-2"></i>
                ${message}
            </div>`;
    }
}

// Clear message div
function clearMessage(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '';
    }
}


// ─── FORMAT FUNCTIONS ─────────────────────────────

// Format date → DD/MM/YYYY

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
}

// Format currency 
function formatCurrency(amount) {
    if (amount === null || amount === undefined) return '₹0.00';
    return '₹' + parseFloat(amount).toFixed(2);
}

// Get month name from number
function getMonthName(month) {
    const months = [
        'January', 'February', 'March',
        'April', 'May', 'June',
        'July', 'August', 'September',
        'October', 'November', 'December'
    ];
    return months[month - 1];
}

// ─── STATUS BADGE ─────────────────────────────────

// Returns colored Bootstrap badge based on status

function getStatusBadge(status) {
    switch (status) {
        case 'PAID':
            return '<span class="badge bg-success">PAID</span>';
        case 'PENDING':
            return '<span class="badge bg-warning text-dark">PENDING</span>';
        case 'UNDER_REVIEW':
            return '<span class="badge bg-info text-dark">UNDER REVIEW</span>';
        case 'APPROVED':
            return '<span class="badge bg-success">APPROVED</span>';
        case 'REJECTED':
            return '<span class="badge bg-danger">REJECTED</span>';
        default:
            return '<span class="badge bg-secondary">' + status + '</span>';
    }
}

// ─── NAVBAR ACTIVE LINK ───────────────────────────

// Highlights current page in sidebar

function setActiveLink(linkId) {
    const link = document.getElementById(linkId);
    if (link) {
        link.classList.add('active');
    }
}

// ─── SHOW LOADING ─────────────────────────────────

function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="text-muted mt-2">Loading...</p>
            </div>`;
    }
}



// ─── CONFIRM DELETE ───────────────────────────────

function confirmAction(message) {
    return confirm(message);
}