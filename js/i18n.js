(function() {
    try {
        class I18n {
            constructor() {
                this.translations = {};
                this.supportedLanguages = ['ko', 'en', 'ja', 'zh', 'es', 'pt', 'id', 'tr', 'de', 'fr', 'hi', 'ru'];
                this.currentLang = this.detectLanguage();
                this.isLoading = false;
            }

            detectLanguage() {
                try {
                    const saved = localStorage.getItem('preferredLanguage');
                    if (saved && this.supportedLanguages.includes(saved)) {
                        return saved;
                    }
                } catch (e) {
                    // localStorage not available
                }

                const browserLang = navigator.language.split('-')[0].toLowerCase();
                if (this.supportedLanguages.includes(browserLang)) {
                    return browserLang;
                }

                return 'ko';
            }

            async loadTranslations(lang) {
                if (this.isLoading) return;

                try {
                    this.isLoading = true;

                    if (this.translations[lang]) {
                        this.isLoading = false;
                        return this.translations[lang];
                    }

                    const response = await fetch('js/locales/' + lang + '.json');
                    if (!response.ok) {
                        throw new Error('Failed to load language: ' + lang);
                    }

                    const data = await response.json();
                    this.translations[lang] = data;
                    this.isLoading = false;
                    return data;
                } catch (error) {
                    console.error('Error loading translations:', error);
                    this.isLoading = false;
                    if (lang !== 'ko') {
                        return this.loadTranslations('ko');
                    }
                }
            }

            t(key) {
                const keys = key.split('.');
                let value = this.translations[this.currentLang];

                if (!value) {
                    return key;
                }

                for (const k of keys) {
                    if (value && typeof value === 'object' && k in value) {
                        value = value[k];
                    } else {
                        return key;
                    }
                }

                return value || key;
            }

            async setLanguage(lang) {
                if (!this.supportedLanguages.includes(lang)) {
                    console.warn('Unsupported language: ' + lang);
                    return;
                }

                this.currentLang = lang;
                try {
                    localStorage.setItem('preferredLanguage', lang);
                } catch (e) {
                    // localStorage not available
                }
                await this.loadTranslations(lang);
                this.updateUI();
                this.updateLangButtons();
            }

            updateUI() {
                document.querySelectorAll('[data-i18n]').forEach(function(element) {
                    var key = element.getAttribute('data-i18n');
                    var text = window.i18n.t(key);

                    if (element.tagName === 'META') {
                        element.setAttribute('content', text);
                    } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        if (element.placeholder) {
                            element.placeholder = text;
                        }
                    } else {
                        element.textContent = text;
                    }
                });
            }

            updateLangButtons() {
                var self = this;
                document.querySelectorAll('.lang-option').forEach(function(btn) {
                    if (btn.getAttribute('data-lang') === self.currentLang) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }

            getCurrentLanguage() {
                return this.currentLang;
            }

            async init() {
                await this.loadTranslations(this.currentLang);
                this.updateUI();
                this.updateLangButtons();
            }
        }

        window.i18n = new I18n();
    } catch (e) {
        console.error('i18n initialization failed:', e);
        // Fallback: provide a minimal i18n object so the app doesn't break
        window.i18n = {
            t: function(key) { return key; },
            init: function() { return Promise.resolve(); },
            setLanguage: function() { return Promise.resolve(); },
            getCurrentLanguage: function() { return 'ko'; },
            updateUI: function() {},
            updateLangButtons: function() {}
        };
    }
})();
