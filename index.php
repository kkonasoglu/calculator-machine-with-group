<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $isim   = htmlspecialchars($_POST['isim']);
    $eposta = htmlspecialchars($_POST['eposta']);
    $mesaj  = htmlspecialchars($_POST['mesaj']);

    $mail = new PHPMailer(true);

    try {
        // --- Gmail SMTP Ayarları ---
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'zengintalha2002@gmail.com'; 
        $mail->Password   = 'frixqisqjikvimcy'; 
        
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;
        $mail->CharSet    = 'UTF-8';

        // --- Alıcı Ayarları ---
        $mail->setFrom('zengintalha2002@gmail.com', 'Mükellef Portal İletişim');
        $mail->addAddress('zengintalha2002@gmail.com'); 

        // --- Mail İçeriği ---
        $mail->isHTML(true);
        $mail->Subject = 'Yeni Portal Mesaji';
        $mail->Body    = "
            <h3>Siteden Yeni Mesaj Geldi:</h3>
            <p><b>Ad:</b> {$isim}</p>
            <p><b>E-posta:</b> {$eposta}</p>
            <p><b>Mesaj:</b><br>{$mesaj}</p>
        ";

        $mail->send();
        // BURASI ÇOK KRİTİK: JS dosyan tam olarak bu kelimeyi bekliyor!
        echo "basarili"; 
    } catch (Exception $e) {
        echo "Hata: {$mail->ErrorInfo}";
    }
} else {
    echo "Gecersiz Istek";
}
?>