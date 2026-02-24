(function () {
    'use strict';

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
        hazardGrid.addEventListener('change', function () {
            var checkboxes = hazardGrid.querySelectorAll('input[type=\"checkbox\"]');
            var checked = Array.prototype.filter.call(checkboxes, function (el) {
                return el.checked;
            });
            if (checked.length > 4) {
                // ยกเลิกตัวที่เพิ่งคลิก
                var target = event.target;
                if (target && target.type === 'checkbox') {
                    target.checked = false;
                }
                alert('เลือกความอันตรายได้สูงสุด 4 ข้อ');
            }
        });
    }
})();
