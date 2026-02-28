var chemicalsCache = [];

$(document).ready(function () {
    if(sessionStorage.getItem("access_token") == null || sessionStorage.getItem("access_token") == undefined || sessionStorage.getItem("access_token") == '') {
        window.location.href = '../../pages/login/index.php';
    }
    getdata()

    var modal = document.getElementById('modalAddChemical');
    var btnOpen = document.getElementById('btnAddChemical');
    var btnClose = document.getElementById('modalAddChemicalClose');
    var btnCancel = document.getElementById('btnCancelAdd');
    var backdrop = document.getElementById('modalAddChemicalBackdrop');
    var hazardGrid = document.getElementById('hazardGrid');
    var modalEdit = document.getElementById('modalEditChemical');
    var btnEditClose = document.getElementById('modalEditChemicalClose');
    var btnEditCancel = document.getElementById('btnCancelEdit');
    var backdropEdit = document.getElementById('modalEditChemicalBackdrop');
    var hazardGridEdit = document.getElementById('hazardGridEdit');

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

    // จำกัดการเลือกความอันตรายไม่เกิน 4 ข้อ
    function bindHazardLimit(gridElement) {
        if (!gridElement) {
            return;
        }
        gridElement.addEventListener('change', function (event) {
            var checkboxes = gridElement.querySelectorAll('input[type="checkbox"]');
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
    bindHazardLimit(hazardGrid);
    bindHazardLimit(hazardGridEdit);


    $("#btnSubmitAdd").click(function (e) {
        e.preventDefault();
        var formData = {
            name: $("#chem-name_th").val(),
            amount: $("#chem-volume").val(),
            cas_no: $("#chem-cas_no").val(),
            location: $("#chem-location").val(),
            status: $("#chem-status").val(),
            expiry_date: $("#expired_at").val(),
            hazards: $("#hazardGrid").find('input[type="checkbox"]:checked').map(function() {
                return $(this).val();
            }).get(),
            sds_url: $("#chem-sds_url").val(),
        };

        console.log(formData);
        $.ajax({
            url: api_url + 'api/chemicals', // Check if this matches your action
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('access_token'),
            },
            data: JSON.stringify({
                name: formData.name,
                amount: formData.amount,
                cas_no: formData.cas_no,
                location: formData.location,
                status: formData.status,
                expired_at: formData.expiry_date,
                hazard: formData.hazards,
                sds_url: formData.sds_url,
            }),
            contentType: 'application/json; charset=utf-8',
            processData: false,
            dataType: 'json',
            success: function(response) {
                if(response.message == 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'บันทึกข้อมูลเรียบร้อย!',
                        text: response.message
                    });
                    closeModal();
                    $("#formAddChemical")[0].reset();
                    getdata();
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
    window.editChemical = function (id) {
        $("#ed-chem-id").val(id);
        var item = chemicalsCache.find(function (chemical) {
            return Number(chemical.id) === Number(id);
        });

        if (!item) {
            Swal.fire({
                icon: 'error',
                title: 'ไม่พบข้อมูล',
                text: 'ไม่สามารถโหลดข้อมูลสำหรับแก้ไขได้'
            });
            return;
        }

        $("#ed-chem-name_th").val(item.name || '');
        $("#ed-chem-volume").val(item.amount || '');
        $("#ed-chem-cas_no").val(item.cas_no || '');
        $("#ed-chem-location").val(item.location || '');
        $("#ed-chem-status").val(item.status || 'normal');
        $("#ed-expired_at").val(item.expired_at || '');
        $("#ed-chem-sds_url").val(item.sds_url || '');

        var selectedHazards = [];
        try {
            selectedHazards = JSON.parse(item.hazard || '[]');
            if (!Array.isArray(selectedHazards)) {
                selectedHazards = [];
            }
        } catch (e) {
            selectedHazards = [];
        }

        $("#hazardGridEdit input[type='checkbox']").each(function () {
            this.checked = selectedHazards.indexOf(this.value) !== -1;
        });

        openEditModal();
    };

    $('#btnSubmitEdit').click(function (e) { 
        e.preventDefault();
        var id = $("#ed-chem-id").val();
        console.log(id);
        var formData = {
            name: $("#ed-chem-name_th").val(),
            amount: $("#ed-chem-volume").val(),
            cas_no: $("#ed-chem-cas_no").val(),
            location: $("#ed-chem-location").val(),
            status: $("#ed-chem-status").val(),
            expiry_date: $("#ed-expired_at").val(),
            hazard: $("#hazardGridEdit").find('input[type="checkbox"]:checked').map(function() {
                return $(this).val();
            }).get(),
            sds_url: $("#ed-chem-sds_url").val(),
        };
        console.log(formData);
        $.ajax({
            url: api_url + 'api/chemicals/' + id,
            type: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('access_token'),
            },
            data: JSON.stringify(formData),
            contentType: 'application/json; charset=utf-8',
            processData: false,
            dataType: 'json',
            success: function (response) {
                if(response.message == 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'แก้ไขข้อมูลเรียบร้อย!',
                        text: response.message
                    });
                    closeEditModal();
                    getdata();
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
        
    });
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
                chemicalsCache = Array.isArray(data) ? data : [];
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
                            case 'expired_label': statusClass = 'chem-status--expired_label'; break;
                            case 'expired_condition': statusClass = 'chem-status--expired_condition'; break;
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


function deleteChemical(id) {
    Swal.fire({
        title: 'คุณต้องการลบข้อมูลสารเคมีนี้หรือไม่?',
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
                url: api_url + 'api/chemicals/' + id,
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('access_token'),
                },
                dataType: "json",
                success: function (response) {
                    if (response.message == "Chemical deleted successfully") {
                        Swal.fire({
                            icon: 'success',
                            title: 'ลบข้อมูลเรียบร้อย!',
                            text: response.message
                        });
                        getdata();
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


  

    
