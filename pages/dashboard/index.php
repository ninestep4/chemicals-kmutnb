<?php
declare(strict_types=1);

$pageTitle = 'แดชบอร์ด';
$pageSubtitle = 'ภาพรวมระบบจัดการสารเคมี';
$pageScript = 'pages/dashboard/script.js';

require_once __DIR__ . '/../../layouts/header.php';
?>

<section class="dashboard">
    <div class="dashboard-cards">
        <div class="dashboard-card">
            <div class="dashboard-card__icon dashboard-card__icon--purple" aria-hidden="true"></div>
            <div class="dashboard-card__label">สารทั้งหมด</div>
            <div class="dashboard-card__value">0</div>
            <div class="dashboard-card__badge">ยังไม่มีข้อมูล</div>
        </div>
        <div class="dashboard-card">
            <div class="dashboard-card__icon dashboard-card__icon--green" aria-hidden="true"></div>
            <div class="dashboard-card__label">สารปกติ</div>
            <div class="dashboard-card__value">0</div>
            <div class="dashboard-card__badge">0 รายการปัจจุบัน</div>
        </div>
        <div class="dashboard-card">
            <div class="dashboard-card__icon dashboard-card__icon--red" aria-hidden="true"></div>
            <div class="dashboard-card__label">หมดอายุ</div>
            <div class="dashboard-card__value">0</div>
            <div class="dashboard-card__badge">ไม่มีสารหมดอายุ</div>
        </div>
        <div class="dashboard-card">
            <div class="dashboard-card__icon dashboard-card__icon--orange" aria-hidden="true"></div>
            <div class="dashboard-card__label">กำลังยืม</div>
            <div class="dashboard-card__value">0</div>
            <div class="dashboard-card__badge">ยังไม่มีรายการยืม</div>
        </div>
        <div class="dashboard-card">
            <div class="dashboard-card__icon dashboard-card__icon--yellow" aria-hidden="true"></div>
            <div class="dashboard-card__label">กำลังคืน</div>
            <div class="dashboard-card__value">0</div>
            <div class="dashboard-card__badge">ยังไม่มีรายการคืน</div>
        </div>
    </div>

    <div class="panel">
        <div class="panel__header">
            <div class="panel__title">สารที่เพิ่มล่าสุด</div>
        </div>
        <div class="panel__empty">ยังไม่มีข้อมูลสาร</div>
    </div>
</section>

<?php require_once __DIR__ . '/../../layouts/footer.php'; ?>
