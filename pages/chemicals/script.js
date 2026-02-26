$(document).ready(function () {
    getdata()

    var modal = document.getElementById('modalAddChemical');
    var btnOpen = document.getElementById('btnAddChemical');
    var btnClose = document.getElementById('modalAddChemicalClose');
    var btnCancel = document.getElementById('btnCancelAdd');
    var backdrop = document.getElementById('modalAddChemicalBackdrop');
    var hazardGrid = document.getElementById('hazardGrid');

    function openModal() {
        if (modal) modal.removeAttribute('hidden');
    }

    function closeModal() {
        if (modal) modal.setAttribute('hidden', 'hidden');
    }

    if (btnOpen) btnOpen.addEventListener('click', openModal);
    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnCancel) btnCancel.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    // จำกัดการเลือกความอันตรายไม่เกิน 4 ข้อ
    if (hazardGrid) {
        hazardGrid.addEventListener('change', function (event) {
            var checkboxes = hazardGrid.querySelectorAll('input[type="checkbox"]');
            var checked = Array.prototype.filter.call(checkboxes, function (el) {
                return el.checked;
            });
            if (checked.length > 4) {
                // ยกเลิกตัวที่เพิ่งคลิก
                var target = event.target;
                if (target && target.type === 'checkbox') {
                    target.checked = false;
                }
                swal.fire({
                    icon: 'warning',
                    title: 'แจ้งเตือน',
                    text: 'เลือกความอันตรายได้สูงสุด 4 ข้อ'
                });
            }
        });
    }
});

function getdata(){
    $.ajax({
        url: api_url + 'api/chemicals',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('access_token'),
        },
        success: function(response) {
            
                var data = response;
                var $list = $("#listdata");
                $list.empty();

                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(function (item, idx) {
                        // Convert hazard string to readable labels
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
                            case 'expired_label': statusClass = 'chem-status--expired-label'; break;
                            case 'expired_condition': statusClass = 'chem-status--expired-condition'; break;
                            default: statusClass = '';
                        }

                        // Expiry date format
                        let expiredAt = item.expired_at ? item.expired_at : '';

                        $list.append(`
                            <tr>
                                <td>${idx + 1}</td>
                                <td>${item.name ? $('<div>').text(item.name).html() : ''}</td>
                                <td>${item.amount ? $('<div>').text(item.amount).html() : ''}</td>
                                <td>${item.cas_no ? $('<div>').text(item.cas_no).html() : ''}</td>
                                <td>${item.location ? $('<div>').text(item.location).html() : ''}</td>
                                <td>
                                    <span class="chem-status ${statusClass}">
                                        ${(() => {
                                            switch (item.status) {
                                                case 'normal': return 'ปกติ';
                                                case 'unused': return 'ไม่เหลือการใช้';
                                                case 'expired_label': return 'หมดอายุตามฉลาก';
                                                case 'expired_condition': return 'หมดอายุตามสภาพ';
                                                default: return '';
                                            }
                                        })()}
                                    </span>
                                </td>
                                <td>${expiredAt}</td>
                                <td>${hazardHtml}</td>
                                <td><i class="fa fa-info-circle" aria-hidden="true"></i> <a href="${item.sds_url}" target="_blank">SDS</a></td>
                                <td>
                                    <button class="btn btn--primary" onclick="editChemical(${item.id})">แก้ไข</button>
                                    <button class="btn btn--danger" onclick="deleteChemical(${item.id})">ลบ</button>
                                </td>
                            </tr>
                        `);
                    });
              
            }
        }
    });
}


    $("#formAddChemical").submit(function (event) {
        // 1. Prevent the page from refreshing immediately
        event.preventDefault(); 
        
        // 2. Create FormData object
        var formData = new FormData(this);
            // console.log("Form Data Object:", Object.fromEntries(formData.entries()));
            //const selectedHazards = formData.getAll('hazards[]');
            // console.log("Selected Hazards:", selectedHazards);

        $.ajax({
            url: api_url + 'api/chemicals', // Check if this matches your action
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('access_token'),
            },
            data: JSON.stringify({
                name: formData.get('name'),
                amount: formData.get('amount'),
                cas_no: formData.get('cas_no'),
                location: formData.get('location'),
                status: formData.get('status'),
                expired_at: formData.get('expiry_date'),
                hazard: formData.getAll('hazards[]'),
                sds_url: formData.get('sds_url'),
            }),
            contentType: 'application/json; charset=utf-8',
            processData: false,
            dataType: 'json',
            success: function(response) {
                if(response.success == true) {
                    Swal.fire({
                        icon: 'success',
                        title: 'บันทึกข้อมูลเรียบร้อย!',
                        text: response.message
                    });
                    closeModal();
                    $("#formAddChemical")[0].reset();
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
        });
        
    });

    
