<?php
/**
 * Mükellef Portal - İletişim Formu İşleyici
 * form action="form-handler.php" ile aynı klasörde olmalı.
 */

// Olası PHP uyarı/notice çıktılarının JSON'u bozmasını engellemek için:
// - Hataları ekrana değil log'a yaz
// - Çıktıyı tamponla, en sonda sadece temiz JSON'u gönder
ini_set('display_errors', '0');
error_reporting(E_ALL);
ob_start();

header('Content-Type: application/json; charset=utf-8');

// Sadece POST isteklerine izin ver
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    ob_clean();
    echo json_encode([
        'success' => false,
        'message' => 'Geçersiz istek yöntemi.'
    ]);
    exit;
}

// ---- Ayarlar ----
$alici_email = "info@mukellefportal.com"; // <-- Mesajların gideceği e-posta adresini buraya yazın
$site_adi    = "Mükellef Portal";

// ---- Basit bot/spam koruması (honeypot) ----
// Form içindeki gizli "website" alanı doluysa bot kabul edilir.
if (!empty($_POST['website'])) {
    ob_clean();
    echo json_encode([
        'success' => true,
        'message' => 'Mesajınız başarıyla gönderildi.'
    ]);
    exit;
}

// ---- Verileri al ve temizle ----
$ad_soyad = isset($_POST['customer_name']) ? trim($_POST['customer_name']) : '';
$email    = isset($_POST['customer_email']) ? trim($_POST['customer_email']) : '';
$mesaj    = isset($_POST['customer_message']) ? trim($_POST['customer_message']) : '';

// ---- Validasyon ----
$hatalar = [];

if ($ad_soyad === '' || mb_strlen($ad_soyad) < 2) {
    $hatalar[] = 'Lütfen geçerli bir ad soyad girin.';
}

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $hatalar[] = 'Lütfen geçerli bir e-posta adresi girin.';
}

if ($mesaj === '' || mb_strlen($mesaj) < 5) {
    $hatalar[] = 'Lütfen mesajınızı yazın.';
}

// E-posta header injection koruması (\r veya \n içeriyorsa reddet)
if (preg_match("/[\r\n]/", $ad_soyad) || preg_match("/[\r\n]/", $email)) {
    $hatalar[] = 'Geçersiz karakter tespit edildi.';
}

if (!empty($hatalar)) {
    ob_clean();
    echo json_encode([
        'success' => false,
        'message' => implode(' ', $hatalar)
    ]);
    exit;
}

// ---- Güvenli çıktı için HTML özel karakterlerini encode et ----
$ad_soyad_safe = htmlspecialchars($ad_soyad, ENT_QUOTES, 'UTF-8');
$email_safe    = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$mesaj_safe    = nl2br(htmlspecialchars($mesaj, ENT_QUOTES, 'UTF-8'));

// ---- Mail içeriği ----
$konu = "$site_adi - Yeni İletişim Formu Mesajı";

$icerik = "
<html>
<head><meta charset='utf-8'></head>
<body style='font-family: sans-serif; color: #1e293b;'>
    <h2>Yeni Bir İletişim Formu Mesajı Aldınız</h2>
    <p><strong>Ad Soyad:</strong> {$ad_soyad_safe}</p>
    <p><strong>E-posta:</strong> {$email_safe}</p>
    <p><strong>Mesaj:</strong><br>{$mesaj_safe}</p>
    <hr>
    <p style='font-size:12px;color:#94a3b8;'>Bu mesaj $site_adi web sitesindeki iletişim formundan gönderilmiştir.</p>
</body>
</html>
";

// ---- From adresi: sunucudaki gerçek domain kullanılır (SPF/DKIM uyuşmazlığını önlemek için) ----
// Not: no-reply@sunucudaki-alan-adiniz.com şeklinde, alıcı adresiyle AYNI domain'den gönderim
// çoğu sunucuda mail()'in false dönmesini engeller, çünkü sunucu kendi domain'i adına
// mail göndermeye yetkilidir.
$gonderen_domain = $_SERVER['HTTP_HOST'] ?? 'mukellefportal.com';
$gonderen_domain = preg_replace('/^www\./', '', $gonderen_domain); // www. varsa temizle
$gonderen_domain = explode(':', $gonderen_domain)[0]; // port varsa temizle

// ---- Mail başlıkları ----
$headers   = [];
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-type: text/html; charset=UTF-8";
$headers[] = "From: {$site_adi} <no-reply@{$gonderen_domain}>";
$headers[] = "Reply-To: {$email_safe}";
$headers[] = "X-Mailer: PHP/" . phpversion();

$headers_string = implode("\r\n", $headers);

// ---- Mail gönder (hata ayrıntısını yakala) ----
error_clear_last();
$gonderildi = mail($alici_email, $konu, $icerik, $headers_string);
$son_hata = error_get_last();

// Hata olsun ya da olmasın, teşhis için loglama yap (kendi sunucunda "form-handler.log" dosyasına bak)
$log_satiri = date('Y-m-d H:i:s') . " | Sonuç: " . ($gonderildi ? 'BAŞARILI' : 'BAŞARISIZ');
if (!$gonderildi && $son_hata) {
    $log_satiri .= " | PHP Hatası: " . $son_hata['message'];
}
$log_satiri .= " | Alıcı: {$alici_email} | Gönderen: no-reply@{$gonderen_domain}" . PHP_EOL;
@file_put_contents(__DIR__ . '/form-handler.log', $log_satiri, FILE_APPEND);

if ($gonderildi) {
    ob_clean();
    echo json_encode([
        'success' => true,
        'message' => 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.'
    ]);
} else {
    http_response_code(500);
    ob_clean();
    echo json_encode([
        'success' => false,
        'message' => 'Mesajınız gönderilirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin veya bizi telefonla arayın.'
    ]);
}
