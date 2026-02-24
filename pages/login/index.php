<?php
declare(strict_types=1);

$pageTitle = 'เข้าสู่ระบบ';

require_once __DIR__ . '/../../layouts/auth-header.php';
?>

        <h2 class="auth-panel__title">เข้าสู่ระบบ</h2>
        <p class="auth-panel__subtitle">ลงชื่อเข้าใช้งานระบบจัดการสารเคมี</p>

        <form class="auth-form" method="post" action="">
            <div class="auth-form__field">
                <label for="login-username">ชื่อผู้ใช้ หรืออีเมล</label>
                <input type="text" id="login-username" name="username" class="auth-input" autocomplete="username">
            </div>

            <div class="auth-form__field">
                <label for="login-password">รหัสผ่าน</label>
                <input type="password" id="login-password" name="password" class="auth-input" autocomplete="current-password">
            </div>

            <div class="auth-form__row">
                <label class="auth-checkbox">
                    <input type="checkbox" name="remember" value="1">
                    <span>จดจำการเข้าสู่ระบบ</span>
                </label>
                <a href="#" class="auth-link">ลืมรหัสผ่าน?</a>
            </div>

            <button type="button" class="auth-submit" onclick="window.location.href='<?php echo htmlspecialchars(url('pages/dashboard/')); ?>'">เข้าสู่ระบบ</button>
        </form>

        <p class="auth-switch">
            ยังไม่มีบัญชีผู้ใช้?
            <a href="<?php echo htmlspecialchars(url('pages/register/')); ?>" class="auth-link">สมัครสมาชิก</a>
        </p>

<?php
require_once __DIR__ . '/../../layouts/auth-footer.php';
?>

