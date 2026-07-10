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

    if (track && dotsContainer) {
        generateDots();
        updateSlider();
    }

    // ==========================================
    // --- 7. PHP VE FETCH API İLETİŞİM FORMU (YENİLENEN KISIM) ---
    // ==========================================
    const formElement = document.getElementById('mukellef-iletisim-formu');

    if (formElement) {
        formElement.addEventListener('submit', function (event) {
            event.preventDefault(); // Sayfanın yenilenmesini engelliyoruz

            const submitBtn = document.getElementById('form-submit-btn');
            const originalBtnText = submitBtn ? submitBtn.innerText : "Gönder";

            if (submitBtn) {
                submitBtn.innerText = "Gönderiliyor...";
                submitBtn.disabled = true;
                submitBtn.style.opacity = "0.7";
            }

            // HTML formundaki name niteliklerine göre verileri çekiyoruz
            const nameValue = formElement.querySelector('input[name="customer_name"]').value;
            const emailValue = formElement.querySelector('input[name="customer_email"]').value;
            const messageValue = formElement.querySelector('textarea[name="customer_message"]').value;

            // PHP'nin tanıması için FormData nesnesi oluşturuyoruz
            const formData = new FormData();
            formData.append("isim", nameValue);       // PHP'deki $_POST['isim'] ile eşleşir
            formData.append("eposta", emailValue);   // PHP'deki $_POST['eposta'] ile eşleşir
            formData.append("mesaj", messageValue);   // PHP'deki $_POST['mesaj'] ile eşleşir

            // Arka planda yerel PHP dosyasına istek atıyoruz
            fetch("mail-gonder.php", {
                method: "POST",
                body: formData
            })
            .then(response => response.text())
            .then(data => {
                if (data.trim() === "basarili") {
                    alert('Mesajınız başarıyla iletildi! En kısa sürede dönüş yapacağız.');
                    formElement.reset(); // Formu sıfırla
                } else {
                    alert('Mesaj gönderilirken sunucu taraflı bir sorun oluştu: ' + data);
                }
            })
            .catch((error) => {
                console.error('Sistem Hatası:', error);
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

    // --- 8. ScrollSpy (Sayfa Kaydırıldıkça Navigasyonun Güncellenmesi) ---
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        let current = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 100) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    });
});
