var usersCache = [];

$(document).ready(function () {
    if (sessionStorage.getItem('access_token') == null || sessionStorage.getItem('access_token') == undefined || sessionStorage.getItem('access_token') == '') {
        window.location.href = '../../pages/login/index.php';
        return;
    }

    getUsers();

    
    $('#btnSaveProfile').click(function (e) {
        e.preventDefault();
        var payload = {
            id: $('#pf-id').val().trim(),
            student_id: $('#pf-student_id').val().trim(),
            name: $('#pf-name').val().trim(),
            email: $('#pf-email').val().trim(),
            phone: $('#pf-phone').val().trim(),
            username: $('#pf-username').val().trim(),
        };

        var password = $('#pf-password').val();
        var passwordConfirm = $('#pf-password-confirm').val();

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

        if (!payload.student_id || !payload.name || !payload.email || !payload.username) {
            Swal.fire({
                icon: 'warning',
                title: 'ข้อมูลไม่ครบถ้วน',
                text: 'กรุณากรอกรหัสนักศึกษา, ชื่อ-นามสกุล, อีเมล และชื่อผู้ใช้'
            });
            return;
        }
        let id = $('#pf-id').val();

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
        url: api_url + 'api/user',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')
        },
        success: function (response) {
            var user = response;
            if (response && response.data) {
                user = response.data;
            }

            $('#pf-id').val(user.id || '');
            $('#pf-student_id').val(user.student_id || '');
            $('#pf-name').val(user.name || '');
            $('#pf-email').val(user.email || '');
            $('#pf-phone').val(user.phone || '');
            $('#pf-username').val(user.username || '');
        },
        error: function (xhr) {
            $('#listdata').html('<tr><td colspan="7" class="text-muted">ไม่สามารถโหลดข้อมูลได้ กรุณาตรวจสอบ API หรือสิทธิ์การเข้าถึง</td></tr>');
        }
    });
}

