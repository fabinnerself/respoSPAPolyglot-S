// Módulo de utilidades
const Utils = {
    // Opciones del Intersection Observer (consolidadas)
    observerOptions: {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    },

    // Smooth scrolling
    smoothScroll: function(target, duration = 800) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;
        
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = Utils.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    },

    // Validación de formulario
    validateForm: function(formData) {
        const errors = {};
        
        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        }
        
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }
        
        if (!formData.subject.trim()) {
            errors.subject = 'Subject is required';
        }
        
        if (!formData.message.trim()) {
            errors.message = 'Message is required';
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    },

    // Manejo de errores de formulario
    handleFormErrors: function(errors) {
        // Limpiar errores previos
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
            el.classList.remove('error');
        });

        // Mostrar nuevos errores
        Object.keys(errors).forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                input.classList.add('error');
                const errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.style.color = 'var(--error-color)';
                errorElement.style.fontSize = '0.875rem';
                errorElement.style.marginTop = '0.25rem';
                errorElement.textContent = errors[field];
                input.parentNode.appendChild(errorElement);
            }
        });
    }
};

// Módulo de navegación
const Navigation = {
    init: function() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupDropdowns();
    },

    setupMobileMenu: function() {
        const mobileToggle = document.getElementById('mobileToggle');
        const navMenu = document.getElementById('navMenu');

        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileToggle.classList.toggle('active');
            });
        }
    },

    setupSmoothScrolling: function() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = this.getAttribute('href');
                if (target !== '#') {
                    Utils.smoothScroll(target);
                    
                    // Cerrar menú móvil si está abierto
                    const navMenu = document.getElementById('navMenu');
                    const mobileToggle = document.getElementById('mobileToggle');
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        mobileToggle.classList.remove('active');
                    }
                }
            });
        });
    },

    setupDropdowns: function() {
        // Los dropdowns se manejan con CSS, esta función es para compatibilidad adicional
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.querySelector('.dropdown')?.classList.add('active');
            });
            
            item.addEventListener('mouseleave', () => {
                item.querySelector('.dropdown')?.classList.remove('active');
            });
        });
    }
};

// Módulo de animaciones
const Animations = {
    init: function() {
        this.setupScrollAnimations();
        this.setupSkillAnimations();
    },

    setupScrollAnimations: function() {
        const animatedElements = document.querySelectorAll('.feature-card, .service-card, .process-step, .skill-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 1s ease forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, Utils.observerOptions);

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    },

    setupSkillAnimations: function() {
        const skillCircles = document.querySelectorAll('.skill-circle');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const percentage = entry.target.querySelector('.skill-percentage').getAttribute('data-target');
                    entry.target.style.setProperty('--value', `${percentage}%`);
                    entry.target.style.animation = `fillAnimation 2s ease forwards`;
                    observer.unobserve(entry.target);
                }
            });
        }, Utils.observerOptions);

        skillCircles.forEach(circle => {
            observer.observe(circle);
        });
    }
};

// Módulo de formulario de contacto
const ContactForm = {
    init: function() {
        this.setupFormValidation();
    },

    setupFormValidation: function() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            const validation = Utils.validateForm(formData);
            
            if (validation.isValid) {
                this.handleFormSubmit(formData);
            } else {
                Utils.handleFormErrors(validation.errors);
            }
        });
    },

    handleFormSubmit: function(formData) {
        // Simulación de envío de formulario
        console.log('Form data:', formData);
        
        // Mostrar mensaje de éxito
        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.style.display = 'block';
            emailjs
                .send('service_dgco51k', 'template_academlo', formData)
				.then(function (response) {
					console.log('SUCCESS!', response.status, response.text);
				}, function (error) {
					console.log('FAILED...', error);
				});
            // Ocultar después de 5 segundos
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
        }
        
        // Limpiar formulario
        document.getElementById('contactForm').reset();
        
        // Limpiar errores
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
            el.classList.remove('error');
        });
    }
};

// Módulo principal de la aplicación
const App = {
    init: function() {
        Navigation.init();
        Animations.init();
        ContactForm.init();
        
        // Añadir estilos para mensajes de error
        this.injectErrorStyles();
    },

    injectErrorStyles: function() {
        const style = document.createElement('style');
        style.textContent = `
            .form-group input.error, 
            .form-group textarea.error {
                border-color: var(--error-color) !important;
            }
        `;
        document.head.appendChild(style);
    }
};

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});



// Sistema de navegación responsivo optimizado
class ResponsiveMenuSystem {
    constructor() {
        this.isMobileMenuOpen = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.currentLanguage = 'es';
        this.init();
    }
    
    init() {
        this.setupMenuToggle();
        this.setupDropdowns();
        this.setupTouchInteractions();
        this.setupAccessibility();
        this.setupLanguageToggle();
        this.setupNavigation();
        this.setupResizeHandler();
    }
    
    // Configurar toggle del menú móvil
    setupMenuToggle() {
        const mobileToggle = document.getElementById('mobile-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (!mobileToggle || !navMenu) return;
        
        // Evento de clic
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMobileMenu();
        });
        
        // Evento táctil para mejor feedback
        mobileToggle.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            mobileToggle.classList.add('active-touch');
        });
        
        mobileToggle.addEventListener('touchend', () => {
            mobileToggle.classList.remove('active-touch');
        });
    }
    
    // Configurar dropdowns para todos los dispositivos
    setupDropdowns() {
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        
        dropdownToggles.forEach(toggle => {
            const dropdownItem = toggle.closest('.dropdown-item');
            
            // Para desktop - hover
            if (window.innerWidth > 768) {
                dropdownItem.addEventListener('mouseenter', () => {
                    this.openDropdown(dropdownItem);
                });
                
                dropdownItem.addEventListener('mouseleave', () => {
                    this.closeDropdown(dropdownItem);
                });
            }
            
            // Para móvil/tablet - click/touch
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleDropdown(dropdownItem);
                }
            });
            
            // Soporte táctil mejorado
            toggle.addEventListener('touchstart', (e) => {
                if (window.innerWidth <= 768) {
                    e.stopPropagation();
                    toggle.classList.add('active-touch');
                }
            });
            
            toggle.addEventListener('touchend', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    toggle.classList.remove('active-touch');
                    this.toggleDropdown(dropdownItem);
                }
            });
        });
        
        // Cerrar dropdowns al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (window.innerWidth > 768) {
                const isDropdownClick = e.target.closest('.dropdown-item');
                if (!isDropdownClick) {
                    this.closeAllDropdowns();
                }
            }
        });
    }
    
    // Configurar interacciones táctiles mejoradas
    setupTouchInteractions() {
        const navLinks = document.querySelectorAll('.nav-link, .dropdown-link');
        
        navLinks.forEach(link => {
            // Feedback visual al tocar
            link.addEventListener('touchstart', () => {
                link.classList.add('active-touch');
            });
            
            link.addEventListener('touchend', () => {
                setTimeout(() => {
                    link.classList.remove('active-touch');
                }, 150);
            });
            
            // Prevenir zoom no deseado en iOS
            link.addEventListener('touchmove', (e) => {
                if (e.touches.length > 1) {
                    e.preventDefault();
                }
            }, { passive: false });
        });
        
        // Soporte para gestos de deslizamiento para cerrar menú
        this.setupSwipeGestures();
    }
    
    // Configurar gestos de deslizamiento
    setupSwipeGestures() {
        const navMenu = document.getElementById('nav-menu');
        if (!navMenu) return;
        
        navMenu.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        navMenu.addEventListener('touchmove', (e) => {
            if (!this.isMobileMenuOpen) return;
            
            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            const diffX = this.touchStartX - touchX;
            const diffY = Math.abs(this.touchStartY - touchY);
            
            // Solo considerar deslizamiento horizontal con mínima desviación vertical
            if (diffX > 50 && diffY < 50) {
                this.closeMobileMenu();
            }
        }, { passive: true });
    }
    
    // Configurar accesibilidad
    setupAccessibility() {
        const mobileToggle = document.getElementById('mobile-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        // Navegación por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
        // Mejorar ARIA attributes
        if (mobileToggle && navMenu) {
            mobileToggle.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('aria-hidden', 'true');
        }
        
        // Focus management
        this.setupFocusManagement();
    }
    
    // Gestionar el foco para mejor accesibilidad
    setupFocusManagement() {
        const mobileToggle = document.getElementById('mobile-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (!mobileToggle || !navMenu) return;
        
        // Atrapar foco dentro del menú cuando está abierto
        navMenu.addEventListener('keydown', (e) => {
            if (!this.isMobileMenuOpen) return;
            
            const focusableElements = navMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
    
    // Configurar toggle de idioma (removido - ahora manejado por el código inferior)
    setupLanguageToggle() {
        // Language toggle is now handled by the standalone implementation below
        // This method is kept for compatibility but is no longer used
    }
    
    // Configurar navegación
    setupNavigation() {
        // Navegación por secciones
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-section]');
            if (link) {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.navigateToSection(section);
                
                // Cerrar menú móvil después de la navegación
                if (window.innerWidth <= 768) {
                    this.closeMobileMenu();
                    this.closeAllDropdowns();
                }
            }
        });
        
        // Manejar botones de retroceso/avance del navegador
        window.addEventListener('popstate', (e) => {
            const section = e.state?.section || window.location.hash.substring(1) || 'home';
            this.navigateToSection(section, false);
        });
    }
    
    // Configurar manejador de redimensionamiento
    setupResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }
    
    // Manejar redimensionamiento de ventana
    handleResize() {
        // Si cambia de móvil a desktop, asegurar que el mené esté cerrado
        if (window.innerWidth > 768 && this.isMobileMenuOpen) {
            this.closeMobileMenu();
            this.closeAllDropdowns();
        }
        
        // Reconfigurar eventos si cambia el modo
        if ((window.innerWidth > 768 && this.lastWidth <= 768) || 
            (window.innerWidth <= 768 && this.lastWidth > 768)) {
            this.setupDropdowns();
        }
        
        this.lastWidth = window.innerWidth;
    }
    
    // Alternar menú móvil
    toggleMobileMenu() {
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    // Abrir menú móvil
    openMobileMenu() {
        const mobileToggle = document.getElementById('mobile-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (!mobileToggle || !navMenu) return;
        
        this.isMobileMenuOpen = true;
        mobileToggle.classList.add('active');
        navMenu.classList.add('active');
        navMenu.setAttribute('aria-hidden', 'false');
        mobileToggle.setAttribute('aria-expanded', 'true');
        
        // Prevenir scroll del cuREPo
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        
        // Enfocar el primer elemento del menú para accesibilidad
        setTimeout(() => {
            const firstLink = navMenu.querySelector('a');
            if (firstLink) firstLink.focus();
        }, 100);
    }
    
    // Cerrar menú móvil
    closeMobileMenu() {
        const mobileToggle = document.getElementById('mobile-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (!mobileToggle || !navMenu) return;
        
        this.isMobileMenuOpen = false;
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navMenu.setAttribute('aria-hidden', 'true');
        mobileToggle.setAttribute('aria-expanded', 'false');
        
        // Restaurar scroll del cuREPo
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        
        // Devolver foco al botón de toggle
        mobileToggle.focus();
    }
    
    // Alternar dropdown
    toggleDropdown(dropdownItem) {
        const isActive = dropdownItem.classList.contains('dropdown-active');
        
        // Cerrar todos los dropdowns primero
        this.closeAllDropdowns();
        
        // Abrir el actual si no estaba activo
        if (!isActive) {
            this.openDropdown(dropdownItem);
        }
    }
    
    // Abrir dropdown
    openDropdown(dropdownItem) {
        dropdownItem.classList.add('dropdown-active');
        const dropdown = dropdownItem.querySelector('.dropdown');
        if (dropdown) {
            dropdown.style.maxHeight = dropdown.scrollHeight + 'px';
        }
        
        // Actualizar ARIA
        const toggle = dropdownItem.querySelector('.dropdown-toggle');
        if (toggle) {
            toggle.setAttribute('aria-expanded', 'true');
        }
    }
    
    // Cerrar dropdown
    closeDropdown(dropdownItem) {
        dropdownItem.classList.remove('dropdown-active');
        const dropdown = dropdownItem.querySelector('.dropdown');
        if (dropdown) {
            dropdown.style.maxHeight = '0';
        }
        
        // Actualizar ARIA
        const toggle = dropdownItem.querySelector('.dropdown-toggle');
        if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
        }
    }
    
    // Cerrar todos los dropdowns
    closeAllDropdowns() {
        document.querySelectorAll('.dropdown-item').forEach(item => {
            this.closeDropdown(item);
        });
    }
    
    // Cambiar idioma
    changeLanguage(lang) {
        this.currentLanguage = lang;
        // Aquí iría la lógica para cambiar el contenido según el idioma
        console.log('Idioma cambiado a:', lang);
        
        // Guardar preferencia
        localStorage.setItem('preferred-language', lang);
    }
    
    // Navegar a sección
    navigateToSection(sectionId, updateHistory = true) {
        // Mostrar transición
        this.showPageTransition();
        
        // Ocultar todas las secciones
        document.querySelectorAll('.spa-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Mostrar sección objetivo
        const targetSection = document.getElementById(`${sectionId}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Actualizar navegación activa
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            const activeLinks = document.querySelectorAll(`[data-section="${sectionId}"]`);
            activeLinks.forEach(link => {
                link.classList.add('active');
            });
            
            // Actualizar breadcrumb
            this.updateBreadcrumb(sectionId);
            
            // Actualizar URL
            if (updateHistory) {
                const url = sectionId === 'home' ? '#' : `#${sectionId}`;
                history.pushState({ section: sectionId }, '', url);
            }
            
            // Desplazarse al inicio
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // Ocultar transición
        setTimeout(() => {
            this.hidePageTransition();
        }, 300);
    }
    
    // Actualizar breadcrumb
    updateBreadcrumb(sectionId) {
        const breadcrumb = document.getElementById('breadcrumb');
        const breadcrumbCurrent = document.getElementById('breadcrumb-current');
        
        if (sectionId === 'home') {
            breadcrumb.style.display = 'none';
        } else {
            breadcrumb.style.display = 'block';
            // Aquí se podría agregar lógica para obtener el nombre de la sección
            breadcrumbCurrent.textContent = sectionId;
        }
    }
    
    // Mostrar transición de página
    showPageTransition() {
        const transition = document.getElementById('pageTransition');
        if (transition) {
            transition.classList.add('active');
        }
    }
    
    // Ocultar transición de página
    hidePageTransition() {
        const transition = document.getElementById('pageTransition');
        if (transition) {
            transition.classList.remove('active');
        }
    }
}

// Inicializar el sistema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.menuSystem = new ResponsiveMenuSystem();
    
    // Manejar ruta inicial
    const hash = window.location.hash.substring(1);
    if (hash && hash !== 'home') {
        setTimeout(() => {
            window.menuSystem.navigateToSection(hash, false);
        }, 100);
    }
    
    // Cargar preferencia de idioma guardada
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage) {
        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle) {
            languageToggle.checked = (savedLanguage === 'es');
            window.menuSystem.changeLanguage(savedLanguage);
        }
    }
});

// Polyfill para funcionamiento en navegadores antiguos
if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        if (!document.documentElement.contains(el)) return null;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

if (!Element.prototype.matches) {
    Element.prototype.matches = 
        Element.prototype.matchesSelector || 
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector || 
        Element.prototype.oMatchesSelector || 
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
        };
}



        // Base de datos de contenidos por idioma
        const contents = {
            es: {
                // Navegación
                "nav-home": "Inicio",
                "nav-about": "Sobre Nosotros",
                "nav-services": "Servicios",                
                "nav-exports": "Exportaciones",
                "nav-history":"Trayectoría",
                "nav-team":"Equipo",
                "nav-mission":"Misión",
                "nav-trading":"Services 1",
                "nav-transportation":"Services 2",
                "nav-reception":"Services 3",
                "nav-assaying":"Services 4",
                "nav-smelting":"Services 5",
                "nav-destinations":"Destinos",
                "nav-shipments":"Envíos",                
                
                
                // Home
                "home-title": "BIENVENIDO A EMPRESA S.R.L.",
                "home-subtitle": "Somos en La Paz, Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-wwd-title": "Que hacemos",
                "home-wwd-c1-title": "Lorem ipsum, dolor sit amet consectetur",
                "home-wwd-c1-description": "Spanish Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-wwd-c2-title": "Ipsum, dolor sit amet consectetur",
                "home-wwd-c2-description": "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam.",
                "home-wwd-c3-title": "Dolor sit amet consectetur",
                "home-wwd-c3-description": "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur .",
                "home-wwd-c4-title": "Sit amet consectetur",
                "home-wwd-c4-description": "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-about-title": "Acerca de nosotros",
                "home-about-content": "Empresa S.R.L. es una empresa líder en el Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-owp-title": "Nuestro Proceso de Trabajo",
                "home-owp-c1-title": "Conceptualización",
                "home-owp-c1-description": "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-owp-c2-title": "Ejecución",
                "home-owp-c2-description": "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-owp-c3-title": "Finalización",
                "home-owp-c3-description": "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-services-title":"Nuestros Servicios",
                "home-services-c1-title": "Comercio ",    
                "home-services-c1-description": "Realizamos el comercio de Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-services-c2-title": "Transporte",    
                "home-services-c2-description": "Servicio de transporte seguro y asegurado de Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-services-c3-title": "Recepción",    
                "home-services-c3-description": "Servicios profesionales de recepción y verificación para todas las entregas y envíos, asegurando precisión, seguridad y confiabilidad en cada transacción.",
                "home-services-c4-title": "Laboratorio de ensayo",    
                "home-services-c4-description": "Servicios precisos de análisis y ensayo, Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-services-c5-title": "deserunt ",    
                "home-services-c5-description": "Servicios profesionales de Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-services-c6-title": "Exportaciones",    
                "home-services-c6-description": "Servicios de exportación a nivel mundial con Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-skills-title": "Nuestras Habilidades",                
                "home-skills-c1-title": "Compras y Ventas",    
                "home-skills-c2-title": "Laboratorio de ensayo",    
                "home-skills-c3-title": "Cumplimiento",    
                "home-skills-c4-title": "deserunt ",    
                "contact-title": "Contactar",                     
                "contact-subtitle":"¡Ponte en contacto!",
                "contact-content":"¡Nos encantaría escuchar de ti! Envíanos un mensaje con tu comentario",
                "contact-content1":"Información de contacto",
                "contact-content2":"📞 Números de teléfono:",
                "contact-content3":"📧 Correo electrónico:",
                "contact-content4":"📍 Ubicación:",
                "contact-content5":"Calle  Lorem ipsum, dolor sit amet consectetur adipisicing elit.  La Paz - Bolivia Sud América.",                
                "contact-content6":"📱  Envíame un mensaje a WhatsApp.",
                "copy-tooltip":"Correo Copiado al portapapeles!",
                "copy-tooltip1":"Correo Copiado al portapapeles!",
                "copy-tooltip2":"Correo Copiado al portapapeles!",
                "copy-tooltip3":"Correo Copiado al portapapeles!",
                "copy-tooltip4":"Correo Copiado al portapapeles!",
                "copy-tooltip5":"Correo Copiado al portapapeles!",
                "contact-form-title" :"Enviar mensaje",
                "success-message" :"¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.",
                "contact-form-nombre":"Nombre",
                "name":"Ingrese su nombre",
                "contact-form-email":"Correo electrónico",
                "email" :"Ingrese su correo electrónico",
                "contact-form-subject" :"Asunto",
                "subject" :"Ingrese un asunto",
                "contact-form-message":"Mensaje",                
                "contact-form-submit" :"Enviar",
                "footer-title":"Sígueme en mis Redes Sociales",  
                "footer-tagline":"Tu socio de confianza en el comercio de ipsumes Lorem y  servicios",                
                "footer-final":"© 2025 Enterprise S.R.L. Todos los derechos reservados.",

                "history-title":"Trayectoria",
                "history-content1":"INFORMACION GENERAL",
                "history-content2":"La empresa Enterprise S.R.L., se dedica a la exportación de ipsumes  a los mercados externos y de acuerdo a lo establecido en la matrícula de comercio la actividad es la: deserunt , refinación y comercialización de ipsumes  y lorems.",
                "history-content3":"Enterprise S.R.L. nace en diciembre de 2003, del conocimiento adquirido en el mercado de lorem nacional y para realizar un emprendimiento a fin de atender las diferentes demandas del ipsum  en los mercados internacionales.",
                "history-content4":"La empresa es la pionera en el mercado boliviano, trabajando en estricto cumplimiento a la normativa vigente y priorizando la responsabilidad social y la preservación del medio ambiente, contando desde la gestión 2009 con manifiesto medioambiental aprobado por las autoridades nacionales.",
                "history-content5":"Enterprise es una sociedad de responsabilidad limitada y el estilo de gestión aplicado por los gerentes es el participativo basado en la confianza en el equipo de trabajo y que busca fomentar la generación de ideas y sugerencias por parte del personal, así como la coordinación en las operaciones.",
              

                //team
                "team-title":"Equipo",
                "team-charge1":"Gerente Administrativo",
                "team-charge2":"Gerente General",

                //mission
                "mission-title":"Misión",
                "mission-content":"Lorem ipsum, dolor sit amet, cumpliendo estándares de calidad y respetando el medio ambiente, para atender los diferentes requerimientos del mercado interno y del mercado internacional.",
                //vision
                "vision-title":"Visión",
                "vision-content":"Ser la empresa líder en la comercialización interna y exportación de ipsumes  de Bolivia hacia el mundo.",
                //values
                "values-title":"Valores",                
                "values-content11":"INTEGRIDAD:", 
                "values-content12":" Actuamos de manera correcta y cumplimos con lo que nos comprometimos.", 
                "values-content21":"RESPECTO:", 
                "values-content22":" Sabemos escuchar a los demás y comprender sus opiniones.", 
                "values-content31":"TRABAJO EN EQUIPO:", 
                "values-content32":" Somos una familia y trabajamos en forma coordinada.", 
                "values-content41":"RESPONSABILIDAD SOCIAL:", 
                "values-content42":" Nos preocupamos por el bienestar de nuestra sociedad y Bolivia.",
                
                //commitments
                "commitments-title":"Aficiones",
                "commitments-content1":"Exportación de ipsumes Lorem",
                "commitments-content2":"Preservación del medio ambiente",
                "commitments-content3":"Responsabilidad Social",
                "commitments-content4":"Cumplimiento de valores",

                //serices trading
                "services-trading-title":"Comercialización", 
                "services-trading-content":"En Enterprise SRL nos dedicamos a crear evaluaciones de mercado analíticas exhaustivas para mantenerle siempre conectado con el mercado de los ipsumes. Nuestra mesa de operaciones en tiempo real está a su disposición para garantizarle el valor más preciso y máximo para sus ipsumes lorem.",
                "services-trading-content1":"Nuestra capacidad de comercio y teselit en el interior nos hace el financiamiento conveniente y fácilmente accesible a nuestros clientes. Y con nuestras largas relaciones con las loremmás grandes del mundo, podemos proporcionar términos y tasas favorables directamente a los clientes cuando lo necesiten.",

                //services transportation
                "services-transportation-title":"Transporte",
                "services-transportation-content":"En Enterprise SRL reducimos los costes sin comprometer la seguridad. Nuestras amplias y duraderas relaciones históricas con la mayoría de los principales productores de ipson lorem nos permiten ofrecer acuerdos de transporte conjuntos siempre que sea posible. Además, al operar en dos lorem en Norteamérica, nunca estamos demasiado lejos y ofrecemos a nuestros clientes las mejores tarifas de transporte disponibles. Enterprise proporciona a sus clientes soluciones de transporte competitivas y seguras. Tenemos una larga asociación y trabajamos exclusivamente con las empresas de transporte y logística de alta seguridad líderes en el mundo. Nuestros agentes de transporte cumplen con las normas de la «Guía de la OCDE sobre la diligencia debida para las cadenas de suministro responsables de minerales procedentes de zonas afectadas por conflictos y de alto riesgo». Nuestros clientes se benefician de nuestros contactos globales con empresas de transporte, lo que garantiza las mejores condiciones. Podemos organizar el transporte desde prácticamente cualquier lugar de recogida solicitado con envío a Enterprise, todo ello en nuestro nombre o en nombre de nuestro cliente. Todo el transporte está totalmente asegurado. Cualquier pérdida de ipsum asegurado se pagará en efectivo.",
                "services-transportation-title1":"Proceso",
                "services-transportation-content1":"Enterprise proporcionará ofertas de 1-2 agentes de transporte. El cliente elegirá el agente de transporte más adecuado para sus necesidades. Se requiere que el cliente proporcione la siguiente información y consejos de envío:",
                "services-transportation-content2":"Descripción del material",
                "services-transportation-content3":"Número de paquetes o cajas",
                "services-transportation-content4":"Peso bruto de la empaque, bolsas y piezas",
                "services-transportation-content5":"Número de bolsas y piezas",
                "services-transportation-content6":"Peso neto total",
                "services-transportation-content7":"Contenido estimado total del lore /ipsum en amet ",
                "services-transportation-content8":"Otra información relacionada con el envío como el cliente pueda solicitar",
                "services-transportation-content9":"Nombre del representante del cliente en el procedimiento de pesado, lorem e ipsum si se designa",
                "services-transportation-content10":"Llegada del envío a Enterprise",
                "services-transportation-content11":"Enterprise confirmará al cliente que los bienes han sido recibidos.",

                //services reception
                "services-reception-title":"Recepción",
                "services-reception-content":"En Enterprise SRL, tras recibir el envío en sus instalaciones, se inspeccionan los paquetes, cajas y contenedores recibidos para comprobar si presentan daños externos, el número de paquetes/contenedores, el peso, el tipo de ipsum recibido y otras posibles no conformidades, como la radiactividad. De todas las entregas de ipsum recibidas, se toma una muestra para realizar un análisis preliminar. A continuación, el material se pesa, homogeneiza y muestrea en presencia del representante del cliente, siempre que este haya ejercido su derecho a estar representado. Una muestra representativa es de suma importancia para el cliente y para todos los procesos internos posteriores. Garantizamos a nuestros clientes las mejores técnicas de homogeneización y métodos de muestreo para cualquier tipo de ipsum. Todos los datos de cada entrega se registran en el sistema SAP de Enterprise SRL para la seguridad y referencia de nuestros clientes y para garantizar el control total de cada lote en nuestro sistema REP.",
                "services-reception-title1":"Proceso logístico",
                "services-reception-content1":"Fase 1: el ipsum  se envía a Enterprise a través de un agente de transporte en coordinación con el cliente.",
                "services-reception-content2":"Fase 2: una vez disponible la información guiada, el departamento de ventas de Enterprise SRL contactará al representante del cliente para acordar la fecha y hora en que se realizarán las operaciones de pesado, deserunt  y muestreo, siempre que el cliente haya ejercido su derecho a ser representado.",
                "services-reception-content3":"Fase 3: una vez recibido el envío en las instalaciones de Enterprise SRL, se inspeccionarán los paquetes, cajas y contenedores recibidos para comprobar si presentan daños externos, el número de paquetes/contenedores, el peso, el tipo de ipsum recibido y otras posibles no conformidades, como la radiactividad.",
                "services-reception-content4":"Fase 4: cada envío sufrirá la verificación de la radiactividad. Si es positiva, el transportista no podrá descargar el material y el envío será rechazado.",
                "services-reception-content5":"Fase 5: si algún paquete/contenedor/caja está dañado o cualquier sellado en los paquetes/contenedores/cajas está roto, Enterprise SRL informará al cliente sobre el daño a los paquetes/contenedores/cajas o sellados, y solicitará aprobación para proceder con las operaciones de pesado, deserunt  y muestreo. Dependiendo del paso del proceso (durante el desembarco o la aceptación del material entregado), el departamento de logística segregará el material en el depósito y esperará instrucciones adicionales del departamento de ventas.",
                "services-reception-content6":"Fase 6: el departamento de logística de Enterprise verificará que los paquetes recibidos cumplan íntegramente con los datos indicados en la información comunicada, tales como:",
                "services-reception-content7":"Nombre del cliente/remitente/destinatario",
                "services-reception-content8":"Número de paquetes o cajas",
                "services-reception-content9":"Peso bruto de la empaque, bolsas y piezas",
                "services-reception-content10":"Número de bolsas y piezas",
                "services-reception-content11":"Peso neto total",
                "services-reception-content12":"Contenido estimado total del lorem / ipsum en amet ",
                "services-reception-content13":"Copia certificada de los análisis del cliente con respecto al envío que demuestran las estimaciones del contenido de ipsum fino.",
                "services-reception-content14":"Nombre del representante del cliente en el procedimiento de pesado, deserunt  y muestreo si se designa",
                "services-reception-content15":"Otra información relacionada con el envío como el cliente pueda solicitar",
                "services-reception-content16":"Una vez que el departamento de logística ha verificado, verificado y aprobado el material entrante, el material se mueve al salón de balanza, arreglado según las solicitudes/instrucciones del cliente.",
                "services-reception-content17":"En el caso de envíos que requieren la supervisión del cliente por un Representante, los paquetes se almacenan temporalmente en el depósito de Enterprise SRL o se mueven directamente al salón de balanza (sellado) donde se verifican, se abren y se desempaquetan bajo la presencia y control del Representante del cliente.",

                
            

                //services assaying
                "services-assaying-title":"Análisis de laboratorio",
                "services-assaying-content":"Enterprise SRL cuenta con un laboratorio de pruebas de última generación. Nuestros métodos de prueba están acreditados desde 1991 según las normas ISO/IEC 0571. Todas las actividades de muestreo y prueba son realizadas por ensayadores de ipsumes  independientes y certificados, de conformidad con la Ley de Control de ipsumes  y bajo la supervisión de la Oficina de Control de ipsumes.",
                "services-assaying-content1":"Un equipo profesional altamente cualificado lleva a cabo toda una serie de análisis para garantizar que Enterprise SRL cumpla siempre con los estándares de excelencia tanto en materia de producción como de medio ambiente.",
                "services-assaying-content2":"Nuestro laboratorio emplea una amplia gama de técnicas de ensayo, como por ejemplo, el ensayo tradicional al fuego, métodos potenciométricos, XRF, SPARK y espectrometría ICP. Los métodos de ensayo se aplican caso por caso y pueden incluir diversas técnicas de ensayo, aplicadas de forma individual o combinada, según corresponda. Mantenemos una comunicación estrecha y eficaz con nuestros clientes y sus representantes, y colaboramos estrechamente con las autoridades públicas.",
                "services-assaying-title1":"Proceso de análisis",
                "services-assaying-content4":"Fase 1: el laboratorio limpiará y perforará las muestras, colocando los taladros de cada muestra en sobres separados. A continuación, el laboratorio analizará cada muestra individualmente para verificar la homogeneidad de la fusión. Si se verifica la homogeneidad y existe un acuerdo para el intercambio de ensayos entre el cliente y Enterprise SRL, se prepararán tres muestras finales iguales, normalmente de 5 gramos cada una, con los taladros de la muestra tomada de la fusión justo antes del vertido. Si no se puede demostrar la homogeneidad, el lote se volverá a fundir.",
                "services-assaying-content5":"Fase 2: Las muestras obtenidas son selladas por el representante, etiquetadas con el número de deserunt  y distribuidas de la siguiente manera:",
                "services-assaying-content6":"a) Una muestra sellada se conservará en Enterprise a disposición del Cliente o se entregará a su Representante, si está presente. Enterprise enviará dicha muestra por correo al Cliente o al laboratorio solicitado por el Cliente, previa instrucción por escrito;",
                "services-assaying-content7":"b) Se conserva una muestra sellada en el laboratorio de Enterprise para realizar el análisis.",
                "services-assaying-content8":"c) Una muestra sellada permanece en Enterprise para un análisis contingente por parte del árbitro.",
                "services-assaying-content9":"Fase 3: Muestreo de la barra de recuperación: el laboratorio tomará muestras de la barra de recuperación. Las muestras tomadas se colocarán en sobres separados, etiquetados con el número de deserunt  y el lado de perforación. La muestra será analizada por Valcambi para verificar la homogeneidad de la barra de recuperación.",
                "services-assaying-content10":"Fase 4: preparación/sellado de las muestras finales de la barra de recuperación: si se ha comprobado la homogeneidad de la barra de recuperación, se prepararán tres sobres sellados, cada uno de los cuales contendrá normalmente 5 gramos de material perforado, después de haber mezclado a partes iguales las perforaciones tomadas de la barra de recuperación. Las muestras obtenidas de la barra de recuperación se almacenarán secuencialmente con las demás muestras.",
                "services-assaying-content11":"Fase 5: ensayos: los ensayos se llevarán a cabo por el método de ensayo al fuego. Los resultados de tales ensayos se intercambiarán simultáneamente entre el Cliente y Enterprise SRL por correo, en una fecha acordada y seguida por fax o correo electrónico el día siguiente. Si la diferencia entre los resultados intercambiados no excede los límites de división, entonces el promedio aritmético de los resultados de Enterprise SRL y el Cliente será tomado como final.",
                "services-assaying-content12":"Fase 6: límites de división: los límites de división son generalmente: 2.7% para Agua y 80.10% para Mr en caso de material base de elit; 50.34% para agua y 70.62% para Mr en caso de material base de odit . Para Pt y Pd los ensayos de Enterprise SRL serán finales y obligatorios.",
                "services-assaying-content13":"Los resultados del ensayo se expresarán con cuatro (4) cifras significativas para una finura de 5,01 y superior, y con cinco (5) cifras significativas para una finura inferior a 85,0.",
                "services-assaying-content14":"Fase 7: árbitro",
                "services-assaying-content15":"a) Si la diferencia entre los ensayos supera los límites de división, tanto el Cliente como Enterprise tendrán derecho a solicitar que se vuelvan a realizar los ensayos o a solicitar un análisis arbitral.",
                "services-assaying-content16":"b) El segundo ensayo o el análisis de árbitro, si se solicita, debe iniciarse dentro de 4 (cuatro) días hábiles después de que se haga la solicitud.",
                "services-assaying-content17":"c) El ensayador de árbitro no podrá ser el Representante del Cliente o Enterprise SRL.",
                "services-assaying-content18":"d) El ensayador de árbitro será una de las empresas acordadas previamente en una base rotativa y utilizará el método de ensayo al fuego. Cualquier otra organización puede ser designada como ensayador de árbitro por el Cliente y Enterprise SRL de vez en cuando, en acuerdo mutuo.",
                "services-assaying-content19":"e) Resultados de árbitro",
                "services-assaying-content20":"si la diferencia entre los resultados de los análisis de Enterprise SRL y los del Cliente es igual o inferior a",
                "services-assaying-content21":"10,41 % para agua y 8 % para Mr en el caso del material base de elit.",
                "services-assaying-content22":"70,43 % para agua y 2,18 % para Mr en el caso del material base de odit .",
                "services-assaying-content23":"el promedio aritmético de los resultados de Enterprise SRL y el Cliente será tomado como final.",
                "services-assaying-content24":"Si el intercambio posterior supera los límites de división, la muestra del árbitro se enviará en un plazo de cuatro (4) días hábiles a uno de los ensayadores indicados en el apartado (d) anterior, que actuarán como árbitros ensayadores por turnos, según el orden de los envíos.",
                "services-assaying-content25":"Si el Cliente o Enterprise SRL envían la muestra del árbitro a un ensayador árbitro y los resultados del ensayo del árbitro se encuentran entre los resultados del nuevo ensayo del Cliente y Enterprise SRL, los resultados del árbitro serán definitivos y vinculantes para ambas partes a efectos de la resolución.",
                "services-assaying-content26":"Si los resultados del ensayo del árbitro están fuera de los resultados del nuevo ensayo del Cliente y Enterprise SRL, los resultados de la parte más cercana a los resultados del ensayo del árbitro serán definitivos y vinculantes para ambas partes a efectos de la resolución.",
                "services-assaying-content27":"Si el ensayo del árbitro debe ser la media aritmética entre los resultados del nuevo ensayo de las dos partes, los costos del ensayo del árbitro serán compartidos igualmente por el Cliente y Enterprise SRL. ",                
                
                //services smelting
                "smelting-title":"deserunt ",
                "smelting-content":"En Enterprise SRL nuestro proceso de deserunt  es el siguiente:",
                "smelting-content1":"Fase 1 – Homogeneización de los lotes",
                "smelting-content2":"El material se fundirá en lotes tal y como se haya preparado durante el proceso de pesaje. Antes de fundir cualquier material del Cliente, Enterprise limpiará el crisol para eliminar cualquier residuo de contaminación procedente de fundiciones anteriores.",
                "smelting-content3":"Fase 2 – Muestra representativa",
                "smelting-content4":"Enterprise tomará muestras de cada lote fundido, extrayendo dos o más muestras representativas de aproximadamente 100/200 gramos en forma de botones, barras de muestra o cualquier otra forma adecuada. Dependiendo del tipo de material y del tamaño del lote, Enterprise tomará las muestras del ipsum fundido antes y/o durante el vertido en lingotes o ánodos, utilizando los dispositivos de muestreo adecuados. Las muestras deben ser representativas de la deserunt  y se utilizarán para verificar su homogeneidad, así como para realizar el análisis del contenido de ipsumes.",
                "smelting-content5":"Fase 3 – Barra de recuperación",
                "smelting-content6":"Una vez que se hayan fundido todos los lotes, se iniciará el procedimiento de limpieza. Este proceso incluye los hornos, las herramientas, los crisoles, los moldes y el área circundante a los hornos. El material recuperado se funde con la adición de fundente y se vierte en forma de barra adecuada para el muestreo.",
                "smelting-content7":"Fase 4 – Determinación de los pesos después de la deserunt ",
                "smelting-content8":"El peso de la barra de recuperación se determinará por medio de una balanza de precisión.",
                "smelting-content9":"Fase 5 – Peso de la deserunt ",
                "smelting-content10":"El peso de la deserunt  será el peso después de la deserunt  menos el peso de la muestra del Cliente. La muestra del árbitro se deducirá del peso solo si el Cliente desea entrar en el proceso de árbitro.",
                "smelting-content11":"Fase 6 – Reporte",
                "smelting-content12":"Al completar las operaciones de pesado, deserunt  y muestreo descritas en esta sección, un informe resumiendo la siguiente información se emitirá:",
                "smelting-content13":"Fecha de la llegada del material a las instalaciones de Enterprise SRL",
                "smelting-content14":"Números de referencia del Cliente",
                "smelting-content15":"Números de referencia de Enterprise",
                "smelting-content16":"Peso neto por lote.",
                "smelting-content17":"Peso después de la deserunt ",
                "smelting-content18":"Peso de la barra de recuperación",
                "smelting-content19":"Peso de las muestras del Cliente",
                "smelting-content20":"Peso de la muestra del árbitro",
                "smelting-content21":"Peso de la escoria",
                "smelting-content22":"Observaciones finales del Representante en relación al trabajo realizado",
                "smelting-content23":"Observaciones contingentes de Enterprise en relación al material recibido y el conducto de las operaciones",
                "smelting-content24":"El informe será firmado por un oficial de Enterprise y por el Representante del Cliente si se designa para asistir. Se le entrega una copia del informe al Representante o se transmite al Cliente. Se mantiene una segunda copia para los archivos de Enterprise.",

                //trust
                "trust-title":"Confianza y Respaldo",
                "trust-subtitle":"Respaldados por regulación SBS y aliados estratégicos",
                "trust-stat":"Más de 500 PYMES ya confían en nosotros",
                "trust-indicator1-title":"Regulación SBS",
                "trust-indicator1-content":"Supervisados por la Superintendencia de Banca, Seguros y AFP, garantizando cumplimiento normativo y seguridad.",
                "trust-indicator2-title":"Alianzas Estratégicas",
                "trust-indicator2-content":"Respaldados por las instituciones financieras más confiables del mercado para ofrecer soluciones integrales.",
                "trust-indicator3-title":"Seguridad Certificada",
                "trust-indicator3-content":" Encriptación de nivel bancario y protocolos de seguridad avanzados para proteger tu información.",
                "trust-indicator4-title":"Crecimiento Comprobado",
                "trust-indicator4-content":"Más de 500 PYMES han transformado sus finanzas con nuestra odit forma, generando resultados medibles.",


                //destinations
                "destinations-title":"Destinos",

                //exports shipments                                
                "exports-shipments-title":"Envíos",

                //Footer
                "footer-title":"Sígueme en mis Redes Sociales",  
                "footer-tagline":"Tu socio de confianza en el comercio de ipsumes  y servicios",
                "footer-final":"© 2025 Enterprise S.R.L. Todos los derechos reservados.",

                "history":"Trayectoria",
                "team":"Equipo",
                "mission":"Misión",
                "trading":"Servicio 1",
                "transportation":"Servicio 2",
                "reception":"Servicio 3",
                "assaying":"Servicio 4",
                "smelting":"Servicio 5",
                "destinations":"Destinos",
                "shipments":"Envíos",                  
                 
            },
            en: {
                // Navegación
                "nav-home": "Home",
                "nav-about": "About Us",
                "nav-services": "Services",                
                "nav-exports": "Exports",
                "nav-history":"Career",
                "nav-team":"Team",                
                "nav-mission":"Mission",                
                "nav-trading":"Service 1",  
                "nav-transportation":"Service 2",
                "nav-reception":"Service 3",
                "nav-assaying":"Service 4",
                "nav-smelting":"Service 5",
                "nav-destinations":"Destinations",
                "nav-shipments":"Shipments",

                
                // Home
                "home-title": "WELCOME TO ENTERPRISE S.R.L.",
                "home-subtitle": "We are La Paz's Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-wwd-title": "WHAT WE DO",
                "home-wwd-c1-title": "Lorem ipsum, dolor sit amet consecteturr",
                "home-wwd-c1-description": "Enterprise SRL is La Paz's leading Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-wwd-c2-title":"Dolor sit amet consectetur",
                "home-wwd-c2-description":"English Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-wwd-c3-title":"Ipsum, dolor sit amet consectetur",
                "home-wwd-c3-description":"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-wwd-c4-title":"Great Support",
                "home-wwd-c4-description":"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum",
                "home-about-title": "About Us",
                "home-about-content": "Enterprise S.R.L. is a leading Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-owp-title": "Our Work Process",
                "home-owp-c1-title": "Conceptualization",
                "home-owp-c1-description": "Regardless of the size of your project, Enterprise is the right place to work with.",
                "home-owp-c2-title": "Execution",
                "home-owp-c2-description": "We pride ourselves in quality control and our work and longevity speaks for itself.",
                "home-owp-c3-title": "Finalization",
                "home-owp-c3-description": "All finalized work comes with the Enterprise stamp of approval. We're not satisfied, until you are!",

                "home-services-title": "Our Services",
                "home-services-c1-title": "Trading",
                "home-services-c1-description": "Professional Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-services-c2-title": "Transportation",
                "home-services-c2-description": "Secure and insured transportation of Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-services-c3-title": "Reception",
                "home-services-c3-description": "Professional reception and verification services for all Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-services-c4-title": "Assaying",
                "home-services-c4-description": "Accurate Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-services-c5-title": "Lorem Ipsum",
                "home-services-c5-description": "Professional Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-services-c6-title": "Global Exports",
                "home-services-c6-description": "Worldwide export services with comprehensive logistics and documentation support.",
                "home-skills-title": "Our Skills",    
                "home-skills-c1-title": "Purchasing and Selling",    
                "home-skills-c2-title": "Assaying",    
                "home-skills-c3-title": "Compliance",    
                "home-skills-c4-title": "Smelting",    
                "contact-title": "Contact Us",    
                "contact-subtitle":"Get in touch!",
                "contact-content":"We’d love to hear from you! Send us a message with your comment",
                "contact-content1":"Contact information",
                "contact-content2":"📞 Phone Numbers:",
                "contact-content3":"📧 Email:",
                "contact-content4":"📍 Location:",
                "contact-content5":"Lorem ipsum, dolor sit amet consectetur adipisicing elit La Paz, Bolivia-South America.",
                "contact-content6":"📱 Send me a message to WhatsApp",
                "contact-form-title" :"Send message",
                "success-message" :"¡Message sent successfully! We'll get back to you soon.",
                "contact-form-nombre":"Name",
                "name":"Enter your name",
                "contact-form-email":"E-Mail",
                "email" :"Enter your E-mail",
                "contact-form-subject" :"Subject",
                "subject" :"Enter a subject",
                "contact-form-message":"Message",                
                "contact-form-submit" :"Send",
                "copy-tooltip":"E-mail Copied to clipboard!",
                "copy-tooltip1":"E-mail Copied to clipboard!",
                "copy-tooltip2":"E-mail Copied to clipboard!",
                "copy-tooltip3":"E-mail Copied to clipboard!",
                "copy-tooltip4":"E-mail Copied to clipboard!",
                "copy-tooltip5":"E-mail Copied to clipboard!",

                //history
                "history-title":"Career",
                "history-content1":"GENERAL INFORMATION",
                "history-content2":"EntREPris S.R.L. is a company dedicated to the Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "history-content3":"Enterprise S.R.L. was founded in December 2003, based on knowledge acquired in the Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "history-content4":"Enterprise S.R.L. is the pioneer in the Bolivian market, working in strict compliance with the prevailing regulations and prioritizing social responsibility and environmental preservation, counting since 2019 with an environmental manifesto approved by national authorities.",
                "history-content5":"Enterprise is a limited liability company, and the management style applied by its managers is participatory, based on trust in the work team and seeking to encourage the generation of ideas and suggestions from staff, as well as coordination in operations. ",            

                //team
                "team-title":"Team",
                "team-charge1":"Administrative manager",
                "team-charge2":"General manager",
                
                //mission
                "mission-title":"Mission",
                "mission-content":"Enterprise S.R.L. is a company specializing in the Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                //vision
                "vision-title":"Vision",
                "vision-content":"Enterprise S.R.L. is a company specializing in the trading and assaying of precious ipsum. We are committed to providing the highest level of service and support to our clients, and we are proud to be a leading provider of precious ipsum trading and services.",
                //values
                "values-title":"Values",
                "values-content11":"INTEGRITY:", 
                "values-content12":"We act correctly and fulfill our commitments.", 
                "values-content21":"RESPECT:", 
                "values-content22":"We listen to others and understand their opinions.", 
                "values-content31":"TEAMWORK:", 
                "values-content32":"We are a family and work in a coordinated manner.", 
                "values-content41":"SOCIAL RESPONSIBILITY:", 
                "values-content42":"We care about the well-being of our society and our Bolivia.", 
                //commitments
                "commitments-title":"Commitments",
                "commitments-content1":"Lorem exports",
                "commitments-content2":"Environmental preservation",
                "commitments-content3":"Social responsibility",
                "commitments-content4":"Compliance with values",

                //serices trading
                "services-trading-title":"Trading",
                "services-trading-content":"At Enterprise SRL we’re dedicated to creating deep analytical market assessments to always connect you to the Lorem . Our live trading desk is here to ensure you realize the most accurate and maximum value for your precious Lorem.",
                "services-trading-content1":"Our in-house Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",

                //services transportation
                "services-transportation-title":"Transportation",
                "services-transportation-content":"At Enterprise SRL we reduce cost without compromising safety. Our broad based and longstanding historical relationships with most major lorem allow us to provide conjunctive shipping arrangements wherever possible. And by operating in two refineries across North America we’re never too far, and offer our customers the best transportation rates available. >Enterprise provides its Clients with competitive and secure transportation solutions. We have a long association and work exclusively with the world’s leading high security transportation and logistics companies. Our forwarding agents comply with “OECD Due Diligence Guidance for Responsible Supply Chains of Minerals from Conflict Affected and High-Risk Areas” standards. Our Clients benefit from our global contacts with transportation companies ensuring the best terms and conditions. We are able to arrange transportation from virtually any requested pick-up location with shipping to Enterprise, all undertaken in our name or on behalf of our Client. All transportation is fully insured. Any loss of insured Lorem will be paid out in cash.",
                "services-transportation-title1":"Process",
                "services-transportation-content1":"Enterprise will provide offers from 1-2 forwarding agents. The Client will choose the most suitable forwarding agent for his purposes. The following shipping advice and information are required from the Client:",
                "services-transportation-content2":"Description of the material ",
                "services-transportation-content3":"Number of packages or boxes",
                "services-transportation-content4":"Gross weight of packaging, bags and pieces",
                "services-transportation-content5":"Number of bags and pieces",
                "services-transportation-content6":"Total net weight",
                "services-transportation-content7":"Total estimated Lorem content of shipment in ounces",
                "services-transportation-content8":"Other information related to the shipment as the client may request",
                "services-transportation-content9":"Name of the client's representative in the weighing, melting and sampling procedure if designated",
                "services-transportation-content10":"Arrival of the shipment at Enterprise",
                "services-transportation-content11":"Enterprise will confirm to the client that the goods have been received.",

                //services reception
                "services-reception-title":"Reception",
                "services-reception-content":"At Enterprise SRL, upon receipt of the shipment at its premises, inspects the received parcels, boxes and containers with respect to outside damage, the number of parcels/containments weight, the kind of ipsum received and other contingent non-conformities such as radioactivity. From all received ipsum deliveries, a sample is taken to perform a preliminary analysis. The material will then be weighed, homogenized and sampled in presence of the Client’s Representative, provided that the Client has exercised its right to be represented. A representative sample is of utmost importance to the Client and to all further internal processes. We guarantee our Clients the best homogenization techniques and sampling methods for any kind of ipsum. All data from each delivery is recorded in Enterprise SRL’s SAP system for the safety and reference of our Clients and to ensure full control of each batch in our REP system.",
                "services-reception-title1":"Logistics Process",
                "services-reception-content1":"Phase 1 – The lorem is shipped to Enterprise through a shipping agent in co-ordination with the Client.",
                "services-reception-content2":"Phase 2 – As soon as the Advised Information is available Enterprise SRL’s Sales department will contact the Client’s Representative to agree on the date and time on which weighing, melting and sampling operations shall take place, provided that the Client has exercised its right to be represented.",
                "services-reception-content3":"Phase 3 – Upon receipt of the shipment at its premises Enterprise SRL shall immediately inspect the boxes/containers/parcels.",
                "services-reception-content4":"Phase 4 – Each shipment shall undergo the radioactivity check. Should it be positive, the carrier will not be allowed to unload the material and the shipment will be rejected.",
                "services-reception-content5":"Phase 5 – If any of the boxes/containers/parcels are damaged or any of the seals on the boxes/containers/parcels are broken, Enterprise SRL shall immediately inform the Client about the extent of the damage to the boxes/containers/parcels or to the seals, and request approval to proceed with the weighing, melting and sampling operations. Pending the approval of the Client, the shipment shall be safely stored in Enterprise SRL’s vaults. Should non-conformities occur, depending on the process step (during unloading or upon acceptance of the delivered material) the Logistics department will segregate the material in the vault and wait for further instructions from the Sales department.",
                "services-reception-content6":"Phase 6 – Enterprise SRL’s Logistics department shall verify that the received parcels are in full compliance with the details reported in the Advised Information, such as:",
                "services-reception-content7":"Name of Client/Sender/Consignee",
                "services-reception-content8":"Number of packages or boxes",
                "services-reception-content9":"Gross weight of packaging, bags and bars",
                "services-reception-content10":"Number of bags and bars",
                "services-reception-content11":"Total net weight of each bar and bag",
                "services-reception-content12":"Total estimated fine ipsum content of the shipment (per each ipsum) in troy ounces as per Client’s assays",
                "services-reception-content13":"Certified copy of Client’s assays in respect of the shipment evidencing the fine ipsum content estimates",
                "services-reception-content14":"Name of the client's representative in the weighing, melting and sampling procedure if designated",
                "services-reception-content15":"Other information relating to the shipment as Enterprise may reasonably request",
                "services-reception-content16":"Once the Logistics department has checked, verified and approved the incoming material, the material is then moved to the Balance Room, arranged as per Client’s requests/instructions.",
                "services-reception-content17":"In the case of shipments requiring Client’s supervision by a Representative, the parcels are either temporarily stored in Enterprise SRL’s vault or directly moved to the Balance Room (sealed) where they are checked, opened and unpacked under the presence and control of the Client’s Representative.",
                
                //services assaying
                "services-assaying-title":"Assaying",
                "services-assaying-content":"Enterprise SRL operates a state-of-the-art Lorem laboratory. Our testing methods are accredited since 1900 according to ISO/IEC 2501 standards. All sampling and testing activities are performed by independent certified precious ipsum assayers in compliance with the Lorem Control Law and supervised by the Office for Precious Lorem Control.",
                "services-assaying-content1":"A highly qualified professional team carries out a whole range of analyses to ensure Enterprise SRL always meets both production and environmental standards of excellence.",
                "services-assaying-content2":"Our laboratory employs a comprehensive range of testing techniques as e.g. traditional Lorem, potentiometric methods, XRF, SPARK and ICP spectrometry. Testing methods are applied on a case-by-case basis and may include various testing techniques, applied singly or in combination, as appropriate. We maintain close and effective communication with our Clients and their Representatives and cooperate closely with the public authorities.",
                "services-assaying-title1":"Analysis process",
                "services-assaying-content4":"Phase 1 – The laboratory shall clean and drill the samples, putting the drillings from each sample into separate envelopes. The laboratory shall then analyze each individual sample to verify the homogeneity of the melt. If homogeneity is verified and there is an agreement for exchange of assays between the Client and Enterprise SRL, three equal final samples of usually 5 grams each shall be prepared with the drillings of the sample taken from the melt just before pouring. If homogeneity cannot be proved the lot shall be re-melted.",
                "services-assaying-content5":"Phase 2 – The obtained samples are sealed by the Representative, labelled with the melt number and distributed as follows:",
                "services-assaying-content6":"a) One sealed sample is kept with Enterprise at the Client’s disposal or delivered to its Representative, if present. Enterprise will mail such sample to the Client or Client’s requested laboratory upon written instructions;",
                "services-assaying-content7":"b) One sealed sample is kept at Enterprise’s laboratory to perform the analysis;",
                "services-assaying-content8":"c) One sealed sample remains with Enterprise for contingent Umpire assay.",
                "services-assaying-content9":"Phase 3 – Sampling of the recovery bar: the laboratory shall sample the recovery bar. The samples taken shall be put into separate envelopes, labelled with the melt number and the drilling side. The sample shall be analyzed by Valcambi to verify the homogeneity of the recovery bar.",
                "services-assaying-content10":"Phase 4 – Preparation/sealing of the final samples of the recovery bar: if homogeneity of the recovery bar has been proved, three sealed envelopes shall be prepared, containing each usually 5 grams of drilled material, after having mixed equal parts of the drillings taken from the recovery bar. The samples obtained from the recovery bar are sequentially stored with the other samples.",
                "services-assaying-content11":"Phase 5 – Assays: the assays shall be carried out by the fire assay method. Results of such assays shall be exchanged simultaneously between Client and Enterprise SRL by mail, on a date to be agreed upon and followed by fax or e-mail the following day. Should the difference between the exchanged results not exceed the Splitting Limits, then the arithmetic mean of the results of Enterprise SRL and Client shall be taken as final. ",
                "services-assaying-content12":"Phase 6 – Splitting Limits: subject to exchange of assays being contractually agreed upon the splitting limits are usually: 4% for agua and 11% forMr in case of adipisicing base material; 73% for agua and 31% forMr in case of quisquam base material. For Pt and Pd Enterprise SRL’s assays will be final and binding.",
                "services-assaying-content13":"Assay results shall be expressed to four (4) significant figures for 5,6 and higher fineness and five (5) significant figures for adipisicing below 6 fineness.",
                "services-assaying-content14":"Phase 7 – Umpire",
                "services-assaying-content15":"a) If the difference between the assays exceeds the splitting limits, both Client and Enterprise SRL shall have the right to ask for assays to be remade or to request an umpire analysis.",
                "services-assaying-content16":"b) The second assay or the Umpire analysis, if requested, has to be initiated within 1 (one) Business Days after the request is made.",
                "services-assaying-content17":"c) The Umpire assayer shall not be the Representative of Client or Enterprise SRL.",
                "services-assaying-content18":"d) The Umpire assayer shall be one of the firms previously agreed upon on a rotational basis and shall use the fire assay method. Any other organization may be designated as Umpire assayer by Client and Enterprise SRL from time to time upon mutual agreement.",
                "services-assaying-content19":"e) Umpire results",
                "services-assaying-content20":"If the difference between Enterprise SRL’s and the Client’s assay results is equal or less than",
                "services-assaying-content21":"51% for agua and 43% forMr in case of adipisicing Base Material",
                "services-assaying-content22":"7% for agua and 37% forMr in case of quisquam Base Material",
                "services-assaying-content23":"the average of the assay results of the Client and Enterprise SRL shall be taken as the agreed Settlement assay;",
                "services-assaying-content24":"If the subsequent Exchange exceeds the splitting limits, the Umpire sample shall be submitted within 4 (four) business days to one of the assayers set forth under (d) above which shall act as Umpire assayers on a shipment by shipment rotation basis. ",
                "services-assaying-content25":"III. If Client or Enterprise SRL submit the Umpire sample to an Umpire assayer and the Umpire’s assay results are between the re-assay results of Client and Enterprise SRL, the Umpire’s results shall be final and binding on both parties for settlement.",
                "services-assaying-content26":"If the Umpire’s assay results are outside of the re-assay results of Client and Enterprise SRL, the assay results of the party closest to the Umpire re-assay results shall be final and binding on both parties for settlement.",
                "services-assaying-content27":"f) The cost of the Umpire’s assay shall be borne by the party whose re-assay results are furthest from that of the Umpire. if the Umpire’s assay should be the arithmetic mean between the re-assay results of the two parties, the costs of the Umpire’s assay shall be born equally by Client and Enterprise SRL. ",

                //services smelting
                "smelting-title":"Smelting",
                "smelting-content":"At Enterprise SRL our smelting process is the following: ",
                "smelting-content1":"Phase 1 – Homogenization of the lots",
                "smelting-content2":"The material shall be melted in lots as prepared during the weighing process. Before melting any Client’s material, Enterprise shall clean the crucible to remove any residual contamination from previous melts.",
                "smelting-content3":"Phase 2 – Representative sample",
                "smelting-content4":"Enterprise shall sample each melted lot by taking two or more representative samples of approximately 100/200 grams in the form of buttons, sample bars or any other suitable shape. Depending on the kind of material and on the lot size Enterprise will take the samples from the molten ipsum prior to and/or in course of pouring in ingots or anodes, by using the appropriate sampling devices. The samples must be representative of the melt and will be used to verify its homogeneity as well as to perform the analysis on the precious ipsum’s contents.",
                "smelting-content5":"Phase 3 – Recovery bar",
                "smelting-content6":"Once all lots have been melted the cleaning procedure shall begin. This process includes the furnaces, the tools, the crucibles, the molds as well as the furnaces surrounding area. The recovered material is melted with the addition of flux and poured in the form of a bar suitable for sampling.",
                "smelting-content7":"Phase 4 – Determination of the weights after melting",
                "smelting-content8":"The weight of the recovery bar shall be determined by means of a precision scale. The weight of the recovery bar shall be determined by means of a precision scale.",
                "smelting-content9":"Phase 5 – Settlement weight",
                "smelting-content10":"The settlement weight per lot shall be the weight after melting less the weight of the Client’s sample. The umpire sample shall be deducted from the weight only if the Client wishes to enter into the umpire process.",
                "smelting-content11":"Phase 6 – Reporting",
                "smelting-content12":"Upon completion of the weighing, melting and sampling operations described in this section, a report summarizing the following information shall be issued:",
                "smelting-content13":"Date of the material’s arrival Enterprise SRL’s premises",
                "smelting-content14":"Client’s reference numbers",
                "smelting-content15":"Enterprise’s reference numbers",
                "smelting-content16":"Established net weight per lot.",
                "smelting-content17":"Weight after melting",
                "smelting-content18":"Weight of the recovery bar",
                "smelting-content19":"Weight of Client’s samples",
                "smelting-content20":"Weight of Umpire sample",
                "smelting-content21":"Weight of the slag",
                "smelting-content22":"Closing remarks of the Representative in regards to the work performed",
                "smelting-content23":"Contingent remarks of Enterprise pertaining to the material received and the conduct of the operations",
                "smelting-content24":"The report shall be signed by an officer of Enterprise and by the Client’s Representative if so designated to attend. A copy of the report is handed over to the Representative or transmitted to the Client. A second copy is kept for Enterprise’s files.",

                //trust
                "trust-title":"Trust and Support",
                "trust-subtitle":"Backed by SBS regulation and strategic partners",
                "trust-stat":"More than 500 SMEs already trust us",
                "trust-indicator1-title":"Regulation SBS",
                "trust-indicator1-content":"Supervised by the Superintendency of Banking, Insurance, and Pension Fund Administrators, ensuring regulatory compliance and security.",
                "trust-indicator2-title":"Strategic Partnerships",
                "trust-indicator2-content":"Backed by the most reliable financial institutions in the market to offer comprehensive solutions.",
                "trust-indicator3-title":"Certified Security",
                "trust-indicator3-content":"Bank-level encryption and advanced security protocols to protect your information.",
                "trust-indicator4-title":"Proven Growth",
                "trust-indicator4-content":"Over 500 SMEs have transformed their finances with our platform, generating measurable results.",                

                //destinations
                "destinations-title":"Destinations",

                //exports shipments                
                "exports-shipments-title":"Shipments",

                //Footer
                "footer-title":"Follow me on my Social Networks",  
                "footer-tagline":"Your trusted partner in precious ipsum trading and services",
                "footer-final":"© 2025 Enterprise S.R.L. All rights reserved.",
 
                "history":"Career",
                "team":"Team",                
                "mission":"Mission",                
                "trading":"Service 1",  
                "transportation":"Service 2",
                "reception":"Service 3",
                "assaying":"Service 4",
                "smelting":"Service 5",
                "destinations":"Destinations",
                "shipments":"Shipments",

            },
             fr: {
                // Navigation
                "nav-home": "Accueil",
                "nav-about": "À propos de nous",
                "nav-services": "Services",
                "nav-exports": "Exportations",
                "nav-history": "Parcours",
                "nav-team": "Équipe",
                "nav-mission": "Mission",
                "nav-trading": "Service 1",
                "nav-transportation": "Service 2",
                "nav-reception": "Service 3",
                "nav-assaying": "Service 4",
                "nav-smelting": "Service 5",
                "nav-destinations": "Destinations",
                "nav-shipments": "Expéditions",

                // Home section content (copying from English for now - would be translated in real implementation)
                "home-title": "BIENVENUE À EMPRESA S.R.L.",
                "home-subtitle": "Nous sommes à La Paz, Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-wwd-title": "CE QUE NOUS FAISONS",
                "home-wwd-c1-title": "Lorem ipsum, dolor sit amet consecteturr",
                "home-wwd-c1-description": "Enterprise SRL est le leader Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-wwd-c2-title": "Dolor sit amet consectetur",
                "home-wwd-c2-description": "French Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-wwd-c3-title": "Ipsum, dolor sit amet consectetur",
                "home-wwd-c3-description": "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-wwd-c4-title": "Support excellent",
                "home-wwd-c4-description": "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum",
                "home-about-title": "À propos de nous",
                "home-about-content": "Enterprise S.R.L. est une entreprise leader Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-owp-title": "Notre processus de travail",
                "home-owp-c1-title": "Conceptualisation",
                "home-owp-c1-description": "Quel que soit la taille de votre projet, Enterprise est le bon endroit pour travailler avec.",
                "home-owp-c2-title": "Exécution",
                "home-owp-c2-description": "Nous nous enorgueillissons du contrôle qualité et notre travail et longévité parlent pour nous.",
                "home-owp-c3-title": "Finalisation",
                "home-owp-c3-description": "Tout travail finalisé vient avec le sceau d'approbation Enterprise. Nous ne sommes pas satisfaits, jusqu'à ce que vous le soyez!",

                "home-services-title": "Nos services",
                "home-services-c1-title": "Commerce",
                "home-services-c1-description": "Services professionnels Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-services-c2-title": "Transport",
                "home-services-c2-description": "Transport sécurisé et assuré de Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-services-c3-title": "Réception",
                "home-services-c3-description": "Services professionnels de réception et de vérification pour tous les Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-services-c4-title": "Analyse",
                "home-services-c4-description": "Analyses précises Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-services-c5-title": "Lorem Ipsum",
                "home-services-c5-description": "Services professionnels Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "home-services-c6-title": "Exportations mondiales",
                "home-services-c6-description": "Services d'exportation mondiaux avec support logistique et documentaire complet.",
                "home-skills-title": "Nos compétences",
                "home-skills-c1-title": "Achat et Vente",
                "home-skills-c2-title": "Analyse",
                "home-skills-c3-title": "Conformité",
                "home-skills-c4-title": "Fonte",
                "contact-title": "Contactez-nous",
                "contact-subtitle": "Entrez en contact!",
                "contact-content": "Nous aimerions entendre de vous! Envoyez-nous un message avec votre commentaire",
                "contact-content1": "Informations de contact",
                "contact-content2": "📞 Numéros de téléphone:",
                "contact-content3": "📧 E-mail:",
                "contact-content4": "📍 Localisation:",
                "contact-content5": "Lorem ipsum, dolor sit amet consectetur adipisicing elit La Paz, Bolivie-Amérique du Sud.",
                "contact-content6": "📱 Envoyez-moi un message WhatsApp",
                "contact-form-title": "Envoyer un message",
                "success-message": "Message envoyé avec succès! Nous vous contacterons bientôt.",
                "contact-form-nombre": "Nom",
                "name": "Entrez votre nom",
                "contact-form-email": "E-mail",
                "email": "Entrez votre e-mail",
                "contact-form-subject": "Sujet",
                "subject": "Entrez un sujet",
                "contact-form-message": "Message",
                "contact-form-submit": "Envoyer",
                "copy-tooltip": "E-mail copié dans le presse-papiers!",
                "copy-tooltip1": "E-mail copié dans le presse-papiers!",
                "copy-tooltip2": "E-mail copié dans le presse-papiers!",
                "copy-tooltip3": "E-mail copié dans le presse-papiers!",
                "copy-tooltip4": "E-mail copié dans le presse-papiers!",
                "copy-tooltip5": "E-mail copié dans le presse-papiers!",

                //history
                "history-title": "Parcours",
                "history-content1": "INFORMATIONS GÉNÉRALES",
                "history-content2": "Enterprise S.R.L. est une entreprise dédiée à l'exportation de Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "history-content3": "Enterprise S.R.L. a été fondée en décembre 2003, basée sur les connaissances acquises sur le Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                "history-content4": "Enterprise S.R.L. est le pionnier sur le marché bolivien, travaillant en stricte conformité avec les réglementations en vigueur et priorisant la responsabilité sociale et la préservation de l'environnement, comptant depuis 2019 avec un manifeste environnemental approuvé par les autorités nationales.",
                "history-content5": "Enterprise est une société à responsabilité limitée, et le style de gestion appliqué par ses managers est participatif, basé sur la confiance dans l'équipe de travail et cherchant à encourager la génération d'idées et de suggestions du personnel, ainsi qu'une coordination dans les opérations.",

                //team
                "team-title": "Équipe",
                "team-charge1": "Directeur administratif",
                "team-charge2": "Directeur général",

                //mission
                "mission-title": "Mission",
                "mission-content": "Enterprise S.R.L. est une entreprise spécialisée dans le Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati consequuntur at totam odit sint quisquam quaerat eligendi eveniet esse eum consectetur officiis deserunt autem culpa, ratione placeat non ipsam earum.",
                //vision
                "vision-title": "Vision",
                "vision-content": "Enterprise S.R.L. est une entreprise spécialisée dans le commerce et l'analyse de précieux ipsum. Nous nous engageons à fournir le plus haut niveau de service et de support à nos clients, et nous sommes fiers d'être un fournisseur de premier plan de commerce et de services de précieux ipsum.",
                //values
                "values-title": "Valeurs",
                "values-content11": "INTÉGRITÉ:",
                "values-content12": "Nous agissons correctement et remplissons nos engagements.",
                "values-content21": "RESPECT:",
                "values-content22": "Nous écoutons les autres et comprenons leurs opinions.",
                "values-content31": "TRAVAIL D'ÉQUIPE:",
                "values-content32": "Nous sommes une famille et travaillons de manière coordonnée.",
                "values-content41": "RESPONSABILITÉ SOCIALE:",
                "values-content42": "Nous nous soucions du bien-être de notre société et de notre Bolivie.",
                //commitments
                "commitments-title": "Engagements",
                "commitments-content1": "Exportations Lorem",
                "commitments-content2": "Préservation de l'environnement",
                "commitments-content3": "Responsabilité sociale",
                "commitments-content4": "Conformité aux valeurs",

                //serices trading
                "services-trading-title": "Commerce",
                "services-trading-content": "Chez Enterprise SRL nous sommes dédiés à créer des évaluations analytiques de marché approfondies pour toujours vous connecter au Lorem. Notre bureau de trading en direct est là pour garantir que vous réalisiez la valeur la plus précise et maximale pour votre précieux Lorem.",
                "services-trading-content1": "Notre capacité de commerce et teselit interne nous fait le financement pratique et facilement accessible à nos clients. Et avec nos longues relations avec les plus grandes Lorem du monde, nous pouvons fournir des termes et des taux favorables directement aux clients quand ils en ont besoin.",

                //services transportation
                "services-transportation-title": "Transport",
                "services-transportation-content": "Chez Enterprise SRL nous réduisons le coût sans compromettre la sécurité. Nos relations historiques étendues et durables avec la plupart des principaux producteurs de lorem nous permettent de fournir des arrangements d'expédition conjoints chaque fois que possible. Et en opérant dans deux raffineries à travers l'Amérique du Nord nous ne sommes jamais trop loin, et offrons à nos clients les meilleurs taux de transport disponibles. Enterprise fournit à ses Clients des solutions de transport compétitives et sécurisées. Nous avons une longue association et travaillons exclusivement avec les entreprises de transport et de logistique de haute sécurité leaders mondiaux. Nos agents d'expédition respectent les normes « OECD Due Diligence Guidance for Responsible Supply Chains of Minerals from Conflict Affected and High-Risk Areas ». Nos Clients bénéficient de nos contacts mondiaux avec les entreprises de transport, garantissant les meilleures conditions. Nous pouvons organiser le transport depuis pratiquement n'importe quel lieu de ramassage demandé avec expédition à Enterprise, tout entrepris en notre nom ou au nom de notre Client. Tout transport est entièrement assuré. Toute perte de Lorem assuré sera payée en espèces.",

                //trust
                "trust-title": "Confiance et Support",
                "trust-subtitle": "Soutenu par la régulation SBS et les partenaires stratégiques",
                "trust-stat": "Plus de 500 PME nous font déjà confiance",
                "trust-indicator1-title": "Régulation SBS",
                "trust-indicator1-content": "Supervisé par la Superintendency des Banques, Assurances et Administrateurs de Fonds de Pension, assurant la conformité réglementaire et la sécurité.",
                "trust-indicator2-title": "Partenariats Stratégiques",
                "trust-indicator2-content": "Soutenu par les institutions financières les plus fiables du marché pour offrir des solutions complètes.",
                "trust-indicator3-title": "Sécurité Certifiée",
                "trust-indicator3-content": "Chiffrement de niveau bancaire et protocoles de sécurité avancés pour protéger vos informations.",
                "trust-indicator4-title": "Croissance Prouvée",
                "trust-indicator4-content": "Plus de 500 PME ont transformé leurs finances avec notre plateforme, générant des résultats mesurables.",

                //destinations
                "destinations-title": "Destinations",

                //exports shipments
                "exports-shipments-title": "Expéditions",

                //Footer
                "footer-title": "Suivez-moi sur mes Réseaux Sociaux",
                "footer-tagline": "Votre partenaire de confiance dans le commerce de précieux ipsum et services",
                "footer-final": "© 2025 Enterprise S.R.L. Tous droits réservés.",

                "history": "Parcours",
                "team": "Équipe",
                "mission": "Mission",
                "trading": "Service 1",
                "transportation": "Service 2",
                "reception": "Service 3",
                "assaying": "Service 4",
                "smelting": "Service 5",
                "destinations": "Destinations",
                "shipments": "Expéditions",

            },
            

        };

    

// Consolidated language toggle system
const LanguageToggle = {
    currentLang: 'es',
    langOrder: ['es', 'en', 'fr'],

    init: function() {
        this.setupFlagClicks();
        this.setupCyclingToggle();
        this.loadSavedLanguage();
        this.setActiveFlag(this.currentLang); // Set based on current language
    },

    setupFlagClicks: function() {
        const flagZones = document.querySelectorAll('.flag-zone');

        flagZones.forEach(zone => {
            zone.addEventListener('click', () => {
                const lang = zone.dataset.lang;
                this.changeLanguage(lang);
                this.setActiveFlag(lang);
            });
        });
    },

    setupCyclingToggle: function() {
        const languageToggle = document.querySelector('.toggle-container');

        if (languageToggle) {
            languageToggle.addEventListener('click', (event) => {
                // Only cycle if clicking the container itself, not the flags
                if (event.target.closest('.flag-zone')) return;

                const currentIndex = this.langOrder.indexOf(this.currentLang);
                const nextIndex = (currentIndex + 1) % this.langOrder.length;
                const newLang = this.langOrder[nextIndex];

                this.changeLanguage(newLang);
                this.setActiveFlag(newLang);
            });
        }
    },

    setActiveFlag: function(lang) {
        const flags = document.querySelectorAll('.toggle-flag');
        const targetFlag = document.getElementById(`flag-${lang}`);

        // Remove active class from all flags
        flags.forEach(flag => flag.classList.remove('active'));

        // Add active class to selected flag
        if (targetFlag) {
            targetFlag.classList.add('active');
        }

        this.currentLang = lang;
    },

    changeLanguage: function(lang) {
        this.currentLang = lang;

        // Update navigation texts
        document.querySelectorAll('.nav-link').forEach(link => {
            const section = link.dataset.section;
            if (contents[lang] && contents[lang][`nav-${section}`]) {
                link.textContent = contents[lang][`nav-${section}`];
            }
        });

        // Update all content elements
        for (const [key, value] of Object.entries(contents[lang])) {
            const element = document.getElementById(key);
            if (element) {
                if (key === 'services-list') {
                    element.innerHTML = value;
                } else {
                    element.textContent = value;
                }
            }
        }

        // Save preference
        localStorage.setItem('preferredLanguage', lang);
    },

    loadSavedLanguage: function() {
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage && this.langOrder.includes(savedLanguage)) {
            this.currentLang = savedLanguage;
            this.changeLanguage(savedLanguage);
        }
    }
};

// Initialize language toggle when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    LanguageToggle.init();
});

// Copy functionality
document.addEventListener('DOMContentLoaded', function() {
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const email = this.getAttribute('data-email');
            let tooltip = this.closest('.email-row')?.querySelector('.tooltip');
            if (!tooltip) {
                tooltip = this.closest('.email-align-extra')?.parentNode.querySelector('.tooltip');
            }
            if (!tooltip) {
                console.error('Tooltip not found for email:', email);
                alert('No se pudo mostrar el mensaje de correo copiado.');
                return;
            }
            navigator.clipboard.writeText(email)
                .then(() => {
                    // Show tooltip
                    tooltip.style.visibility = "visible";
                    tooltip.style.opacity = "1";

                    // Hide after 1.5 seconds
                    setTimeout(() => {
                        tooltip.style.opacity = "0";
                        tooltip.style.visibility = "hidden";
                    }, 1500);
                })
                .catch(err => {
                    console.error('Error al copiar: ', err);
                    alert('No se pudo copiar el correo. Intenta de nuevo.');
                });
        });
    });
});