// ─── REPORT MODULE ────────────────────────────────

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
            <a class="nav-link" href="expenses.html">
                <i class="bi bi-receipt"></i> Expenses
            </a>
            <a class="nav-link" href="contributions.html">
                <i class="bi bi-heart-pulse"></i> Contributions
            </a>
            <a class="nav-link" href="meetings.html">
                <i class="bi bi-calendar-event"></i> Meetings
            </a>
            <a class="nav-link active" href="report.html">
                <i class="bi bi-file-earmark-bar-graph"></i> Reports
            </a>
            <hr class="mx-3">
            <a class="nav-link text-danger" href="#"
               onclick="logout()">
                <i class="bi bi-box-arrow-left"></i> Logout
            </a>`;

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
            <a class="nav-link" href="maintenance.html">
                <i class="bi bi-calendar-check"></i> Maintenance
            </a>
            <a class="nav-link" href="meetings.html">
                <i class="bi bi-calendar-event"></i> Meetings
            </a>
            <a class="nav-link active" href="report.html">
                <i class="bi bi-file-earmark-bar-graph"></i> Report
            </a>
            <hr class="mx-3">
            <a class="nav-link text-danger" href="#"
               onclick="logout()">
                <i class="bi bi-box-arrow-left"></i> Logout
            </a>`;
    }
}

// ─── LOAD REPORT ──────────────────────────────────

async function loadReport() {
    const month = document.getElementById('reportMonth').value;
    const year = document.getElementById('reportYear').value;

    // Validation
    if (!month) {
        showError('message', 'Please select a month!');
        return;
    }
    if (!year) {
        showError('message', 'Please enter a year!');
        return;
    }

    clearMessage('message');

    try {
        let report;

        // Call different API based on role
        if (role === 'PRADHANA') {
            // Full report for Pradhana
            report = await apiCall(
                '/api/reports/monthly/' + month +
                '/year/' + year, 'GET'
            );
        } else {
            // Own report for Member
            report = await apiCall(
                '/api/reports/my/' + month +
                '/year/' + year, 'GET'
            );
        }

        // Show report content
        document.getElementById('reportContent')
            .style.display = 'block';

        // Update subtitle
        document.getElementById('reportSubtitle').textContent =
            getMonthName(parseInt(month)) + ' ' + year + ' Report';

        // Render summary cards
        renderSummaryCards(report);

        // Render payment details
        renderPaymentDetails(report.paymentDetails);

        // Render expense details
        renderExpenseDetails(report.expenseDetails);

    } catch (error) {
        showError('message', error.message);
        document.getElementById('reportContent')
            .style.display = 'none';
    }
}

// ─── RENDER SUMMARY CARDS ─────────────────────────

function renderSummaryCards(report) {
    const container = document.getElementById('summaryCards');

    if (role === 'PRADHANA') {
        // Pradhana sees full summary
        container.innerHTML = `
            <div class="col-md-2">
                <div class="metric-card">
                    <div class="metric-label">
                        Total Expected
                    </div>
                    <div class="metric-value">
                        ${formatCurrency(report.totalExpected)}
                    </div>
                    <div class="metric-sub">
                        All members × amount
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="metric-card">
                    <div class="metric-label">
                        Total Collected
                    </div>
                    <div class="metric-value text-success">
                        ${formatCurrency(report.totalCollected)}
                    </div>
                    <div class="metric-sub">Paid members</div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="metric-card">
                    <div class="metric-label">Total Pending</div>
                    <div class="metric-value text-warning">
                        ${formatCurrency(report.totalPending)}
                    </div>
                    <div class="metric-sub">Yet to collect</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="metric-card">
                    <div class="metric-label">Total Expenses</div>
                    <div class="metric-value">
                        ${formatCurrency(report.totalExpenses)}
                    </div>
                    <div class="metric-sub">This month</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="metric-card">
                    <div class="metric-label">
                        Closing Balance
                    </div>
                    <div class="metric-value ${
                        parseFloat(report.closingBalance) >= 0
                            ? 'text-success' : 'text-danger'}">
                        ${formatCurrency(report.closingBalance)}
                    </div>
                    <div class="metric-sub">
                        Collected - Expenses
                    </div>
                </div>
            </div>`;

    } else {
        // Member sees own summary only
        container.innerHTML = `
            <div class="col-md-4">
                <div class="metric-card">
                    <div class="metric-label">
                        My Payment Status
                    </div>
                    <div class="metric-value">
                        ${report.paymentDetails.length > 0
                            ? getStatusBadge(
                                report.paymentDetails[0].status)
                            : '-'}
                    </div>
                    <div class="metric-sub">This month</div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="metric-card">
                    <div class="metric-label">My Amount Due</div>
                    <div class="metric-value text-primary">
                        ${formatCurrency(report.totalExpected)}
                    </div>
                    <div class="metric-sub">Monthly maintenance</div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="metric-card">
                    <div class="metric-label">Total Expenses</div>
                    <div class="metric-value">
                        ${formatCurrency(report.totalExpenses)}
                    </div>
                    <div class="metric-sub">
                        Apartment expenses
                    </div>
                </div>
            </div>`;
    }
}

// ─── RENDER PAYMENT DETAILS ───────────────────────

function renderPaymentDetails(payments) {
    const container = document.getElementById(
        'paymentDetailsTable');
    const title = document.getElementById('paymentSectionTitle');

    // Update section title based on role
    if (role === 'PRADHANA') {
        title.textContent = 'All Members Payment Details';
    } else {
        title.textContent = 'My Payment Detail';
    }

    if (!payments || payments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-cash text-muted"></i>
                <p>No payment records found</p>
            </div>`;
        return;
    }

    let html = `
        <div class="table-responsive">
            <table class="table mb-0">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Member</th>
                        <th>Flat</th>
                        <th>Amount Due</th>
                        <th>Credit Used</th>
                        <th>Paid Amount</th>
                        <th>Mode</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>`;

    for (let i = 0; i < payments.length; i++) {
        const p = payments[i];
        html += `
            <tr>
                <td>${i + 1}</td>
                <td>
                    <div style="font-weight:500">
                        ${p.memberName}
                    </div>
                </td>
                <td>
                    <span class="badge bg-secondary">
                        ${p.flatNumber}
                    </span>
                </td>
                <td>${formatCurrency(p.finalDue)}</td>
                <td>${formatCurrency(p.creditUsed)}</td>
                <td>${formatCurrency(p.paidAmount)}</td>
                <td>${p.paymentMode || '-'}</td>
                <td>${formatDate(p.paymentDate)}</td>
                <td>${getStatusBadge(p.status)}</td>
            </tr>`;
    }

    html += `</tbody></table></div>`;
    container.innerHTML = html;
}

// ─── RENDER EXPENSE DETAILS ───────────────────────

function renderExpenseDetails(expenses) {
    const container = document.getElementById(
        'expenseDetailsTable');

    if (!expenses || expenses.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-receipt text-muted"></i>
                <p>No expenses this month</p>
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
                    <span class="badge ${
                        e.categoryType === 'RECURRING'
                            ? 'bg-info text-dark'
                            : 'bg-secondary'}">
                        ${e.categoryType}
                    </span>
                </td>
                <td>${e.description || '-'}</td>
                <td>
                    <span style="font-weight:500;
                                 color:#534AB7">
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
                            Total Expenses
                        </td>
                        <td class="fw-bold"
                            style="color:#534AB7">
                            ${formatCurrency(total)}
                        </td>
                        <td colspan="2"></td>
                    </tr>
                </tfoot>
            </table>
        </div>`;

    container.innerHTML = html;
}

// ─── AUTO LOAD CURRENT MONTH ──────────────────────

function autoLoadCurrentMonth() {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    document.getElementById('reportMonth').value =
        currentMonth;
    document.getElementById('reportYear').value =
        currentYear;

    // Auto load current month report
    loadReport();
}

// ─── START ────────────────────────────────────────

buildSidebar();
autoLoadCurrentMonth();