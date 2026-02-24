<?php
declare(strict_types=1);

/**
 * คืนค่า web base path ของโปรเจกต์
 * (เช่น /chemicals-kmutnb เมื่อโปรเจกต์อยู่ใน C:/xampp/htdocs/chemicals-kmutnb)
 */
if (!function_exists('base_path')) {
    function base_path(): string
    {
        static $path = null;

        if ($path === null) {
            $projectRoot = realpath(__DIR__ . '/..'); // โฟลเดอร์โปรเจกต์จริงบนดิสก์
            $docRoot     = $_SERVER['DOCUMENT_ROOT'] ?? '';

            $projectRoot = $projectRoot ? str_replace('\\', '/', $projectRoot) : '';
            $docRoot     = str_replace('\\', '/', rtrim($docRoot, '/'));

            // แปลง path จริงให้เป็น path บนเว็บ
            if ($projectRoot && $docRoot && strpos($projectRoot, $docRoot) === 0) {
                $webPath = substr($projectRoot, strlen($docRoot));
                $path    = rtrim($webPath, '/');
            } else {
                // fallback: รันจาก root document
                $path = '';
            }
        }

        return $path;
    }
}

if (!function_exists('asset')) {
    function asset(string $path): string
    {
        $base = base_path();
        return ($base === '' ? '' : $base) . '/' . ltrim($path, '/');
    }
}

if (!function_exists('url')) {
    function url(string $path): string
    {
        $base = base_path();
        return ($base === '' ? '' : $base) . '/' . ltrim($path, '/');
    }
}

if (!function_exists('is_active')) {
    function is_active(string $segment): bool
    {
        $script = $_SERVER['SCRIPT_NAME'] ?? '';
        return strpos($script, $segment) !== false;
    }
}
