// ─── PAYMENTS MODULE ──────────────────────────────

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
            <a class="nav-link active" href="payments.html">
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
    } else {
        roleLabel.textContent = 'Member Panel';
        topbarRole.textContent = 'Member';
        sidebarNav.innerHTML = `
            <a class="nav-link" href="member-dashboard.html">
                <i class="bi bi-layout-dashboard"></i> My Dashboard
            </a>
            <a class="nav-link active" href="payments.html">
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
            <a class="nav-link" href="report.html">
                <i class="bi bi-file-earmark-bar-graph"></i> Report
            </a>
            <hr class="mx-3">
            <a class="nav-link text-danger" href="#"
               onclick="logout()">
                <i class="bi bi-box-arrow-left"></i> Logout
            </a>`;
    }
}

// ─── BUILD TABS ───────────────────────────────────

function buildTabs() {
    const tabsContainer = document.getElementById('tabsContainer');
    const tabContent = document.getElementById('tabContent');

    if (role === 'PRADHANA') {
        // Pradhana sees 2 tabs
        tabsContainer.innerHTML = `
            <ul class="nav nav-tabs mb-3">
                <li class="nav-item">
                    <a class="nav-link active"
                       id="allPaymentsTab"
                       href="#"
                       onclick="showTab('allPayments')">
                        All Payments
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link"
                       id="myPaymentsTab"
                       href="#"
                       onclick="showTab('myPayments')">
                        My Payment
                    </a>
                </li>
            </ul>`;

        tabContent.innerHTML = `
            <!-- All Payments Tab -->
            <div id="allPaymentsContent">
                <!-- Cycle selector -->
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="row align-items-end">
                            <div class="col-md-4">
                                <label class="form-label">
                                    Select Cycle
                                </label>
                                <select class="form-select"
                                        id="cycleSelector"
                                        onchange="loadPaymentsByCycle()">
                                    <option value="">
                                        Select maintenance cycle
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body p-0">
                        <div id="allPaymentsTable">
                            <div class="empty-state">
                                <i class="bi bi-cash-stack
                                          text-muted"></i>
                                <p>Select a cycle to view payments</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- My Payment Tab -->
            <div id="myPaymentsContent" style="display:none">
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between
                                    align-items-center">
                            <h6 class="mb-0">My Payment History</h6>
                            <button class="btn btn-primary btn-sm"
                                    data-bs-toggle="modal"
                                    data-bs-target="#uploadPaymentModal"
                                    onclick="loadCyclesForUpload()">
                                <i class="bi bi-upload me-1"></i>
                                Upload Payment
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body p-0">
                        <div id="myPaymentsTable">
                            <div class="empty-state">
                                <i class="bi bi-cash text-muted"></i>
                                <p>Loading...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        // Load cycles for selector
        loadCyclesForSelector();
        loadMyPayments();

    } else {
        // Member sees only own payments
        tabsContainer.innerHTML = `
            <div class="d-flex justify-content-between
                        align-items-center mb-3">
                <h6 class="mb-0">My Payment History</h6>
                <button class="btn btn-primary btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#uploadPaymentModal"
                        onclick="loadCyclesForUpload()">
                    <i class="bi bi-upload me-1"></i>
                    Upload Payment
                </button>
            </div>`;

        tabContent.innerHTML = `
            <div class="card">
                <div class="card-body p-0">
                    <div id="myPaymentsTable">
                        <div class="empty-state">
                            <i class="bi bi-cash text-muted"></i>
                            <p>Loading payments...</p>
                        </div>
                    </div>
                </div>
            </div>`;

        loadMyPayments();
    }
}

// ─── SHOW TAB ─────────────────────────────────────

function showTab(tab) {
    const allTab = document.getElementById('allPaymentsTab');
    const myTab = document.getElementById('myPaymentsTab');
    const allContent = document.getElementById('allPaymentsContent');
    const myContent = document.getElementById('myPaymentsContent');

    if (tab === 'allPayments') {
        allTab.classList.add('active');
        myTab.classList.remove('active');
        allContent.style.display = 'block';
        myContent.style.display = 'none';
    } else {
        myTab.classList.add('active');
        allTab.classList.remove('active');
        myContent.style.display = 'block';
        allContent.style.display = 'none';
    }
}

// ─── LOAD CYCLES FOR SELECTOR ─────────────────────

async function loadCyclesForSelector() {
    try {
        const cycles = await apiCall(
            '/api/maintenance/all', 'GET');
        const selector = document.getElementById('cycleSelector');

        for (let i = 0; i < cycles.length; i++) {
            const cycle = cycles[i];
            selector.innerHTML += `
                <option value="${cycle.id}">
                    ${getMonthName(cycle.month)} ${cycle.year}
                    - ₹${cycle.amountPerMember}
                </option>`;
        }
    } catch (error) {
        console.log('Error loading cycles:', error);
    }
}

// ─── LOAD CYCLES FOR UPLOAD MODAL ─────────────────

async function loadCyclesForUpload() {
    try {
        const cycles = await apiCall(
            '/api/maintenance/all', 'GET');
        const selector = document.getElementById('paymentCycleId');
        selector.innerHTML = '<option value="">Select cycle</option>';

        for (let i = 0; i < cycles.length; i++) {
            const cycle = cycles[i];
            selector.innerHTML += `
                <option value="${cycle.id}">
                    ${getMonthName(cycle.month)} ${cycle.year}
                    - ₹${cycle.amountPerMember}
                </option>`;
        }
    } catch (error) {
        console.log('Error loading cycles:', error);
    }
}

// ─── LOAD PAYMENTS BY CYCLE ───────────────────────

async function loadPaymentsByCycle() {
    const cycleId = document.getElementById('cycleSelector').value;
    const container = document.getElementById('allPaymentsTable');

    if (!cycleId) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-cash-stack text-muted"></i>
                <p>Select a cycle to view payments</p>
            </div>`;
        return;
    }

    showLoading('allPaymentsTable');

    try {
        const payments = await apiCall(
            '/api/payments/cycle/' + cycleId, 'GET');

        if (payments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-cash-stack text-muted"></i>
                    <p>No payments found for this cycle</p>
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
                            <th>Status</th>
                            <th>Action</th>
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
                    <td>${getStatusBadge(p.status)}</td>
                    <td>
                        ${p.status === 'UNDER_REVIEW'
                            ? `<button class="btn btn-sm btn-success me-1"
                                       onclick="approvePayment(${p.id})">
                                   Approve
                               </button>
                               <button class="btn btn-sm btn-danger"
                                       onclick="rejectPayment(${p.id})">
                                   Reject
                               </button>`
                            : p.status === 'PAID'
                                ? '<span class="text-success"><i class="bi bi-check-circle"></i> Paid</span>'
                                : '<span class="text-muted">-</span>'}
                    </td>
                </tr>`;
        }

        html += `</tbody></table></div>`;
        container.innerHTML = html;

    } catch (error) {
        showError('message', error.message);
    }
}

// ─── LOAD MY PAYMENTS ─────────────────────────────

async function loadMyPayments() {
    const container = document.getElementById('myPaymentsTable');
    showLoading('myPaymentsTable');

    try {
        const payments = await apiCall('/api/payments/my', 'GET');

        if (payments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-cash text-muted"></i>
                    <p>No payments yet</p>
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
                            <th>Amount Due</th>
                            <th>Credit Used</th>
                            <th>Paid Amount</th>
                            <th>Mode</th>
                            <th>Ref No</th>
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
                    <td>${getMonthName(p.month)}</td>
                    <td>${p.year}</td>
                    <td>${formatCurrency(p.finalDue)}</td>
                    <td>${formatCurrency(p.creditUsed)}</td>
                    <td>${formatCurrency(p.paidAmount)}</td>
                    <td>${p.paymentMode || '-'}</td>
                    <td>${p.transactionRef || '-'}</td>
                    <td>${formatDate(p.paymentDate)}</td>
                    <td>${getStatusBadge(p.status)}</td>
                </tr>`;
        }

        html += `</tbody></table></div>`;
        container.innerHTML = html;

    } catch (error) {
        showError('message', error.message);
    }
}

// ─── UPLOAD PAYMENT ───────────────────────────────

async function uploadPayment() {
    const cycleId = document.getElementById('paymentCycleId').value;
    const paymentMode = document.getElementById('paymentMode').value;
    const transactionRef = document.getElementById(
        'transactionRef').value.trim();
    const screenshotUrl = document.getElementById(
        'screenshotUrl').value.trim();
    const uploadBtn = document.getElementById('uploadPaymentBtn');

    // Validation
    if (!cycleId) {
        showError('modalMessage', 'Please select a cycle!');
        return;
    }
    if (!paymentMode) {
        showError('modalMessage', 'Please select payment mode!');
        return;
    }

    // Show loading
    uploadBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Uploading...';
    uploadBtn.disabled = true;
    clearMessage('modalMessage');

    try {
        await apiCall('/api/payments/upload', 'POST', {
            cycleId: parseInt(cycleId),
            paymentMode: paymentMode,
            transactionRef: transactionRef || null,
            screenshotUrl: screenshotUrl || null
        });

        // Close modal
        const modal = bootstrap.Modal.getInstance(
            document.getElementById('uploadPaymentModal'));
        modal.hide();

        // Reset form
        document.getElementById('uploadPaymentForm').reset();

        showSuccess('message',
            role === 'PRADHANA'
                ? 'Payment uploaded and auto approved!'
                : 'Payment uploaded! Waiting for Pradhana approval.');

        // Reload
        loadMyPayments();

    } catch (error) {
        showError('modalMessage', error.message);
    } finally {
        uploadBtn.innerHTML = 'Upload Payment';
        uploadBtn.disabled = false;
    }
}

// ─── APPROVE PAYMENT ──────────────────────────────

async function approvePayment(paymentId) {
    if (!confirmAction('Approve this payment?')) return;

    try {
        await apiCall(
            '/api/payments/' + paymentId + '/approve', 'PUT');
        showSuccess('message', 'Payment approved successfully!');
        loadPaymentsByCycle();
    } catch (error) {
        showError('message', error.message);
    }
}

// ─── REJECT PAYMENT ───────────────────────────────

async function rejectPayment(paymentId) {
    if (!confirmAction('Reject this payment?')) return;

    try {
        await apiCall(
            '/api/payments/' + paymentId + '/reject', 'PUT');
        showSuccess('message', 'Payment rejected!');
        loadPaymentsByCycle();
    } catch (error) {
        showError('message', error.message);
    }
}

// ─── START ────────────────────────────────────────

buildSidebar();
buildTabs();