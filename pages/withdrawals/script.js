$(document).ready(function () {
    if(sessionStorage.getItem("access_token") == null || sessionStorage.getItem("access_token") == undefined || sessionStorage.getItem("access_token") == '') {
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

    $(document).on('click', '.btnEditWithdrawal', function () {
        var id = $(this).data('id');
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

function getWithdrawals(){
    $.ajax({
        url: api_url + 'api/chemicals-borrows',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('access_token'),
        },
        dataType: 'json',
        success: function(response) {
            var data = response.data;
            var html = '';
            $.each(data, function(index, item) {
                html += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.chemical_borrow.chemical.name}</td>
                        <td>${item.chemical_borrow.user.name || '-'}</td>
                        <td>${item.chemical_borrow.borrow_date || '-'}</td>
                        <td>${item.chemical_borrow.return_date || '-'}</td>
                        <td>${item.chemical_borrow.purpose ? $('<div>').text(item.chemical_borrow.purpose).html() : '-'}</td>
                        <td>
                            <button type="button" class="btn btn--secondary btnEditWithdrawal" data-id="${item.chemical_borrow.id}">คืนสาร</button>
                            <button type="button" class="btn btn--danger" onclick="deleteWithdrawal(${item.chemical_borrow.id})">ลบ</button>
                        </td>
                    </tr>
                `;
            });
            $('#listdata').html(html);
        },
        error: function(xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
}

function getchemicals(selectedEditChemicalId){
    $.ajax({
        url: api_url + 'api/chemicals',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('access_token'),
        },
        dataType: 'json',
        success: function(response) {
            var data = response;
            var html = '<option value="">-- เลือกสาร --</option>';
            $.each(data, function(index, item) {
                html += '<option value="' + item.id + '">' + item.name + '</option>';
            });
            $('#wd-chemical_id').html(html);
            $('#ed-chemical_id').html(html);
            if (selectedEditChemicalId !== undefined && selectedEditChemicalId !== null) {
                $('#ed-chemical_id').val(String(selectedEditChemicalId));
            }
        }
    });
}

function openEditWithdrawal(id) {
    $.ajax({
        url: api_url + 'api/chemicals-borrows/' + id,
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('access_token'),
        },
        dataType: 'json',
        success: function (response) {
            var item = response.data || {};
            var chemicalBorrow = item.chemical_borrow || item;
            var modalEdit = document.getElementById('modalEditWithdrawal');
            if (!modalEdit) return;

            getchemicals(chemicalBorrow.chemical_id || '');
            $('#ed-withdrawal-id').val(chemicalBorrow.id || '');
            $('#ed-borrow_date').val(chemicalBorrow.borrow_date || '');
            $('#ed-return_date').val(chemicalBorrow.return_date || '');
            $('#ed-purpose').val(chemicalBorrow.purpose || '');

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

function saveWithdrawal(){
        var formData = {
            borrower_id: sessionStorage.getItem('user_id'),
            chemical_id: $('#wd-chemical_id').val(),
            borrow_date: $('#wd-borrow_date').val(),
            return_date: $('#wd-return_date').val(),
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
        success: function(response) {
            console.log(response);
            if(response.data.message == 'success') {
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
        error: function(xhr, status, error) {
            console.log(xhr.responseText);
        }
    })

}

function editWithdrawal(){
    var id = $('#ed-withdrawal-id').val();
    var formData = {
        status: "returned"
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
        success: function(response) {
            console.log(response);
            if(response.data.message == 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'แก้ไขข้อมูลเรียบร้อย!',
                    text: response.data.message
                });
                getWithdrawals();
            }
        },
        error: function(xhr, status, error) {
            console.log(xhr.responseText);
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