// ─── PRADHANA DASHBOARD ───────────────────────────

//checkAuth();
//checkRole('PRADHANA');

const now = new Date();
const currentMonth = now.getMonth() + 1;
const currentYear = now.getFullYear();

document.getElementById('currentMonthYear').textContent =
    getMonthName(currentMonth) + ' ' + currentYear + ' Overview';

// ─── LOAD ALL ─────────────────────────────────────

async function loadDashboard() {
    await loadTotalMembers(),
    await loadMonthlyReport();
    await loadPendingContributions();
    await loadUpcomingMeetings();
    
}

// ─── LOAD TOTAL MEMBERS ───────────────────────────
async function loadTotalMembers(){
    try{
    const members=await apiCall('/api/members/all','GET');

    // Count only active members
    let activeCount=0;
    for(let i=0; i<members.length;i++){
        if(members[i].isActive){
           activeCount++;
        }
    }//for

    document.getElementById('totalMembers').textContent=activeCount;
}//try
catch(error){

    console.error('Error loading members:', error);

    document.getElementById('totalMembers').textContent = 'Error';
}//catch

}//func


// ─── LOAD MONTHLY REPORT ──────────────────────────
async function loadMonthlyReport() {
    try{
        const report = await apiCall(
            '/api/reports/monthly/' + currentMonth +
            '/year/' + currentYear, 'GET'
        );

        // Update metric cards
        document.getElementById('totalCollected').textContent =
            formatCurrency(report.totalCollected);
        document.getElementById('totalPending').textContent =
            formatCurrency(report.totalPending);
        document.getElementById('totalExpenses').textContent =
            formatCurrency(report.totalExpenses);
        document.getElementById('closingBalance').textContent =
            formatCurrency(report.closingBalance);

        // Load payment lists from report
        loadUnderReviewPayments(report.paymentDetails);
        loadPendingPayments(report.paymentDetails);
        loadRecentExpenses(report.expenseDetails);
    }//try

    catch (error){
       document.getElementById('currentMonthYear').textContent =
            'No cycle created for ' +
            getMonthName(currentMonth) + ' ' + currentYear;
    }

}//func


// ─── LOAD UNDER REVIEW PAYMENTS ───────────────────

function loadUnderReviewPayments(){
    const container = document.getElementById('underReviewPaymentsList');

    // Filter under review payments
     const underReview = [];
     for (let i = 0; i < payments.length; i++) {
        if (payments[i].status === 'UNDER_REVIEW') {
            underReview.push(payments[i]);
        }
    }//pushing under review payments only 

    if (underReview.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-check-circle text-success"></i>
                <p>No payments under review!</p>
            </div>`;
        return;
    }

    let html = '';
    for (let i = 0; i < underReview.length; i++) {
        const payment = underReview[i];
        html += `
            <div class="d-flex justify-content-between
                        align-items-center py-2 border-bottom">
                <div>
                    <div style="font-size:14px;font-weight:500">
                        ${payment.memberName}
                    </div>
                    <small class="text-muted">
                        Flat ${payment.flatNumber}
                    </small>
                </div>
                <div class="text-end">
                    <div style="font-size:14px">
                        ${formatCurrency(payment.finalDue)}
                    </div>
                    <div class="mt-1">
                        <button class="btn btn-sm btn-success me-1"
                                onclick="approvePayment(${payment.id})">
                            Approve
                        </button>
                        <button class="btn btn-sm btn-danger"
                                onclick="rejectPayment(${payment.id})">
                            Reject
                        </button>
                    </div>
                </div>
            </div>`;
    }

    container.innerHTML = html;
}//func


// ─── APPROVE PAYMENT ──────────────────────────────

async function approvePayment(paymentId) {
   if (!confirmAction('Approve this payment?')) return;

    try {
        await apiCall('/api/payments/' + paymentId + '/approve',
            'PUT');
        showSuccess('message', 'Payment approved successfully!');
        loadDashboard(); // refresh
    } catch (error) {
        showError('message', error.message);
    }
}


// ─── REJECT PAYMENT ───────────────────────────────

async function rejectPayment(paymentId) {
    if (!confirmAction('Reject this payment?')) return;

    try {
        await apiCall('/api/payments/' + paymentId + '/reject',
            'PUT');
        showSuccess('message', 'Payment rejected!');
        loadDashboard(); // refresh
    } catch (error) {
        showError('message', error.message);
    }
}


// ─── LOAD PENDING PAYMENTS ────────────────────────

function loadPendingPayments(payments){
    const container=document.getElementById('pendingPaymentsList');
     // Filter pending payments

     for(let i=0 ;i<payments.length; i++){
        if (payments[i].status === 'PENDING') {
            pending.push(payments[i]);
        }
     }//for

     if (pending.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-check-circle text-success"></i>
                <p>All payments done!</p>
            </div>`;
        return;
    }//if eveyrone already pays

    let html = '';
    for (let i = 0; i < pending.length; i++) {
        const payment = pending[i];
        html += `
            <div class="d-flex justify-content-between
                        align-items-center py-2 border-bottom">
                <div>
                    <div style="font-size:14px;font-weight:500">
                        ${payment.memberName}
                    </div>
                    <small class="text-muted">
                        Flat ${payment.flatNumber}
                    </small>
                </div>
                <div class="text-end">
                    <div style="font-size:14px">
                        ${formatCurrency(payment.finalDue)}
                    </div>
                    ${getStatusBadge(payment.status)}
                </div>
            </div>`;
    }

    container.innerHTML = html;
}


// ─── LOAD RECENT EXPENSES ─────────────────────────
function loadRecentExpenses(expenses) {//loads just 4 expenses or less
    const container = document.getElementById('recentExpensesList');

    if (!expenses || expenses.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-receipt text-muted"></i>
                <p>No expenses this month</p>
            </div>`;
        return;
    }

    let html = '';
    for (let i = 0; i < Math.min(4, expenses.length); i++) {
        const expense = expenses[i];
        html += `
            <div class="d-flex justify-content-between
                        align-items-center py-2 border-bottom">
                <div>
                    <div style="font-size:14px">
                        ${expense.categoryName}
                    </div>
                    <small class="text-muted">
                        ${expense.description || '-'}
                    </small>
                </div>
                <div style="font-size:14px;font-weight:500">
                    ${formatCurrency(expense.amount)}
                </div>
            </div>`;
    }

    container.innerHTML = html;
}

// ─── LOAD PENDING CONTRIBUTIONS ───────────────────
async function loadPendingContributions() {
    try {
        const contributions = await apiCall(
            '/api/contributions/status/PENDING', 'GET'
        );

        const container = document.getElementById(
            'pendingContributionsList');

        if (contributions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-heart-pulse text-muted"></i>
                    <p>No pending contributions</p>
                </div>`;
            return;
        }

        let html = '';
        for (let i = 0; i < contributions.length; i++) {
            const c = contributions[i];
            html += `
                <div class="d-flex justify-content-between
                            align-items-center py-2 border-bottom">
                    <div>
                        <div style="font-size:14px;font-weight:500">
                            ${c.memberName}
                        </div>
                        <small class="text-muted">
                            ${c.description}
                        </small>
                    </div>
                    <div class="text-end">
                        <div style="font-size:14px">
                            ${formatCurrency(c.amount)}
                        </div>
                        <div class="mt-1">
                            <button class="btn btn-sm btn-success me-1"
                                    onclick="approveContribution(${c.id})">
                                Approve
                            </button>
                            <button class="btn btn-sm btn-danger"
                                    onclick="rejectContribution(${c.id})">
                                Reject
                            </button>
                        </div>
                    </div>
                </div>`;
        }

        container.innerHTML = html;

    } catch (error) {
        console.log('Error loading contributions:', error);
    }
}

// ─── APPROVE CONTRIBUTION ─────────────────────────

async function approveContribution(id) {
    if (!confirmAction('Approve this contribution?')) return;

    try {
        await apiCall('/api/contributions/' + id + '/approve',
            'PUT');
        showSuccess('message', 'Contribution approved! Credit added to member.');
        loadDashboard();
    } catch (error) {
        showError('message', error.message);
    }
}

// ─── REJECT CONTRIBUTION ──────────────────────────

async function rejectContribution(id) {
    if (!confirmAction('Reject this contribution?')) return;

    try {
        await apiCall('/api/contributions/' + id + '/reject',
            'PUT');
        showSuccess('message', 'Contribution rejected!');
        loadDashboard();
    } catch (error) {
        showError('message', error.message);
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