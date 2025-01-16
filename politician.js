document.addEventListener('DOMContentLoaded', function() {
    const userQuadrant = localStorage.getItem('userQuadrant');
    console.log('User quadrant:', userQuadrant); // Debug log

    const sections = document.querySelectorAll('main .quadrant');
    sections.forEach(section => {
        section.style.display = 'none';
        console.log('Section ID:', section.id); // Debug log
    });

    const sectionToShow = document.getElementById(userQuadrant);
    if (sectionToShow) {
        sectionToShow.style.display = 'block';
    } else {
        consoler.error('Section not found:', userQuadrant);
    }
});