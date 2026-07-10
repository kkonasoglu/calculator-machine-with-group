<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Klasöre attığın PHPMailer dosyalarını koda bağlıyoruz
require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Formdan gelen verileri alıyoruz
    $isim   = htmlspecialchars($_POST['isim']);
    $eposta = htmlspecialchars($_POST['eposta']);
    $mesaj  = htmlspecialchars($_POST['mesaj']);

    $mail = new PHPMailer(true);

    try {
        // --- Gmail SMTP Ayarları ---
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        
        // BURALARI KENDİ BİLGİLERİNLE DOLDUR:
        $mail->Username   = 'zengintalha2002@gmail.com'; // Kendi Gmail adresin
        $mail->Password   = 'frix qisq jikv imcy';     // Google'dan aldığın 16 haneli uygulama şifresi
        
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;
        $mail->CharSet    = 'UTF-8'; // Türkçe karakter sorunu olmasın diye

        // --- Alıcı Ayarları ---
        $mail->setFrom('zengintalha2002@gmail.com', 'Web Sitesi İletişim');
        $mail->addAddress('zengintalha2002@gmail.com'); // Mail kime gitsin istiyorsan o adres

        // --- Mail İçeriği ---
        $mail->isHTML(true);
        $mail->Subject = 'Yeni İletişim Mesajı';
        $mail->Body    = "
            <h3>Siteden Yeni Mesaj Geldi:</h3>
            <p><b>Ad:</b> {$isim}</p>
            <p><b>E-posta:</b> {$eposta}</p>
            <p><b>Mesaj:</b><br>{$mesaj}</p>
        ";

$mail->send();
        // ESKİ OKLU SCRIPT SATIRINI SİLİP SADECE BUNU YAZIYORUZ:
        echo "basarili"; 
        
    } catch (Exception $e) {
        echo "Hata: {$mail->ErrorInfo}";
    }
} else {
    echo "Gecersiz Istek";
}
?>