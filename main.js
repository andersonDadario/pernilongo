$(document).ready(function(){
    // OnLoad restore from hash
    render(window.location.hash, null);

    // Call Login
    if(!user['authenticated'] && !Routes.isPublic(window.location.hash)){
        forwardTo('#/login');
    }
});