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
// --- 7. EMAILJS İLETİŞİM FORMU (BAĞIMSIZ BLOK) ---
// ==========================================
(function() {
    try {
        // EmailJS Başlatma (Senin verdiğin Public Key)
        emailjs.init({
            publicKey: "7G8UYwKhxPh8WtgN1", 
        });

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

                    const templateParams = {
                        customer_name: formElement.querySelector('input[name="customer_name"]').value,
                        customer_email: formElement.querySelector('input[name="customer_email"]').value,
                        customer_message: formElement.querySelector('textarea[name="customer_message"]').value
                    };

                    // Senin verdiğin Service ve Template ID'ler
                    const serviceID = 'service_yr51i4x';   
                    const templateID = 'template_4731nqq'; 

                    emailjs.send(serviceID, templateID, templateParams)
                        .then(() => {
                            alert('Mesajınız başarıyla iletildi! En kısa sürede dönüş yapacağız.');
                            formElement.reset();
                        })
                        .catch((error) => {
                            console.error('EmailJS Hatası:', error);
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
        console.error("EmailJS başlatma koruması devrede:", e);
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
    
    if (!track || !container) return;

    let isAnimating = false; // Animasyon bitmeden peş peşe tıklanarak bozulmasını önler
    const gap = 20; // yorumlar.css dosyasındaki gap değeri ile aynı olmalıdır

    // Kart genişliğini dinamik hesaplayan fonksiyon
    function getCardWidth() {
        const card = track.querySelector('.testimonial-card');
        return card ? card.offsetWidth + gap : 0;
    }

    // --- İLERİ (NEXT) BUTONU (Sonsuz Döngü) ---
    if(nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;
            
            const moveAmount = getCardWidth();
            
            // 1. Önce sola doğru animasyonlu kaydır
            track.style.transition = 'transform 0.4s ease-in-out';
            track.style.transform = `translateX(-${moveAmount}px)`;
            
            // 2. Animasyon bittiğinde (0.4s sonra) ilk elemanı alıp en sona gizlice ekle
            setTimeout(() => {
                track.style.transition = 'none'; // Geçişi kapat ki sıfırlama belli olmasın
                track.appendChild(track.firstElementChild); // 1. kartı kopar, en sona yapıştır
                track.style.transform = 'translateX(0)'; // Konumu anında sıfırla
                isAnimating = false;
            }, 400); // 0.4s (400ms) transition süresiyle aynı
        });
    }

    // --- GERİ (PREV) BUTONU (Sonsuz Döngü) ---
    if(prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;
            
            const moveAmount = getCardWidth();
            
            // 1. En sondaki elemanı al, gizlice en başa koy
            track.insertBefore(track.lastElementChild, track.firstElementChild);
            
            // 2. Kaymayı hissettirmemek için track'i anında bir kart genişliği kadar sola it
            track.style.transition = 'none';
            track.style.transform = `translateX(-${moveAmount}px)`;
            
            // Tarayıcıyı bu pozisyon değişikliğini okumaya zorla (Reflow)
            track.offsetHeight; 
            
            // 3. Şimdi animasyonu aç ve sıfır noktasına (sağa doğru) kaydır
            track.style.transition = 'transform 0.4s ease-in-out';
            track.style.transform = 'translateX(0)';
            
            setTimeout(() => {
                isAnimating = false;
            }, 400);
        });
    }

    // --- MOBİL İÇİN KAYDIRMA (SWIPE) DESTEĞİ ---
    // Yeni yapıya uygun daha kararlı ve hatasız kaydırma algoritması
    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    // Masaüstü fare ile sürükleme
    container.addEventListener('mousedown', e => {
        touchStartX = e.screenX;
    });

    container.addEventListener('mouseup', e => {
        touchEndX = e.screenX;
        handleSwipe();
    });

    function handleSwipe() {
        // Eşik değeri 50px: Sağa veya sola yeterince çekildiyse buton tıklamasını tetikle
        if (touchEndX < touchStartX - 50) {
            if (nextBtn) nextBtn.click(); // Sola çektik (İleri git)
        }
        if (touchEndX > touchStartX + 50) {
            if (prevBtn) prevBtn.click(); // Sağa çektik (Geri gel)
        }
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

            // 🚀 TAMAMEN GÜVENLİ VE BAĞIMSIZ MOBİL MENÜ KAPATMA MANTIĞI
            const navbar = document.getElementById("navbar");
            const mobileMenuBtn = document.getElementById("mobileMenuBtn");
            const navLinks = document.querySelectorAll(".nav-link");

            navLinks.forEach(link => {
                link.addEventListener("click", () => {
                    // 1. Menü penceresini kapatıyoruz
                    navbar.classList.remove("active"); 
                    navbar.classList.remove("show");
                    
                    // 2. Butonun çarpı olmasını sağlayan aktiflik sınıflarını siliyoruz
                    mobileMenuBtn.classList.remove("active");
                    mobileMenuBtn.classList.remove("open");
                    
                    // 3. Garanti olsun diye butonun içindeki ikonu zorla 3 çizgi (fa-bars) yapıyoruz
                    const menuIcon = mobileMenuBtn.querySelector("i");
                    if (menuIcon) {
                        menuIcon.className = "fa-solid fa-bars";
                    }
                });
            });
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



            
            const navbar = document.getElementById("navbar");
            const mobileMenuBtn = document.getElementById("mobileMenuBtn");
            const navLinks = document.querySelectorAll(".nav-link");

            // 1. Hamburger menü butonuna tıklandığında
            mobileMenuBtn.addEventListener("click", () => {
                setTimeout(() => {
                    if (navbar.classList.contains("active") || navbar.classList.contains("show")) {
                        document.body.classList.add("menu-open");
                    } else {
                        document.body.classList.remove("menu-open");
                    }
                }, 50);
            });

            // 2. Menü linklerinden birine tıklandığında
            navLinks.forEach(link => {
                link.addEventListener("click", () => {
                    navbar.classList.remove("active"); 
                    navbar.classList.remove("show");
                    mobileMenuBtn.classList.remove("active");
                    mobileMenuBtn.classList.remove("open");
                    
                    const menuIcon = mobileMenuBtn.querySelector("i");
                    if (menuIcon) {
                        menuIcon.className = "fa-solid fa-bars";
                    }
                    document.body.classList.remove("menu-open");
                });
            });
        });

        
})();
