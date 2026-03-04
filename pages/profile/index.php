<?php
declare(strict_types=1);

$pageTitle = 'แก้ไขผู้ใช้งาน';
$pageSubtitle = 'จัดการข้อมูลส่วนตัวของผู้ใช้งาน';

require_once __DIR__ . '/../../layouts/header.php';
?>

<section class="profile-page">
    <div class="panel">
        <div class="panel__header">
            <div class="panel__title">ข้อมูลผู้ใช้งาน</div>
        </div>

        <div class="chem-form" id="profileForm">
            <div class="form-row">
                <div class="form-group">
                    <label for="pf-student_id">รหัสนักศึกษา</label>
                    <input type="text" id="pf-student_id" class="form-input" placeholder="รหัสนักศึกษา">
                </div>
                <div class="form-group">
                    <label for="pf-name">ชื่อ-นามสกุล <span class="required">*</span></label>
                    <input type="text" id="pf-name" class="form-input" placeholder="ชื่อ-นามสกุล" required>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="pf-email">อีเมล <span class="required">*</span></label>
                    <input type="email" id="pf-email" class="form-input" placeholder="example@email.kmutnb.ac.th" required>
                </div>
                <div class="form-group">
                    <label for="pf-phone">เบอร์โทรศัพท์</label>
                    <input type="text" id="pf-phone" class="form-input" placeholder="เช่น 0812345678">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="pf-username">ชื่อผู้ใช้ <span class="required">*</span></label>
                    <input type="text" id="pf-username" class="form-input" placeholder="ชื่อผู้ใช้" required>
                </div>
                <div class="form-group"></div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="pf-password">รหัสผ่านใหม่</label>
                    <input type="password" id="pf-password" class="form-input" placeholder="เว้นว่างหากไม่เปลี่ยน" autocomplete="off">
                </div>
                <div class="form-group">
                    <label for="pf-password-confirm">ยืนยันรหัสผ่านใหม่</label>
                    <input type="password" id="pf-password-confirm" class="form-input" placeholder="กรอกรหัสผ่านใหม่อีกครั้ง">
                </div>
            </div>

            <div class="modal__footer">
                <input type="hidden" id="pf-id" name="id" value="">
                <!-- <button type="button" class="btn btn--secondary" id="btnCancelProfile">รีเซ็ต</button> -->
                <button type="button" class="btn btn--primary" id="btnSaveProfile">บันทึกข้อมูล</button>
            </div>
        </div>
    </div>
</section>

<?php require_once __DIR__ . '/../../layouts/footer.php'; ?>
