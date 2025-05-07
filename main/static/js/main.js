document.addEventListener("DOMContentLoaded", function() {
    function setBodyHeight() {
        document.body.style.height = window.innerHeight + 'px';
    }
    
    // Set body height initially
    setBodyHeight();
    
    // Update on window resize
    window.addEventListener('resize', setBodyHeight);
});
