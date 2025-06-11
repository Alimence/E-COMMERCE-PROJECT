const users = [
    {
       username: 'admin',
       password: 'admin123',
       role: 'admin'
    },
    {
        username: 'editor',
       password: 'editor123',
       role: 'editor'
    }, 
    {
        username: 'viewer',
       password: 'viewer123',
       role: 'viewer'
    }
];

const saveCurrentUser = (userName, role) => {
    localStorage.setItem('currentUser', JSON.stringify({userName, role}));
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('currentUser'));
};

const clearCurrentUser = () => {
    localStorage.removeItem('currentUser');
};

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#loginForm');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.querySelector('#userName').value.trim();
        const password = document.querySelector('#password').value.trim();
        const errorContainer = document.querySelector('#errorMessage');
        const successContainer = document.querySelector('#successMessage');

        if (!username || !password) {
            errorContainer.textContent = 'Please fill in all fields';
            successContainer.textContent = '';
        } else {
            errorContainer.textContent = '';
            const user = users.find(user => user.username === username && user.password === password);
            if (user) {
                errorContainer.textContent = '';
                successContainer.textContent = `Welcome ${user.role}`;
                saveCurrentUser(user.username, user.role);    
                displayContent(user.role);
            } else {
                errorContainer.textContent = 'Invalid username or password';
                successContainer.textContent = '';
            }
        } 
    });

    // Auto-login if user is already in localStorage
    const currentUser = getCurrentUser();
    if (currentUser) {
        displayContent(currentUser.role);
    }
});

const clearDynamicContent = () => {
    // Remove any existing .content or .user-management divs
    document.querySelectorAll('.content, .user-management').forEach(el => el.remove());
};

const displayContent = (role) => {
    clearDynamicContent();

    const loginContainer = document.querySelector('.login-container');
    if (loginContainer) loginContainer.style.display = 'none';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'content';

    contentDiv.innerHTML = `<h2>Welcome ${role}</h2>`;

    if (role === 'admin') {
        const manageBtn = document.createElement('button');
        manageBtn.textContent = 'Manage Users';
        manageBtn.onclick = displayUserManagement;
        contentDiv.appendChild(manageBtn);
    } else if (role === 'editor') {
        contentDiv.innerHTML += `
            <button>View</button>
            <button>Edit</button>
            <button>Delete</button>
        `;
    } else if (role === 'viewer') {
        contentDiv.innerHTML += `
            <button>Edit</button>
            <button>View</button>
        `;
    }

    const logoutButton = document.createElement('button');
    logoutButton.textContent = 'Logout';
    logoutButton.classList.add('logout-button');
    logoutButton.addEventListener('click', logout);

    contentDiv.appendChild(logoutButton);

    document.body.appendChild(contentDiv);
};

const displayUserManagement = () => {
    clearDynamicContent();

    const userManagementDiv = document.createElement('div');
    userManagementDiv.className = 'user-management';

    userManagementDiv.innerHTML = '<h2>User Management</h2>';

    users.forEach((user, index) => {
        const userDiv = document.createElement('div');
        userDiv.classList.add('user-row');
        userDiv.innerHTML = `
            <span>${user.username}</span>
            <select data-index="${index}">
                <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                <option value="editor" ${user.role === 'editor' ? 'selected' : ''}>Editor</option>
                <option value="viewer" ${user.role === 'viewer' ? 'selected' : ''}>Viewer</option>
            </select>
        `;
        userManagementDiv.appendChild(userDiv);
    });

    // Add event listeners for all selects
    userManagementDiv.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', function() {
            changeRole(Number(this.dataset.index), this.value);
        });
    });

    // Add a back button to return to main content
    const backButton = document.createElement('button');
    backButton.textContent = 'Back';
    backButton.onclick = () => {
        const currentUser = getCurrentUser();
        if (currentUser) {
            displayContent(currentUser.role);
        }
    };
    userManagementDiv.appendChild(backButton);

    document.body.appendChild(userManagementDiv);
};

const changeRole = (index, newRole) => {
    users[index].role = newRole;
    alert(`User ${users[index].username} role has been changed to ${newRole}`);
    // Optionally, refresh the user management view
    displayUserManagement();
};

const logout = () => {
    clearCurrentUser();
    location.reload();
};