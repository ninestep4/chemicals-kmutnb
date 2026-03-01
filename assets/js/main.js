(function () {
    'use strict';

    var sidebar = document.getElementById('sidebar');
    var btnToggle = document.getElementById('btnToggleSidebar');
    var overlay = document.getElementById('sidebarOverlay');
    var topbarUser = document.getElementById('topbarUser');

    function openSidebar() {
        if (sidebar) sidebar.classList.add('is-open');
        if (btnToggle) btnToggle.setAttribute('aria-expanded', 'true');
        if (overlay) overlay.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        if (sidebar) sidebar.classList.remove('is-open');
        if (btnToggle) btnToggle.setAttribute('aria-expanded', 'false');
        if (overlay) overlay.classList.remove('is-visible');
        document.body.style.overflow = '';
    }

    function toggleSidebar() {
        if (sidebar && sidebar.classList.contains('is-open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }

    if (btnToggle) {
        btnToggle.addEventListener('click', toggleSidebar);
    }

    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            closeSidebar();
        }
    });

    if (topbarUser) {
        var goToProfile = function () {
            var profileUrl = topbarUser.getAttribute('data-profile-url');
            if (profileUrl) {
                window.location.href = profileUrl;
            }
        };

        topbarUser.addEventListener('click', goToProfile);
        topbarUser.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                goToProfile();
            }
        });
    }
})();

let api_url = 'https://api.9centuryhost.shop/';
$(document).ready(function () {
    $("#topbar-name").text(sessionStorage.getItem("user"));

    
});
