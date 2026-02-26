<?php
declare(strict_types=1);


if (!function_exists('base_path')) {
    function base_path(): string
    {
        return '/chemicals-kmutnb';
    }
}

if (!function_exists('asset')) {
    function asset(string $path): string
    {
        return base_path() . '/' . ltrim($path, '/');
    }
}

if (!function_exists('url')) {
    function url(string $path): string
    {
        return base_path() . '/' . ltrim($path, '/');
    }
}

if (!function_exists('is_active')) {
    function is_active(string $segment): bool
    {
        $script = $_SERVER['SCRIPT_NAME'] ?? '';
        return strpos($script, $segment) !== false;
    }
}