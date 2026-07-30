// ─── EXPENSES MODULE ──────────────────────────────

checkAuth();
checkPasswordChanged();

const role = getRole();

// ─── BUILD SIDEBAR ────────────────────────────────

function buildSidebar() {
    const roleLabel = document.getElementById('roleLabel');
    const sidebarNav = document.getElementById('sidebarNav');
    const topbarRole = document.getElementById('topbarRole');

    if (role === 'PRADHANA') {
        roleLabel.textContent = 'Pradhana Panel';
        topbarRole.textContent = 'Pradhana';
        sidebarNav.innerHTML = `
            <a class="nav-link" href="pradhana-dashboard.html">
                <i class="bi bi-layout-dashboard"></i> Dashboard
            </a>
            <a class="nav-link" href="members.html">
                <i class="bi bi-people"></i> Members
            </a>
            <a class="nav-link" href="maintenance.html">
                <i class="bi bi-calendar-check"></i> Maintenance
            </a>
            <a class="nav-link" href="payments.html">
                <i class="bi bi-cash-stack"></i> Payments
            </a>
            <a class="nav-link active" href="expenses.html">
                <i class="bi bi-receipt"></i> Expenses
            </a>
            <a class="nav-link" href="contributions.html">
                <i class="bi bi-heart-pulse"></i> Contributions
            </a>
            <a class="nav-link" href="meetings.html">
                <i class="bi bi-calendar-event"></i> Meetings
            </a>
            <a class="nav-link" href="report.html">
                <i class="bi bi-file-earmark-bar-graph"></i> Reports
            </a>
            <hr class="mx-3">
            <a class="nav-link text-danger" href="#"
               onclick="logout()">
                <i class="bi bi-box-arrow-left"></i> Logout
            </a>`;

        // Show action buttons for Pradhana
        document.getElementById('actionBtnsContainer').innerHTML = `
            <button class="btn btn-outline-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#addCategoryModal">
                <i class="bi bi-tag me-1"></i>
                Add Category
            </button>
            <button class="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#addExpenseModal"
                    onclick="loadCategoriesForExpense()">
                <i class="bi bi-plus-lg me-1"></i>
                Add Expense
            </button>`;

    } else {
        roleLabel.textContent = 'Member Panel';
        topbarRole.textContent = 'Member';
        sidebarNav.innerHTML = `
            <a class="nav-link" href="member-dashboard.html">
                <i class="bi bi-layout-dashboard"></i> My Dashboard
            </a>
            <a class="nav-link" href="payments.html">
                <i class="bi bi-cash-stack"></i> My Payments
            </a>
            <a class="nav-link" href="contributions.html">
                <i class="bi bi-heart-pulse"></i> Contributions
            </a>
            <a class="nav-link active" href="expenses.html">
                <i class="bi bi-receipt"></i> Expenses
            </a>
            <a class="nav-link" href="maintenance.html">
                <i class="bi bi-calendar-check"></i> Maintenance
            </a>
            <a class="nav-link" href="meetings.html">
                <i class="bi bi-calendar-event"></i> Meetings
            </a>
            <a class="nav-link" href="report.html">
                <i class="bi bi-file-earmark-bar-graph"></i> Report
            </a>
            <hr class="mx-3">
            <a class="nav-link text-danger" href="#"
               onclick="logout()">
                <i class="bi bi-box-arrow-left"></i> Logout
            </a>`;

        // No action buttons for member
        document.getElementById('actionBtnsContainer')
            .innerHTML = '';
    }
}

// ─── LOAD ALL EXPENSES ────────────────────────────

async function loadExpenses() {
    const container = document.getElementById(
        'expensesTableContainer');
    showLoading('expensesTableContainer');

    try {
        const expenses = await apiCall(
            '/api/expenses/all', 'GET');
        renderExpensesTable(expenses);
    } catch (error) {
        showError('message', error.message);
        container.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-exclamation-triangle
                          text-danger"></i>
                <p>Failed to load expenses</p>
            </div>`;
    }
}

// ─── FILTER EXPENSES ──────────────────────────────

async function filterExpenses() {
    const month = document.getElementById('filterMonth').value;
    const year = document.getElementById('filterYear').value;

    if (!month || !year) {
        showError('message',
            'Please select both month and year to filter!');
        return;
    }

    showLoading('expensesTableContainer');

    try {
        const expenses = await apiCall(
            '/api/expenses/month/' + month + '/year/' + year,
            'GET'
        );
        renderExpensesTable(expenses);
    } catch (error) {
        showError('message', error.message);
    }
}

// ─── CLEAR FILTER ─────────────────────────────────

function clearFilter() {
    document.getElementById('filterMonth').value = '';
    document.getElementById('filterYear').value = '';
    loadExpenses();
}

// ─── RENDER EXPENSES TABLE ────────────────────────

function renderExpensesTable(expenses) {
    const container = document.getElementById(
        'expensesTableContainer');

    if (expenses.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-receipt text-muted"></i>
                <p>No expenses found</p>
                ${role === 'PRADHANA'
                    ? `<button class="btn btn-primary btn-sm mt-2"
                               data-bs-toggle="modal"
                               data-bs-target="#addExpenseModal"
                               onclick="loadCategoriesForExpense()">
                           Add First Expense
                       </button>`
                    : ''}
            </div>`;
        return;
    }

    // Calculate total
    let total = 0;
    for (let i = 0; i < expenses.length; i++) {
        total += parseFloat(expenses[i].amount);
    }

    let html = `
        <div class="table-responsive">
            <table class="table mb-0">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Added By</th>
                    </tr>
                </thead>
                <tbody>`;

    for (let i = 0; i < expenses.length; i++) {
        const e = expenses[i];
        html += `
            <tr>
                <td>${i + 1}</td>
                <td>
                    <div style="font-weight:500">
                        ${e.categoryName}
                    </div>
                </td>
                <td>
                    <span class="badge ${e.categoryType === 'RECURRING'
                        ? 'bg-info text-dark'
                        : 'bg-secondary'}">
                        ${e.categoryType}
                    </span>
                </td>
                <td>${e.description || '-'}</td>
                <td>
                    <span style="font-weight:500;color:#534AB7">
                        ${formatCurrency(e.amount)}
                    </span>
                </td>
                <td>${formatDate(e.expenseDate)}</td>
                <td>${e.addedByName}</td>
            </tr>`;
    }

    html += `
                </tbody>
                <tfoot>
                    <tr class="table-light">
                        <td colspan="4"
                            class="text-end fw-bold">
                            Total
                        </td>
                        <td class="fw-bold" style="color:#534AB7">
                            ${formatCurrency(total)}
                        </td>
                        <td colspan="2"></td>
                    </tr>
                </tfoot>
            </table>
        </div>`;

    container.innerHTML = html;
}

// ─── LOAD CATEGORIES FOR EXPENSE MODAL ────────────

async function loadCategoriesForExpense() {
    try {
        const categories = await apiCall(
            '/api/expenses/category/all', 'GET');
        const selector = document.getElementById(
            'expenseCategoryId');
        selector.innerHTML = '<option value="">Select category</option>';

        for (let i = 0; i < categories.length; i++) {
            const cat = categories[i];
            selector.innerHTML += `
                <option value="${cat.id}">
                    ${cat.name} (${cat.type})
                </option>`;
        }
    } catch (error) {
        console.log('Error loading categories:', error);
    }
}

// ─── ADD CATEGORY ─────────────────────────────────

async function addCategory() {
    const name = document.getElementById('categoryName')
            .value.trim();
    const type = document.getElementById('categoryType').value;
    const frequency = document.getElementById(
            'categoryFrequency').value;
    const addBtn = document.getElementById('addCategoryBtn');

    // Validation
    if (!name) {
        showError('categoryModalMessage',
            'Category name is required!');
        return;
    }
    if (!type) {
        showError('categoryModalMessage', 'Please select type!');
        return;
    }
    if (!frequency) {
        showError('categoryModalMessage',
            'Please select frequency!');
        return;
    }

    // Show loading
    addBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Adding...';
    addBtn.disabled = true;
    clearMessage('categoryModalMessage');

    try {
        await apiCall('/api/expenses/category/add', 'POST', {
            name: name,
            type: type,
            frequency: frequency
        });

        // Close modal
        const modal = bootstrap.Modal.getInstance(
            document.getElementById('addCategoryModal'));
        modal.hide();

        // Reset form
        document.getElementById('addCategoryForm').reset();

        showSuccess('message',
            'Category "' + name + '" added successfully!');

    } catch (error) {
        showError('categoryModalMessage', error.message);
    } finally {
        addBtn.innerHTML = 'Add Category';
        addBtn.disabled = false;
    }
}

// ─── ADD EXPENSE ──────────────────────────────────

async function addExpense() {
    const categoryId = document.getElementById(
            'expenseCategoryId').value;
    const amount = document.getElementById('expenseAmount').value;
    const description = document.getElementById(
            'expenseDescription').value.trim();
    const expenseDate = document.getElementById('expenseDate').value;
    const receiptUrl = document.getElementById(
            'expenseReceiptUrl').value.trim();
    const addBtn = document.getElementById('addExpenseBtn');

    // Validation
    if (!categoryId) {
        showError('expenseModalMessage',
            'Please select a category!');
        return;
    }
    if (!amount || amount <= 0) {
        showError('expenseModalMessage',
            'Please enter valid amount!');
        return;
    }
    if (!expenseDate) {
        showError('expenseModalMessage',
            'Please select expense date!');
        return;
    }

    // Show loading
    addBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Adding...';
    addBtn.disabled = true;
    clearMessage('expenseModalMessage');

    try {
        await apiCall('/api/expenses/add', 'POST', {
            categoryId: parseInt(categoryId),
            amount: parseFloat(amount),
            description: description || null,
            expenseDate: expenseDate,
            receiptUrl: receiptUrl || null
        });

        // Close modal
        const modal = bootstrap.Modal.getInstance(
            document.getElementById('addExpenseModal'));
        modal.hide();

        // Reset form
        document.getElementById('addExpenseForm').reset();

        showSuccess('message', 'Expense added successfully!');

        // Reload expenses
        loadExpenses();

    } catch (error) {
        showError('expenseModalMessage', error.message);
    } finally {
        addBtn.innerHTML = 'Add Expense';
        addBtn.disabled = false;
    }
}

// ─── START ────────────────────────────────────────

buildSidebar();
loadExpenses();