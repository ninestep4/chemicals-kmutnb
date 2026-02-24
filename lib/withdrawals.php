<?php
declare(strict_types=1);

/**
 * โหลดรายการยืม-คืนจากไฟล์ JSON
 * @return array<int, array{
 *   id: string,
 *   chemical_id: string,
 *   borrower_name: string,
 *   borrow_date: string,
 *   return_date: string,
 *   purpose: string,
 *   created_at: string
 * }>
 */
function get_withdrawals(): array
{
    $path = dirname(__DIR__) . '/data/withdrawals.json';
    if (!is_file($path)) {
        return [];
    }
    $raw = file_get_contents($path);
    if ($raw === false) {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

/**
 * บันทึกรายการยืม-คืนลงไฟล์ JSON
 * @param array<int, array<string, mixed>> $list
 */
function save_withdrawals(array $list): bool
{
    $dir = dirname(__DIR__) . '/data';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    $path = $dir . '/withdrawals.json';
    $json = json_encode($list, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    return $json !== false && file_put_contents($path, $json) !== false;
}

/**
 * เพิ่มรายการยืมสาร
 */
function add_withdrawal(array $input): string
{
    $list = get_withdrawals();
    $maxId = 0;
    foreach ($list as $row) {
        $n = (int) ($row['id'] ?? 0);
        if ($n > $maxId) {
            $maxId = $n;
        }
    }
    $id = (string) ($maxId + 1);

    $row = [
        'id' => $id,
        'chemical_id' => trim((string) ($input['chemical_id'] ?? '')),
        'borrower_name' => trim((string) ($input['borrower_name'] ?? '')),
        'borrow_date' => trim((string) ($input['borrow_date'] ?? '')),
        'return_date' => trim((string) ($input['return_date'] ?? '')),
        'purpose' => trim((string) ($input['purpose'] ?? '')),
        'created_at' => date('Y-m-d H:i:s'),
    ];

    $list[] = $row;
    save_withdrawals($list);
    return $id;
}

