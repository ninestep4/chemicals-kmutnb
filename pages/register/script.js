$(document).ready(function () {

});

function submitForm(e) {
    // ตรวจสอบว่ารหัสผ่าน และ ยืนยันรหัสผ่านตรงกันหรือไม่
    // เอาค่าใน form ออกมาแสดง
    var formData = {
        student_id: $("#register-student_id").val(),
        name: $("#register-name").val(),
        email: $("#register-email").val(),
        phone: $("#register-phone").val(),
        username: $("#register-username").val(),
        password: $("#register-password").val(),
        password_confirmation: $("#register-password-confirm").val()
    };

    // ตรวจสอบว่าทุกฟิลด์ไม่ใช่ค่าว่าง
    for (const key in formData) {
        if (!formData[key] || (typeof formData[key] === "string" && formData[key].trim() === "")) {
            let labels = {
                student_id: "รหัสนักศึกษา",
                name: "ชื่อ-นามสกุล",
                email: "อีเมล",
                phone: "เบอร์โทรศัพท์",
                username: "ชื่อผู้ใช้",
                password: "รหัสผ่าน",
                password_confirmation: "ยืนยันรหัสผ่าน"
            };
            Swal.fire({
                icon: 'warning',
                title: 'แจ้งเตือน',
                text: `กรุณากรอก${labels[key]}`
            });
            $(`#register-${key.replace('_confirmation', '-confirm')}`).focus();
            return false;
        }
    }


    var password = $("#register-password").val();
    var passwordConfirm = $("#register-password-confirm").val();

    if (password !== passwordConfirm) {
        Swal.fire({
            icon: 'error',
            title: 'การสมัครสมาชิกล้มเหลว',
            text: "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน"
        });
        $("#register-password-confirm").focus();
        return false;
    }

    $.ajax({
        type: "POST",
        url: api_url + 'api/register',
        data: formData,
        dataType: "json",
        success: function (response) {
            console.log(response);
            if (response.success == true) {
                Swal.fire({
                    icon: 'success',
                    title: 'การสมัครสมาชิกสำเร็จ',
                    text: response.message
                });
            }
        },
        error: function (xhr, status, error) {
            // console.log(response.responseText);
            Swal.fire({
                icon: 'error',
                title: 'การสมัครสมาชิกล้มเหลว',
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