<?php
declare(strict_types=1);

$pageTitle = 'รายการเบิกจ่าย';
$pageSubtitle = 'ยืม-คืนสารเคมี';
$pageScript = 'pages/withdrawals/script.js';

require_once __DIR__ . '/../../layouts/header.php';
?>

<section class="withdrawals-page">
    <h2 class="page-title">รายการเบิกจ่าย</h2>
    <p class="page-subtitle">ยืม-คืนสารเคมี</p>

    <div class="panel">
        <div class="panel__header">
            <div class="panel__title">ธุรกรรมยืม-คืน</div>
        </div>
        <div class="panel__empty">ยังไม่มีรายการยืม-คืน</div>
    </div>
</section>

<?php require_once __DIR__ . '/../../layouts/footer.php'; ?>
