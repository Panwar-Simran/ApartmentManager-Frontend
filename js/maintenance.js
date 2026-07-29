// ─── MAINTENANCE MODULE ───────────────────────────

//checkAuth();
//checkPasswordChanged();

const role = getRole();

// ─── BUILD SIDEBAR BASED ON ROLE ─────────────────

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
            <a class="nav-link active" href="maintenance.html">
                <i class="bi bi-calendar-check"></i> Maintenance
            </a>
            <a class="nav-link" href="payments.html">
                <i class="bi bi-cash-stack"></i> Payments
            </a>
            <a class="nav-link" href="expenses.html">
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

        // Show create button for Pradhana
        document.getElementById('createBtnContainer').innerHTML = `
            <button class="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#createCycleModal">
                <i class="bi bi-plus-lg me-1"></i> Create Cycle
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
            <a class="nav-link" href="expenses.html">
                <i class="bi bi-receipt"></i> Expenses
            </a>
            <a class="nav-link active" href="maintenance.html">
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

        // No create button for member
        document.getElementById('createBtnContainer').innerHTML = '';
    }
}

// ─── LOAD ALL CYCLES ──────────────────────────────

async function loadCycles() {
    const container = document.getElementById('cyclesTableContainer');
    showLoading('cyclesTableContainer');

    try {
        const cycles = await apiCall(
            '/api/maintenance/all', 'GET');

        if (cycles.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-calendar-check text-muted"></i>
                    <p>No maintenance cycles created yet</p>
                    ${role === 'PRADHANA'
                        ? `<button class="btn btn-primary btn-sm mt-2"
                                   data-bs-toggle="modal"
                                   data-bs-target="#createCycleModal">
                               Create First Cycle
                           </button>`
                        : ''}
                </div>`;
            return;
        }

        let html = `
            <div class="table-responsive">
                <table class="table mb-0">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Month</th>
                            <th>Year</th>
                            <th>Amount Per Member</th>
                            <th>Due Date</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>`;

        for (let i = 0; i < cycles.length; i++) {
            const cycle = cycles[i];
            html += `
                <tr>
                    <td>${i + 1}</td>
                    <td>
                        <span class="fw-500">
                            ${getMonthName(cycle.month)}
                        </span>
                    </td>
                    <td>${cycle.year}</td>
                    <td>
                        <span class="fw-500 text-primary">
                            ${formatCurrency(cycle.amountPerMember)}
                        </span>
                    </td>
                    <td>${formatDate(cycle.dueDate)}</td>
                    <td class="text-muted">
                        ${formatDate(cycle.createdAt)}
                    </td>
                </tr>`;
        }

        html += `</tbody></table></div>`;
        container.innerHTML = html;

    } catch (error) {
        showError('message', error.message);
        container.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-exclamation-triangle
                          text-danger"></i>
                <p>Failed to load cycles</p>
            </div>`;
    }
}

// ─── CREATE CYCLE ─────────────────────────────────

async function createCycle() {
    const month = document.getElementById('cycleMonth').value;
    const year = document.getElementById('cycleYear').value;
    const amount = document.getElementById('cycleAmount').value;
    const dueDate = document.getElementById('cycleDueDate').value;
    const createBtn = document.getElementById('createCycleBtn');

    // Validation
    if (!month) {
        showError('modalMessage', 'Please select a month!');
        return;
    }
    if (!year) {
        showError('modalMessage', 'Please enter year!');
        return;
    }
    if (!amount || amount <= 0) {
        showError('modalMessage', 'Please enter valid amount!');
        return;
    }
    if (!dueDate) {
        showError('modalMessage', 'Please select due date!');
        return;
    }

    // Show loading
    createBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Creating...';
    createBtn.disabled = true;
    clearMessage('modalMessage');

    try {
        await apiCall('/api/maintenance/create', 'POST', {
            month: parseInt(month),
            year: parseInt(year),
            amountPerMember: parseFloat(amount),
            dueDate: dueDate
        });

        // Close modal
        const modal = bootstrap.Modal.getInstance(
            document.getElementById('createCycleModal'));
        modal.hide();

        // Reset form
        document.getElementById('createCycleForm').reset();

        // Show success
        showSuccess('message',
            'Maintenance cycle created! Payment records generated for all members.');

        // Reload cycles
        loadCycles();

    } catch (error) {
        showError('modalMessage', error.message);
    } finally {
        createBtn.innerHTML = 'Create Cycle';
        createBtn.disabled = false;
    }
}

// ─── START ────────────────────────────────────────

buildSidebar();
loadCycles();