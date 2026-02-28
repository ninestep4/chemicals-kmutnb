<?php
declare(strict_types=1);

$pageTitle = 'รายการเบิกจ่าย';
$pageSubtitle = 'ยืม-คืนสารเคมี';

require_once __DIR__ . '/../../layouts/header.php';
?>

<section class="withdrawals-page">

    <div class="panel">
        <div class="panel__header">
            <div class="panel__title">ธุรกรรมยืม-คืน</div>
            <div class="panel__actions">
                <!-- เปลี่ยนปุ่ม Excel เป็น client-side export -->
                <button type="button" class="btn btn--secondary" id="btnExportExcel">Export to Excel</button>
                <button type="button" class="btn btn--primary" id="btnAddWithdrawal">+ เพิ่มการยืมสาร</button>
            </div>
        </div>

        <div class="table-wrap">
            <table class="chem-table" id="withdrawals-table">
                <thead>
                    <tr>
                        <th>ลำดับ</th>
                        <th>ชื่อสาร</th>
                        <th>ชื่อผู้ยืม</th>
                        <th>วันที่ยืม</th>
                        <th>วันที่คืน</th>
                        <th>วัตถุประสงค์</th>
                        <th>จัดการ</th>
                    </tr>
                </thead>
                <tbody id="listdata">

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
        <div class="modal__body chem-form">
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
                <button type="submit" class="btn btn--primary" id="btnSubmitAddWithdrawal">บันทึก</button>
            </div>
        </div>
    </div>
</div>


<!-- Modal แก้ไขการยืมสาร -->
<div class="modal" id="modalEditWithdrawal" role="dialog" aria-labelledby="modalEditWithdrawalTitle" aria-modal="true" hidden>
    <div class="modal__backdrop" id="modalEditWithdrawalBackdrop"></div>
    <div class="modal__box">
        <div class="modal__header">
            <h2 class="modal__title" id="modalEditWithdrawalTitle">แก้ไขการยืมสาร</h2>
            <button type="button" class="modal__close" id="modalEditWithdrawalClose" aria-label="ปิด">×</button>
        </div>
        <div method="post" id="formEditWithdrawal" class="modal__body chem-form">
            <input type="hidden" name="action" value="edit">
            <input type="hidden" id="ed-withdrawal-id" name="id" value="">
            <div class="form-row">
                <div class="form-group form-group--full">
                    <label for="wd-chemical_id">เลือกสาร <span class="required">*</span></label>
                    <select id="ed-chemical_id" name="chemical_id" class="form-input" required>
                        <option value="">-- เลือกสาร --</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="wd-borrow_date">วันที่ยืม <span class="required">*</span></label>
                    <input type="date" id="ed-borrow_date" name="borrow_date" class="form-input" required value="<?php echo date('Y-m-d'); ?>">
                </div>
                <div class="form-group">
                    <label for="wd-return_date">วันที่คืน</label>
                    <input type="date" id="ed-return_date" name="return_date" class="form-input">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group form-group--full">
                    <label for="wd-purpose">วัตถุประสงค์ <span class="required">*</span></label>
                    <textarea id="ed-purpose" name="purpose" class="form-input" rows="3" placeholder="ยืมเพื่อ..." required></textarea>
                </div>
            </div>
            <div class="modal__footer">
                <button type="button" class="btn btn--secondary" id="btnCancelEditWithdrawal">ยกเลิก</button>
                <button type="submit" class="btn btn--primary" id="btnSubmitEditWithdrawal">บันทึก</button>
            </div>
        </div>
    </div>
</div>

<!-- สคริปต์สำหรับ Export Excel (client-side) -->
<!-- xlsx library สำหรับ export เป็น excel -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script>
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('btnExportExcel').addEventListener('click', function () {
        var table = document.getElementById('withdrawals-table');
        var rows = table.querySelectorAll('tbody tr');

        // ถ้าไม่มีข้อมูล
        if (rows.length === 0) {
            alert('ไม่พบข้อมูลสำหรับ Export');
            return;
        }

        // เตรียมหัวตาราง (6 คอลัมน์แรก)
        var ws_data = [];
        var header = [];
        table.querySelectorAll('thead th').forEach(function (th, i) {
            if (i < 6) header.push(th.innerText || "");
        });
        ws_data.push(header);

        // เตรียมแถวข้อมูล (6 คอลัมน์แรก)
        rows.forEach(function (row) {
            var tds = row.querySelectorAll('td');
            var rowData = [];
            for (var i = 0; i < 6; i++) {
                rowData.push(tds[i] ? tds[i].innerText : "");
            }
            ws_data.push(rowData);
        });

        // สร้าง worksheet & workbook
        var ws = XLSX.utils.aoa_to_sheet(ws_data);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Withdrawals");

        // ตั้งชื่อไฟล์
        var today = new Date();
        var fileName = 'withdrawals_' 
            + today.getFullYear().toString().padStart(4, '0')
            + ('0' + (today.getMonth()+1)).slice(-2)
            + ('0' + today.getDate()).slice(-2)
            + '.xlsx';

        XLSX.writeFile(wb, fileName);
    });
});
</script>

<?php require_once __DIR__ . '/../../layouts/footer.php'; ?>
