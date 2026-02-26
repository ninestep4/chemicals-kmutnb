<?php
declare(strict_types=1);

$pageTitle = 'รายละเอียดสาร';
$pageSubtitle = 'จัดการข้อมูลสารเคมีในห้องปฏิบัติการ';
// $pageScript = 'pages/chemicals/script.js';
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
                            <th>SDS</th>
                            <th>จัดการ</th>
                        </tr>
                    </thead>
                    <tbody id="listdata">
                        
                          
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>
                                    <span class="chem-status chem-status--">
                                   
                                    </span>
                                </td>
                                <td></td>
                                <td>
                                
                                </td>
                            </tr>
                           
                        
                    </tbody>
                </table>
            </div>
     
    </div>
</section>

<!-- Modal เพิ่มสารเคมี -->
<div class="modal" id="modalAddChemical" role="dialog" aria-labelledby="modalAddChemicalTitle" aria-modal="true" hidden>
    <div class="modal__backdrop" id=""></div>
    <div class="modal__box">
        <div class="modal__header">
            <h2 class="modal__title" id="modalAddChemicalTitle">เพิ่มข้อมูลสารเคมี</h2>
            <button type="button" class="modal__close" id="modalAddChemicalClose" aria-label="ปิด">×</button>
        </div>
        <form id="formAddChemical"  class="modal__body chem-form">
            <input type="hidden" name="action" value="add">
            <div class="form-row">
                <div class="form-group">
                    <label for="chem-name">ชื่อสาร <span class="required">*</span></label>
                    <input type="text" id="chem-name_th" name="name" required class="form-input" placeholder="เช่น กรดไฮโดรคลอริก">
                </div>
                <div class="form-group">
                    <label for="chem-amount">ปริมาณ <span class="required">*</span></label>
                    <input type="text" id="chem-volume" name="amount" required class="form-input" placeholder="เช่น 500 mL">
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
                    <input type="date" id="expired_at" name="expiry_date" class="form-input">
                </div>
                <div class="form-group">
                    <label for="chem-status">สถานะ</label>
                    <select id="chem-status" name="status" class="form-input">
                        <option value="normal">สารปกติ</option>
                        <option value="unused">ไม่เหลือการใช้</option>
                        <option value="expired_label">หมดอายุตามฉลาก</option>
                        <option value="expired_condition">หมดอายุตามสภาพ</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group form-group--full">
                    <label for="chem-sds_url">URL SDS</label>
                    <input type="text" id="chem-sds_url" name="sds_url" class="form-input" placeholder="เช่น https://sds.com">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group form-group--full">
                    <label>ความอันตรายของสาร (เลือกได้สูงสุด 4 ข้อ)</label>
                    <div class="hazard-grid" id="hazardGrid">
                        
                            <?php
                                // Define hazard labels (matching chemicals.php @ lines 113-120)
                                $hazardLabels = [
                                    'flammable'   => 'สารไวไฟ',
                                    'oxidizer'    => 'สารออกซิไดซ์',
                                    'corrosive'   => 'สารกัดกร่อน',
                                    'explosive'   => 'วัตถุระเบิด',
                                    'toxic'       => 'พิษเฉียบพลัน',
                                    'environment' => 'อันตรายต่อสิ่งแวดล้อม',
                                    'health'      => 'อันตรายต่อสุขภาพ',
                                    'reactive'    => 'ระเบิด / เกิดปฏิกิริยา'
                                ];

                                foreach ($hazardLabels as $hazard => $label) {
                            ?>
                                <label class="hazard-chip">
                                    <input type="checkbox" name="hazards[]" value="<?= htmlspecialchars($hazard) ?>">
                                    <span class="hazard-chip__label"><?= htmlspecialchars($label) ?></span>
                                </label>
                            <?php } ?>
                      
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
