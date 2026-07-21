// ─── MEMBER DASHBOARD ─────────────────────────────

checkAuth();
checkPasswordChanged();
checkRole('MEMBER');

const now = new Date();
const currentMonth = now.getMonth() + 1;
const currentYear = now.getFullYear();

document.getElementById('currentMonthYear').textContent =
    getMonthName(currentMonth) + ' ' + currentYear;

// ─── LOAD ALL ─────────────────────────────────────

async function loadDashboard() {
    await loadMyPayments();
    await loadCreditBalance();
    await loadMyContributions();
    await loadUpcomingMeetings();
}

// ─── LOAD MY PAYMENTS ─────────────────────────────
async function loadMyPayments() {
    try {
        const payments = await apiCall('/api/payments/my', 'GET');
        const container = document.getElementById('myPaymentsList');

        if (payments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-cash text-muted"></i>
                    <p>No payments yet</p>
                </div>`;
            return;
        }

        // Find current month payment
        let currentPayment = null;
        for (let i = 0; i < payments.length; i++) {
            if (payments[i].month === currentMonth &&
                payments[i].year === currentYear) {
                currentPayment = payments[i];
                break;
            }
        }

        // Show quick action banner based on status
        if (currentPayment) {
            document.getElementById('myPaymentStatus')
                .innerHTML = getStatusBadge(currentPayment.status);
            document.getElementById('myPaymentAmount')
                .textContent = formatCurrency(currentPayment.finalDue)
                + ' due this month';

            // Show quick action banner
            showQuickActionBanner(currentPayment);
        }

        // Build payment history
        let html = '';
        for (let i = 0; i < Math.min(5, payments.length); i++) {
            const payment = payments[i];
            html += `
                <div class="d-flex justify-content-between
                            align-items-center py-2 border-bottom">
                    <div>
                        <div style="font-size:14px">
                            ${getMonthName(payment.month)}
                            ${payment.year}
                        </div>
                        <small class="text-muted">
                            Due: ${formatCurrency(payment.finalDue)}
                        </small>
                    </div>
                    ${getStatusBadge(payment.status)}
                </div>`;
        }

        container.innerHTML = html;

    } catch (error) {
        console.log('Error loading payments:', error);
    }
}

// ─── QUICK ACTION BANNER ──────────────────────────

function showQuickActionBanner(payment) {
    const banner = document.getElementById('quickActionBanner');

    if (payment.status === 'PENDING') {
        // Show Pay Now button
        banner.innerHTML = `
            <div class="alert alert-warning d-flex
                        justify-content-between align-items-center">
                <div>
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    <strong>Payment Pending!</strong>
                    Your maintenance of
                    ${formatCurrency(payment.finalDue)}
                    is due this month.
                </div>
                <a href="payments.html"
                   class="btn btn-warning btn-sm">
                    Pay Now →
                </a>
            </div>`;

    } else if (payment.status === 'UNDER_REVIEW') {
        // Show waiting message
        banner.innerHTML = `
            <div class="alert alert-info d-flex
                        justify-content-between align-items-center">
                <div>
                    <i class="bi bi-hourglass-split me-2"></i>
                    <strong>Payment Under Review!</strong>
                    Pradhana is reviewing your payment screenshot.
                </div>
                ${getStatusBadge(payment.status)}
            </div>`;

    } else if (payment.status === 'PAID') {
        // Show paid message
        banner.innerHTML = `
            <div class="alert alert-success d-flex
                        justify-content-between align-items-center">
                <div>
                    <i class="bi bi-check-circle me-2"></i>
                    <strong>Payment Done!</strong>
                    Your maintenance payment for this month is complete.
                </div>
                ${getStatusBadge(payment.status)}
            </div>`;
    }
}
// ─── LOAD CREDIT BALANCE ──────────────────────────

async function loadCreditBalance() {
    try {
        const credit = await apiCall('/api/credits/my', 'GET');
        document.getElementById('myCreditBalance').textContent =
            formatCurrency(credit.creditBalance);
    } catch (error) {
        console.log('Error loading credit:', error);
    }
}

// ─── LOAD MY CONTRIBUTIONS ────────────────────────

async function loadMyContributions() {
    try {
        const contributions = await apiCall(
            '/api/contributions/my', 'GET'
        );

        const container = document.getElementById(
            'myContributionsList');

        if (contributions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-heart-pulse text-muted"></i>
                    <p>No contributions yet</p>
                    <a href="contributions.html"
                       class="btn btn-sm btn-primary mt-2">
                        Submit First Contribution
                    </a>
                </div>`;
            return;
        }

        let html = '';
        for (let i = 0; i < Math.min(4, contributions.length); i++) {
            const c = contributions[i];
            html += `
                <div class="d-flex justify-content-between
                            align-items-center py-2 border-bottom">
                    <div>
                        <div style="font-size:14px">
                            ${c.description}
                        </div>
                        <small class="text-muted">
                            ${formatDate(c.contributionDate)}
                        </small>
                    </div>
                    <div class="text-end">
                        <div style="font-size:14px">
                            ${formatCurrency(c.amount)}
                        </div>
                        ${getStatusBadge(c.status)}
                    </div>
                </div>`;
        }

        container.innerHTML = html;

    } catch (error) {
        console.log('Error loading contributions:', error);
    }
}


// ─── LOAD UPCOMING MEETINGS ───────────────────────

async function loadUpcomingMeetings() {
    try {
        const meetings = await apiCall(
            '/api/meetings/upcoming', 'GET'
        );

        const container = document.getElementById(
            'upcomingMeetingsList');

        if (meetings.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-calendar-event text-muted"></i>
                    <p>No upcoming meetings</p>
                </div>`;
            return;
        }

        // Set next meeting metric card
        document.getElementById('nextMeetingDate').textContent =
            formatDate(meetings[0].meetingDate) +
            ' at ' + meetings[0].meetingTime;
        document.getElementById('nextMeetingLocation').textContent =
            meetings[0].location;

        let html = '';
        for (let i = 0; i < meetings.length; i++) {
            const meeting = meetings[i];
            html += `
                <div class="d-flex justify-content-between
                            align-items-center py-2 border-bottom">
                    <div>
                        <div style="font-size:14px;font-weight:500">
                            ${meeting.title}
                        </div>
                        <small class="text-muted">
                            ${meeting.agenda || '-'}
                        </small>
                    </div>
                    <div class="text-end">
                        <div style="font-size:13px">
                            ${formatDate(meeting.meetingDate)}
                        </div>
                        <small class="text-muted">
                            ${meeting.meetingTime} |
                            ${meeting.location}
                        </small>
                    </div>
                </div>`;
        }

        container.innerHTML = html;

    } catch (error) {
        console.log('Error loading meetings:', error);
    }
}

// ─── START ────────────────────────────────────────

loadDashboard();