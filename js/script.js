document.addEventListener("DOMContentLoaded", () => {

    // --- 1. Theme Toggle (Karanlık/Aydınlık Tema) ---
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    const htmlElement = document.documentElement;

    // LocalStorage kontrolü
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        htmlElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            htmlElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            htmlElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    });

    // --- 2. Sticky Header ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 3. Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navbar = document.getElementById('navbar');
    const menuIcon = mobileMenuBtn.querySelector('i');

    mobileMenuBtn.addEventListener('click', () => {
        navbar.classList.toggle('active');
        if (navbar.classList.contains('active')) {
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-xmark');
        } else {
            menuIcon.classList.remove('fa-xmark');
            menuIcon.classList.add('fa-bars');
        }
    });


    // --- 4. Mobile Dropdown Toggle ---
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });
    // --- 5. Scroll Animations ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // --- 6. Advanced 12-Item Testimonial Slider ---
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

    generateDots();
    updateSlider();
});
// Sayfa tamamen yüklendiğinde çalışacak ana blok
window.addEventListener('DOMContentLoaded', () => {

    // 1. EmailJS'i burada başlatıyoruz
    emailjs.init({
        publicKey: "7G8UYwKhxPh8WtgN1", // Boşluk bırakmadan yapıştır
    });

    const formElement = document.getElementById('mukellef-iletisim-formu');

    // Eğer form sayfada varsa dinleyiciyi ekle (Çökme önleyici)
    if (formElement) {
        formElement.addEventListener('submit', function (event) {
            event.preventDefault(); // Sayfa yenilemesini engelle

            const submitBtn = document.getElementById('form-submit-btn');
            const originalBtnText = submitBtn.innerText;

            // Buton durumunu kilitle
            submitBtn.innerText = "Gönderiliyor...";
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.7";

            // Form verilerini JS nesnesi olarak paketle (En güvenli yöntem)
            const templateParams = {
                customer_name: formElement.querySelector('input[name="customer_name"]').value,
                customer_email: formElement.querySelector('input[name="customer_email"]').value,
                customer_message: formElement.querySelector('textarea[name="customer_message"]').value
            };

            const serviceID = 'service_yr51i4x';   // Kendi Service ID'ni yaz
            const templateID = 'template_4731nqq'; // Kendi Template ID'ni yaz

            // sendForm yerine send kullanarak CORS riskini sıfıra indiriyoruz
            emailjs.send(serviceID, templateID, templateParams)
                .then(() => {
                    alert('Mesajınız başarıyla iletildi! En kısa sürede dönüş yapacağız.');
                    formElement.reset(); // Formu temizle
                })
                .catch((error) => {
                    console.error('JS Tarafı Detaylı Hata Çıktısı:', error);
                    alert('Mesaj gönderilirken JS kaynaklı bir sorun oluştu.');
                })
                .finally(() => {
                    // Butonu eski haline geri getir
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = "1";
                });
        });
    }

});