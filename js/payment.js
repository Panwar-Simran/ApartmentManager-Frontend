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

        loadCyclesForSelector();
        loadMyPayments();

    } else {
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
// UPDATED - now includes payment summary on cycle select

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

        // Clear summary when modal opens
        document.getElementById('paymentSummary').innerHTML = '';

        // Load payment summary when cycle is selected
        selector.onchange = loadPaymentSummary;

    } catch (error) {
        console.log('Error loading cycles:', error);
    }
}

// ─── LOAD PAYMENT SUMMARY ─────────────────────────
// Shows due amount, credit balance and final payable
// Helps member understand exactly how much to pay

async function loadPaymentSummary() {
    const cycleId = document.getElementById('paymentCycleId').value;
    const summaryDiv = document.getElementById('paymentSummary');

    if (!cycleId) {
        summaryDiv.innerHTML = '';
        return;
    }

    try {
        // Get my payments to find this cycle record
        const payments = await apiCall('/api/payments/my', 'GET');

        // Find payment for selected cycle
        let myPayment = null;
        for (let i = 0; i < payments.length; i++) {
            if (payments[i].cycleId == cycleId) {
                myPayment = payments[i];
                break;
            }
        }

        // Get credit balance
        const credit = await apiCall('/api/credits/my', 'GET');
        const creditBalance = parseFloat(credit.creditBalance);

        if (myPayment) {

            // If already paid
            if (myPayment.status === 'PAID') {
                summaryDiv.innerHTML = `
                    <div class="alert alert-success mt-3 mb-0">
                        <i class="bi bi-check-circle me-2"></i>
                        <strong>Already Paid!</strong>
                        Payment of
                        ${formatCurrency(myPayment.paidAmount)}
                        completed for this cycle.
                    </div>`;
                return;
            }

            // If under review
            if (myPayment.status === 'UNDER_REVIEW') {
                summaryDiv.innerHTML = `
                    <div class="alert alert-warning mt-3 mb-0">
                        <i class="bi bi-hourglass-split me-2"></i>
                        <strong>Payment Under Review!</strong>
                        Pradhana is reviewing your payment.
                        Please wait for approval.
                    </div>`;
                return;
            }

            // If pending - show breakdown
            const finalDue = parseFloat(myPayment.finalDue);
            const creditToUse = Math.min(creditBalance, finalDue);
            const actualPayable = Math.max(
                0, finalDue - creditToUse);

            summaryDiv.innerHTML = `
                <div class="alert alert-info mt-3 mb-0">
                    <div class="fw-500 mb-2">
                        Payment Breakdown
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Monthly Due:</span>
                        <strong>
                            ${formatCurrency(finalDue)}
                        </strong>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Credit Balance:</span>
                        <strong class="text-success">
                            - ${formatCurrency(creditBalance)}
                        </strong>
                    </div>
                    <hr class="my-2">
                    <div class="d-flex justify-content-between">
                        <span><strong>You Pay:</strong></span>
                        <strong class="text-primary"
                                style="font-size:18px">
                            ${formatCurrency(actualPayable)}
                        </strong>
                    </div>
                    ${actualPayable === 0
                        ? `<div class="mt-2 text-success small">
                               <i class="bi bi-check-circle me-1"></i>
                               Your credit covers full payment!
                               No cash needed.
                           </div>`
                        : creditToUse > 0
                            ? `<div class="mt-2 text-muted small">
                                   <i class="bi bi-info-circle me-1"></i>
                                   ${formatCurrency(creditToUse)}
                                   credit will be auto deducted.
                               </div>`
                            : `<div class="mt-2 text-muted small">
                                   <i class="bi bi-info-circle me-1"></i>
                                   No credit available.
                                   Pay full amount.
                               </div>`}
                </div>`;
        }

    } catch (error) {
        console.log('Error loading payment summary:', error);
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
                                ? `<span class="text-success">
                                       <i class="bi bi-check-circle"></i>
                                       Paid
                                   </span>`
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

        // Reset form and summary
        document.getElementById('uploadPaymentForm').reset();
        document.getElementById('paymentSummary').innerHTML = '';

        showSuccess('message',
            role === 'PRADHANA'
                ? 'Payment uploaded and auto approved!'
                : 'Payment uploaded! Waiting for Pradhana approval.');

        // Reload payments
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