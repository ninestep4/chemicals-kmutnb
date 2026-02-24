<?php
declare(strict_types=1);

$pageTitle = 'รายละเอียดสาร';
$pageSubtitle = 'จัดการข้อมูลสารเคมีในห้องปฏิบัติการ';
$pageScript = 'pages/chemicals/script.js';

require_once __DIR__ . '/../../layouts/header.php';
?>

<section class="chemicals-page">
    <h2 class="page-title">รายละเอียดสาร</h2>
    <p class="page-subtitle">จัดการข้อมูลสารเคมีในห้องปฏิบัติการ</p>

    <div class="panel">
        <div class="panel__header">
            <div class="panel__title">รายการสารเคมี</div>
        </div>
        <div class="panel__empty">ยังไม่มีข้อมูลสารเคมี</div>
    </div>
</section>

<?php require_once __DIR__ . '/../../layouts/footer.php'; ?>
