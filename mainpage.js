document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector("nav");

    menuToggle.addEventListener("click", function() {
        menu.classList.toggle("active");
    });

    const newDiv = document.createElement("div");
    newDiv.id = "welcome-div";
    newDiv.textContent = 'Welcome to the main page!';
    document.body.appendChild(newDiv);
    
    setTimeout(() => {
        const toRemove = document.getElementById('welcome-div');
        if (toRemove) {
            toRemove.remove();
        }
    }, 3000)
});