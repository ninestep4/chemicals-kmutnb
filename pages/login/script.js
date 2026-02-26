$(document).ready(function () {
    sessionStorage.clear();
});

function login() {
    var username = $("#login-username").val();
    var password = $("#login-password").val();
    console.log(username, password);
    $.ajax({
        type: "POST",
        url: api_url + "api/login",
        data: { username: username, password: password },
        dataType: "json",
        success: function (response) {
            if (response.success == true) {
                sessionStorage.setItem("user", response.name);
                // ดึง access_token เฉพาะค่าหลัง | 
                if (response.access_token) {
                    const tokenParts = response.access_token.split('|');
                    if (tokenParts.length === 2) {
                        sessionStorage.setItem("access_token", tokenParts[1]);
                    }
                }
                window.location.href = "../dashboard/index.php";
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