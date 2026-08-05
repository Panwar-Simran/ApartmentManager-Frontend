// ─── MEETINGS MODULE ──────────────────────────────

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
            <a class="nav-link active" href="meetings.html">
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
                    data-bs-target="#createMeetingModal">
                <i class="bi bi-plus-lg me-1"></i>
                Create Meeting
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
            <a class="nav-link" href="maintenance.html">
                <i class="bi bi-calendar-check"></i> Maintenance
            </a>
            <a class="nav-link active" href="meetings.html">
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
        document.getElementById('createBtnContainer')
            .innerHTML = '';
    }
}

// ─── SHOW TAB ─────────────────────────────────────

function showTab(tab) {
    const upcomingTab = document.getElementById('upcomingTab');
    const allTab = document.getElementById('allTab');
    const upcomingContent = document.getElementById(
        'upcomingContent');
    const allContent = document.getElementById('allContent');

    if (tab === 'upcoming') {
        upcomingTab.classList.add('active');
        allTab.classList.remove('active');
        upcomingContent.style.display = 'block';
        allContent.style.display = 'none';
    } else {
        allTab.classList.add('active');
        upcomingTab.classList.remove('active');
        allContent.style.display = 'block';
        upcomingContent.style.display = 'none';
        loadAllMeetings();
    }
}

// ─── LOAD UPCOMING MEETINGS ───────────────────────

async function loadUpcomingMeetings() {
    const container = document.getElementById(
        'upcomingMeetingsTable');
    showLoading('upcomingMeetingsTable');

    try {
        const meetings = await apiCall(
            '/api/meetings/upcoming', 'GET');
        renderMeetingsTable(meetings,
            'upcomingMeetingsTable');
    } catch (error) {
        showError('message', error.message);
        container.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-exclamation-triangle
                          text-danger"></i>
                <p>Failed to load meetings</p>
            </div>`;
    }
}

// ─── LOAD ALL MEETINGS ────────────────────────────

async function loadAllMeetings() {
    const container = document.getElementById(
        'allMeetingsTable');
    showLoading('allMeetingsTable');

    try {
        const meetings = await apiCall(
            '/api/meetings/all', 'GET');
        renderMeetingsTable(meetings,
            'allMeetingsTable');
    } catch (error) {
        showError('message', error.message);
        container.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-exclamation-triangle
                          text-danger"></i>
                <p>Failed to load meetings</p>
            </div>`;
    }
}

// ─── RENDER MEETINGS TABLE ────────────────────────

function renderMeetingsTable(meetings, containerId) {
    const container = document.getElementById(containerId);

    if (meetings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-calendar-event text-muted"></i>
                <p>No meetings found</p>
                ${role === 'PRADHANA'
                    ? `<button class="btn btn-primary btn-sm mt-2"
                               data-bs-toggle="modal"
                               data-bs-target="#createMeetingModal">
                           Schedule First Meeting
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
                        <th>Title</th>
                        <th>Agenda</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Location</th>
                        <th>Created By</th>
                        ${role === 'PRADHANA'
                            ? '<th>Action</th>' : ''}
                    </tr>
                </thead>
                <tbody>`;

    for (let i = 0; i < meetings.length; i++) {
        const m = meetings[i];

        // Check if meeting is upcoming or past
        const meetingDate = new Date(m.meetingDate);
        const today = new Date();
        const isUpcoming = meetingDate >= today;

        html += `
            <tr>
                <td>${i + 1}</td>
                <td>
                    <div style="font-weight:500">
                        ${m.title}
                    </div>
                </td>
                <td>
                    <small class="text-muted">
                        ${m.agenda || '-'}
                    </small>
                </td>
                <td>
                    <span class="${isUpcoming
                        ? 'text-primary fw-500'
                        : 'text-muted'}">
                        ${formatDate(m.meetingDate)}
                    </span>
                </td>
                <td>${m.meetingTime}</td>
                <td>
                    <i class="bi bi-geo-alt text-muted me-1"></i>
                    ${m.location}
                </td>
                <td>${m.createdByName}</td>
                ${role === 'PRADHANA'
                    ? `<td>
                        <button class="btn btn-sm btn-outline-danger"
                                onclick="deleteMeeting(${m.id},
                                '${m.title}')">
                            <i class="bi bi-trash"></i>
                            Delete
                        </button>
                       </td>`
                    : ''}
            </tr>`;
    }

    html += `</tbody></table></div>`;
    container.innerHTML = html;
}

// ─── CREATE MEETING ───────────────────────────────

async function createMeeting() {
    const title = document.getElementById(
            'meetingTitle').value.trim();
    const agenda = document.getElementById(
            'meetingAgenda').value.trim();
    const date = document.getElementById('meetingDate').value;
    const time = document.getElementById('meetingTime').value;
    const location = document.getElementById(
            'meetingLocation').value.trim();
    const createBtn = document.getElementById('createMeetingBtn');

    // Validation
    if (!title) {
        showError('modalMessage',
            'Meeting title is required!');
        return;
    }
    if (!date) {
        showError('modalMessage',
            'Please select meeting date!');
        return;
    }
    if (!time) {
        showError('modalMessage',
            'Please select meeting time!');
        return;
    }
    if (!location) {
        showError('modalMessage',
            'Meeting location is required!');
        return;
    }

    // Show loading
    createBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Creating...';
    createBtn.disabled = true;
    clearMessage('modalMessage');

    try {
        await apiCall('/api/meetings/create', 'POST', {
            title: title,
            agenda: agenda || null,
            meetingDate: date,
            meetingTime: time,
            location: location
        });

        // Close modal
        const modal = bootstrap.Modal.getInstance(
            document.getElementById('createMeetingModal'));
        modal.hide();

        // Reset form
        document.getElementById('createMeetingForm').reset();

        showSuccess('message',
            'Meeting "' + title + '" scheduled successfully!');

        // Reload meetings
        loadUpcomingMeetings();

    } catch (error) {
        showError('modalMessage', error.message);
    } finally {
        createBtn.innerHTML = 'Create Meeting';
        createBtn.disabled = false;
    }
}

// ─── DELETE MEETING ───────────────────────────────

async function deleteMeeting(id, title) {
    if (!confirmAction(
            'Delete meeting "' + title + '"? This cannot be undone!'))
        return;

    try {
        await apiCall(
            '/api/meetings/' + id + '/delete', 'DELETE');
        showSuccess('message',
            'Meeting "' + title + '" deleted successfully!');

        // Reload both tabs
        loadUpcomingMeetings();
        loadAllMeetings();

    } catch (error) {
        showError('message', error.message);
    }
}

// ─── START ────────────────────────────────────────

buildSidebar();
loadUpcomingMeetings();