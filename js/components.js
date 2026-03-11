
// let currentPage = 1;
// const rowsPerPage = 15;
// const userData = JSON.parse(sessionStorage.getItem("userData"));
// const userName = userData ? userData.name : "ຜູ້ໃຊ້ທົ່ວໄປ";
// const userRole = userData ? userData.role : "User";
// const Components = {
//   dashboard: (data) => `
//         <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-white font-bold">
//             <div class="bg-indigo-600 p-6 rounded-2xl shadow-lg">ລວມ: ${data.total}</div>
//             <div class="bg-blue-600 p-6 rounded-2xl shadow-lg">ເຂົ້າ: ${data.inbound}</div>
//             <div class="bg-green-600 p-6 rounded-2xl shadow-lg">ອອກ: ${data.outbound}</div>
//         </div>
        

//      <div class="bg-white p-4 rounded-2xl shadow-sm border mb-6 flex flex-wrap gap-4 items-end font-lao">
//     <div class="flex-1 min-w-[200px]">
//         <label class="block text-xs font-bold text-gray-400 mb-1 uppercase">ຄົ້ນຫາທົ່ວໄປ</label>
//         <input type="text" id="filter-search" onkeyup="applyFilter()" placeholder="ເລກທີ, ລາຍລະອຽດ, ພາກສ່ວນ..." 
//             class="w-full border p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
//     </div>
//     <div>
//         <label class="block text-xs font-bold text-gray-400 mb-1 uppercase">ເລີ່ມວັນທີ</label>
//         <input type="date" id="filter-start" onchange="applyFilter()" 
//             class="border p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
//     </div>
//     <div>
//         <label class="block text-xs font-bold text-gray-400 mb-1 uppercase">ເຖິງວັນທີ</label>
//         <input type="date" id="filter-end" onchange="applyFilter()" 
//             class="border p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
//     </div>
//     <button onclick="resetFilter()" class="bg-gray-100 text-gray-500 px-4 py-2.5 rounded-xl hover:bg-gray-200 transition-all text-sm font-bold">
//         <i class="fas fa-sync-alt mr-1"></i> ລ້າງຄ່າ
//     </button>
// </div>

//         <div class="bg-white rounded-2xl shadow-sm border overflow-hidden">
//             <table class="w-full text-left">
//                 <thead class="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
//                     <tr><th class="p-4">ເລກທີຂາເຂົ້າ</th><th class="p-4">ວັນທີຂາເຂົ້າ</th><th class="p-4">ລາຍລະອຽດ</th><th class="p-4">ຜູ້ຮັບຜິດຊອບ</th><th class="p-4">ຈັດການ</th></tr>
//                 </thead>
//                 <tbody class="divide-y">
//                     ${data.data
//                       .map(
//                         (row) => `
//                         <tr>
//                             <td class="p-4 font-bold text-indigo-600">${row[1]}</td>
//                             <td class="p-4 text-sm">${new Date(row[2]).toLocaleDateString("lo-LA")}</td>
//                             <td class="p-4">${row[3]}</td>
//                             <td class="p-4">${row[8]}</td>
//                             <td class="p-4 flex gap-3">
//                                 <button onclick="editItem('${encodeURIComponent(JSON.stringify(row))}')" class="text-blue-500"> <i class="fas fa-edit"></i></button>
//                                 <button onclick="deleteItem('${row[0]}')" class="text-red-500"><i class="fas fa-trash"></i></button>
//                             </td>
//                         </tr>
//                     `,
//                       )
//                       .join("")}
//                 </tbody>
//             </table>
//         </div>`,
let currentPage = 1;      // ເລກໜ້າປັດຈຸບັນ
const rowsPerPage = 15;   // ຈຳນວນແຖວຕໍ່ໜ້າ
 const Components = { 
    dashboard: (data) => {
    // 1. ຄິດໄລ່ການແບ່ງໜ້າ (Pagination Logic)
    const totalRows = data.data.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
     
    // ຕັດຂໍ້ມູນສະເພາະທີ່ຈະໂຊໃນໜ້ານີ້
    const paginatedData = data.data.slice(startIndex, endIndex);

    return `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-white font-bold font-lao">
            <div class="bg-indigo-600 p-6 rounded-2xl shadow-lg flex justify-between items-center">
                <span>ລວມທັງໝົດ:</span>
                <span class="text-3xl">${data.total}</span>
            </div>
            <div class="bg-blue-600 p-6 rounded-2xl shadow-lg flex justify-between items-center">
                <span>ເອກະສານເຂົ້າ:</span>
                <span class="text-3xl">${data.inbound}</span>
            </div>
            <div class="bg-green-600 p-6 rounded-2xl shadow-lg flex justify-between items-center">
                <span>ເອກະສານອອກ:</span>
                <span class="text-3xl">${data.outbound}</span>
            </div>
        </div>

        <div class="bg-white p-4 rounded-2xl shadow-sm border mb-6 flex flex-wrap gap-4 items-end font-lao">
            <div class="flex-1 min-w-[200px]">
                <label class="block text-xs font-bold text-gray-400 mb-1 uppercase">ຄົ້ນຫາທົ່ວໄປ</label>
                <input type="text" id="filter-search" onkeyup="applyFilter()" placeholder="ເລກທີ, ລາຍລະອຽດ, ພາກສ່ວນ..." 
                    class="w-full border p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-400 mb-1 uppercase">ເລີ່ມວັນທີ</label>
                <input type="date" id="filter-start" onchange="applyFilter()" 
                    class="border p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-400 mb-1 uppercase">ເຖິງວັນທີ</label>
                <input type="date" id="filter-end" onchange="applyFilter()" 
                    class="border p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
            </div>
            <button onclick="resetFilter()" class="bg-gray-100 text-gray-500 px-4 py-2.5 rounded-xl hover:bg-gray-200 transition-all text-sm font-bold">
                <i class="fas fa-sync-alt mr-1"></i> ລ້າງຄ່າ
            </button>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border overflow-hidden font-lao">
            <table class="w-full text-left">
                <thead class="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                    <tr>
                        <th class="p-4">ເລກທີຂາເຂົ້າ</th>
                        <th class="p-4">ວັນທີຂາເຂົ້າ</th>
                        <th class="p-4">ລາຍລະອຽດ</th>
                        <th class="p-4">ຜູ້ຮັບຜິດຊອບ</th>
                        <th class="p-4 text-center">ຈັດການ</th>
                    </tr>
                </thead>
                <tbody id="data-table-body" class="divide-y">
                    ${paginatedData.map((row) => {
                        // ແປງວັນທີເປັນ YYYY-MM-DD ສໍາລັບ Filter
                        const dateForFilter = row[2] ? new Date(row[2]).toLocaleDateString('en-CA') : '';
                        return `
                        <tr data-date="${dateForFilter}" class="hover:bg-gray-50 transition-colors">
                            <td class="p-4 font-bold text-indigo-600">${row[1]}</td>
                            <td class="p-4 text-sm">${new Date(row[2]).toLocaleDateString("lo-LA")}</td>
                            <td class="p-4 text-sm text-gray-600">${row[3]}</td>
                            <td class="p-4 text-sm">${row[8]}</td>
                            <td class="p-4 flex justify-center gap-3">
                                <button onclick="editItem('${encodeURIComponent(JSON.stringify(row))}')" class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"> 
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="deleteItem('${row[0]}')" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `}).join("")}
                </tbody>
            </table>

            <div class="p-4 border-t flex items-center justify-between bg-slate-50">
                <span class="text-sm text-gray-500">
                    ສະແດງ ${startIndex + 1} - ${Math.min(endIndex, totalRows)} ຈາກ ${totalRows}
                </span>
                <div class="flex gap-2">
                    <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''} 
                        class="px-4 py-2 border rounded-xl bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    
                    <div class="flex items-center px-4 font-bold text-indigo-600">
                        ໜ້າ ${currentPage} / ${totalPages}
                    </div>

                    <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''} 
                        class="px-4 py-2 border rounded-xl bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>`;
  },
  inboundForm: (type, isEdit = false, row = null) => `
        <div class="max-w-4xl bg-white p-8 rounded-3xl shadow-sm border mx-auto font-lao">
            <h3 class="text-xl font-bold mb-6 text-indigo-600">${isEdit ? "ແກ້ໄຂເອກະສານ" : "ລົງທະບຽນເອກະສານ"}</h3>
             
             <form onsubmit="handleFormSubmit(event, '${type}', ${isEdit})" class="grid grid-cols-2 gap-5">
                ${isEdit ? `<input type="hidden" name="id" value="${row[0]}">` : ""}
                
                <div class="col-span-1">
                    <label class="block text-xs font-bold text-gray-400 mb-1">ເລກທີຂາເຂົ້າ</label>
                    <input type="text" name="inNum" value="${isEdit ? row[1] : ""}" class="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
                </div>
                <div class="col-span-1">
                    <label class="block text-xs font-bold text-gray-400 mb-1">ວັນທີຂາເຂົ້າ</label>
                    <input type="date" name="inDate" value="${isEdit && row[2] ? new Date(row[2]).toISOString().split("T")[0] : ""}" class="w-full border p-3 rounded-xl outline-none">
                </div>
                <div class="col-span-2">
                    <label class="block text-xs font-bold text-gray-400 mb-1">ລາຍລະອຽດເອກະສານ</label>
                    <textarea name="details" rows="2" required class="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">${isEdit ? row[3] : ""}</textarea>
                </div>
                <div class="col-span-1">
                    <label class="block text-xs font-bold text-gray-400 mb-1">ເລກທີເອກະສານ (ຕົ້ນສະບັບ)</label>
                    <input type="text" name="docNumber" value="${isEdit ? row[4] : ""}" class="w-full border p-3 rounded-xl outline-none">
                </div>
                <div class="col-span-1">
                    <label class="block text-xs font-bold text-gray-400 mb-1">ວັນທີເອກະສານ (ຕົ້ນສະບັບ)</label>
                    <input type="date" name="docDate" value="${isEdit && row[5] ? new Date(row[5]).toISOString().split("T")[0] : ""}" class="w-full border p-3 rounded-xl outline-none">
                </div>
                <div class="col-span-1">
                    <label class="block text-xs font-bold text-gray-400 mb-1">ຈາກພາກສ່ວນ/ເຖິງພາກສ່ວນ</label>
                    <input type="text" name="department" value="${isEdit ? row[6] : ""}" required class="w-full border p-3 rounded-xl outline-none">
                </div>
                <div class="col-span-1">
                    <label class="block text-xs font-bold text-gray-400 mb-1">ປະເພດເອກະສານ</label>
                    <select name="docType" class="w-full border p-3 rounded-xl outline-none">
                        <option value="ໃບກິດສຳພັນ" ${isEdit && row[7] === "ໃບກິດສຳພັນ" ? "selected" : ""}>ໃບກິດສຳພັນ</option>
                        <option value="ໜັງສືເຊີນ" ${isEdit && row[7] === "ໜັງສືເຊີນ" ? "selected" : ""}>ໜັງສືເຊີນ</option>
                        <option value="ໜັງສືສະເໜີ" ${isEdit && row[7] === "ໜັງສືສະເໜີ" ? "selected" : ""}>ໜັງສືສະເໜີ</option>
                         <option value="ໜັງສືສະເໜີ" ${isEdit && row[7] === "ໜັງສືສະເໜີ" ? "selected" : ""}>ໜັງສືຂອບໃຈ</option>
                      
                    </select>
                </div>
                <div class="col-span-2">
     <label class="block text-xs font-bold text-gray-400 mb-1 font-lao uppercase">ຜູ້ຮັບຜິດຊອບວຽກ</label>
        <select name="responsible" required class="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-lao">
        <option value="">-- ເລືອກຜູ້ຮັບຜິດຊອບ --</option>
        <option value="ທ່ານ ນ ພອນນາລີ ແກ້ວວິທຳ" ${isEdit && row[8] === "ທ່ານ ນ ພອນນາລີ ແກ້ວວິທຳ" ? "selected" : ""}>ທ່ານ ນ ພອນນາລີ ແກ້ວວິທຳ</option>
        <option value="ທ່ານ ສຸວິນນາ ອຸມມິລາ" ${isEdit && row[8] === "ທ່ານ ສຸວິນນາ ອຸມມິລາ" ? "selected" : ""}>ທ່ານ ສຸວິນນາ ອຸມມິລາ</option>
        <option value="ທ່ານ ນ ພອນວິໄລ ແພງຍະລາດ" ${isEdit && row[8] === "ທ່ານ ນ ພອນວິໄລ ແພງຍະລາດ" ? "selected" : ""}>ທ່ານ ນ ພອນວິໄລ ແພງຍະລາດ</option>
        <option value="ທ່ານ ບຸນຕີ ຊາມຸນຕີ" ${isEdit && row[8] === "ທ່ານ ບຸນຕີ ຊາມຸນຕີ" ? "selected" : ""}>ທ່ານ ບຸນຕີ ຊາມຸນຕີ</option>
        <option value="ທ່ານ ນ ພອນເພັດ ທັນນະວົງ" ${isEdit && row[8] === "ທ່ານ ນ ພອນເພັດ ທັນນະວົງ" ? "selected" : ""}>ທ່ານ ນ ພອນເພັດ ທັນນະວົງ</option>
        <option value="ທ່ານ ນ ອໍລະໄທ ແພງພາປະເສີດ" ${isEdit && row[8] === "ທ່ານ ນ ອໍລະໄທ ແພງພາປະເສີດ" ? "selected" : ""}>ທ່ານ ນ ອໍລະໄທ ແພງພາປະເສີດ</option>
        <option value="ທ່ານ ນ ຄຳທິດາ ພົມມະສັກ" ${isEdit && row[8] === "ທ່ານ ນ ຄຳທິດາ ພົມມະສັກ" ? "selected" : ""}>ທ່ານ ນ ຄຳທິດາ ພົມມະສັກ</option>
        <option value="TBC" ${isEdit && row[8] === "TBC" ? "selected" : ""}>TBC</option>
    </select>
        </div>
                
                <div class="col-span-2 flex gap-3 mt-4">
                    <button type="submit" class="flex-1 bg-indigo-600 text-white p-4 rounded-xl font-bold shadow-lg">
                        <i class="fas fa-save mr-2"></i> ${isEdit ? "ອັບເດດຂໍ້ມູນ" : "ບັນທຶກເອກະສານ"}
                    </button>
                    ${isEdit ? `<button type="button" onclick="closeModal()" class="flex-1 bg-gray-100 text-gray-500 p-4 rounded-xl font-bold">ຍົກເລີກ</button>` : ""}
                </div>
            </form>
        </div>
    `,
  outboundForm: (type, isEdit = false, row = null) => `
    <div class="max-w-4xl bg-white p-8 rounded-3xl shadow-sm border mx-auto font-lao">
        <h3 class="text-xl font-bold mb-6 text-blue-600">${isEdit ? "ແກ້ໄຂເອກະສານຂາອອກ" : "ລົງທະບຽນເອກະສານຂາອອກ"}</h3>
        <form onsubmit="handleFormSubmit(event, '${type}', ${isEdit})" class="grid grid-cols-2 gap-5">
            ${isEdit ? `<input type="hidden" name="id" value="${row[0]}">` : ""}
            
            <div class="col-span-1">
                <label class="block text-xs font-bold text-gray-400 mb-1 uppercase">ເລກທີຂາອອກ</label>
                <input type="text" name="inNum" value="${isEdit ? row[1] : ""}" required class="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div class="col-span-1">
                <label class="block text-xs font-bold text-gray-400 mb-1 uppercase">ວັນທີຂາອອກ</label>
                <input type="date" name="inDate" value="${isEdit && row[2] ? new Date(row[2]).toLocaleDateString("en-CA") : ""}" required class="w-full border p-3 rounded-xl outline-none">
            </div>
            <div class="col-span-2">
                <label class="block text-xs font-bold text-gray-400 mb-1 uppercase">ລາຍລະອຽດເອກະສານ</label>
                <textarea name="details" rows="2" required class="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500">${isEdit ? row[3] : ""}</textarea>
            </div>
            <div class="col-span-1">
                <label class="block text-xs font-bold text-gray-400 mb-1 uppercase">ເລກທີເອກະສານ (ຕົ້ນສະບັບ)</label>
                <input type="text" name="docNumber" value="${isEdit ? row[4] : ""}" class="w-full border p-3 rounded-xl outline-none">
            </div>
            <div class="col-span-1">
                <label class="block text-xs font-bold text-gray-400 mb-1 uppercase">ວັນທີເອກະສານ (ຕົ້ນສະບັບ)</label>
                <input type="date" name="docDate" value="${isEdit && row[5] ? new Date(row[5]).toLocaleDateString("en-CA") : ""}" class="w-full border p-3 rounded-xl outline-none">
            </div>
            <div class="col-span-1">
                <label class="block text-xs font-bold text-gray-400 mb-1 uppercase">ເຖິງພາກສ່ວນ</label>
                <input type="text" name="department" value="${isEdit ? row[6] : ""}" required class="w-full border p-3 rounded-xl outline-none">
            </div>
            <div class="col-span-1">
                <label class="block text-xs font-bold text-gray-400 mb-1 uppercase">ປະເພດເອກະສານ</label>
                <select name="docType" class="w-full border p-3 rounded-xl outline-none">
                    <option value="ໃບກິດສຳພັນ" ${isEdit && row[7] === "ໃບກິດສຳພັນ" ? "selected" : ""}>ໃບກິດສຳພັນ</option>
                    <option value="ໜັງສືເຊີນ" ${isEdit && row[7] === "ໜັງສືເຊີນ" ? "selected" : ""}>ໜັງສືເຊີນ</option>
                    <option value="ໜັງສືສະເໜີ" ${isEdit && row[7] === "ໜັງສືສະເໜີ" ? "selected" : ""}>ໜັງສືສະເໜີ</option>
                </select>
            </div>
            <div class="col-span-2">
                <label class="block text-xs font-bold text-gray-400 mb-1 uppercase">ຜູ້ລົງນາມ/ຜູ້ຮັບຜິດຊອບ</label>
                <input type="text" name="responsible" value="${isEdit ? row[8] : ""}" required class="w-full border p-3 rounded-xl outline-none">
            </div>
            
            <div class="col-span-2 flex gap-3 mt-4">
                <button type="submit" class="flex-1 bg-blue-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all">
                    <i class="fas fa-save mr-2"></i> ${isEdit ? "ອັບເດດຂໍ້ມູນ" : "ບັນທຶກເອກະສານ"}
                </button>
                ${isEdit ? `<button type="button" onclick="closeModal()" class="flex-1 bg-gray-100 text-gray-500 p-4 rounded-xl font-bold">ຍົກເລີກ</button>` : ""}
            </div>
        </form>
    </div>`,

  settings: () =>
    `<div class="p-10 text-slate-400 italic">ໜ້າຕັ້ງຄ່າກຳລັງພັດທະນາ...</div>`,
};
