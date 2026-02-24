<?php
declare(strict_types=1);

$pageTitle = 'ประเมินความเสี่ยง';
$pageSubtitle = 'ประเมินความเสี่ยงจากการใช้สารเคมี';
$pageScript = 'pages/risk/script.js';

require_once __DIR__ . '/../../layouts/header.php';
?>

<section class="risk-page">
    <h2 class="page-title">ประเมินความเสี่ยง</h2>
    <p class="page-subtitle">ประเมินความเสี่ยงจากการใช้สารเคมี</p>

    <div class="panel">
        <div class="panel__header">
            <div class="panel__title">รายการประเมินความเสี่ยง</div>
        </div>
        <div class="panel__empty">ยังไม่มีรายการประเมินความเสี่ยง</div>
    </div>
</section>

<?php require_once __DIR__ . '/../../layouts/footer.php'; ?>
