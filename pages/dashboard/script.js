$(document).ready(function () {
    if(sessionStorage.getItem("access_token") == null || sessionStorage.getItem("access_token") == undefined || sessionStorage.getItem("access_token") == '') {
        window.location.href = '../../pages/login/index.php';
    }
    getdata();
});

function getdata() {
    $.ajax({
        url: api_url + 'api/dashboard',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('access_token'),
        },
        dataType: 'json',
        success: function (response) {
            var data = response.summary;
            $('#total_chemicals').text(data.total);
            $('#normal_chemicals').text(data.normal);
            $('#expired_chemicals').text(data.expired);
            $('#borrowing_chemicals').text(data.borrowing);

            var html = '';
            $.each(response.latest_chemicals, function (index, item) {
                let hazardArr = [];
                try {
                    hazardArr = JSON.parse(item.hazard || "[]");
                } catch (e) {
                    hazardArr = [];
                }
                // Map hazard keys to label (same as index.php)
                const hazardLabels = {
                    'flammable': 'สารไวไฟ',
                    'oxidizer': 'สารออกซิไดซ์',
                    'corrosive': 'สารกัดกร่อน',
                    'explosive': 'วัตถุระเบิด',
                    'toxic': 'พิษเฉียบพลัน',
                    'environment': 'อันตรายต่อสิ่งแวดล้อม',
                    'health': 'อันตรายต่อสุขภาพ',
                    'reactive': 'ระเบิด / เกิดปฏิกิริยา'
                };
                let hazardHtml = hazardArr.map(h => `<span class="hazard-chip hazard-chip--table">${hazardLabels[h] || h}</span>`).join(' ');
                // status class
                let statusClass = '';
                switch (item.status) {
                    case 'normal': statusClass = 'chem-status--normal'; break;
                    case 'unused': statusClass = 'chem-status--unused'; break;
                    case 'expired_label': statusClass = 'chem-status--expired_label'; break;
                    case 'expired_condition': statusClass = 'chem-status--expired_condition'; break;
                    default: statusClass = '';
                }
                // map status label
                let statusLabel = '';
                switch (item.status) {
                    case 'normal': statusLabel = 'ปกติ'; break;
                    case 'unused': statusLabel = 'ไม่เหลือการใช้'; break;
                    case 'expired_label': statusLabel = 'หมดอายุตามฉลาก'; break;
                    case 'expired_condition': statusLabel = 'หมดอายุตามสภาพ'; break;
                    default: statusLabel = '';
                }
                html += `<tr>
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td>${item.volume}</td>
                    <td>${item.cas_no}</td>
                    <td>${item.location}</td>
                    <td><span class="chem-status ${statusClass}">${statusLabel}</span></td>
                    <td>${item.expired_at}</td>
                    <td>${hazardHtml}</td>
                </tr>`;
            });
            $('#listdata').html(html);
        },
        error: function (error) {
            console.log(error);
        }
    });
}