<?php
declare(strict_types=1);

$pageTitle = 'จัดการผู้ใช้งาน';
$pageSubtitle = 'จัดการข้อมูลผู้ใช้ในระบบ';

require_once __DIR__ . '/../../layouts/header.php';
?>

<section class="users-page">
    <div class="panel">
        <div class="panel__header">
            <div class="panel__title">รายการผู้ใช้งาน</div>
            <!-- <button type="button" class="btn btn--primary" id="btnAddUser" aria-label="เพิ่มผู้ใช้">
                <i class="fas fa-user-plus"></i> เพิ่มผู้ใช้
            </button> -->
        </div>

        <div class="table-wrap">
            <table class="chem-table">
                <thead>
                    <tr>
                        <th>ลำดับ</th>
                        <th>รหัสนักศึกษา</th>
                        <th>ชื่อ-นามสกุล</th>
                        <th>อีเมล</th>
                        <th>เบอร์โทร</th>
                        <th>ชื่อผู้ใช้</th>
                        <th>สิทธิ์</th>
                        <th>จัดการ</th>
                    </tr>
                </thead>
                <tbody id="listdata">
                    <tr>
                        <td colspan="8" class="text-muted">กำลังโหลด...</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</section>

<!-- Modal เพิ่มผู้ใช้ -->
<!-- <div class="modal" id="modalAddUser" role="dialog" aria-labelledby="modalAddUserTitle" aria-modal="true" hidden>
    <div class="modal__backdrop" id="modalAddUserBackdrop"></div>
    <div class="modal__box">
        <div class="modal__header">
            <h2 class="modal__title" id="modalAddUserTitle">เพิ่มผู้ใช้งาน</h2>
            <button type="button" class="modal__close" id="modalAddUserClose" aria-label="ปิด">×</button>
        </div>
        <div id="formAddUser" class="modal__body chem-form">
            <div class="form-row">
                <div class="form-group">
                    <label for="add-student_id">รหัสนักศึกษา</label>
                    <input type="text" id="add-student_id" name="student_id" class="form-input" placeholder="รหัสนักศึกษา">
                </div>
                <div class="form-group">
                    <label for="add-name">ชื่อ-นามสกุล <span class="required">*</span></label>
                    <input type="text" id="add-name" name="name" required class="form-input" placeholder="ชื่อ-นามสกุล">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="add-email">อีเมล <span class="required">*</span></label>
                    <input type="email" id="add-email" name="email" required class="form-input" placeholder="example@email.kmutnb.ac.th">
                </div>
                <div class="form-group">
                    <label for="add-phone">เบอร์โทรศัพท์</label>
                    <input type="text" id="add-phone" name="phone" class="form-input" placeholder="0812345678">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="add-username">ชื่อผู้ใช้ <span class="required">*</span></label>
                    <input type="text" id="add-username" name="username" required class="form-input" placeholder="ชื่อผู้ใช้">
                </div>
                <div class="form-group">
                    <label for="add-password">รหัสผ่าน <span class="required">*</span></label>
                    <input type="password" id="add-password" name="password" required class="form-input" placeholder="รหัสผ่าน">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group form-group--full">
                    <label for="add-password_confirmation">ยืนยันรหัสผ่าน <span class="required">*</span></label>
                    <input type="password" id="add-password_confirmation" name="password_confirmation" required class="form-input" placeholder="ยืนยันรหัสผ่าน">
                </div>
            </div>
            <div class="modal__footer">
                <button type="button" class="btn btn--secondary" id="btnCancelAdd">ยกเลิก</button>
                <button type="button" class="btn btn--primary" id="btnSubmitAdd">บันทึก</button>
            </div>
        </div>
    </div>
</div> -->

<!-- Modal แก้ไขผู้ใช้ -->
<div class="modal" id="modalEditUser" role="dialog" aria-labelledby="modalEditUserTitle" aria-modal="true" hidden>
    <div class="modal__backdrop" id="modalEditUserBackdrop"></div>
    <div class="modal__box">
        <div class="modal__header">
            <h2 class="modal__title" id="modalEditUserTitle">แก้ไขผู้ใช้งาน</h2>
            <button type="button" class="modal__close" id="modalEditUserClose" aria-label="ปิด">×</button>
        </div>
        <div id="formEditUser" class="modal__body chem-form">
            <input type="hidden" id="ed-user-id" name="id" value="">
            <div class="form-row">
                <div class="form-group">
                    <label for="ed-student_id">รหัสนักศึกษา</label>
                    <input type="text" id="ed-student_id" name="student_id" class="form-input" placeholder="รหัสนักศึกษา">
                </div>
                <div class="form-group">
                    <label for="ed-name">ชื่อ-นามสกุล <span class="required">*</span></label>
                    <input type="text" id="ed-name" name="name" required class="form-input" placeholder="ชื่อ-นามสกุล">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="ed-email">อีเมล <span class="required">*</span></label>
                    <input type="email" id="ed-email" name="email" required class="form-input" placeholder="example@email.kmutnb.ac.th">
                </div>
                <div class="form-group">
                    <label for="ed-phone">เบอร์โทรศัพท์</label>
                    <input type="text" id="ed-phone" name="phone" class="form-input" placeholder="0812345678">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="ed-username">ชื่อผู้ใช้ <span class="required">*</span></label>
                    <input type="text" id="ed-username" name="username" required class="form-input" placeholder="ชื่อผู้ใช้">
                </div>
                <div class="form-group">
                    <label for="ed-role">สิทธิ์</label>
                    <select id="ed-role" name="role" class="form-input">
                        <option value="admin">ผู้ดูแลระบบ</option>
                        <option value="user">ผู้ใช้งาน</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
            <div class="form-group">
                    <label for="ed-password">รหัสผ่านใหม่</label>
                    <input type="password" id="ed-password" name="password" class="form-input" placeholder="เว้นว่างหากไม่เปลี่ยน">
                </div>
                <div class="form-group">
                    <label for="ed-password_confirmation">ยืนยันรหัสผ่านใหม่</label>
                    <input type="password" id="ed-password_confirmation" name="password_confirmation" class="form-input" placeholder="กรอกเมื่อต้องการเปลี่ยนรหัสผ่าน">
                </div>
            </div>
            <div class="modal__footer">
                <button type="button" class="btn btn--secondary" id="btnCancelEdit">ยกเลิก</button>
                <button type="button" class="btn btn--primary" id="btnSubmitEdit">บันทึก</button>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../../layouts/footer.php'; ?>
