<?php
declare(strict_types=1);

$pageTitle = 'รายการเบิกจ่าย';
$pageSubtitle = 'ยืม-คืนสารเคมี';
$pageScript = 'pages/withdrawals/script.js';

require_once __DIR__ . '/../../lib/chemicals.php';
require_once __DIR__ . '/../../lib/withdrawals.php';

// รับฟอร์มเพิ่มการยืมสาร
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add') {
    add_withdrawal([
        'chemical_id' => $_POST['chemical_id'] ?? '',
        'borrower_name' => $_POST['borrower_name'] ?? '',
        'borrow_date' => $_POST['borrow_date'] ?? '',
        'return_date' => $_POST['return_date'] ?? '',
        'purpose' => $_POST['purpose'] ?? '',
    ]);

    $redirect = (string) (isset($_SERVER['REQUEST_URI']) ? strtok($_SERVER['REQUEST_URI'], '?') : '');
    header('Location: ' . ($redirect ?: 'index.php') . '?added=1');
    exit;
}

$chemicals = get_chemicals();
$chemOptions = [];
foreach ($chemicals as $chem) {
    $chemOptions[$chem['id']] = $chem['name_th'] ?? '';
}

$withdrawals = get_withdrawals();
$added = isset($_GET['added']) && $_GET['added'] === '1';

require_once __DIR__ . '/../../layouts/header.php';
?>

<section class="withdrawals-page">
    <h2 class="page-title">รายการเบิกจ่าย</h2>
    <p class="page-subtitle">ยืม-คืนสารเคมี</p>

    <div class="panel">
        <div class="panel__header">
            <div class="panel__title">ธุรกรรมยืม-คืน</div>
            <div class="panel__actions">
                <a href="<?php echo htmlspecialchars(url('pages/withdrawals/export.php')); ?>" class="btn btn--secondary">Export to Excel</a>
                <button type="button" class="btn btn--primary" id="btnAddWithdrawal">+ เพิ่มการยืมสาร</button>
            </div>
        </div>

            <div class="table-wrap">
                <table class="chem-table">
                    <thead>
                        <tr>
                            <th>ลำดับ</th>
                            <th>ชื่อสาร</th>
                            <th>ชื่อผู้ยืม</th>
                            <th>วันที่ยืม</th>
                            <th>วันที่คืน</th>
                            <th>วัตถุประสงค์</th>
                        </tr>
                    </thead>
                    <tbody>
                       
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                      
                    </tbody>
                </table>
            </div>
       
    </div>
</section>

<!-- Modal บันทึกการยืมสาร -->
<div class="modal" id="modalAddWithdrawal" role="dialog" aria-labelledby="modalAddWithdrawalTitle" aria-modal="true" hidden>
    <div class="modal__backdrop" id="modalAddWithdrawalBackdrop"></div>
    <div class="modal__box">
        <div class="modal__header">
            <h2 class="modal__title" id="modalAddWithdrawalTitle">บันทึกการยืมสาร</h2>
            <button type="button" class="modal__close" id="modalAddWithdrawalClose" aria-label="ปิด">×</button>
        </div>
        <form method="post" action="" class="modal__body chem-form">
            <input type="hidden" name="action" value="add">
            <div class="form-row">
                <div class="form-group form-group--full">
                    <label for="wd-chemical_id">เลือกสาร <span class="required">*</span></label>
                    <select id="wd-chemical_id" name="chemical_id" class="form-input" required>
                        <option value="">-- เลือกสาร --</option>
                        
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="wd-borrow_date">วันที่ยืม <span class="required">*</span></label>
                    <input type="date" id="wd-borrow_date" name="borrow_date" class="form-input" required value="<?php echo date('Y-m-d'); ?>">
                </div>
                <div class="form-group">
                    <label for="wd-return_date">วันที่คืน</label>
                    <input type="date" id="wd-return_date" name="return_date" class="form-input">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group form-group--full">
                    <label for="wd-purpose">วัตถุประสงค์ <span class="required">*</span></label>
                    <textarea id="wd-purpose" name="purpose" class="form-input" rows="3" placeholder="ยืมเพื่อ..." required></textarea>
                </div>
            </div>
            <div class="modal__footer">
                <button type="button" class="btn btn--secondary" id="btnCancelWithdrawal">ยกเลิก</button>
                <button type="submit" class="btn btn--primary">บันทึก</button>
            </div>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/../../layouts/footer.php'; ?>
