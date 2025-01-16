document.addEventListener('DOMContentLoaded', function() {
    const userQuadrant = localStorage.getItem('userQuadrant');
    console.log('User quadrant:', userQuadrant); // debug

    const sections = document.querySelectorAll('main .quadrant');
    sections.forEach(section => {
        section.style.display = 'none';
        console.log('Section ID:', section.id); // debug
    });

    const sectionToShow = document.getElementById(userQuadrant);
    if (sectionToShow) {
        sectionToShow.style.display = 'block';
    } else {
        consoler.error('Section not found:', userQuadrant);
    }
});