// ─── CONTRIBUTIONS MODULE ─────────────────────────

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
            <a class="nav-link active" href="contributions.html">
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

        // Show Pradhana note in modal
        document.getElementById('pradhanaNote').style.display
            = 'block';

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
            <a class="nav-link active" href="contributions.html">
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
                       id="allContributionsTab"
                       href="#"
                       onclick="showTab('all')">
                        All Contributions
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link"
                       id="myContributionsTab"
                       href="#"
                       onclick="showTab('my')">
                        My Contributions
                    </a>
                </li>
            </ul>`;

        tabContent.innerHTML = `
            <!-- All Contributions Tab -->
            <div id="allContributionsContent">

                <!-- Status Filter -->
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="row align-items-end g-3">
                            <div class="col-md-3">
                                <label class="form-label">
                                    Filter by Status
                                </label>
                                <select class="form-select"
                                        id="statusFilter"
                                        onchange="filterByStatus()">
                                    <option value="">
                                        All Status
                                    </option>
                                    <option value="PENDING">
                                        Pending
                                    </option>
                                    <option value="APPROVED">
                                        Approved
                                    </option>
                                    <option value="REJECTED">
                                        Rejected
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-body p-0">
                        <div id="allContributionsTable">
                            <div class="empty-state">
                                <i class="bi bi-heart-pulse
                                          text-muted"></i>
                                <p>Loading contributions...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- My Contributions Tab -->
            <div id="myContributionsContent" style="display:none">
                <div class="card">
                    <div class="card-body p-0">
                        <div id="myContributionsTable">
                            <div class="empty-state">
                                <i class="bi bi-heart-pulse
                                          text-muted"></i>
                                <p>Loading...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        // Load all contributions
        loadAllContributions();
        loadMyContributions();

    } else {
        // Member sees only own contributions
        tabsContainer.innerHTML = '';
        tabContent.innerHTML = `
            <div class="card">
                <div class="card-body p-0">
                    <div id="myContributionsTable">
                        <div class="empty-state">
                            <i class="bi bi-heart-pulse
                                      text-muted"></i>
                            <p>Loading contributions...</p>
                        </div>
                    </div>
                </div>
            </div>`;

        loadMyContributions();
    }
}

// ─── SHOW TAB ─────────────────────────────────────

function showTab(tab) {
    const allTab = document.getElementById('allContributionsTab');
    const myTab = document.getElementById('myContributionsTab');
    const allContent = document.getElementById(
        'allContributionsContent');
    const myContent = document.getElementById(
        'myContributionsContent');

    if (tab === 'all') {
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

// ─── LOAD ALL CONTRIBUTIONS ───────────────────────

async function loadAllContributions() {
    const container = document.getElementById(
        'allContributionsTable');
    showLoading('allContributionsTable');

    try {
        const contributions = await apiCall(
            '/api/contributions/all', 'GET');
        renderContributionsTable(contributions,
            'allContributionsTable', true);
    } catch (error) {
        showError('message', error.message);
    }
}

// ─── FILTER BY STATUS ─────────────────────────────

async function filterByStatus() {
    const status = document.getElementById('statusFilter').value;

    if (!status) {
        loadAllContributions();
        return;
    }

    showLoading('allContributionsTable');

    try {
        const contributions = await apiCall(
            '/api/contributions/status/' + status, 'GET');
        renderContributionsTable(contributions,
            'allContributionsTable', true);
    } catch (error) {
        showError('message', error.message);
    }
}

// ─── LOAD MY CONTRIBUTIONS ────────────────────────

async function loadMyContributions() {
    const containerId = role === 'PRADHANA'
        ? 'myContributionsTable'
        : 'myContributionsTable';

    showLoading(containerId);

    try {
        const contributions = await apiCall(
            '/api/contributions/my', 'GET');
        renderContributionsTable(contributions,
            containerId, false);
    } catch (error) {
        showError('message', error.message);
    }
}

// ─── RENDER CONTRIBUTIONS TABLE ───────────────────

function renderContributionsTable(contributions,
        containerId, showActions) {
    const container = document.getElementById(containerId);

    if (contributions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-heart-pulse text-muted"></i>
                <p>No contributions found</p>
                <button class="btn btn-primary btn-sm mt-2"
                        data-bs-toggle="modal"
                        data-bs-target="#submitContributionModal">
                    Submit First Contribution
                </button>
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
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Approved By</th>
                        ${showActions ? '<th>Action</th>' : ''}
                    </tr>
                </thead>
                <tbody>`;

    for (let i = 0; i < contributions.length; i++) {
        const c = contributions[i];
        html += `
            <tr>
                <td>${i + 1}</td>
                <td>
                    <div style="font-weight:500">
                        ${c.memberName}
                    </div>
                </td>
                <td>
                    <span class="badge bg-secondary">
                        ${c.flatNumber}
                    </span>
                </td>
                <td>${c.description}</td>
                <td>
                    <span style="font-weight:500;color:#534AB7">
                        ${formatCurrency(c.amount)}
                    </span>
                </td>
                <td>${formatDate(c.contributionDate)}</td>
                <td>${getStatusBadge(c.status)}</td>
                <td>${c.approvedByName || '-'}</td>
                ${showActions
                    ? `<td>
                        ${c.status === 'PENDING'
                            ? `<button class="btn btn-sm btn-success me-1"
                                       onclick="approveContribution(${c.id})">
                                   Approve
                               </button>
                               <button class="btn btn-sm btn-danger"
                                       onclick="rejectContribution(${c.id})">
                                   Reject
                               </button>`
                            : '<span class="text-muted">-</span>'}
                       </td>`
                    : ''}
            </tr>`;
    }

    html += `</tbody></table></div>`;
    container.innerHTML = html;
}

// ─── SUBMIT CONTRIBUTION ──────────────────────────

async function submitContribution() {
    const description = document.getElementById(
            'contributionDescription').value.trim();
    const amount = document.getElementById(
            'contributionAmount').value;
    const date = document.getElementById(
            'contributionDate').value;
    const proofUrl = document.getElementById(
            'contributionProofUrl').value.trim();
    const submitBtn = document.getElementById(
            'submitContributionBtn');

    // Validation
    if (!description) {
        showError('modalMessage', 'Description is required!');
        return;
    }
    if (!amount || amount <= 0) {
        showError('modalMessage', 'Please enter valid amount!');
        return;
    }
    if (!date) {
        showError('modalMessage',
            'Please select contribution date!');
        return;
    }

    // Show loading
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Submitting...';
    submitBtn.disabled = true;
    clearMessage('modalMessage');

    try {
        await apiCall('/api/contributions/submit', 'POST', {
            description: description,
            amount: parseFloat(amount),
            contributionDate: date,
            proofUrl: proofUrl || null
        });

        // Close modal
        const modal = bootstrap.Modal.getInstance(
            document.getElementById('submitContributionModal'));
        modal.hide();

        // Reset form
        document.getElementById(
            'submitContributionForm').reset();

        // Different message for Pradhana vs Member
        if (role === 'PRADHANA') {
            showSuccess('message',
                'Contribution submitted and auto approved! ' +
                'Credit added to your balance.');
        } else {
            showSuccess('message',
                'Contribution submitted! ' +
                'Waiting for Pradhana approval.');
        }

        // Reload
        if (role === 'PRADHANA') {
            loadAllContributions();
            loadMyContributions();
        } else {
            loadMyContributions();
        }

    } catch (error) {
        showError('modalMessage', error.message);
    } finally {
        submitBtn.innerHTML = 'Submit';
        submitBtn.disabled = false;
    }
}

// ─── APPROVE CONTRIBUTION ─────────────────────────

async function approveContribution(id) {
    if (!confirmAction(
            'Approve this contribution? Credit will be added to member.'))
        return;

    try {
        await apiCall(
            '/api/contributions/' + id + '/approve', 'PUT');
        showSuccess('message',
            'Contribution approved! Credit added to member.');
        loadAllContributions();
    } catch (error) {
        showError('message', error.message);
    }
}

// ─── REJECT CONTRIBUTION ──────────────────────────

async function rejectContribution(id) {
    if (!confirmAction('Reject this contribution?')) return;

    try {
        await apiCall(
            '/api/contributions/' + id + '/reject', 'PUT');
        showSuccess('message', 'Contribution rejected!');
        loadAllContributions();
    } catch (error) {
        showError('message', error.message);
    }
}

// ─── START ────────────────────────────────────────

buildSidebar();
buildTabs();