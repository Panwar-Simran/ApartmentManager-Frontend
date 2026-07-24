// ─── MEMBERS MODULE ───────────────────────────────

// Check auth and role
checkAuth();
checkPasswordChanged();
checkRole('PRADHANA');

// ─── LOAD ALL MEMBERS ─────────────────────────────

async function loadMembers() {
    const container = document.getElementById(
        'membersTableContainer');

    showLoading('membersTableContainer');

    try {
        const members = await apiCall('/api/members/all', 'GET');

        if (members.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-people text-muted"></i>
                    <p>No members added yet</p>
                    <button class="btn btn-primary btn-sm mt-2"
                            data-bs-toggle="modal"
                            data-bs-target="#addMemberModal">
                        Add First Member
                    </button>
                </div>`;
            return;
        }

        // Build table
        let html = `
            <div class="table-responsive">
                <table class="table mb-0">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Flat</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Password</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>`;

        for (let i = 0; i < members.length; i++) {
            const member = members[i];
            html += `
                <tr>
                    <td>${i + 1}</td>
                    <td>
                        <div style="font-weight:500">
                            ${member.name}
                        </div>
                    </td>
                    <td>${member.email}</td>
                    <td>${member.phone}</td>
                    <td>
                        <span class="badge bg-secondary">
                            ${member.flatNumber}
                        </span>
                    </td>
                    <td>
                        <span class="badge ${member.role === 'PRADHANA'
                            ? 'bg-primary' : 'bg-info text-dark'}">
                            ${member.role}
                        </span>
                    </td>
                    <td>
                        ${member.isActive
                            ? '<span class="badge bg-success">Active</span>'
                            : '<span class="badge bg-danger">Inactive</span>'}
                    </td>
                    <td>
                        ${member.isPasswordChanged
                            ? '<span class="badge bg-success">Changed</span>'
                            : '<span class="badge bg-warning text-dark">Pending</span>'}
                    </td>
                    <td>
                        ${member.isActive && member.role !== 'PRADHANA'
                            ? `<button class="btn btn-sm btn-outline-danger"
                                       onclick="deactivateMember(${member.id}, '${member.name}')">
                                   <i class="bi bi-person-x"></i> Deactivate
                               </button>`
                            : member.role === 'PRADHANA'
                                ? '<small class="text-muted">Pradhana</small>'
                                : '<span class="badge bg-danger">Inactive</span>'}
                    </td>
                </tr>`;
        }

        html += `</tbody></table></div>`;
        container.innerHTML = html;

    } catch (error) {
        showError('message', error.message);
        container.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-exclamation-triangle text-danger"></i>
                <p>Failed to load members</p>
            </div>`;
    }
}

// ─── ADD MEMBER ───────────────────────────────────

async function addMember() {
    const name = document.getElementById('memberName').value.trim();
    const email = document.getElementById('memberEmail').value.trim();
    const phone = document.getElementById('memberPhone').value.trim();
    const flatNumber = document.getElementById('memberFlatNumber')
            .value.trim();
    const addBtn = document.getElementById('addMemberBtn');

    // Client side validation
    if (!name || !email || !phone || !flatNumber) {
        showError('modalMessage', 'All fields are required!');
        return;
    }

    if (phone.length !== 10) {
        showError('modalMessage', 'Phone must be 10 digits!');
        return;
    }

    // Show loading
    addBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Adding...';
    addBtn.disabled = true;
    clearMessage('modalMessage');

    try {
        await apiCall('/api/members/add', 'POST', {
            name: name,
            email: email,
            phone: phone,
            flatNumber: flatNumber
        });

        // Close modal
        const modal = bootstrap.Modal.getInstance(
            document.getElementById('addMemberModal'));
        modal.hide();

        // Reset form
        document.getElementById('addMemberForm').reset();

        // Show success
        showSuccess('message',
            'Member added successfully! Welcome email sent to '
            + email);

        // Reload members list
        loadMembers();

    } catch (error) {
        showError('modalMessage', error.message);
    } finally {
        addBtn.innerHTML = 'Add Member';
        addBtn.disabled = false;
    }
}

// ─── DEACTIVATE MEMBER ────────────────────────────

async function deactivateMember(id, name) {
    if (!confirmAction(
            'Are you sure you want to deactivate ' + name + '?')) {
        return;
    }

    try {
        await apiCall('/api/members/' + id + '/deactivate', 'PUT');

        showSuccess('message',
            name + ' has been deactivated successfully!');

        // Reload members list
        loadMembers();

    } catch (error) {
        showError('message', error.message);
    }
}

// ─── START ────────────────────────────────────────

loadMembers();