<?php
declare(strict_types=1);

$pageTitle = 'รายละเอียดสาร';
$pageSubtitle = 'จัดการข้อมูลสารเคมีในห้องปฏิบัติการ';
$pageScript = 'pages/chemicals/script.js';

require_once __DIR__ . '/../../lib/chemicals.php';

// จัดการฟอร์มเพิ่มสารเคมี
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add') {
    add_chemical([
        'name_th' => $_POST['name_th'] ?? '',
        'volume' => $_POST['volume'] ?? '',
        'cas_no' => $_POST['cas_no'] ?? '',
        'location' => $_POST['location'] ?? '',
        'expiry_date' => $_POST['expiry_date'] ?? '',
        'status' => $_POST['status'] ?? 'normal',
        'hazards' => $_POST['hazards'] ?? [],
    ]);
    $redirect = (string) (isset($_SERVER['REQUEST_URI']) ? strtok($_SERVER['REQUEST_URI'], '?') : '');
    header('Location: ' . ($redirect ?: 'index.php') . '?added=1');
    exit;
}

$chemicals = get_chemicals();
$statusOptions = chemical_status_options();
$hazardOptions = chemical_hazard_options();
$added = isset($_GET['added']) && $_GET['added'] === '1';

require_once __DIR__ . '/../../layouts/header.php';
?>

<section class="chemicals-page">
    <div class="panel">
        <div class="panel__header">
            <div class="panel__title">รายการสารเคมี</div>
            <button type="button" class="btn btn--primary" id="btnAddChemical" aria-label="เพิ่มสารเคมี">
                + เพิ่มสารเคมี
            </button>
        </div>

        <?php if ($added): ?>
            <p class="msg msg--success" role="alert">บันทึกข้อมูลสารเคมีเรียบร้อยแล้ว</p>
        <?php endif; ?>

        
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
                    <tbody>
                        
                            <?php
                            // จำลองข้อมูลรายการสารเคมี 3 รายการ (mock)
                            $mockChemicals = [
                                [
                                    'name_th' => 'กรดไฮโดรคลอริก',
                                    'volume' => '500 mL',
                                    'cas_no' => '7647-01-0',
                                    'location' => 'ตู้ A ชั้น 1',
                                    'status' => 'normal',
                                    'expiry_date' => '2024-12-31',
                                    'hazards' => ['flame', 'corrosive']
                                ],
                                [
                                    'name_th' => 'โซเดียมคลอไรด์',
                                    'volume' => '250 g',
                                    'cas_no' => '7647-14-5',
                                    'location' => 'ตู้ B ชั้น 3',
                                    'status' => 'normal',
                                    'expiry_date' => '2027-06-15',
                                    'hazards' => []
                                ],
                                [
                                    'name_th' => 'แอมโมเนียมไนเตรต',
                                    'volume' => '1000 g',
                                    'cas_no' => '6484-52-2',
                                    'location' => 'ตู้ C ชั้น 2',
                                    'status' => 'expired',
                                    'expiry_date' => '2023-02-01',
                                    'hazards' => ['explosive', 'oxidizer']
                                ],
                            ];

                            foreach ($mockChemicals as $i => $c): ?>
                            <tr>
                                <td><?php echo (int) ($i + 1); ?></td>
                                <td><?php echo htmlspecialchars($c['name_th'] ?? ''); ?></td>
                                <td><?php echo htmlspecialchars($c['volume'] ?? ''); ?></td>
                                <td><?php echo htmlspecialchars($c['cas_no'] ?? ''); ?></td>
                                <td><?php echo htmlspecialchars($c['location'] ?? ''); ?></td>
                                <td>
                                    <span class="chem-status chem-status--<?php echo htmlspecialchars($c['status'] ?? 'normal'); ?>">
                                        <?php echo htmlspecialchars($statusOptions[$c['status'] ?? 'normal'] ?? $c['status']); ?>
                                    </span>
                                </td>
                                <td><?php echo htmlspecialchars($c['expiry_date'] ?? '-'); ?></td>
                                <td>
                                    <?php
                                    $hazards = $c['hazards'] ?? [];
                                    if (!is_array($hazards)) {
                                        $hazards = [];
                                    }
                                    $labels = [];
                                    foreach ($hazards as $code) {
                                        if (isset($hazardOptions[$code])) {
                                            $labels[] = $hazardOptions[$code];
                                        }
                                    }
                                    echo $labels ? htmlspecialchars(implode(', ', $labels)) : '-';
                                    ?>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        
                    </tbody>
                </table>
            </div>
     
    </div>
</section>

<!-- Modal เพิ่มสารเคมี -->
<div class="modal" id="modalAddChemical" role="dialog" aria-labelledby="modalAddChemicalTitle" aria-modal="true" hidden>
    <div class="modal__backdrop" id="modalAddChemicalBackdrop"></div>
    <div class="modal__box">
        <div class="modal__header">
            <h2 class="modal__title" id="modalAddChemicalTitle">เพิ่มข้อมูลสารเคมี</h2>
            <button type="button" class="modal__close" id="modalAddChemicalClose" aria-label="ปิด">×</button>
        </div>
        <form method="post" action="" class="modal__body chem-form">
            <input type="hidden" name="action" value="add">
            <div class="form-row">
                <div class="form-group">
                    <label for="chem-name_th">ชื่อสาร <span class="required">*</span></label>
                    <input type="text" id="chem-name_th" name="name_th" required class="form-input" placeholder="เช่น กรดไฮโดรคลอริก">
                </div>
                <div class="form-group">
                    <label for="chem-volume">ปริมาณ <span class="required">*</span></label>
                    <input type="text" id="chem-volume" name="volume" required class="form-input" placeholder="เช่น 500 mL">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="chem-cas_no">CAS No.</label>
                    <input type="text" id="chem-cas_no" name="cas_no" class="form-input" placeholder="เช่น 7732-18-5">
                </div>
                <div class="form-group">
                    <label for="chem-location">ที่จัดเก็บ <span class="required">*</span></label>
                    <input type="text" id="chem-location" name="location" required class="form-input" placeholder="เช่น ตู้ A ชั้น 2">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="chem-expiry_date">วันที่หมดอายุ</label>
                    <input type="date" id="chem-expiry_date" name="expiry_date" class="form-input">
                </div>
                <div class="form-group">
                    <label for="chem-status">สถานะ</label>
                    <select id="chem-status" name="status" class="form-input">
                        <?php foreach ($statusOptions as $value => $label): ?>
                            <option value="<?php echo htmlspecialchars($value); ?>"><?php echo htmlspecialchars($label); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group form-group--full">
                    <label>ความอันตรายของสาร (เลือกได้สูงสุด 4 ข้อ)</label>
                    <div class="hazard-grid" id="hazardGrid">
                        <?php foreach ($hazardOptions as $value => $label): ?>
                            <label class="hazard-chip">
                                <input type="checkbox" name="hazards[]" value="<?php echo htmlspecialchars($value); ?>">
                                <span class="hazard-chip__label"><?php echo htmlspecialchars($label); ?></span>
                            </label>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
            <div class="modal__footer">
                <button type="button" class="btn btn--secondary" id="btnCancelAdd">ยกเลิก</button>
                <button type="submit" class="btn btn--primary">บันทึก</button>
            </div>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/../../layouts/footer.php'; ?>
