// Authentication logic
function isAuthenticated() {
    // Check if the authentication token exists in local storage
    return !!localStorage.getItem("user");
}

function redirectToLogin() {
    // Redirect to the login page
    window.location.href = "login.html";
}

// Check authentication status when the page loads
function checkAuth() {
    if (!isAuthenticated()) {
        redirectToLogin();
    }
}

function logout(){
    localStorage.clear();
    redirectToLogin();
}