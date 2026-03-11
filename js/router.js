async function navigate(page) {
    const view = document.getElementById('content-view');
    const title = document.getElementById('page-title');
    
    // UI Update
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('bg-indigo-600'));
    document.getElementById(`nav-${page}`).classList.add('bg-indigo-600');
    title.innerText = page.toUpperCase();

    if (page === 'dashboard') {
        view.innerHTML = '<p class="p-10 animate-pulse text-slate-400">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>';
        const data = await API.getDashboard();
        view.innerHTML = Components.dashboard(data);
    } else if (page === 'inbound') {
        view.innerHTML = Components.inboundForm();

    } else if (page === 'outbound') {
        view.innerHTML = Components.outboundForm('outbound');
    } else if (page === 'settings') {
        view.innerHTML = Components.settings();
    }
}
// --- ລະບົບ Login ---
async function authLogin(event) {
    event.preventDefault();
    
    // ສະແດງ Loading
    Swal.fire({
        title: 'ກຳລັງກວດສອບສິດ...',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        const formData = new FormData(event.target);
        const payload = Object.fromEntries(formData);
        payload.action = 'login'; // ບອກ Backend ວ່າຈະ Login

        // ເອີ້ນໃຊ້ postData ທີ່ມີຢູ່ແລ້ວໃນ api.js
        const res = await API.postData(payload);

        if (res.status === 'success') {
            // ເກັບຂໍ້ມູນລົງ SessionStorage
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('userData', JSON.stringify(res.user));

            await Swal.fire({
                icon: 'success',
                title: 'ສຳເລັດ!',
                text: 'ຍິນດີຕ້ອນຮັບ: ' + res.user.name,
                timer: 1500,
                showConfirmButton: false
            });

            // ໄປໜ້າ Dashboard
            window.location.href = 'index.html';
        } else {
            throw new Error(res.message);
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'ເຂົ້າລະບົບບໍ່ໄດ້',
            text: error.message
        });
    }
}

// --- ຟັງຊັນກວດເຊັກສິດ (Security Guard) ---

function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn) {
        if (!window.location.href.includes('login.html')) {
            window.location.href = 'login.html';
        }
    } else {
        // ຖ້າ Login ແລ້ວ ໃຫ້ເອົາຂໍ້ມູນໄປໂຊໃນ Header ທັນທີ
        renderUserProfile();
    }
}
// --- ຟັງຊັນ Logout ---
function handleLogout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}

// ລັນທຸກຄັ້ງທີ່ໂຫຼດໜ້າເວັບ
checkAuth();
// ຟັງຊັນບັນທຶກ
// --- ຟັງຊັນ ບັນທຶກ ແລະ ແກ້ໄຂ (Create & Update) ---
async function handleFormSubmit(event, type, isEdit) {
    event.preventDefault();

    // ສະແດງ Loading ຕອນເລີ່ມ
    Swal.fire({
        title: isEdit ? 'ກຳລັງອັບເດດ...' : 'ກຳລັງບັນທຶກ...',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        const formData = new FormData(event.target);
        const payload = Object.fromEntries(formData);
        
        payload.action = isEdit ? 'update' : 'create';
        payload.type = type;

        const res = await API.postData(payload);

        if (res.status === 'success') {
            await Swal.fire({
                icon: 'success',
                title: 'ສຳເລັດ!',
                text: res.message,
                timer: 1500,
                showConfirmButton: false
            });

            if (isEdit) closeModal();
            navigate('dashboard'); // Refresh ຕາຕະລາງ
        } else {
            throw new Error(res.message);
        }
    } catch (error) {
        Swal.fire({ icon: 'error', title: 'ຜິດພາດ', text: error.message });
    }
}
function openView(encodedRow) {
    const row = JSON.parse(decodeURIComponent(encodedRow));
    const modal = document.getElementById('edit-modal'); // ໃຊ້ modal ໂຕດຽວກັບ Edit ກໍໄດ້
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = Components.viewDetails(row);
    modal.classList.remove('hidden');
}
// --- ຟັງຊັນ ລຶບຂໍ້ມູນ (Delete) ---
async function deleteItem(id) {
    const result = await Swal.fire({
        title: 'ຢືນຢັນການລຶບ?',
        text: "ທ່ານຈະບໍ່ສາມາດກູ້ຄືນຂໍ້ມູນນີ້ໄດ້!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'ລຶບທັນທີ',
        cancelButtonText: 'ຍົກເລີກ'
    });

    if (result.isConfirmed) {
        Swal.fire({ title: 'ກຳລັງລຶບ...', didOpen: () => Swal.showLoading() });
        
        const res = await API.postData({ action: 'delete', id: id, type: 'inbound' });
        
        if (res.status === 'success') {
            Swal.fire('ລຶບແລ້ວ!', res.message, 'success');
            navigate('dashboard');
        } else {
            Swal.fire('ຜິດພາດ', res.message, 'error');
        }
    }
}
// ຟັງຊັນສະແດງຕາຕະລາງໃນ Dashboard
function renderDashboardTable(res) {
    if (!res.data || res.data.length === 0) return '<p class="p-10 text-center text-gray-400">ບໍ່ມີຂໍ້ມູນ</p>';
    
    return `
        <table class="w-full text-left text-sm font-lao">
            <thead class="bg-gray-50 text-gray-400 font-bold uppercase text-[10px]">
                <tr>
                    <th class="p-4">ເລກທີ</th><th class="p-4">ວັນທີ</th><th class="p-4">ລາຍລະອຽດ</th><th class="p-4 text-right">ຈັດການ</th>
                </tr>
            </thead>
            <tbody class="divide-y">
                ${res.data.map(row => {
                    const rowData = encodeURIComponent(JSON.stringify(row));
                    return `
                    <tr class="hover:bg-gray-50 transition-all">
                        <td class="p-4 font-bold text-indigo-600">${row[1] || '-'}</td>
                        <td class="p-4 text-gray-500">${row[2] ? new Date(row[2]).toLocaleDateString('lo-LA') : '-'}</td>
                        <td class="p-4 text-gray-700 truncate max-w-xs">${row[3] || '-'}</td>
                        <td class="p-4 text-right flex justify-end gap-3">
                            <button onclick="handleEditAction('${rowData}', 'inbound')" class="text-blue-500 hover:scale-110 transition-transform">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="handleDeleteAction('${row[0]}', 'inbound')" class="text-red-500 hover:scale-110 transition-transform">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>`;
                }).join('')}
            </tbody>
        </table>
    `;
}
// ຟັງຊັນນີ້ຕ້ອງຊື່ editItem ເພາະໃນປຸ່ມກົດ (onclick) ເຮົາຂຽນຊື່ນີ້ໄວ້
// ຟັງຊັນຮັບຄ່າຈາກປຸ່ມ Edit ໃນຕາຕະລາງ
function editItem(rowDataEncoded) {
    // 1. ຖອດລະຫັດຂໍ້ມູນທີ່ສົ່ງມາ
    const row = JSON.parse(decodeURIComponent(rowDataEncoded));
    
    // 2. ຊີ້ບ່ອນທີ່ຈະສະແດງ Modal
    const modal = document.getElementById('edit-modal');
    const modalBody = document.getElementById('modal-body');
    
    // 3. ເອີ້ນໃຊ້ Components.inboundForm ໂດຍສົ່ງຄ່າ isEdit = true ແລະ ສົ່ງຂໍ້ມູນ row ໄປໃຫ້
    modalBody.innerHTML = Components.inboundForm('inbound', true, row);
    
    // 4. ສະແດງ Modal ຂຶ້ນມາ
    modal.classList.remove('hidden');
}

// ຟັງຊັນປິດ Modal
function closeModal() {
    document.getElementById('edit-modal').classList.add('hidden');
}
// ຟັງຊັນຈັດການ Edit (ເປີດ Modal)
function handleEditAction(encodedRow, type) {
    const row = JSON.parse(decodeURIComponent(encodedRow));
    const modal = document.getElementById('edit-modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = Components.docForm(type, true, row); // ໃຊ້ Component ຟອມໂຕດຽວກັນ
    modal.classList.remove('hidden');
}

// ຟັງຊັນຈັດການ Delete
async function handleDeleteAction(id, type) {
    const confirm = await Swal.fire({
        title: 'ຢືນຢັນການລຶບ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'ລຶບທັນທີ'
    });

    if (confirm.isConfirmed) {
        Swal.fire({ title: 'ກຳລັງລຶບ...', didOpen: () => Swal.showLoading() });
        const res = await API.post({ action: 'delete', id: id, type: type });
        if(res.status === 'success') {
            Swal.fire('ສຳເລັດ', 'ລຶບຂໍ້ມູນຮຽບຮ້ອຍ', 'success');
            navigate('dashboard');
        }
    }
}
function editOutbound(encodedRow) {
    const row = JSON.parse(decodeURIComponent(encodedRow));
    const modal = document.getElementById('edit-modal');
    const modalBody = document.getElementById('modal-body');
    // ສົ່ງ type ເປັນ 'outbound'
    modalBody.innerHTML = Components.outboundForm('outbound', true, row);
    modal.classList.remove('hidden');
}

// ຟັງຊັນສຳລັບເອົາຂໍ້ມູນ User ໄປໂຊໃນ Header
function renderUserProfile() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    
    if (userData) {
        const nameElement = document.getElementById('display-user-name');
        const roleElement = document.getElementById('display-user-role');
        
        if (nameElement) nameElement.innerText = userData.name;
        if (roleElement) roleElement.innerText = userData.role;
    }
}
// ຟັງຊັນ Logout ແບບມີ Swal ຢືນຢັນ
function handleLogout() {
    Swal.fire({
        title: 'ຢືນຢັນການອອກຈາກລະບົບ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4F46E5',
        cancelButtonColor: '#F3F4F6',
        confirmButtonText: 'ແມ່ນແລ້ວ',
        cancelButtonText: 'ຍົກເລີກ',
        customClass: {
            cancelButton: 'text-gray-500'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            sessionStorage.clear();
            window.location.href = 'login.html';
        }
    });
}

// ລັນທຸກຄັ້ງທີ່ເປີດໜ້າເວັບ
checkAuth();

// ຟັງຊັນກອງຂໍ້ມູນ
function applyFilter() {
    const searchTerm = document.getElementById('filter-search').value.toLowerCase();
    const startDate = document.getElementById('filter-start').value;
    const endDate = document.getElementById('filter-end').value;
    
    const rows = document.querySelectorAll('#data-table-body tr');

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        // ສົມມຸດວ່າວັນທີຢູ່ໃນ Column ທີ 2 ຫຼື 3 (Index 1 ຫຼື 2)
        const rowDate = row.getAttribute('data-date'); // ເຮົາຕ້ອງເພີ່ມ attribute ນີ້ໃນ components.js
        
        let show = true;

        // ກອງຕາມຄຳຄົ້ນຫາ
        if (searchTerm && !text.includes(searchTerm)) show = false;

        // ກອງຕາມວັນທີ
        if (show && startDate && rowDate < startDate) show = false;
        if (show && endDate && rowDate > endDate) show = false;
   
        row.style.display = show ? '' : 'none';
    });
}

// ຟັງຊັນລ້າງຄ່າ Filter
function resetFilter() {
    document.getElementById('filter-search').value = '';
    document.getElementById('filter-start').value = '';
    document.getElementById('filter-end').value = '';
    applyFilter();
}
function changePage(newPage) { 
    // ປ້ອງກັນບໍ່ໃຫ້ໄປໜ້າທີ່ບໍ່ມີຢູ່ຈິງ
    if (newPage < 1) return;
    
    currentPage = newPage;
    // ເອີ້ນ navigate ເພື່ອ Re-render ຕາຕະລາງໃໝ່
    navigate('dashboard');
}
window.onload = () => navigate('dashboard');