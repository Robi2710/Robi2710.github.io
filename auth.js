document.addEventListener('DOMContentLoaded', checkSession);

function checkSession() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loginSection = document.getElementById('login-section');
    const welcomeSection = document.getElementById('welcome-section');
    
    if (isLoggedIn) {
        loginSection.style.display = 'none';
        welcomeSection.style.display = 'block';
    } else {
        loginSection.style.display = 'block';
        welcomeSection.style.display = 'none';
    }
}

function toggleAuth(section) {
    document.getElementById('login-section').style.display = section === 'login' ? 'block' : 'none';
    document.getElementById('register-section').style.display = section === 'register' ? 'block' : 'none';
    document.getElementById('login-toggle').classList.toggle('active', section === 'login');
    document.getElementById('register-toggle').classList.toggle('active', section === 'register');
}

document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    
    if (password !== confirmPassword) {
        document.getElementById('register-message').textContent = 'Passwords do not match';
        return;
    }

    fetch('data/users.json')
        .then(response => response.json())
        .then(data => {
            if (data.users.some(u => u.username === username)) {
                document.getElementById('register-message').textContent = 'Username already exists';
                return;
            }

            // In a real application, you would make a POST request to save the user
            // For this demo, we'll store in localStorage
            const newUser = { username, password };
            data.users.push(newUser);
            localStorage.setItem('registeredUsers', JSON.stringify(data.users));
            
            // Auto login after registration
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            checkSession();
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('register-message').textContent = 'Registration failed';
        });
});
//identific utilizatorul si setez cheile de sesiune in localstorage 
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Get users from both the original JSON and newly registered users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    fetch('data/users.json')
        .then(response => response.json())
        .then(data => {
            const allUsers = [...data.users, ...registeredUsers];
            const user = allUsers.find(u => 
                u.username === username && u.password === password
            );
            
            if (user) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                checkSession();
            } else {
                document.getElementById('login-message').textContent = 'Invalid credentials';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('login-message').textContent = 'Login failed';
        });
});

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    checkSession();
}
