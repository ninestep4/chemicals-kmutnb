(function () {
    'use strict';

    var modal = document.getElementById('modalAddWithdrawal');
    var btnOpen = document.getElementById('btnAddWithdrawal');
    var btnClose = document.getElementById('modalAddWithdrawalClose');
    var btnCancel = document.getElementById('btnCancelWithdrawal');
    var backdrop = document.getElementById('modalAddWithdrawalBackdrop');

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
})();
