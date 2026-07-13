document.addEventListener("DOMContentLoaded", () => {

    // --- 1. Theme Toggle (Karanlık/Aydınlık Tema) ---
    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    if (themeToggleBtn) {
        const themeIcon = themeToggleBtn.querySelector('i');
        // LocalStorage kontrolü
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            htmlElement.setAttribute('data-theme', 'dark');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        }

        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                htmlElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
            } else {
                htmlElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                }
            }
        });
    }

    // --- 2. Sticky Header ---
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- 3. Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navbar = document.getElementById('navbar');

    if (mobileMenuBtn && navbar) {
        const menuIcon = mobileMenuBtn.querySelector('i');
        mobileMenuBtn.addEventListener('click', () => {
            navbar.classList.toggle('active');
            if (menuIcon) {
                if (navbar.classList.contains('active')) {
                    menuIcon.classList.remove('fa-bars');
                    menuIcon.classList.add('fa-xmark');
                } else {
                    menuIcon.classList.remove('fa-xmark');
                    menuIcon.classList.add('fa-bars');
                }
            }
        });
    }

    // --- 4. Mobile Dropdown Toggle ---
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        if (link) {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });

    // --- 5. Scroll Animations ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => {
            scrollObserver.observe(el);
        });
    }

    // --- 6. Advanced 12-Item Testimonial Slider (KORUMALI) ---
    const track = document.getElementById('sliderTrack');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const cards = document.querySelectorAll('.testimonial-card');
    const dotsContainer = document.getElementById('sliderDots');

    let currentIndex = 0;
    let maxIndex = 0;

    function getCardsPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 992) return 2;
        return 4;
    }

    function generateDots() {
        // ÇÖZÜM: Eğer bu sayfada slider dots alanı yoksa fonksiyonu güvenle kır, çökme!
        if (!dotsContainer || cards.length === 0) return;
        
        dotsContainer.innerHTML = '';
        const cardsPerView = getCardsPerView();
        maxIndex = cards.length - cardsPerView;

        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === currentIndex) dot.classList.add('active');

            dot.addEventListener('click', () => {
                currentIndex = i;
                updateSlider();
            });

            dotsContainer.appendChild(dot);
        }
    }

    function updateSlider() {
        // ÇÖZÜM: Eğer slider bileşenleri sayfada yoksa işlem yapma
        if (!track || cards.length === 0 || !dotsContainer) return;

        const cardsPerView = getCardsPerView();
        maxIndex = cards.length - cardsPerView;

        if (currentIndex > maxIndex) currentIndex = maxIndex;
        if (currentIndex < 0) currentIndex = 0;

        const cardWidth = cards[0].offsetWidth;
        const gap = 30;

        track.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;

        const allDots = dotsContainer.querySelectorAll('.dot');
        allDots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateSlider();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            dropdowns.forEach(dd => dd.classList.remove('active'));
        }
        generateDots();
        updateSlider();
    });

    // Sadece slider elemanları varsa tetikle
    if (track && dotsContainer) {
        generateDots();
        updateSlider();
    }
});

// ==========================================
// --- 7. PHPMAILER İLETİŞİM FORMU (BAĞIMSIZ BLOK) ---
// ==========================================
(function() {
    try {
        window.addEventListener('DOMContentLoaded', () => {
            const formElement = document.getElementById('mukellef-iletisim-formu');

            if (formElement) {
                formElement.addEventListener('submit', function (event) {
                    event.preventDefault();

                    const submitBtn = document.getElementById('form-submit-btn');
                    const originalBtnText = submitBtn ? submitBtn.innerText : "Gönder";

                    if (submitBtn) {
                        submitBtn.innerText = "Gönderiliyor...";
                        submitBtn.disabled = true;
                        submitBtn.style.opacity = "0.7";
                    }

                    const formData = new FormData(formElement);

                    fetch('send-mail.php', {
                        method: 'POST',
                        body: formData
                    })
                        .then(response => response.json())
                        .then(sonuc => {
                            if (sonuc.basarili) {
                                alert('Mesajınız başarıyla iletildi! En kısa sürede dönüş yapacağız.');
                                formElement.reset();
                            } else {
                                console.error('PHPMailer Hatası:', sonuc.mesaj);
                                alert('Mesaj gönderilirken bir sorun oluştu: ' + sonuc.mesaj);
                            }
                        })
                        .catch((error) => {
                            console.error('Bağlantı Hatası:', error);
                            alert('Mesaj gönderilirken bir sorun oluştu.');
                        })
                        .finally(() => {
                            if (submitBtn) {
                                submitBtn.innerText = originalBtnText;
                                submitBtn.disabled = false;
                                submitBtn.style.opacity = "1";
                            }
                        });
                });
            }
        });
    } catch (e) {
        console.error("İletişim formu başlatma koruması devrede:", e);
    }

    // --- 8. ScrollSpy (Sayfa Kaydırıldıkça Navigasyonun Güncellenmesi) ---
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        let current = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Yukarıdaki yapışkan (sticky) header'ın yüksekliğini hesaba katmak için
            // 100px civarı bir pay (offset) bırakıyoruz.
            if (window.scrollY >= sectionTop - 100) {
                current = section.getAttribute("id");
            }
        });

        // Tüm linklerden active sınıfını temizle, sadece ekranda olan section'a ait linke ekle
        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    });
    /* =========================================
   WHATSAPP LİNK KONTROLÜ (PC'de Kopyala, Mobilde Aç)
========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const whatsappLink = document.getElementById('whatsapp-link');
    const phoneNumber = '0552 285 55 61'; // Kopyalanmasını istediğin format

    if (whatsappLink) {
        whatsappLink.addEventListener('click', (e) => {
            // Kullanıcının mobil cihazdan girip girmediğini kontrol et
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            // Eğer cihaz BİLGİSAYAR ise (mobil değilse)
            if (!isMobile) {
                e.preventDefault(); // Sayfa yönlendirmesini (wa.me) iptal et
                
                // Numarayı panoya (clipboard) kopyala
                navigator.clipboard.writeText(phoneNumber).then(() => {
                    // Kullanıcıya kopyalandığını belli etmek için ikon anlık olarak 'Tik' işaretine dönsün
                    const originalHTML = whatsappLink.innerHTML;
                    whatsappLink.innerHTML = '<i class="fa-solid fa-check"></i>';
                    
                    // 2 saniye sonra WhatsApp ikonunu geri getir
                    setTimeout(() => {
                        whatsappLink.innerHTML = originalHTML;
                    }, 2000);
                    
                }).catch(err => {
                    console.error('Numara kopyalanamadı: ', err);
                });
            }
            // Eğer cihaz MOBİL ise koda hiç dokunmuyoruz, href="..." çalışıyor ve uygulama açılıyor.
        });
    }
});


        document.addEventListener("DOMContentLoaded", () => {
            const scrollBtn = document.getElementById("progress-scroll-btn");
            const progressPath = document.querySelector(".progress-circle path");
            const pathLength = progressPath.getTotalLength();

            progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
            progressPath.style.strokeDashoffset = pathLength;

            const updateProgress = () => {
                const scroll = window.scrollY || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                
                const progress = pathLength - (scroll * pathLength) / height;
                progressPath.style.strokeDashoffset = progress;

                if (scroll > 200) {
                    scrollBtn.classList.add("active");
                } else {
                    scrollBtn.classList.remove("active");
                }
            };

            scrollBtn.addEventListener("click", () => {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            });

            window.addEventListener("scroll", updateProgress);
        });

        document.addEventListener('DOMContentLoaded', () => {
        const track = document.getElementById('testimonialTrack');
        const prevBtn = document.getElementById('t-prev');
        const nextBtn = document.getElementById('t-next');
        const container = document.querySelector('.testimonial-track-container');
        
        let currentIndex = 0;
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationID;

        // Gap değeri CSS'teki gap: 20px ile aynı olmalı
        const gap = 20;

        function updateSliderPosition() {
            const cards = track.querySelectorAll('.testimonial-card');
            if (cards.length === 0) return;
            
            const cardWidth = cards[0].offsetWidth;
            
            // Yeni pozisyonu hesapla ve uygula
            currentTranslate = -(currentIndex * (cardWidth + gap));
            prevTranslate = currentTranslate;
            
            track.style.transition = 'transform 0.4s ease-in-out';
            track.style.transform = `translateX(${currentTranslate}px)`;

            // Buton durumlarını güncelle
            const containerWidth = container.offsetWidth;
            const cardsPerView = Math.round(containerWidth / cardWidth);
            const maxIndex = Math.max(0, cards.length - cardsPerView);

            if(prevBtn) prevBtn.disabled = currentIndex <= 0;
            if(nextBtn) nextBtn.disabled = currentIndex >= maxIndex;
        }

        if(nextBtn) {
            nextBtn.addEventListener('click', () => {
                const cards = track.querySelectorAll('.testimonial-card');
                const containerWidth = container.offsetWidth;
                const cardsPerView = Math.round(containerWidth / cards[0].offsetWidth);
                const maxIndex = Math.max(0, cards.length - cardsPerView);
                
                if (currentIndex < maxIndex) {
                    currentIndex++;
                    updateSliderPosition();
                }
            });
        }

        if(prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateSliderPosition();
                }
            });
        }

        // --- SÜRÜKLEME (DRAG & SWIPE) MEKANİZMASI ---

        function getPositionX(event) {
            return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        }

        function touchStart(index) {
            return function(event) {
                isDragging = true;
                startPos = getPositionX(event);
                
                // Sürükleme sırasında CSS geçiş efektini kapatıyoruz (gecikme olmaması için)
                track.style.transition = 'none';
                
                // Devam eden bir animasyon varsa durdur
                cancelAnimationFrame(animationID);
            }
        }

        function touchMove(event) {
            if (!isDragging) return;
            const currentPosition = getPositionX(event);
            const diff = currentPosition - startPos;
            
            // Sürükleme sırasında transformu anlık olarak güncelle
            track.style.transform = `translateX(${prevTranslate + diff}px)`;
        }

        function touchEnd(event) {
            if (!isDragging) return;
            isDragging = false;

            const endPosition = event.type.includes('mouse') ? event.pageX : event.changedTouches[0].clientX;
            const movedBy = endPosition - startPos;
            
            const cards = track.querySelectorAll('.testimonial-card');
            const containerWidth = container.offsetWidth;
            const cardsPerView = Math.round(containerWidth / cards[0].offsetWidth);
            const maxIndex = Math.max(0, cards.length - cardsPerView);

            // Sürükleme eşiği (Örn: 50px'den fazla sürüklendiyse kart değiştir)
            if (movedBy < -50 && currentIndex < maxIndex) {
                currentIndex++;
            } else if (movedBy > 50 && currentIndex > 0) {
                currentIndex--;
            }

            // Kartın son konumuna oturmasını sağla
            updateSliderPosition();
        }

        // Mouse Olayları (Masaüstü için)
        container.addEventListener('mousedown', touchStart(currentIndex));
        container.addEventListener('mousemove', touchMove);
        container.addEventListener('mouseup', touchEnd);
        container.addEventListener('mouseleave', () => {
            if (isDragging) touchEnd({ type: 'mouseleave', pageX: startPos }); 
        });

        // Touch Olayları (Mobil için)
        container.addEventListener('touchstart', touchStart(currentIndex), { passive: true });
        container.addEventListener('touchmove', touchMove, { passive: true });
        container.addEventListener('touchend', touchEnd);

        // Ekran boyutu değiştiğinde slider'ı sıfırla ve yeniden hesapla
        window.addEventListener('resize', () => {
            currentIndex = 0;
            updateSliderPosition();
        });

        // Sayfa yüklendiğinde buton durumlarını ayarla
        setTimeout(updateSliderPosition, 100);
    });

        
})();
