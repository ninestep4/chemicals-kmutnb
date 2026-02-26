<?php
declare(strict_types=1);

$pageTitle = 'สมัครสมาชิก';

require_once __DIR__ . '/../../layouts/auth-header.php';
?>
<script src="script.js"></script>


        <h2 class="auth-panel__title">สมัครสมาชิก</h2>
        <p class="auth-panel__subtitle">สร้างบัญชีผู้ใช้ใหม่สำหรับระบบจัดการสารเคมี</p>

        
        <div class="auth-form__field">
                <label for="register-name">รหัสนักศึกษา</label>
                <input type="text" id="register-student_id" name="student_id" class="auth-input" autocomplete="student_id" required>
            </div>
            <div class="auth-form__field">
                <label for="register-name">ชื่อ-นามสกุล</label>
                <input type="text" id="register-name" name="name" class="auth-input" autocomplete="name" required>
            </div>

            <div class="auth-form__field">
                <label for="register-email">อีเมล (@kmutnb.ac.th เท่านั้น)</label>
                <input 
                    type="email" 
                    id="register-email" 
                    name="email" 
                    class="auth-input" 
                    autocomplete="email"
                    required
                    oninput="
                        if (this.validity.typeMismatch || !/^[a-zA-Z0-9._%+-]+@kmutnb\.ac\.th$/.test(this.value)) {
                            this.setCustomValidity('กรุณากรอกอีเมล @kmutnb.ac.th เท่านั้น');
                        } else {
                            this.setCustomValidity('');
                        }
                    "
                    pattern="^[a-zA-Z0-9._%+-]+@kmutnb\.ac\.th$"
                    title="กรุณากรอกอีเมล @kmutnb.ac.th เท่านั้น"
                    required    
                >
            </div>
            <div class="auth-form__field">
                <label for="register-name">เบอร์โทรศัพท์</label>
                <input type="number" id="register-phone" name="phone" class="auth-input" autocomplete="phone" maxlength="10" required>
            </div>

            <div class="auth-form__field">
                <label for="register-username">ชื่อผู้ใช้</label>
                <input type="text" id="register-username" name="username" class="auth-input" autocomplete="username" required>
            </div>

            <div class="auth-form__field">
                <label for="register-password">รหัสผ่าน</label>
                <input type="password" id="register-password" name="password" class="auth-input" autocomplete="new-password" required>
            </div>

            <div class="auth-form__field">
                <label for="register-password-confirm">ยืนยันรหัสผ่าน</label>
                <input type="password" id="register-password-confirm" name="password_confirmation" class="auth-input" autocomplete="new-password" required>
            </div>

            <button type="button" class="auth-submit" onclick="submitForm()">สมัครสมาชิก</button>

        <p class="auth-switch">
            มีบัญชีผู้ใช้อยู่แล้ว?
            <a href="<?php echo htmlspecialchars(url('pages/login/')); ?>" class="auth-link">เข้าสู่ระบบ</a>
        </p>

<?php
require_once __DIR__ . '/../../layouts/auth-footer.php';
?>

