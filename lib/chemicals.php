<?php
declare(strict_types=1);

/**
 * โหลดรายการสารเคมีจากไฟล์ JSON
 * @return array<int, array{
 *   id: string,
 *   name_th: string,
 *   volume: string,
 *   cas_no: string,
 *   location: string,
 *   expiry_date: string,
 *   status: string,
 *   hazards: array<int, string>,
 *   created_at: string
 * }>
 */
function get_chemicals(): array
{
    $path = dirname(__DIR__) . '/data/chemicals.json';
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
 * บันทึกรายการสารเคมีลงไฟล์ JSON
 * @param array<int, array<string, string>> $list
 */
function save_chemicals(array $list): bool
{
    $dir = dirname(__DIR__) . '/data';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    $path = $dir . '/chemicals.json';
    $json = json_encode($list, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    return $json !== false && file_put_contents($path, $json) !== false;
}

/**
 * เพิ่มสารเคมีใหม่และคืน id
 */
function add_chemical(array $input): string
{
    $list = get_chemicals();
    $maxId = 0;
    foreach ($list as $row) {
        $n = (int) ($row['id'] ?? 0);
        if ($n > $maxId) {
            $maxId = $n;
        }
    }
    $id = (string) ($maxId + 1);

    $allowedHazards = array_keys(chemical_hazard_options());
    $hazards = [];
    if (isset($input['hazards']) && is_array($input['hazards'])) {
        foreach ($input['hazards'] as $code) {
            $code = (string) $code;
            if (in_array($code, $allowedHazards, true) && !in_array($code, $hazards, true)) {
                $hazards[] = $code;
                if (count($hazards) >= 4) {
                    break;
                }
            }
        }
    }

    $row = [
        'id' => $id,
        'name_th' => trim((string) ($input['name_th'] ?? '')),
        'volume' => trim((string) ($input['volume'] ?? '')),
        'cas_no' => trim((string) ($input['cas_no'] ?? '')),
        'location' => trim((string) ($input['location'] ?? '')),
        'expiry_date' => trim((string) ($input['expiry_date'] ?? '')),
        'status' => trim((string) ($input['status'] ?? 'normal')),
        'hazards' => $hazards,
        'created_at' => date('Y-m-d H:i:s'),
    ];
    $list[] = $row;
    save_chemicals($list);
    return $id;
}

/**
 * สถานะที่ใช้ได้
 */
function chemical_status_options(): array
{
    return [
        'normal' => 'สารปกติ',
        'unused' => 'ไม่เหลือการใช้',
        'expired_label' => 'หมดอายุตามฉลาก',
        'expired' => 'หมดอายุตามสภาพ',
    ];
}

/**
 * ตัวเลือกความอันตรายของสาร
 * key ใช้เก็บในข้อมูล, value ใช้แสดงผล
 */
function chemical_hazard_options(): array
{
    return [
        'flammable' => 'สารไวไฟ',
        'oxidizer' => 'สารออกซิไดซ์',
        'corrosive' => 'สารกัดกร่อน',
        'explosive' => 'วัตถุระเบิด',
        'toxic' => 'พิษเฉียบพลัน',
        'environment' => 'อันตรายต่อสิ่งแวดล้อม',
        'health' => 'อันตรายต่อสุขภาพ',
        'reactive' => 'ระเบิด / เกิดปฏิกิริยา',
    ];
}
