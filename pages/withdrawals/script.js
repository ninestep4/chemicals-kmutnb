var withdrawalChemicalsCache = [];

function updateSelectedChemicalStockInfo() {
    var $selectedOption = $('#wd-chemical_id option:selected');
    var selectedId = $('#wd-chemical_id').val();
    var $stockInfo = $('#wd-chemical-stock-info');

    if (!$stockInfo.length) {
        return;
    }

    if (!selectedId) {
        $stockInfo.text('คงเหลือ: -');
        return;
    }

    var amount = $selectedOption.data('amount');
    var unit = $selectedOption.data('unit');

    if (amount === undefined || amount === null || amount === '') {
        var selectedChemical = withdrawalChemicalsCache.find(function (chemical) {
            return String(chemical.id) === String(selectedId);
        });
        if (selectedChemical) {
            amount = selectedChemical.amount;
            unit = selectedChemical.unit;
        }
    }

    if (amount === undefined || amount === null || amount === '') {
        amount = '-';
    }
    if (unit === undefined || unit === null) {
        unit = '';
    }

    $stockInfo.text('คงเหลือ: ' + amount + (unit ? ' ' + unit : ''));
}

$(document).ready(function () {
    if (sessionStorage.getItem("access_token") == null || sessionStorage.getItem("access_token") == undefined || sessionStorage.getItem("access_token") == '') {
        window.location.href = '../../pages/login/index.php';
    }
    var modal = document.getElementById('modalAddWithdrawal');
    var btnOpen = document.getElementById('btnAddWithdrawal');
    var btnClose = document.getElementById('modalAddWithdrawalClose');
    var btnCancel = document.getElementById('btnCancelWithdrawal');
    var backdrop = document.getElementById('modalAddWithdrawalBackdrop');
    var modalEdit = document.getElementById('modalEditWithdrawal');
    var btnEditClose = document.getElementById('modalEditWithdrawalClose');
    var btnEditCancel = document.getElementById('btnCancelEditWithdrawal');
    var backdropEdit = document.getElementById('modalEditWithdrawalBackdrop');

    function openModal() {
        if (modal) modal.removeAttribute('hidden');
        getchemicals();
    }

    function closeModal() {
        if (modal) modal.setAttribute('hidden', 'hidden');
    }
    function openEditModal() {
        if (modalEdit) modalEdit.removeAttribute('hidden');
    }
    function closeEditModal() {
        if (modalEdit) modalEdit.setAttribute('hidden', 'hidden');
    }

    if (btnOpen) btnOpen.addEventListener('click', openModal);
    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnCancel) btnCancel.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
    if (btnEditClose) btnEditClose.addEventListener('click', closeEditModal);
    if (btnEditCancel) btnEditCancel.addEventListener('click', closeEditModal);
    if (backdropEdit) backdropEdit.addEventListener('click', closeEditModal);
    $('#wd-chemical_id').on('change', updateSelectedChemicalStockInfo);

    $(document).on('click', '.btnEditWithdrawal', function () {
        var id = $(this).data('id');
        if (id === undefined || id === null || id === '') {
            Swal.fire({
                icon: 'error',
                title: 'ไม่พบรหัสรายการ',
                text: 'ไม่สามารถเปิดข้อมูลเพื่อคืนสารได้'
            });
            return;
        }
        openEditWithdrawal(id);
    });

    $('#btnSubmitAddWithdrawal').click(function (e) {
        e.preventDefault();
        saveWithdrawal();
    });

    $('#btnSubmitEditWithdrawal').click(function (e) {
        e.preventDefault();
        editWithdrawal();
    });
    getWithdrawals();
});

function getWithdrawals() {
    $.ajax({
        url: api_url + 'api/chemicals-borrows',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('access_token'),
        },
        dataType: 'json',
        success: function (response) {
            var data = response.data;
            var html = '';
            $.each(data, function (index, item) {
                html += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.chemical.name}</td>
                        <td>${item.user.name || '-'}</td>
                        <td>${item.user.phone || '-'}</td>
                        <td>${item.borrow_amount !== undefined && item.borrow_amount !== null ? item.borrow_amount : '-'}</td>
                        <td>${item.borrow_date || '-'}</td>
                        <td>${item.return_date || '-'}</td>
                        <td>${item.purpose ? $('<div>').text(item.purpose).html() : '-'}</td>
                        <td>${item.status === "normal" ? 'คืนสารแล้ว' : 'ยืมสารอยู่'}</td>

                        <td>
                            ${(item.chemical.amount != item.chemical.original_amount)
                                ? `<button type="button" class="btn btn--secondary btnEditWithdrawal" data-id="${item.id}">คืนสาร</button>`
                                : ''}
                            <button type="button" class="btn btn--danger" onclick="deleteWithdrawal(${item.id})">ลบ</button>
                        </td>
                    </tr>
                `;
            });
            $('#listdata').html(html);
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
}

function getchemicals(selectedEditChemicalId) {
    $.ajax({
        url: api_url + 'api/chemicals',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('access_token'),
        },
        dataType: 'json',
        success: function (response) {
            var data = Array.isArray(response)
                ? response
                : (Array.isArray(response.data)
                    ? response.data
                    : (response.data && Array.isArray(response.data.data) ? response.data.data : []));

            function normalizeChemical(item) {
                var chemical = item && item.chemical ? item.chemical : item;
                return {
                    id: chemical && chemical.id !== undefined ? chemical.id : '',
                    name: chemical && chemical.name ? chemical.name : '-',
                    amount: chemical && chemical.amount !== undefined && chemical.amount !== null ? chemical.amount : (chemical && chemical.original_amount !== undefined ? chemical.original_amount : ''),
                    unit: chemical && chemical.unit ? chemical.unit : ''
                };
            }

            withdrawalChemicalsCache = $.map(data, function (item) {
                return normalizeChemical(item);
            });
            var html = '<option value="">-- เลือกสาร --</option>';
            $.each(data, function (index, item) {
                var chemical = normalizeChemical(item);
                html += '<option value="' + chemical.id + '" data-amount="' + chemical.amount + '" data-unit="' + chemical.unit + '">' + chemical.name + '</option>';
            });
            $('#wd-chemical_id').html(html);
            $('#ed-chemical_id').html(html);
            updateSelectedChemicalStockInfo();
            if (selectedEditChemicalId !== undefined && selectedEditChemicalId !== null) {
                $('#ed-chemical_id').val(String(selectedEditChemicalId));
            }
        }
    });
}

function openEditWithdrawal(id) {
    var selectedId = String(id || '').trim();
    if (!selectedId) {
        Swal.fire({
            icon: 'error',
            title: 'ไม่พบรหัสรายการ',
            text: 'ไม่สามารถโหลดข้อมูลสำหรับแก้ไขได้'
        });
        return;
    }

    $('#ed-withdrawal-id').val(selectedId);

    $.ajax({
        url: api_url + 'api/chemicals-borrows/' + selectedId,
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('access_token'),
        },
        dataType: 'json',
        success: function (response) {
            var item = response && response.data
                ? (response.data.data ? response.data.data : response.data)
                : {};
            var modalEdit = document.getElementById('modalEditWithdrawal');
            if (!modalEdit) return;

            var resolvedId = item.id || item.borrow_id || item.chemical_borrow_id || selectedId;

            getchemicals(item.chemical_id || '');
            $('#ed-withdrawal-id').val(resolvedId);
            $('#ed-borrow_date').val(item.borrow_date || '');
            $('#ed-return_date').val(item.return_date || '');
            $('#ed-purpose').val(item.purpose || '');

            modalEdit.removeAttribute('hidden');
        },
        error: function (xhr) {
            Swal.fire({
                icon: 'error',
                title: 'โหลดข้อมูลไม่สำเร็จ',
                text: xhr.responseText || 'ไม่สามารถโหลดข้อมูลสำหรับแก้ไขได้'
            });
        }
    });
}

function saveWithdrawal() {
    var formData = {
        borrower_id: sessionStorage.getItem('user_id'),
        chemical_id: $('#wd-chemical_id').val(),
        borrow_date: $('#wd-borrow_date').val(),
        return_date: $('#wd-return_date').val(),
        borrow_amount: $('#wd-borrow_amount').val(),
        purpose: $('#wd-purpose').val(),
    };
    $.ajax({
        url: api_url + 'api/chemicals-borrows',
        type: 'POST',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('access_token'),
        },
        data: JSON.stringify(formData),
        contentType: 'application/json; charset=utf-8',
        processData: false,
        dataType: 'json',
        success: function (response) {
            console.log(response);
            if (response.data.message == 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'บันทึกข้อมูลเรียบร้อย!',
                    text: response.data.message
                });
                var modalEdit = document.getElementById('modalEditWithdrawal');
                if (modalEdit) modalEdit.setAttribute('hidden', 'hidden');
                getWithdrawals();
            }
        },
        error: function (xhr, status, error) {
            // console.log(response.responseText);
            Swal.fire({
                icon: 'error',
                title: 'การบันทึกข้อมูลล้มเหลว',
                text: (() => {
                    try {
                        const res = JSON.parse(xhr.responseText);
                        return res.message || xhr.responseText;
                    } catch (e) {
                        return xhr.responseText;
                    }
                })()
            });
        }
    })

}

function editWithdrawal() {
    var id = String($('#ed-withdrawal-id').val() || '').trim();
    if (!id) {
        Swal.fire({
            icon: 'error',
            title: 'ไม่พบรหัสรายการ',
            text: 'กรุณาเลือกข้อมูลที่ต้องการคืนสารใหม่อีกครั้ง'
        });
        return;
    }

    var amount = $('#retrun_amount').val();
    var formData = {
        status: "normal",
        return_amount: amount ? parseFloat(amount) : 0,
    };
    $.ajax({
        url: api_url + 'api/chemicals-borrows/' + id,
        type: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('access_token'),
        },
        data: JSON.stringify(formData),
        contentType: 'application/json; charset=utf-8',
        processData: false,
        dataType: 'json',
        success: function (response) {
            console.log(response);
            if (response.data.message == 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'แก้ไขข้อมูลเรียบร้อย!',
                    text: response.data.message
                });
                getWithdrawals();
            }
        },
        error: function (xhr, status, error) {
            // console.log(response.responseText);
            Swal.fire({
                icon: 'error',
                title: 'การแก้ไขข้อมูลล้มเหลว',
                text: (() => {
                    try {
                        const res = JSON.parse(xhr.responseText);
                        return res.message || xhr.responseText;
                    } catch (e) {
                        return xhr.responseText;
                    }
                })()
            });
        }
    });
}

function deleteWithdrawal(id) {
    Swal.fire({
        title: 'คุณต้องการลบข้อมูลการยืมสารนี้หรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ลบ',
        cancelButtonText: 'ยกเลิก',
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "DELETE",
                url: api_url + 'api/chemicals-borrows/' + id,
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('access_token'),
                },
                dataType: "json",
                success: function (response) {
                    if (response.data.message == "Chemical Borrow deleted successfully") {
                        Swal.fire({
                            icon: 'success',
                            title: 'ลบข้อมูลเรียบร้อย!',
                            text: response.data.message
                        });
                        getWithdrawals();
                    }
                },
                error: function (xhr, status, error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'การลบข้อมูลล้มเหลว',
                        text: (() => {
                            try {
                                const res = JSON.parse(xhr.responseText);
                                return res.message || xhr.responseText;
                            } catch (e) {
                                return xhr.responseText;
                            }
                        })
                    });
                }
            });
        }
    });
}