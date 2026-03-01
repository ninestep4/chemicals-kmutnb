var profileSourceEndpoint = '';
var profileFallbackEndpoint = '';

$(document).ready(function () {
    var token = sessionStorage.getItem('access_token');
    if (!token) {
        window.location.href = '../login/index.php';
        return;
    }

    $('#btnSaveProfile').on('click', function () {
        saveProfile();
    });

    $('#btnCancelProfile').on('click', function () {
        loadProfile();
    });

    loadProfile();
});

function authHeaders() {
    return {
        Authorization: 'Bearer ' + sessionStorage.getItem('access_token'),
    };
}

function getProfileEndpoints() {
    var userId = sessionStorage.getItem('user_id');
    var endpoints = [];

    if (userId) {
        endpoints.push(api_url + 'api/users/' + userId);
        endpoints.push(api_url + 'api/user/' + userId);
    }
    endpoints.push(api_url + 'api/profile');
    endpoints.push(api_url + 'api/users/me');

    return endpoints.filter(function (value, index, self) {
        return self.indexOf(value) === index;
    });
}

function extractProfile(raw) {
    var candidateList = [
        raw && raw.data && raw.data.user,
        raw && raw.data,
        raw && raw.user,
        raw,
    ];

    for (var i = 0; i < candidateList.length; i += 1) {
        var item = candidateList[i];
        if (item && typeof item === 'object' && (item.name || item.username || item.email)) {
            return item;
        }
    }
    return null;
}

function populateProfile(profile) {
    $('#pf-student_id').val(profile.student_id || '');
    $('#pf-name').val(profile.name || '');
    $('#pf-email').val(profile.email || '');
    $('#pf-phone').val(profile.phone || '');
    $('#pf-username').val(profile.username || '');
    $('#pf-password').val('');
    $('#pf-password-confirm').val('');
}

function loadProfile() {
    var endpoints = getProfileEndpoints();
    profileFallbackEndpoint = endpoints.length > 0 ? endpoints[0] : '';

    function attempt(index) {
        if (index >= endpoints.length) {
            $('#pf-name').val(sessionStorage.getItem('user') || '');
            Swal.fire({
                icon: 'warning',
                title: 'ไม่สามารถโหลดข้อมูลผู้ใช้',
                text: 'กรุณาตรวจสอบสิทธิ์หรือ API สำหรับข้อมูลผู้ใช้งาน',
            });
            return;
        }

        $.ajax({
            url: endpoints[index],
            type: 'GET',
            headers: authHeaders(),
            dataType: 'json',
            success: function (response) {
                var profile = extractProfile(response);
                if (!profile) {
                    attempt(index + 1);
                    return;
                }
                profileSourceEndpoint = endpoints[index];
                populateProfile(profile);
            },
            error: function () {
                attempt(index + 1);
            },
        });
    }

    attempt(0);
}

function saveProfile() {
    var payload = {
        student_id: $('#pf-student_id').val().trim(),
        name: $('#pf-name').val().trim(),
        email: $('#pf-email').val().trim(),
        phone: $('#pf-phone').val().trim(),
        username: $('#pf-username').val().trim(),
    };
    var password = $('#pf-password').val();
    var passwordConfirm = $('#pf-password-confirm').val();

    if (!payload.name || !payload.email || !payload.username) {
        Swal.fire({
            icon: 'warning',
            title: 'ข้อมูลไม่ครบถ้วน',
            text: 'กรุณากรอกชื่อ-นามสกุล, อีเมล และชื่อผู้ใช้',
        });
        return;
    }

    if (password || passwordConfirm) {
        if (password !== passwordConfirm) {
            Swal.fire({
                icon: 'error',
                title: 'รหัสผ่านไม่ตรงกัน',
                text: 'กรุณาตรวจสอบรหัสผ่านใหม่อีกครั้ง',
            });
            return;
        }
        payload.password = password;
        payload.password_confirmation = passwordConfirm;
    }

    var endpoints = [];
    if (profileSourceEndpoint) {
        endpoints.push(profileSourceEndpoint);
    }
    if (profileFallbackEndpoint) {
        endpoints.push(profileFallbackEndpoint);
    }
    getProfileEndpoints().forEach(function (endpoint) {
        if (endpoints.indexOf(endpoint) === -1) {
            endpoints.push(endpoint);
        }
    });

    var requestPlan = [];
    endpoints.forEach(function (endpoint) {
        requestPlan.push({ method: 'PUT', endpoint: endpoint });
        requestPlan.push({ method: 'PATCH', endpoint: endpoint });
    });

    function trySave(planIndex) {
        if (planIndex >= requestPlan.length) {
            Swal.fire({
                icon: 'error',
                title: 'บันทึกไม่สำเร็จ',
                text: 'ไม่พบ API แก้ไขผู้ใช้งานที่รองรับในระบบ',
            });
            return;
        }

        $.ajax({
            url: requestPlan[planIndex].endpoint,
            type: requestPlan[planIndex].method,
            headers: authHeaders(),
            data: JSON.stringify(payload),
            contentType: 'application/json; charset=utf-8',
            processData: false,
            dataType: 'json',
            success: function (response) {
                sessionStorage.setItem('user', payload.name);
                $('#topbar-name').text(payload.name);

                Swal.fire({
                    icon: 'success',
                    title: 'บันทึกข้อมูลเรียบร้อย',
                    text:
                        (response && response.message) ||
                        (response && response.data && response.data.message) ||
                        'แก้ไขข้อมูลผู้ใช้งานสำเร็จ',
                });
                profileSourceEndpoint = requestPlan[planIndex].endpoint;
                $('#pf-password').val('');
                $('#pf-password-confirm').val('');
            },
            error: function () {
                trySave(planIndex + 1);
            },
        });
    }

    trySave(0);
}
