const users = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'editor', password: 'editor123', role: 'editor' },
    {
        username: 'viewer',
       password: 'viewer123',
       role: 'viewer'
    }
];

const products = [
    {
        name: "Laptop",
        description: "High-end laptop",
        price: "999$"
    },
    {
        name: "Phone",
        description: "Smartphone with great camera",
        price: "699$"
    },
    {
        name: "Tablet",
        description: "Perfect for on-the-go",
        price: "499$"
    }
];

// Load products from localStorage if available
const savedProducts = localStorage.getItem('products');
if (savedProducts) {
    products.length = 0; // Clear the array
    products.push(...JSON.parse(savedProducts));
}

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

    document.getElementById('closeBtn').addEventListener('click', function() {
        document.querySelector('.login-container').style.display = 'none';
    });

    const closeProductListBtn = document.getElementById('closeProductListBtn');
    if (closeProductListBtn) {
        closeProductListBtn.addEventListener('click', function() {
            document.querySelector('.product-list').style.display = 'none';
        });
    }
});

const clearDynamicContent = () => {
    // Remove any existing .content or .user-management divs
    document.querySelectorAll('.content, .user-management').forEach(el => el.remove());
};

const displayProducts = () => {
    // Remove any existing products section
    document.querySelectorAll('.products-section').forEach(el => el.remove());

    const productsSection = document.createElement('div');
    productsSection.className = 'products-section';

    const heading = document.createElement('h2');
    heading.textContent = 'List of All Products';
    productsSection.appendChild(heading);

    // Get current user role
    const currentUser = getCurrentUser();
    const canEditQuantity = currentUser && (currentUser.role === 'admin' || currentUser.role === 'editor');

    products.forEach((product, index) => {
        const row = document.createElement('div');
        row.className = 'product-row';

        // Product name
        const productName = document.createElement('div');
        productName.innerHTML = `<strong>Product:</strong> ${product.name}`;

        // Description
        const desc = document.createElement('div');
        desc.innerHTML = `<strong>Description:</strong> ${product.description}`;

        // Price
        const price = document.createElement('div');
        price.innerHTML = `<strong>Price:</strong> ${product.price}`;

        row.appendChild(productName);
        row.appendChild(desc);
        row.appendChild(price);

        // Quantity controls for admin/editor
        if (canEditQuantity) {
            const quantityBox = document.createElement('div');
            quantityBox.className = 'quantity-box';

            const minusBtn = document.createElement('button');
            minusBtn.type = 'button';
            minusBtn.textContent = '-';

            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.min = 0;
            quantityInput.value = product.quantity || 0;
            quantityInput.id = `quantity-${index}`;
            quantityInput.style.width = '36px';
            quantityInput.readOnly = true;

            const plusBtn = document.createElement('button');
            plusBtn.type = 'button';
            plusBtn.textContent = '+';

            // Button events
            minusBtn.onclick = () => {
                let val = parseInt(quantityInput.value, 10);
                if (val > 0) {
                    quantityInput.value = val - 1;
                    product.quantity = val - 1;
                }
            };
            plusBtn.onclick = () => {
                let val = parseInt(quantityInput.value, 10);
                quantityInput.value = val + 1;
                product.quantity = val + 1;
            };

            quantityBox.appendChild(minusBtn);
            quantityBox.appendChild(quantityInput);
            quantityBox.appendChild(plusBtn);

            row.appendChild(quantityBox);
        }

        productsSection.appendChild(row);
    });

    // Add Close button at the bottom
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.onclick = () => {
        productsSection.remove();
    };
    productsSection.appendChild(closeButton);

    document.body.appendChild(productsSection);
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
        manageBtn.onclick = () => {
            if (!document.querySelector('.user-management')) {
                displayUserManagement();
            }
        };
        contentDiv.appendChild(manageBtn);

        const viewProductsBtn = document.createElement('button');
        viewProductsBtn.textContent = 'View Products';
        viewProductsBtn.onclick = () => {
            displayProducts();
        };
        contentDiv.appendChild(viewProductsBtn);

        const addProductSection = document.createElement('div');
        addProductSection.className = 'add-product-section';

        const addProductBtn = document.createElement('button');
        addProductBtn.textContent = 'Add Product';
        addProductBtn.type = 'button';
        addProductBtn.className = 'add-product-main-btn';
        addProductBtn.onclick = () => {
            // Remove other sections
            document.querySelectorAll('.user-management, .products-section, .add-product-form').forEach(el => el.remove());
            showAddProductSection();
        };

        addProductSection.appendChild(addProductBtn);
        contentDiv.appendChild(addProductSection);
    } else if (role === 'editor') {
        const viewProductsBtn = document.createElement('button');
        viewProductsBtn.textContent = 'View Products';
        viewProductsBtn.onclick = () => {
            displayProducts();
        };
        contentDiv.appendChild(viewProductsBtn);

        // Add Product section for editor
        const addProductSection = document.createElement('div');
        addProductSection.className = 'add-product-section';

        const addProductBtn = document.createElement('button');
        addProductBtn.textContent = 'Add Product';
        addProductBtn.type = 'button';
        addProductBtn.className = 'add-product-main-btn';
        addProductBtn.onclick = () => {
            // Remove other sections
            document.querySelectorAll('.user-management, .products-section, .add-product-form').forEach(el => el.remove());
            showAddProductSection();
        };

        addProductSection.appendChild(addProductBtn);
        contentDiv.appendChild(addProductSection);
    } else if (role === 'viewer') {
        // Viewer can only view products, no edit/delete
        const viewProductsBtn = document.createElement('button');
        viewProductsBtn.textContent = 'View Products';
        viewProductsBtn.onclick = () => {
            displayProducts();
        };
        contentDiv.appendChild(viewProductsBtn);
    }

    // Shop Products button for all roles
    const shopProductsBtn = document.createElement('button');
    shopProductsBtn.textContent = 'Shop Products';
    shopProductsBtn.className = 'shop-products-btn'; // Optional, for future custom styling
    // Add your event handler here, e.g.:
    shopProductsBtn.onclick = () => {
        // Do NOT remove or hide other sections
        showShopProductSection();
    };
    contentDiv.appendChild(shopProductsBtn);

    // View Cart button for all roles
    const viewCartBtn = document.createElement('button');
    viewCartBtn.textContent = 'View Cart';
    viewCartBtn.className = 'view-cart-btn'; // Optional, for future custom styling
    viewCartBtn.onclick = () => {
        // Implement your view cart logic here
        alert('Cart feature coming soon!');
    };
    contentDiv.appendChild(viewCartBtn);

    const logoutButton = document.createElement('button');
    logoutButton.textContent = 'Logout';
    logoutButton.classList.add('logout-button');
    logoutButton.addEventListener('click', logout);

    contentDiv.appendChild(logoutButton);

    document.body.appendChild(contentDiv);
};

const displayUserManagement = () => {
    // Do NOT clear .content, only remove existing .user-management if any
    document.querySelectorAll('.user-management').forEach(el => el.remove());

    const userManagementDiv = document.createElement('div');
    userManagementDiv.className = 'user-management';

    userManagementDiv.innerHTML = '<h2>User Management</h2>';

    // For each user, create a styled box similar to product-row
    users.forEach((user, index) => {
        const userDiv = document.createElement('div');
        userDiv.classList.add('product-row'); // Use the same style as product-row

        userDiv.innerHTML = `
            <div><strong>Username:</strong> ${user.username}</div>
            <div><strong>Role:</strong> ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</div>
            <div>
                <select data-index="${index}">
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                    <option value="editor" ${user.role === 'editor' ? 'selected' : ''}>Editor</option>
                    <option value="viewer" ${user.role === 'viewer' ? 'selected' : ''}>Viewer</option>
                </select>
            </div>
        `;
        userManagementDiv.appendChild(userDiv);
    });

    // Add event listeners for all selects
    userManagementDiv.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', function() {
            changeRole(Number(this.dataset.index), this.value);
        });
    });

    // Add a close button to hide user management
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close User Management';
    closeButton.onclick = () => {
        userManagementDiv.remove();
    };
    userManagementDiv.appendChild(closeButton);

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

    // Remove all dynamic sections
    document.querySelectorAll(
        '.content, .user-management, .products-section, .add-product-form, .shop-product-section'
    ).forEach(el => el.remove());

    // Show the login section
    const loginContainer = document.querySelector('.login-container');
    if (loginContainer) loginContainer.style.display = '';

    // Optionally clear messages
    const errorContainer = document.querySelector('#errorMessage');
    const successContainer = document.querySelector('#successMessage');
    if (errorContainer) errorContainer.textContent = '';
    if (successContainer) successContainer.textContent = '';
};

function showAddProductForm(contentDiv) {
    // Remove any existing form
    const existingForm = document.querySelector('.add-product-form');
    if (existingForm) existingForm.remove();

    // Create form container
    const formDiv = document.createElement('div');
    formDiv.className = 'add-product-form';

    // Product Name input
    const productNameBox = document.createElement('div');
    productNameBox.className = 'input-box large';
    const productNameInput = document.createElement('input');
    productNameInput.type = 'text';
    productNameInput.className = 'product-input';
    productNameInput.required = true;
    productNameInput.placeholder = 'Product Name';
    productNameBox.appendChild(productNameInput);

    // Description input
    const descBox = document.createElement('div');
    descBox.className = 'input-box large';
    const descInput = document.createElement('input');
    descInput.type = 'text';
    descInput.className = 'product-input';
    descInput.required = true;
    descInput.placeholder = 'Description';
    descBox.appendChild(descInput);

    // Price and Amount (side by side)
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '12px';
    row.style.marginTop = '10px';

    const priceBox = document.createElement('div');
    priceBox.className = 'input-box small';
    const priceInput = document.createElement('input');
    priceInput.type = 'text';
    priceInput.className = 'product-input';
    priceInput.required = true;
    priceInput.placeholder = 'Price';
    priceBox.appendChild(priceInput);

    const amountBox = document.createElement('div');
    amountBox.className = 'input-box small';
    const amountInput = document.createElement('input');
    amountInput.type = 'number';
    amountInput.className = 'product-input';
    amountInput.required = true;
    amountInput.placeholder = 'Amount';
    amountBox.appendChild(amountInput);

    row.appendChild(priceBox);
    row.appendChild(amountBox);

    // Add Product button
    const addBtnBox = document.createElement('div');
    addBtnBox.className = 'input-box large';
    addBtnBox.style.marginTop = '14px';
    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add Product';
    addBtn.type = 'button';
    addBtn.className = 'add-product-btn';
    addBtnBox.appendChild(addBtn);

    // Append all to form
    formDiv.appendChild(productNameBox);
    formDiv.appendChild(descBox);
    formDiv.appendChild(row);
    formDiv.appendChild(addBtnBox);

    // Add form to contentDiv
    contentDiv.appendChild(formDiv);

    // Add logic to hide placeholder on typing (handled by default with placeholder attribute)

    // Add product logic
    addBtn.onclick = () => {
        const name = productNameInput.value.trim();
        const desc = descInput.value.trim();
        const price = priceInput.value.trim();
        const amount = parseInt(amountInput.value, 10);

        if (!name || !desc || !price || isNaN(amount)) {
            alert('Please fill in all fields.');
            return;
        }

        products.push({
            name,
            description: desc,
            price,
            quantity: amount
        });

        // Save to localStorage
        localStorage.setItem('products', JSON.stringify(products));

        formDiv.remove();
        displayProducts();
    };
}

function showAddProductSection() {
    // Remove any existing add product form
    document.querySelectorAll('.add-product-form').forEach(el => el.remove());

    const formDiv = document.createElement('div');
    formDiv.className = 'add-product-form';

    // Heading
    const heading = document.createElement('h2');
    heading.textContent = 'Add Product';
    heading.style.textAlign = 'center';
    heading.style.marginBottom = '16px';
    formDiv.appendChild(heading);

    // Product Name input
    const productNameBox = document.createElement('div');
    productNameBox.className = 'input-box large';
    const productNameInput = document.createElement('input');
    productNameInput.type = 'text';
    productNameInput.className = 'product-input';
    productNameInput.required = true;
    productNameInput.placeholder = 'Product Name';
    productNameBox.appendChild(productNameInput);

    // Description input
    const descBox = document.createElement('div');
    descBox.className = 'input-box large';
    const descInput = document.createElement('input');
    descInput.type = 'text';
    descInput.className = 'product-input';
    descInput.required = true;
    descInput.placeholder = 'Description';
    descBox.appendChild(descInput);

    // Price and Amount (side by side)
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '12px';
    row.style.marginTop = '10px';

    const priceBox = document.createElement('div');
    priceBox.className = 'input-box small';
    const priceInput = document.createElement('input');
    priceInput.type = 'text';
    priceInput.className = 'product-input';
    priceInput.required = true;
    priceInput.placeholder = 'Price';
    priceBox.appendChild(priceInput);

    const amountBox = document.createElement('div');
    amountBox.className = 'input-box small';
    const amountInput = document.createElement('input');
    amountInput.type = 'number';
    amountInput.className = 'product-input';
    amountInput.required = true;
    amountInput.placeholder = 'Amount';
    amountBox.appendChild(amountInput);

    row.appendChild(priceBox);
    row.appendChild(amountBox);

    // Add Product button
    const addBtnBox = document.createElement('div');
    addBtnBox.className = 'input-box large';
    addBtnBox.style.marginTop = '14px';
    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add Product';
    addBtn.type = 'button';
    addBtn.className = 'add-product-btn';
    addBtnBox.appendChild(addBtn);

    // Append all to form
    formDiv.appendChild(productNameBox);
    formDiv.appendChild(descBox);
    formDiv.appendChild(row);
    formDiv.appendChild(addBtnBox);

    // Add a close button to return to main content
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.className = 'add-product-main-btn';
    closeBtn.style.marginTop = '10px';
    closeBtn.onclick = () => {
        formDiv.remove();
    };
    formDiv.appendChild(closeBtn);

    document.body.appendChild(formDiv);

    // Add product logic
    addBtn.onclick = () => {
        const name = productNameInput.value.trim();
        const desc = descInput.value.trim();
        const price = priceInput.value.trim();
        const amount = parseInt(amountInput.value, 10);

        if (!name || !desc || !price || isNaN(amount)) {
            alert('Please fill in all fields.');
            return;
        }

        products.push({
            name,
            description: desc,
            price,
            quantity: amount
        });

        // Save to localStorage
        localStorage.setItem('products', JSON.stringify(products));

        formDiv.remove();
        displayProducts();
    };
}

function showShopProductSection() {
    // Remove any existing shop section
    document.querySelectorAll('.shop-product-section').forEach(el => el.remove());

    // DO NOT hide main content here

    // Create section
    const section = document.createElement('div');
    section.className = 'shop-product-section';
    section.style.background = '#f9f9f9';
    section.style.border = '1.5px solid #007bff';
    section.style.borderRadius = '10px';
    section.style.padding = '18px 18px 12px 18px';
    section.style.margin = '30px auto';
    section.style.width = '370px';
    section.style.boxShadow = '0 0 8px rgba(0,0,0,0.06)';
    section.style.position = 'relative';

    // Heading
    const heading = document.createElement('h2');
    heading.textContent = 'Purchase Product';
    heading.style.textAlign = 'center';
    heading.style.marginBottom = '16px';
    section.appendChild(heading);

    // Alert message
    const alertMsg = document.createElement('div');
    alertMsg.style.display = 'none';
    alertMsg.style.margin = '0 0 12px 0';
    alertMsg.style.padding = '8px';
    alertMsg.style.background = '#d4edda';
    alertMsg.style.color = '#155724';
    alertMsg.style.border = '1px solid #c3e6cb';
    alertMsg.style.borderRadius = '5px';
    alertMsg.style.textAlign = 'center';
    section.appendChild(alertMsg);

    // Product type input
    const productTypeBox = document.createElement('div');
    productTypeBox.className = 'input-box large';
    const productTypeInput = document.createElement('input');
    productTypeInput.type = 'text';
    productTypeInput.className = 'product-input';
    productTypeInput.required = true;
    productTypeInput.placeholder = 'Product type';
    productTypeBox.appendChild(productTypeInput);
    section.appendChild(productTypeBox);

    // Hide placeholder on typing (handled by default with placeholder)
    productTypeInput.addEventListener('input', function() {
        this.placeholder = '';
    });

    // Amount input
    const amountBox = document.createElement('div');
    amountBox.className = 'input-box large';
    amountBox.style.marginTop = '10px';
    const amountInput = document.createElement('input');
    amountInput.type = 'number';
    amountInput.className = 'product-input';
    amountInput.required = true;
    amountInput.placeholder = 'Amount';
    amountBox.appendChild(amountInput);
    section.appendChild(amountBox);

    amountInput.addEventListener('focus', function() {
        this.placeholder = '';
    });

    // Add To Cart button
    const addToCartBtn = document.createElement('button');
    addToCartBtn.textContent = 'Add To Cart';
    addToCartBtn.type = 'button';
    addToCartBtn.className = 'add-product-main-btn';
    addToCartBtn.style.marginTop = '14px';
    section.appendChild(addToCartBtn);

    // Add To Cart logic
    addToCartBtn.onclick = () => {
        const productName = productTypeInput.value.trim();
        const amount = parseInt(amountInput.value, 10);

        if (!productName || isNaN(amount) || amount <= 0) {
            alertMsg.style.display = 'block';
            alertMsg.style.background = '#f8d7da';
            alertMsg.style.color = '#721c24';
            alertMsg.style.border = '1px solid #f5c6cb';
            alertMsg.textContent = 'Please enter a valid product and amount.';
            return;
        }

        // Find product
        const product = products.find(p => p.name.toLowerCase() === productName.toLowerCase());
        if (!product) {
            alertMsg.style.display = 'block';
            alertMsg.style.background = '#f8d7da';
            alertMsg.style.color = '#721c24';
            alertMsg.style.border = '1px solid #f5c6cb';
            alertMsg.textContent = 'Product not found.';
            return;
        }

        if ((product.quantity || 0) < amount) {
            alertMsg.style.display = 'block';
            alertMsg.style.background = '#f8d7da';
            alertMsg.style.color = '#721c24';
            alertMsg.style.border = '1px solid #f5c6cb';
            alertMsg.textContent = 'Not enough quantity available.';
            return;
        }

        // Reduce quantity
        product.quantity = (product.quantity || 0) - amount;

        // Save to localStorage
        localStorage.setItem('products', JSON.stringify(products));

        // Show success alert
        alertMsg.style.display = 'block';
        alertMsg.style.background = '#d4edda';
        alertMsg.style.color = '#155724';
        alertMsg.style.border = '1px solid #c3e6cb';
        alertMsg.textContent = `Product (${product.name}) added to cart successfully`;

        // Update product list if open
        document.querySelectorAll('.products-section').forEach(el => el.remove());
        setTimeout(() => {
            displayProducts();
        }, 500);
    };

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.className = 'add-product-main-btn';
    closeBtn.style.marginTop = '10px';
    closeBtn.onclick = () => {
        section.remove();
        // DO NOT show mainContent here
    };
    section.appendChild(closeBtn);

    document.body.appendChild(section);
}

// Find the last "Phone" product and remove it
for (let i = products.length - 1; i >= 0; i--) {
    if (products[i].name.toLowerCase() === "phone") {
        products.splice(i, 1);
        break;
    }
}
// Update localStorage
localStorage.setItem('products', JSON.stringify(products));
// Optionally refresh the product list if needed
if (typeof displayProducts === 'function') displayProducts();