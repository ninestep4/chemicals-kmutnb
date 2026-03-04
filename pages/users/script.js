var usersCache = [];

$(document).ready(function () {
    if (sessionStorage.getItem('access_token') == null || sessionStorage.getItem('access_token') == undefined || sessionStorage.getItem('access_token') == '') {
        window.location.href = '../../pages/login/index.php';
        return;
    }

    getUsers();

    var modal = document.getElementById('modalAddUser');
    var modalEdit = document.getElementById('modalEditUser');
    var btnOpen = document.getElementById('btnAddUser');
    var btnClose = document.getElementById('modalAddUserClose');
    var btnCancel = document.getElementById('btnCancelAdd');
    var backdrop = document.getElementById('modalAddUserBackdrop');
    var btnEditClose = document.getElementById('modalEditUserClose');
    var btnEditCancel = document.getElementById('btnCancelEdit');
    var backdropEdit = document.getElementById('modalEditUserBackdrop');

    function openModal() {
        if (modal) modal.removeAttribute('hidden');
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

    $('#btnSubmitAdd').click(function (e) {
        e.preventDefault();
        var password = $('#add-password').val();
        var passwordConfirm = $('#add-password_confirmation').val();

        if (password !== passwordConfirm) {
            Swal.fire({
                icon: 'error',
                title: 'รหัสผ่านไม่ตรงกัน',
                text: 'กรุณาตรวจสอบรหัสผ่านและยืนยันรหัสผ่านใหม่อีกครั้ง'
            });
            return;
        }

        var payload = {
            student_id: $('#add-student_id').val().trim(),
            name: $('#add-name').val().trim(),
            email: $('#add-email').val().trim(),
            phone: $('#add-phone').val().trim(),
            username: $('#add-username').val().trim(),
            password: password,
            password_confirmation: passwordConfirm
        };

        if (!payload.name || !payload.email || !payload.username || !payload.password) {
            Swal.fire({
                icon: 'warning',
                title: 'ข้อมูลไม่ครบถ้วน',
                text: 'กรุณากรอกชื่อ-นามสกุล, อีเมล, ชื่อผู้ใช้ และรหัสผ่าน'
            });
            return;
        }

        $.ajax({
            url: api_url + 'api/register',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')
            },
            data: payload,
            dataType: 'json',
            success: function (response) {
                if (response.success === true || response.message === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'เพิ่มผู้ใช้สำเร็จ!',
                        text: response.message || 'บันทึกข้อมูลเรียบร้อย'
                    });
                    closeModal();
                    $('#formAddUser')[0].reset();
                    getUsers();
                }
            },
            error: function (xhr) {
                Swal.fire({
                    icon: 'error',
                    title: 'เพิ่มผู้ใช้ไม่สำเร็จ',
                    text: (function () {
                        try {
                            var res = JSON.parse(xhr.responseText);
                            return res.message || res.errors ? JSON.stringify(res.errors) : xhr.responseText;
                        } catch (e) {
                            return xhr.responseText || 'เกิดข้อผิดพลาด';
                        }
                    })()
                });
            }
        });
    });

    window.editUser = function (id) {
        $('#ed-user-id').val(id);
        var item = usersCache.find(function (u) {
            return Number(u.id) === Number(id);
        });

        if (!item) {
            Swal.fire({
                icon: 'error',
                title: 'ไม่พบข้อมูล',
                text: 'ไม่สามารถโหลดข้อมูลสำหรับแก้ไขได้'
            });
            return;
        }

        $('#ed-student_id').val(item.student_id || '');
        $('#ed-name').val(item.name || '');
        $('#ed-email').val(item.email || '');
        $('#ed-phone').val(item.phone || '');
        $('#ed-username').val(item.username || '');
        $('#ed-password').val('');
        $('#ed-password_confirmation').val('');

        openEditModal();
    };

    $('#btnSubmitEdit').click(function (e) {
        e.preventDefault();
        var id = $('#ed-user-id').val();
        var payload = {
            student_id: $('#ed-student_id').val().trim(),
            name: $('#ed-name').val().trim(),
            email: $('#ed-email').val().trim(),
            phone: $('#ed-phone').val().trim(),
            username: $('#ed-username').val().trim(),
            role: $('#ed-role').val().trim()
        };

        var password = $('#ed-password').val();
        var passwordConfirm = $('#ed-password_confirmation').val();

        if (password || passwordConfirm) {
            if (password !== passwordConfirm) {
                Swal.fire({
                    icon: 'error',
                    title: 'รหัสผ่านไม่ตรงกัน',
                    text: 'กรุณาตรวจสอบรหัสผ่านใหม่อีกครั้ง'
                });
                return;
            }
            payload.password = password;
            // payload.password_confirmation = passwordConfirm;
        }

        if (!payload.name || !payload.email || !payload.username || !payload.role) {
            Swal.fire({
                icon: 'warning',
                title: 'ข้อมูลไม่ครบถ้วน',
                text: 'กรุณากรอกชื่อ-นามสกุล, อีเมล, ชื่อผู้ใช้ และสิทธิ์'
            });
            return;
        }

        $.ajax({
            url: api_url + 'api/admin/users/' + id,
            type: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')
            },
            data: JSON.stringify(payload),
            contentType: 'application/json; charset=utf-8',
            processData: false,
            dataType: 'json',
            success: function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'แก้ไขข้อมูลเรียบร้อย!',
                    text: response.message || 'บันทึกสำเร็จ'
                });
                closeEditModal();
                getUsers();
            },
            error: function (xhr) {
                Swal.fire({
                    icon: 'error',
                    title: 'แก้ไขข้อมูลล้มเหลว',
                    text: (function () {
                        try {
                            var res = JSON.parse(xhr.responseText);
                            return res.message || xhr.responseText;
                        } catch (e) {
                            return xhr.responseText || 'เกิดข้อผิดพลาด';
                        }
                    })()
                });
            }
        });
    });
});

function getUsers() {
    $.ajax({
        url: api_url + 'api/admin/users',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')
        },
        success: function (response) {
            var data = response;
            if (response && response.data && Array.isArray(response.data)) {
                data = response.data;
            }
            usersCache = Array.isArray(data) ? data : [];
            var $list = $('#listdata');
            $list.empty();

            if (usersCache.length === 0) {
                $list.append('<tr><td colspan="7" class="text-muted">ไม่พบข้อมูลผู้ใช้</td></tr>');
                return;
            }

            usersCache.forEach(function (item, idx) {
                $list.append(
                    '<tr>' +
                    '<td>' + (idx + 1) + '</td>' +
                    '<td>' + (item.student_id || '-') + '</td>' +
                    '<td>' + (item.name || '-') + '</td>' +
                    '<td>' + (item.email || '-') + '</td>' +
                    '<td>' + (item.phone || '-') + '</td>' +
                    '<td>' + (item.username || '-') + '</td>' +
                    '<td>' + (item.role || '-') + '</td>' +
                    '<td>' +
                    '<button class="btn btn--primary" onclick="editUser(' + item.id + ')">แก้ไข</button> ' +
                    '<button class="btn btn--danger" onclick="deleteUser(' + item.id + ')">ลบ</button>' +
                    '</td>' +
                    '</tr>'
                );
            });
        },
        error: function (xhr) {
            $('#listdata').html('<tr><td colspan="7" class="text-muted">ไม่สามารถโหลดข้อมูลได้ กรุณาตรวจสอบ API หรือสิทธิ์การเข้าถึง</td></tr>');
        }
    });
}

function deleteUser(id) {
    Swal.fire({
        title: 'คุณต้องการลบผู้ใช้นี้หรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ลบ',
        cancelButtonText: 'ยกเลิก'
    }).then(function (result) {
        if (result.isConfirmed) {
            $.ajax({
                type: 'DELETE',
                url: api_url + 'api/admin/users/' + id,
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')
                },
                dataType: 'json',
                success: function (response) {
                    Swal.fire({
                        icon: 'success',
                        title: 'ลบผู้ใช้เรียบร้อย!',
                        text: response.message || 'ลบสำเร็จ'
                    });
                    getUsers();
                },
                error: function (xhr) {
                    Swal.fire({
                        icon: 'error',
                        title: 'การลบข้อมูลล้มเหลว',
                        text: (function () {
                            try {
                                var res = JSON.parse(xhr.responseText);
                                return res.message || xhr.responseText;
                            } catch (e) {
                                return xhr.responseText || 'เกิดข้อผิดพลาด';
                            }
                        })()
                    });
                }
            });
        }
    });
}
