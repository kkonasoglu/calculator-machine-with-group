<?php
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['basarili' => false, 'mesaj' => 'Geçersiz istek']);
    exit;
}

// Form alanları (index.html'deki isimlerle birebir aynı)
$isim   = htmlspecialchars(trim($_POST['customer_name'] ?? ''));
$email  = filter_var(trim($_POST['customer_email'] ?? ''), FILTER_VALIDATE_EMAIL);
$mesaj  = htmlspecialchars(trim($_POST['customer_message'] ?? ''));

if (!$isim || !$email || !$mesaj) {
    echo json_encode(['basarili' => false, 'mesaj' => 'Lütfen tüm alanları doldurun']);
    exit;
}

$mail = new PHPMailer(true);

try {
    // ---- SMTP AYARLARI (kendi bilgilerinle değiştir) ----
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';           // hosting SMTP'si veya gmail
    $mail->SMTPAuth   = true;
    $mail->Username   = 'zengintalha2002@gmail.com';      // gönderen hesap
    $mail->Password   = 'elcd qczm eola kbns';         // Gmail Uygulama Şifresi
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom('zengintalha2002@gmail.com', 'Mükellef Portal - İletişim Formu');
    $mail->addAddress('zengintalha2002@gmail.com'); // mesajların gideceği adres
    $mail->addReplyTo($email, $isim);

    $mail->isHTML(true);
    $mail->Subject = 'Mükellef Portal - Yeni İletişim Formu Mesajı';
    $mail->Body    = "<b>İsim:</b> $isim<br><b>E-posta:</b> $email<br><b>Mesaj:</b><br>" . nl2br($mesaj);
    $mail->AltBody = "İsim: $isim\nE-posta: $email\nMesaj:\n$mesaj";

    $mail->send();
    echo json_encode(['basarili' => true]);
} catch (Exception $e) {
    echo json_encode(['basarili' => false, 'mesaj' => $mail->ErrorInfo]);
}
