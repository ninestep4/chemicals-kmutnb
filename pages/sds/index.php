<?php
declare(strict_types=1);

$pageTitle = 'SDS เอกสารความปลอดภัย';
$pageSubtitle = 'เอกสารข้อมูลความปลอดภัยของสารเคมี';
$pageScript = 'pages/sds/script.js';

require_once __DIR__ . '/../../layouts/header.php';
?>

<section class="sds-page">
    <h2 class="page-title">SDS เอกสารความปลอดภัย</h2>
    <p class="page-subtitle">เอกสารข้อมูลความปลอดภัยของสารเคมี</p>

    <div class="panel">
        <div class="panel__header">
            <div class="panel__title">รายการเอกสาร SDS</div>
        </div>
        <div class="panel__empty">ยังไม่มีเอกสาร SDS</div>
    </div>
</section>

<?php require_once __DIR__ . '/../../layouts/footer.php'; ?>
