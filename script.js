let users = [];
        let loggedInUser = null;
        let totalAmount = 0;

        const registrationPage = document.getElementById('registrationPage');
        const loginPage = document.getElementById('loginPage');
        const expenseTracker = document.getElementById('expenseTracker');
        const registrationForm = document.getElementById('registrationForm');
        const loginForm = document.getElementById('loginForm');
        const expenseForm = document.getElementById('expenseForm');
        const expenseTable = document.getElementById('expenseTable').querySelector('tbody');
        const totalAmountDisplay = document.getElementById('totalAmount');

        // Keywords for categorisation
        const categories = {
            Food: ["food", "dinner", "lunch", "groceries"],
            Travel: ["travel", "ticket", "hotel", "transport"],
            Shopping: ["shopping", "clothes", "electronics"],
            Bills: ["bill", "electricity", "water", "phone"],
            Other: []
        };

        // Categorise expense based on keywords
        function getCategory(expenseName) {
            const lowerCaseName = expenseName.toLowerCase();
            for (const category in categories) {
                if (categories[category].some(keyword => lowerCaseName.includes(keyword))) {
                    return category;
                }
            }
            return "Other";
        }

        // Switch between login and registration
        document.getElementById('switchToLogin').addEventListener('click', event => {
            event.preventDefault();
            registrationPage.style.display = "none";
            loginPage.style.display = "block";
        });

        document.getElementById('switchToRegister').addEventListener('click', event => {
            event.preventDefault();
            loginPage.style.display = "none";
            registrationPage.style.display = "block";
        });

        // Handle registration
        registrationForm.addEventListener('submit', event => {
            event.preventDefault();
            const username = document.getElementById('regUsername').value;
            const password = document.getElementById('regPassword').value;

            if (users.some(user => user.username === username)) {
                alert("Username already exists!");
            } else {
                users.push({ username, password });
                alert("Registration successful!");
                registrationPage.style.display = "none";
                loginPage.style.display = "block";
            }

            registrationForm.reset();
        });

        // Handle login
        loginForm.addEventListener('submit', event => {
            event.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            const user = users.find(user => user.username === username && user.password === password);
            if (user) {
                loggedInUser = user;
                alert(`Welcome, ${username}!`);
                loginPage.style.display = "none";
                expenseTracker.style.display = "block";
            } else {
                alert("Invalid username or password!");
            }

            loginForm.reset();
        });

        // Add expense row
        expenseForm.addEventListener('submit', event => {
            event.preventDefault();
            const name = document.getElementById('expenseName').value;
            const amount = parseFloat(document.getElementById('expenseAmount').value);
            const date = document.getElementById('expenseDate').value;

            if (name && !isNaN(amount) && date) {
                const category = getCategory(name);

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${name}</td>
                    <td>${category}</td>
                    <td>${amount.toFixed(2)}</td>
                    <td>${date}</td>
                    <td>
                        <button class="edit-btn">Edit</button>
                        <button class="delete-btn">Delete</button>
                    </td>
                `;

                row.querySelector('.edit-btn').addEventListener('click', () => editExpense(row, name, amount, date));
                row.querySelector('.delete-btn').addEventListener('click', () => deleteExpense(row, amount));
                expenseTable.appendChild(row);

                totalAmount += amount;
                updateTotalAmount();
                expenseForm.reset();
            }
        });

        function editExpense(row, name, amount, date) {
            document.getElementById('expenseName').value = name;
            document.getElementById('expenseAmount').value = amount;
            document.getElementById('expenseDate').value = date;
            deleteExpense(row, amount);
        }

        function deleteExpense(row, amount) {
            expenseTable.removeChild(row);
            totalAmount -= amount;
            updateTotalAmount();
        }

        function updateTotalAmount() {
            totalAmountDisplay.textContent = `Total: ₹${totalAmount.toFixed(2)}`;
        }

        // Dark mode toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            const darkModeEnabled = document.body.classList.toggle('dark-mode');
            document.getElementById('themeToggle').textContent = darkModeEnabled ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        });