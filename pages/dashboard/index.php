<?php
declare(strict_types=1);

$pageTitle = 'แดชบอร์ด';
$pageSubtitle = 'ภาพรวมระบบจัดการสารเคมี';

require_once __DIR__ . '/../../layouts/header.php';
?>

<section class="dashboard">
    <div class="dashboard-cards">
        <div class="dashboard-card dashboard-card__icon--purple">
            <div class="dashboard-card__label">สารทั้งหมด</div>
            <div class="dashboard-card__value" id="total_chemicals">0</div>
        </div>
        <div class="dashboard-card dashboard-card__icon--green">
            <div class="dashboard-card__label">สารปกติ</div>
            <div class="dashboard-card__value" id="normal_chemicals">0</div>
        </div>
        <div class="dashboard-card dashboard-card__icon--red">
            <div class="dashboard-card__label">หมดอายุ</div>
            <div class="dashboard-card__value" id="expired_chemicals">0</div>
        </div>
        <div class="dashboard-card dashboard-card__icon--orange">
            <div class="dashboard-card__label">กำลังยืม</div>
            <div class="dashboard-card__value" id="borrowing_chemicals">0</div>
        </div>

    </div>

    <div class="panel">
        <div class="panel__header">
            <div class="panel__title">สารที่เพิ่มล่าสุด(7 วันล่าสุด)</div>
        </div>
        <div class="table-wrap">
            <table class="chem-table">
                <thead>
                    <tr>
                        <th>ลำดับ</th>
                        <th>ชื่อสาร</th>
                        <th>ปริมาณ</th>
                        <th>CAS No.</th>
                        <th>ที่จัดเก็บ</th>
                        <th>สถานะ</th>
                        <th>วันหมดอายุ</th>
                        <th>ความอันตราย</th>    
                    </tr>
                </thead>
                <tbody id="listdata">
                    
                </tbody>
            </table>
        </div>
    </div>
</section>

<?php require_once __DIR__ . '/../../layouts/footer.php'; ?>
