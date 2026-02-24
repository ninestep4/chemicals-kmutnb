<?php
declare(strict_types=1);

require_once __DIR__ . '/../../lib/withdrawals.php';
require_once __DIR__ . '/../../lib/chemicals.php';

$withdrawals = get_withdrawals();
$chemicals = [];
foreach (get_chemicals() as $chem) {
    $chemicals[$chem['id']] = $chem['name_th'] ?? '';
}

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="withdrawals-' . date('Ymd-His') . '.csv"');
header('Pragma: public');
header('Cache-Control: must-revalidate, post-check=0, pre-check=0');

$out = fopen('php://output', 'w');
if ($out === false) {
    exit;
}

// UTF-8 BOM เพื่อให้ Excel แสดงภาษาไทยถูกต้อง
fwrite($out, chr(0xEF) . chr(0xBB) . chr(0xBF));

fputcsv($out, ['ลำดับ', 'ชื่อสาร', 'ชื่อผู้ยืม', 'วันที่ยืม', 'วันที่คืน', 'วัตถุประสงค์'], ',');

foreach ($withdrawals as $index => $w) {
    $name = $chemicals[$w['chemical_id']] ?? '';
    fputcsv($out, [
        $index + 1,
        $name,
        $w['borrower_name'] ?? '',
        $w['borrow_date'] ?? '',
        $w['return_date'] ?? '',
        $w['purpose'] ?? '',
    ], ',');
}

fclose($out);
exit;

