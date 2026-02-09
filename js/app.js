class ColorPersonalityApp {
    constructor() {
        this.currentQuestion = 0;
        this.answers = [];
        this.resultType = null;
        this.hideLoader();
        this.init();
    }

    hideLoader() {
        window.addEventListener('load', () => {
            const loader = document.getElementById('app-loader');
            if (loader) {
                loader.classList.add('hidden');
                setTimeout(() => loader.remove(), 300);
            }
        });
    }

    async init() {
        try {
            if (window.i18n && typeof window.i18n.init === 'function') {
                await i18n.init();
            }
        } catch (e) {
            console.warn('i18n init failed:', e.message);
        }
        this.setupEventListeners();
        this.setupServiceWorker();
    }

    setupEventListeners() {
        // 시작 버튼
        const startBtn = document.getElementById('start-btn');
        if (startBtn) startBtn.addEventListener('click', () => this.startQuiz());

        // 뒤로가기 버튼
        const progressBack = document.getElementById('progress-back');
        const resultBack = document.getElementById('result-back');
        if (progressBack) progressBack.addEventListener('click', () => this.goBack());
        if (resultBack) resultBack.addEventListener('click', () => this.goBack());

        // 다시 하기 버튼
        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) retryBtn.addEventListener('click', () => this.resetQuiz());

        // 언어 선택기
        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => this.toggleLangMenu());
        }

        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.getAttribute('data-lang');
                if (lang) this.changeLang(lang);
            });
        });

        // 공유 버튼
        const shareDownload = document.getElementById('share-download');
        const shareKakao = document.getElementById('share-kakao');
        const shareTwitter = document.getElementById('share-twitter');
        const shareFacebook = document.getElementById('share-facebook');
        const shareCopy = document.getElementById('share-copy');
        if (shareDownload) shareDownload.addEventListener('click', () => this.downloadResultImage());
        if (shareKakao) shareKakao.addEventListener('click', () => this.shareKakao());
        if (shareTwitter) shareTwitter.addEventListener('click', () => this.shareTwitter());
        if (shareFacebook) shareFacebook.addEventListener('click', () => this.shareFacebook());
        if (shareCopy) shareCopy.addEventListener('click', () => this.shareCopy());

        // 프리미엄 분석 버튼
        const premiumBtn = document.getElementById('premium-btn');
        if (premiumBtn) premiumBtn.addEventListener('click', () => this.showPremiumAnalysis());

        // Initialize Theme Toggle
        this.initTheme();

        // Google Analytics
        this.setupGA();
    }

    setupGA() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: 'Color Personality Test',
                page_location: window.location.href
            });
        }
    }

    toggleLangMenu() {
        const menu = document.getElementById('lang-menu');
        menu.classList.toggle('hidden');
    }

    async changeLang(lang) {
        await i18n.setLanguage(lang);
        document.getElementById('lang-menu').classList.add('hidden');

        // 현재 화면 업데이트
        if (this.currentQuestion > 0 && this.resultType === null) {
            this.displayQuestion();
        } else if (this.resultType) {
            this.displayResult();
        }
    }

    startQuiz() {
        // GA4: 테스트 시작
        if (typeof gtag !== 'undefined') {
            gtag('event', 'test_start', {
                app_name: 'color-personality',
                content_type: 'test',
                event_category: 'engagement'
            });
        }

        this.showScreen('quiz-screen');
        this.currentQuestion = 0;
        this.answers = [];
        this.displayQuestion();
    }

    displayQuestion() {
        const question = QUIZ_QUESTIONS[this.currentQuestion];

        // 진행바 업데이트
        const progress = ((this.currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;
        document.getElementById('progress-fill').style.width = progress + '%';
        document.getElementById('current-question').textContent = this.currentQuestion + 1;

        // 질문 텍스트
        document.getElementById('question-text').textContent = i18n.t(question.textKey);

        // 선택지 생성
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';

        question.options.forEach((option, index) => {
            const optionEl = document.createElement('button');
            optionEl.className = 'option';
            optionEl.textContent = i18n.t(option.textKey);
            optionEl.addEventListener('click', () => this.selectOption(index));
            optionsContainer.appendChild(optionEl);
        });
    }

    selectOption(index) {
        this.answers.push(index);
        this.currentQuestion++;

        if (this.currentQuestion < QUIZ_QUESTIONS.length) {
            // 다음 질문
            this.showScreen('quiz-screen');
            setTimeout(() => this.displayQuestion(), 300);
        } else {
            // 분석 화면
            this.showScreen('analyzing-screen');
            setTimeout(() => this.calculateResult(), 1500);
        }
    }

    calculateResult() {
        // 점수 계산
        const scores = {};

        Object.keys(COLOR_TYPES).forEach(type => {
            scores[type] = 0;
        });

        this.answers.forEach((answerIndex, questionIndex) => {
            const question = QUIZ_QUESTIONS[questionIndex];
            const option = question.options[answerIndex];

            Object.entries(option.types).forEach(([type, points]) => {
                scores[type] = (scores[type] || 0) + points;
            });
        });

        // 최고 점수 찾기
        let maxScore = 0;
        this.resultType = 'red';

        Object.entries(scores).forEach(([type, score]) => {
            if (score > maxScore) {
                maxScore = score;
                this.resultType = type;
            }
        });

        // Google Analytics: 테스트 완료
        if (typeof gtag !== 'undefined') {
            gtag('event', 'test_complete', {
                app_name: 'color-personality',
                event_category: 'engagement',
                result_type: this.resultType
            });
        }

        // 결과 화면 표시
        setTimeout(() => {
            this.showScreen('result-screen');
            this.displayResult();
        }, 500);
    }

    displayResult() {
        const typeData = COLOR_TYPES[this.resultType];
        const compatibility = getColorCompatibility(this.resultType);

        // 결과 헤더 - 색상 원
        const colorCircle = document.getElementById('result-color-circle');
        colorCircle.style.background = typeData.colorGradient;
        colorCircle.textContent = typeData.emoji;

        document.getElementById('result-title').textContent = i18n.t(typeData.nameKey);
        document.getElementById('result-tagline').textContent = i18n.t(typeData.taglineKey);

        // 설명
        document.getElementById('result-description').innerHTML = `<p>${i18n.t(typeData.descriptionKey)}</p>`;

        // 색상 의미
        document.getElementById('color-meaning-text').textContent = i18n.t(typeData.meaningKey);

        // 강점
        const strengthsList = document.getElementById('strengths-list');
        strengthsList.innerHTML = '';
        typeData.strengthsKey.forEach(key => {
            const li = document.createElement('li');
            li.textContent = i18n.t(key);
            strengthsList.appendChild(li);
        });

        // 약점
        const weaknessesList = document.getElementById('weaknesses-list');
        weaknessesList.innerHTML = '';
        typeData.weaknessesKey.forEach(key => {
            const li = document.createElement('li');
            li.textContent = i18n.t(key);
            weaknessesList.appendChild(li);
        });

        // 호환성 - 어울리는 색상
        const compatibleList = document.getElementById('compatible-list');
        compatibleList.innerHTML = '';
        compatibility.compatible.forEach(type => {
            const item = document.createElement('div');
            item.className = 'type-item';
            item.textContent = `${COLOR_TYPES[type].emoji} ${i18n.t(COLOR_TYPES[type].nameKey)}`;
            compatibleList.appendChild(item);
        });

        // 호환성 - 주의할 색상
        const incompatibleList = document.getElementById('incompatible-list');
        incompatibleList.innerHTML = '';
        compatibility.incompatible.forEach(type => {
            const item = document.createElement('div');
            item.className = 'type-item';
            item.textContent = `${COLOR_TYPES[type].emoji} ${i18n.t(COLOR_TYPES[type].nameKey)}`;
            incompatibleList.appendChild(item);
        });

        // 프리미엄 콘텐츠 초기화
        document.getElementById('premium-content').classList.add('hidden');

        // Confetti 효과
        this.createConfetti();
    }

    createConfetti() {
        const container = document.getElementById('confetti-container');
        container.innerHTML = '';

        for (let i = 0; i < 30; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';

            const typeData = COLOR_TYPES[this.resultType];
            confetti.style.backgroundColor = typeData.colorValue;
            confetti.style.delay = Math.random() * 0.5 + 's';

            container.appendChild(confetti);

            setTimeout(() => confetti.remove(), 3500);
        }
    }

    generateResultImage() {
        const canvas = document.getElementById('result-canvas');
        const ctx = canvas.getContext('2d');

        // 캔버스 크기 설정 (800x600)
        canvas.width = 800;
        canvas.height = 600;

        const typeData = COLOR_TYPES[this.resultType];

        // 배경 그라데이션
        const gradient = ctx.createLinearGradient(0, 0, 800, 600);
        gradient.addColorStop(0, '#0f0f23');
        gradient.addColorStop(1, '#1a1a3f');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);

        // 색상 원 그리기
        const colorGradient = ctx.createLinearGradient(200, 100, 400, 300);
        colorGradient.addColorStop(0, typeData.colorValue);
        colorGradient.addColorStop(1, typeData.colorValue);
        ctx.fillStyle = colorGradient;
        ctx.beginPath();
        ctx.arc(300, 200, 80, 0, Math.PI * 2);
        ctx.fill();

        // 제목
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(i18n.t(typeData.nameKey), 400, 380);

        // 태그라인
        ctx.fillStyle = '#b0b0b0';
        ctx.font = '24px sans-serif';
        ctx.fillText(i18n.t(typeData.taglineKey), 400, 430);

        // 로고
        ctx.fillStyle = '#ff6b6b';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🎨 Color Personality Test', 400, 550);

        return canvas;
    }

    downloadResultImage() {
        const typeData = COLOR_TYPES[this.resultType];
        const canvas = this.generateResultImage();
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `color-personality-${this.resultType}-${new Date().getTime()}.png`;
        link.click();

        if (typeof gtag !== 'undefined') {
            gtag('event', 'download_image', {
                event_category: 'share',
                color_type: this.resultType
            });
        }
    }

    shareKakao() {
        const typeData = COLOR_TYPES[this.resultType];
        const resultUrl = window.location.href;
        const resultType = i18n.t(typeData.nameKey);

        if (typeof Kakao !== 'undefined') {
            Kakao.Share.sendDefault({
                objectType: 'feed',
                content: {
                    title: '나의 성격 색상 테스트 결과',
                    description: `나의 성격 색상: ${resultType} ${typeData.emoji}`,
                    imageUrl: 'https://dopabrain.com/color-personality/icon-512.svg',
                    link: {
                        mobileWebUrl: resultUrl,
                        webUrl: resultUrl
                    }
                },
                buttons: [
                    {
                        title: '테스트하기',
                        link: {
                            mobileWebUrl: resultUrl,
                            webUrl: resultUrl
                        }
                    }
                ]
            });
        } else {
            this.shareCopy();
        }

        if (typeof gtag !== 'undefined') {
            gtag('event', 'share', {
                method: 'kakao',
                color_type: this.resultType
            });
        }
    }

    shareTwitter() {
        const typeData = COLOR_TYPES[this.resultType];
        const resultType = i18n.t(typeData.nameKey);
        const text = `나의 성격 색상은 ${resultType}${typeData.emoji}입니다! 당신의 성격 색상은 무엇일까요?`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;

        window.open(url, '_blank', 'width=550,height=420');

        if (typeof gtag !== 'undefined') {
            gtag('event', 'share', {
                method: 'twitter',
                color_type: this.resultType
            });
        }
    }

    shareFacebook() {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
        window.open(url, '_blank', 'width=550,height=420');

        if (typeof gtag !== 'undefined') {
            gtag('event', 'share', {
                method: 'facebook',
                color_type: this.resultType
            });
        }
    }

    shareCopy() {
        const typeData = COLOR_TYPES[this.resultType];
        const resultType = i18n.t(typeData.nameKey);
        const text = `나의 성격 색상은 ${resultType}${typeData.emoji}입니다! ${window.location.href}`;

        navigator.clipboard.writeText(text).then(() => {
            alert(i18n.t('message.copy_success'));

            if (typeof gtag !== 'undefined') {
                gtag('event', 'share', {
                    method: 'copy',
                    color_type: this.resultType
                });
            }
        }).catch(() => {
            alert(i18n.t('message.copy_error'));
        });
    }

    showPremiumAnalysis() {
        // 광고 표시
        if (typeof window.adsbygoogle !== 'undefined') {
            window.adsbygoogle = window.adsbygoogle || [];
            window.adsbygoogle.push({});
        }

        // 프리미엄 콘텐츠 표시
        const content = document.getElementById('premium-content');
        const typeData = COLOR_TYPES[this.resultType];

        const analysis = document.createElement('div');
        analysis.innerHTML = `
            <p>${i18n.t(typeData.deepAnalysisKey)}</p>
        `;

        content.innerHTML = '';
        content.appendChild(analysis);
        content.classList.remove('hidden');

        document.getElementById('premium-btn').disabled = true;

        if (typeof gtag !== 'undefined') {
            gtag('event', 'premium_content_viewed', {
                event_category: 'engagement',
                color_type: this.resultType
            });
        }
    }

    goBack() {
        // 인트로로 돌아가기
        this.resetQuiz();
    }

    resetQuiz() {
        this.currentQuestion = 0;
        this.answers = [];
        this.resultType = null;
        this.showScreen('intro-screen');
    }

    showScreen(screenId) {
        // 모든 스크린 숨기기
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // 선택한 스크린 보이기
        document.getElementById(screenId).classList.add('active');

        // 스크롤 상단으로
        window.scrollTo(0, 0);
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            // 현재 폴더에 sw.js가 없어도 부모 폴더의 sw를 사용할 수 있음
            // 또는 프로젝트마다 sw.js를 만들 수 있음
        }
    }

    // Theme Toggle Function
    initTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const html = document.documentElement;

        // Load theme preference from localStorage
        const savedTheme = localStorage.getItem('app-theme') || 'dark';
        html.setAttribute('data-theme', savedTheme);
        this.updateThemeButton(savedTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = html.getAttribute('data-theme') || 'dark';
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('app-theme', newTheme);
                this.updateThemeButton(newTheme);
            });
        }
    }

    updateThemeButton(theme) {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
            themeToggle.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
        }
    }
}

// 앱 시작
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ColorPersonalityApp();
});
