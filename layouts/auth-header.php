<?php
declare(strict_types=1);
require_once __DIR__ . '/_helpers.php';

$pageTitle = $pageTitle ?? 'เข้าสู่ระบบ';
?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php echo htmlspecialchars($pageTitle); ?> - ระบบจัดการสารเคมี</title>
    <link rel="stylesheet" href="<?php echo htmlspecialchars(asset('assets/css/main.css')); ?>">
</head>
<body class="auth-body">
<div class="auth-shell">
    <div class="auth-illustration">
        <div class="auth-illustration__badge">Chemicals Management</div>
        <h1 class="auth-illustration__title">ระบบจัดการสารเคมี</h1>
        <p class="auth-illustration__subtitle">
            จัดเก็บข้อมูลสารเคมี ประวัติการเบิกจ่าย และเอกสารความปลอดภัย
            ในที่เดียวสำหรับห้องปฏิบัติการของคุณ
        </p>
        <ul class="auth-illustration__list">
            <li>ติดตามสถานะสารเคมีแบบ real-time</li>
            <li>รองรับ SDS และการประเมินความเสี่ยง</li>
            <li>ออกแบบสำหรับหลายขนาดหน้าจอ</li>
        </ul>
    </div>

    <div class="auth-panel">
        <div class="auth-panel__inner">
