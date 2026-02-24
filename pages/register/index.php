<?php
declare(strict_types=1);

$pageTitle = 'สมัครสมาชิก';

require_once __DIR__ . '/../../layouts/auth-header.php';
?>

        <h2 class="auth-panel__title">สมัครสมาชิก</h2>
        <p class="auth-panel__subtitle">สร้างบัญชีผู้ใช้ใหม่สำหรับระบบจัดการสารเคมี</p>

        <form class="auth-form" method="post" action="">
            <div class="auth-form__field">
                <label for="register-name">ชื่อ-นามสกุล</label>
                <input type="text" id="register-name" name="name" class="auth-input" autocomplete="name">
            </div>

            <div class="auth-form__field">
                <label for="register-email">อีเมล</label>
                <input type="email" id="register-email" name="email" class="auth-input" autocomplete="email">
            </div>

            <div class="auth-form__field">
                <label for="register-username">ชื่อผู้ใช้</label>
                <input type="text" id="register-username" name="username" class="auth-input" autocomplete="username">
            </div>

            <div class="auth-form__field">
                <label for="register-password">รหัสผ่าน</label>
                <input type="password" id="register-password" name="password" class="auth-input" autocomplete="new-password">
            </div>

            <div class="auth-form__field">
                <label for="register-password-confirm">ยืนยันรหัสผ่าน</label>
                <input type="password" id="register-password-confirm" name="password_confirmation" class="auth-input" autocomplete="new-password">
            </div>

            <button type="submit" class="auth-submit">สมัครสมาชิก</button>
        </form>

        <p class="auth-switch">
            มีบัญชีผู้ใช้อยู่แล้ว?
            <a href="<?php echo htmlspecialchars(url('pages/login/')); ?>" class="auth-link">เข้าสู่ระบบ</a>
        </p>

<?php
require_once __DIR__ . '/../../layouts/auth-footer.php';
?>

