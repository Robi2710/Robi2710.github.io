document.addEventListener('DOMContentLoaded', function() {
    // First, let's add some debug logging
    console.log('Loading results...');
    
    const results = JSON.parse(localStorage.getItem('politicalResults'));
    console.log('Retrieved results:', results);
    
    if (!results) {
        console.error('No results found in localStorage');
        document.getElementById('scores').innerHTML = '<p>No results available. Please take the survey first.</p>';
        return;
    }

    // Clampează scorul economic la maxim -7
    if (results.economic > -7) {
        results.economic = -7;
    }

    const dot = document.getElementById('result-dot');
    const container = document.getElementById('compass-container');

    // Make sure container exists
    if (!container) {
        console.error('Compass container not found');
        return;
    }

    // Get dot dimensions
    const dotSize = dot.offsetWidth;
    const padding = dotSize / 2;
    // Calculate initial position
    // Calculate position
    let x = ((results.economic + 10) / 20) * container.offsetWidth;
    let y = ((10 - results.social) / 20) * container.offsetHeight;

    // Limit x and y to stay within the container
    x = Math.min(Math.max(x, 0), container.offsetWidth);
    y = Math.min(Math.max(y, 0), container.offsetHeight);

    console.log('Adjusted position:', { x, y });

    // Position the dot
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
    
    // Display scores with more detailed information
    const economicScoreElement = document.getElementById('economic-score');
    const socialScoreElement = document.getElementById('social-score');

    if (economicScoreElement && socialScoreElement) {
        economicScoreElement.textContent = results.economic.toFixed(1);
        socialScoreElement.textContent = results.social.toFixed(1);
        
        // Add economic interpretation
        let economicLabel = '';
        if (results.economic < 0) economicLabel = ' (Left)';
        else if (results.economic > 0) economicLabel = ' (Right)';
        else economicLabel = ' (Centrist)';
        
        // Add social interpretation
        let socialLabel = '';
        if (results.social < 0) socialLabel = ' (Libertarian)';
        else if (results.social > 0) socialLabel = ' (Authoritarian)';
        else socialLabel = ' (Moderate)';

        economicScoreElement.textContent += economicLabel;
        socialScoreElement.textContent += socialLabel;
    } else {
        console.error('Score elements not found');
    }

    function determineQuadrant(economic, social) {
        let quadrant = '';
        if (social > 0) {
            if (economic > 0){
                quadrant = 'auth_right';
            }
            else {
                quadrant = 'auth_left';
            }
        }
        else {
            if (economic > 0) {
                quadrant = 'lib_right';
            }
            else {
                quadrant = 'lib_left';
            }
        }
        return quadrant;
    }

    const userQuadrant = determineQuadrant(results.economic, results.social);
    localStorage.setItem('userQuadrant', userQuadrant);
    console.log('Saved quadrant:', userQuadrant);

    // Debug 
    window.setTestResults = function(economic, social) {
        console.log('Setting test results:', { economic, social });
        const testResults = {
            economic: economic,
            social: social
        };
        localStorage.setItem('politicalResults', JSON.stringify(testResults));
        
        if (dot && container) {
            let x = ((economic + 10) / 20) * container.offsetWidth;
            let y = ((10 - social) / 20) * container.offsetHeight;
            
            x = Math.min(Math.max(x, 0), container.offsetWidth);
            y = Math.min(Math.max(y, 0), container.offsetHeight);
            
            dot.style.left = x + 'px';
            dot.style.top = y + 'px';
        }

        if (economicScoreElement && socialScoreElement) {
            let economicLabel = economic < 0 ? ' (Left)' : economic > 0 ? ' (Right)' : ' (Centrist)';
            let socialLabel = social < 0 ? ' (Libertarian)' : social > 0 ? ' (Authoritarian)' : ' (Moderate)';
            
            economicScoreElement.textContent = economic.toFixed(1) + economicLabel;
            socialScoreElement.textContent = social.toFixed(1) + socialLabel;
        }

        const newQuadrant = determineQuadrant(economic, social);
        localStorage.setItem('userQuadrant', newQuadrant);
        console.log('Updated quadrant:', newQuadrant);
    };
});