<?php
declare(strict_types=1);
require_once __DIR__ . '/_helpers.php';

$pageTitle = $pageTitle ?? 'แดชบอร์ด';
$pageSubtitle = $pageSubtitle ?? 'ภาพรวมระบบจัดการสารเคมี';
$base = base_path();
?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php echo htmlspecialchars($pageTitle); ?> - ระบบจัดการสารเคมี</title>
    <link rel="stylesheet" href="<?php echo htmlspecialchars(asset('assets/css/main.css')); ?>">
</head>
<body>
<div class="app">
    <div class="overlay" id="sidebarOverlay" aria-hidden="true"></div>
    <aside class="sidebar" id="sidebar">
        <div class="sidebar__brand">
            <div class="sidebar__logo" aria-hidden="true"></div>
            <div class="sidebar__title">
                <span>ระบบจัดการสารเคมี</span>
                <small>ห้องปฏิบัติการ</small>
            </div>
        </div>

        <nav class="sidebar__nav">
            <div class="sidebar__section-label">เมนูหลัก</div>
            <a href="<?php echo htmlspecialchars(url('pages/dashboard/')); ?>" class="sidebar__item <?php echo is_active('pages/dashboard') ? 'sidebar__item--active' : ''; ?>">
                <span class="sidebar__icon sidebar__icon--dashboard" aria-hidden="true"></span>
                <span>แดชบอร์ด</span>
            </a>
            <a href="<?php echo htmlspecialchars(url('pages/chemicals/')); ?>" class="sidebar__item <?php echo is_active('pages/chemicals') ? 'sidebar__item--active' : ''; ?>">
                <span class="sidebar__icon sidebar__icon--chemicals" aria-hidden="true"></span>
                <span>สารเคมี</span>
            </a>
            <a href="<?php echo htmlspecialchars(url('pages/withdrawals/')); ?>" class="sidebar__item <?php echo is_active('pages/withdrawals') ? 'sidebar__item--active' : ''; ?>">
                <span class="sidebar__icon sidebar__icon--withdrawals" aria-hidden="true"></span>
                <span>รายการเบิกจ่าย</span>
            </a>
            <a href="<?php echo htmlspecialchars(url('pages/sds/')); ?>" class="sidebar__item <?php echo is_active('pages/sds') ? 'sidebar__item--active' : ''; ?>">
                <span class="sidebar__icon sidebar__icon--sds" aria-hidden="true"></span>
                <span>SDS เอกสารความปลอดภัย</span>
            </a>
            <a href="<?php echo htmlspecialchars(url('pages/risk/')); ?>" class="sidebar__item <?php echo is_active('pages/risk') ? 'sidebar__item--active' : ''; ?>">
                <span class="sidebar__icon sidebar__icon--risk" aria-hidden="true"></span>
                <span>ประเมินความเสี่ยง</span>
            </a>

            <div class="sidebar__section-label">สถานะสารเคมี</div>
            <a href="<?php echo htmlspecialchars(url('pages/chemicals/?status=normal')); ?>" class="sidebar__item">
                <span class="sidebar__status-dot sidebar__status-dot--green" aria-hidden="true"></span>
                <span>สารปกติ</span>
            </a>
            <a href="<?php echo htmlspecialchars(url('pages/chemicals/?status=unused')); ?>" class="sidebar__item">
                <span class="sidebar__status-dot sidebar__status-dot--gray" aria-hidden="true"></span>
                <span>ไม่เหลือการใช้</span>
            </a>
            <a href="<?php echo htmlspecialchars(url('pages/chemicals/?status=expired-label')); ?>" class="sidebar__item">
                <span class="sidebar__status-dot sidebar__status-dot--orange" aria-hidden="true"></span>
                <span>หมดอายุทดลอง</span>
            </a>
            <a href="<?php echo htmlspecialchars(url('pages/chemicals/?status=expired')); ?>" class="sidebar__item">
                <span class="sidebar__status-dot sidebar__status-dot--red" aria-hidden="true"></span>
                <span>หมดอายุจริง</span>
            </a>

            <div class="sidebar__bottom">
                <a href="<?php echo htmlspecialchars(url('pages/login/')); ?>" class="sidebar__item">
                    <span class="sidebar__icon sidebar__icon--settings" aria-hidden="true"></span>
                    <span>ตั้งค่า / ออกจากระบบ</span>
                </a>
            </div>
        </nav>
    </aside>

    <div class="main">
        <header class="topbar">
            <div class="topbar__title">
                <h1><?php echo htmlspecialchars($pageTitle); ?></h1>
                <p><?php echo htmlspecialchars($pageSubtitle); ?></p>
            </div>

            <div class="topbar__right">
                <form class="topbar__search" action="<?php echo htmlspecialchars(url('pages/chemicals/')); ?>" method="get" role="search">
                    <input type="search" name="q" placeholder="ค้นหาสาร..." aria-label="ค้นหาสารเคมี" />
                </form>
                <div class="topbar__user">
                    <span class="topbar__user-avatar" aria-hidden="true">P</span>
                    <span class="topbar__user-name">ผู้ดูแลระบบ</span>
                </div>
                <button type="button" class="topbar__menu-btn" id="btnToggleSidebar" aria-label="เปิด/ปิดเมนู" aria-expanded="false">
                    <span class="topbar__menu-btn-icon" aria-hidden="true"></span>
                </button>
            </div>
        </header>

        <main class="content">
