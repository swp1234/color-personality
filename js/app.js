// Color Mixing Lab - Interactive color-mixing personality experience
// Phase 1: Spectrum slider (3 rounds) + Phase 2: Palette comparison (4 rounds)

const COLOR_TYPES = {
    red: {
        nameKey: 'colors.red.name',
        taglineKey: 'colors.red.tagline',
        descriptionKey: 'colors.red.description',
        colorValue: '#ff6b6b',
        colorGradient: 'linear-gradient(135deg, #ff6b6b, #ff8787)',
        emoji: '',
        meaningKey: 'colors.red.meaning',
        strengthsKey: ['colors.red.strength1', 'colors.red.strength2', 'colors.red.strength3'],
        weaknessesKey: ['colors.red.weakness1', 'colors.red.weakness2'],
        hueRange: [0, 30]
    },
    orange: {
        nameKey: 'colors.orange.name',
        taglineKey: 'colors.orange.tagline',
        descriptionKey: 'colors.orange.description',
        colorValue: '#ff9f43',
        colorGradient: 'linear-gradient(135deg, #ff9f43, #ff7675)',
        emoji: '',
        meaningKey: 'colors.orange.meaning',
        strengthsKey: ['colors.orange.strength1', 'colors.orange.strength2', 'colors.orange.strength3'],
        weaknessesKey: ['colors.orange.weakness1', 'colors.orange.weakness2'],
        hueRange: [15, 45]
    },
    yellow: {
        nameKey: 'colors.yellow.name',
        taglineKey: 'colors.yellow.tagline',
        descriptionKey: 'colors.yellow.description',
        colorValue: '#ffd93d',
        colorGradient: 'linear-gradient(135deg, #ffd93d, #ffed4e)',
        emoji: '',
        meaningKey: 'colors.yellow.meaning',
        strengthsKey: ['colors.yellow.strength1', 'colors.yellow.strength2', 'colors.yellow.strength3'],
        weaknessesKey: ['colors.yellow.weakness1', 'colors.yellow.weakness2'],
        hueRange: [40, 70]
    },
    green: {
        nameKey: 'colors.green.name',
        taglineKey: 'colors.green.tagline',
        descriptionKey: 'colors.green.description',
        colorValue: '#00b894',
        colorGradient: 'linear-gradient(135deg, #00b894, #1dd1a1)',
        emoji: '',
        meaningKey: 'colors.green.meaning',
        strengthsKey: ['colors.green.strength1', 'colors.green.strength2', 'colors.green.strength3'],
        weaknessesKey: ['colors.green.weakness1', 'colors.green.weakness2'],
        hueRange: [90, 170]
    },
    blue: {
        nameKey: 'colors.blue.name',
        taglineKey: 'colors.blue.tagline',
        descriptionKey: 'colors.blue.description',
        colorValue: '#4ecdc4',
        colorGradient: 'linear-gradient(135deg, #4ecdc4, #45b7aa)',
        emoji: '',
        meaningKey: 'colors.blue.meaning',
        strengthsKey: ['colors.blue.strength1', 'colors.blue.strength2', 'colors.blue.strength3'],
        weaknessesKey: ['colors.blue.weakness1', 'colors.blue.weakness2'],
        hueRange: [170, 250]
    },
    purple: {
        nameKey: 'colors.purple.name',
        taglineKey: 'colors.purple.tagline',
        descriptionKey: 'colors.purple.description',
        colorValue: '#a29bfe',
        colorGradient: 'linear-gradient(135deg, #a29bfe, #9b59b6)',
        emoji: '',
        meaningKey: 'colors.purple.meaning',
        strengthsKey: ['colors.purple.strength1', 'colors.purple.strength2', 'colors.purple.strength3'],
        weaknessesKey: ['colors.purple.weakness1', 'colors.purple.weakness2'],
        hueRange: [250, 310]
    },
    pink: {
        nameKey: 'colors.pink.name',
        taglineKey: 'colors.pink.tagline',
        descriptionKey: 'colors.pink.description',
        colorValue: '#ff6b9d',
        colorGradient: 'linear-gradient(135deg, #ff6b9d, #ff85a2)',
        emoji: '',
        meaningKey: 'colors.pink.meaning',
        strengthsKey: ['colors.pink.strength1', 'colors.pink.strength2', 'colors.pink.strength3'],
        weaknessesKey: ['colors.pink.weakness1', 'colors.pink.weakness2'],
        hueRange: [310, 345]
    },
    white: {
        nameKey: 'colors.white.name',
        taglineKey: 'colors.white.tagline',
        descriptionKey: 'colors.white.description',
        colorValue: '#e8e8f0',
        colorGradient: 'linear-gradient(135deg, #e8e8f0, #f5f5ff)',
        emoji: '',
        meaningKey: 'colors.white.meaning',
        strengthsKey: ['colors.white.strength1', 'colors.white.strength2', 'colors.white.strength3'],
        weaknessesKey: ['colors.white.weakness1', 'colors.white.weakness2'],
        hueRange: [0, 360] // special: low saturation
    }
};

// Compatibility data
function getColorCompatibility(colorType) {
    var compat = {
        red:    { compatible: ['yellow', 'orange'], incompatible: ['blue', 'green'] },
        blue:   { compatible: ['green', 'white'], incompatible: ['red', 'orange'] },
        green:  { compatible: ['blue', 'white'], incompatible: ['red', 'orange'] },
        yellow: { compatible: ['red', 'orange'], incompatible: ['blue', 'purple'] },
        purple: { compatible: ['pink', 'white'], incompatible: ['yellow', 'orange'] },
        orange: { compatible: ['red', 'yellow'], incompatible: ['blue', 'green'] },
        pink:   { compatible: ['purple', 'white'], incompatible: ['green', 'yellow'] },
        white:  { compatible: ['blue', 'green', 'purple', 'pink'], incompatible: [] }
    };
    return compat[colorType] || { compatible: [], incompatible: [] };
}

// Spectrum definitions for Phase 1
var SPECTRUM_ROUNDS = [
    {
        promptKey: 'phase1.prompt1',
        // Warm spectrum: sunrise tones (reds, oranges, warm yellows, soft pinks)
        colors: [
            { h: 350, s: 80, l: 65 }, // soft pink-red
            { h: 0,   s: 85, l: 60 }, // red
            { h: 15,  s: 90, l: 60 }, // red-orange
            { h: 30,  s: 95, l: 60 }, // orange
            { h: 45,  s: 90, l: 60 }, // amber
            { h: 55,  s: 85, l: 65 }  // warm yellow
        ]
    },
    {
        promptKey: 'phase1.prompt2',
        // Cool spectrum: evening/nature tones (greens, teals, blues, purples)
        colors: [
            { h: 120, s: 50, l: 45 }, // forest green
            { h: 155, s: 60, l: 45 }, // teal green
            { h: 175, s: 65, l: 50 }, // teal
            { h: 200, s: 70, l: 55 }, // sky blue
            { h: 230, s: 65, l: 55 }, // blue
            { h: 260, s: 55, l: 60 }  // lavender
        ]
    },
    {
        promptKey: 'phase1.prompt3',
        // Vivid spectrum: neon/bold tones
        colors: [
            { h: 320, s: 90, l: 55 }, // magenta
            { h: 280, s: 85, l: 55 }, // violet
            { h: 190, s: 95, l: 50 }, // electric cyan
            { h: 145, s: 90, l: 50 }, // neon green
            { h: 55,  s: 95, l: 55 }, // electric yellow
            { h: 5,   s: 95, l: 55 }  // neon red
        ]
    }
];

// Palette pairs for Phase 2
var PALETTE_PAIRS = [
    {
        // Introvert vs Extrovert
        dimensionKey: 'phase2.dim1',
        left: {
            labelKey: 'phase2.pair1.left',
            colors: ['#2d3436', '#636e72', '#b2bec3', '#dfe6e9'],
            scores: { blue: 3, green: 2, white: 1 }
        },
        right: {
            labelKey: 'phase2.pair1.right',
            colors: ['#ff6b6b', '#ffd93d', '#ff9f43', '#fd79a8'],
            scores: { red: 3, orange: 2, yellow: 1 }
        }
    },
    {
        // Creative vs Analytical
        dimensionKey: 'phase2.dim2',
        left: {
            labelKey: 'phase2.pair2.left',
            colors: ['#a29bfe', '#fd79a8', '#6c5ce7', '#e17055'],
            scores: { purple: 3, pink: 2, orange: 1 }
        },
        right: {
            labelKey: 'phase2.pair2.right',
            colors: ['#0984e3', '#00b894', '#74b9ff', '#55efc4'],
            scores: { blue: 3, green: 2, white: 1 }
        }
    },
    {
        // Passionate vs Peaceful
        dimensionKey: 'phase2.dim3',
        left: {
            labelKey: 'phase2.pair3.left',
            colors: ['#e74c3c', '#e17055', '#d63031', '#ff7675'],
            scores: { red: 3, orange: 2, pink: 1 }
        },
        right: {
            labelKey: 'phase2.pair3.right',
            colors: ['#00b894', '#81ecec', '#55efc4', '#dfe6e9'],
            scores: { green: 3, white: 2, blue: 1 }
        }
    },
    {
        // Optimistic vs Mysterious
        dimensionKey: 'phase2.dim4',
        left: {
            labelKey: 'phase2.pair4.left',
            colors: ['#ffd93d', '#fdcb6e', '#f39c12', '#ffed4e'],
            scores: { yellow: 3, orange: 2, red: 1 }
        },
        right: {
            labelKey: 'phase2.pair4.right',
            colors: ['#6c5ce7', '#a29bfe', '#2d3436', '#636e72'],
            scores: { purple: 3, blue: 2, pink: 1 }
        }
    }
];


class ColorMixingLab {
    constructor() {
        this.phase1Colors = [];  // 3 hex colors from spectrum
        this.phase2Choices = []; // 4 binary choices (0=left, 1=right)
        this.currentStep = 0;   // 0-6 total (3 spectrum + 4 palette)
        this.resultType = null;
        this.signatureHex = '#000000';
        this.scores = {};
        this.isDragging = false;
        this.selectedHex = '#ff6b6b';

        this.hideLoader();
        this.init();
    }

    hideLoader() {
        window.addEventListener('load', function() {
            var loader = document.getElementById('app-loader');
            if (loader) {
                loader.classList.add('hidden');
                setTimeout(function() { loader.remove(); }, 300);
            }
        });
    }

    async init() {
        try {
            if (window.i18n && typeof window.i18n.init === 'function') {
                await window.i18n.init();
            }
        } catch (e) {
            console.warn('i18n init failed:', e.message);
        }
        this.setupEventListeners();
        this.initTheme();
        this.setupGA();
    }

    setupGA() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: 'Color Mixing Lab',
                page_location: window.location.href
            });
        }
    }

    setupEventListeners() {
        var self = this;

        // Start button
        var startBtn = document.getElementById('start-btn');
        if (startBtn) startBtn.addEventListener('click', function() { self.startExperience(); });

        // Back buttons
        var phase1Back = document.getElementById('phase1-back');
        var phase2Back = document.getElementById('phase2-back');
        var resultBack = document.getElementById('result-back');
        if (phase1Back) phase1Back.addEventListener('click', function() { self.goBack(); });
        if (phase2Back) phase2Back.addEventListener('click', function() { self.goBack(); });
        if (resultBack) resultBack.addEventListener('click', function() { self.resetExperience(); });

        // Retry
        var retryBtn = document.getElementById('retry-btn');
        if (retryBtn) retryBtn.addEventListener('click', function() { self.resetExperience(); });

        // Confirm color in Phase 1
        var confirmBtn = document.getElementById('confirm-color-btn');
        if (confirmBtn) confirmBtn.addEventListener('click', function() { self.confirmColor(); });

        // Language selector
        var langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
            langToggle.addEventListener('click', function() { self.toggleLangMenu(); });
        }

        document.querySelectorAll('.lang-option').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                var lang = e.target.getAttribute('data-lang');
                if (lang) self.changeLang(lang);
            });
        });

        // Share buttons
        var shareDownload = document.getElementById('share-download');
        var shareKakao = document.getElementById('share-kakao');
        var shareTwitter = document.getElementById('share-twitter');
        var shareFacebook = document.getElementById('share-facebook');
        var shareCopy = document.getElementById('share-copy');
        if (shareDownload) shareDownload.addEventListener('click', function() { self.downloadResultImage(); });
        if (shareKakao) shareKakao.addEventListener('click', function() { self.shareKakao(); });
        if (shareTwitter) shareTwitter.addEventListener('click', function() { self.shareTwitter(); });
        if (shareFacebook) shareFacebook.addEventListener('click', function() { self.shareFacebook(); });
        if (shareCopy) shareCopy.addEventListener('click', function() { self.shareCopy(); });

        // Palette card clicks
        var palLeft = document.getElementById('palette-left');
        var palRight = document.getElementById('palette-right');
        if (palLeft) palLeft.addEventListener('click', function() { self.selectPalette(0); });
        if (palRight) palRight.addEventListener('click', function() { self.selectPalette(1); });

        // Spectrum interaction
        this.setupSpectrumInteraction();
    }

    setupSpectrumInteraction() {
        var self = this;
        var container = document.getElementById('spectrum-container');
        if (!container) return;

        function handleInteraction(e) {
            e.preventDefault();
            var rect = container.getBoundingClientRect();
            var canvas = document.getElementById('spectrum-canvas');
            var clientX, clientY;

            if (e.touches) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            var x = Math.max(0, Math.min(clientX - rect.left, rect.width));
            var y = Math.max(0, Math.min(clientY - rect.top, rect.height));

            // Map to canvas coordinates
            var canvasX = Math.floor(x / rect.width * canvas.width);
            var canvasY = Math.floor(y / rect.height * canvas.height);

            var ctx = canvas.getContext('2d');
            var pixel = ctx.getImageData(canvasX, canvasY, 1, 1).data;
            var hex = self.rgbToHex(pixel[0], pixel[1], pixel[2]);

            self.selectedHex = hex;

            // Update thumb position
            var thumb = document.getElementById('spectrum-thumb');
            thumb.style.left = x + 'px';
            thumb.style.top = y + 'px';
            thumb.style.backgroundColor = hex;

            // Update preview
            var preview = document.getElementById('selected-color-preview');
            var hexText = document.getElementById('selected-color-hex');
            if (preview) preview.style.background = hex;
            if (hexText) hexText.textContent = hex.toUpperCase();
        }

        container.addEventListener('mousedown', function(e) {
            self.isDragging = true;
            handleInteraction(e);
        });

        container.addEventListener('mousemove', function(e) {
            if (self.isDragging) handleInteraction(e);
        });

        document.addEventListener('mouseup', function() {
            self.isDragging = false;
        });

        container.addEventListener('touchstart', function(e) {
            self.isDragging = true;
            handleInteraction(e);
        }, { passive: false });

        container.addEventListener('touchmove', function(e) {
            if (self.isDragging) handleInteraction(e);
        }, { passive: false });

        container.addEventListener('touchend', function() {
            self.isDragging = false;
        });
    }

    // --- Drawing the spectrum ---
    drawSpectrum(roundIndex) {
        var canvas = document.getElementById('spectrum-canvas');
        if (!canvas) return;

        var ctx = canvas.getContext('2d');
        var dpr = window.devicePixelRatio || 1;
        var rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        var round = SPECTRUM_ROUNDS[roundIndex];
        var colors = round.colors;
        var w = rect.width;
        var h = rect.height;

        // Draw horizontal gradient
        var grad = ctx.createLinearGradient(0, 0, w, 0);
        for (var i = 0; i < colors.length; i++) {
            var c = colors[i];
            var stop = i / (colors.length - 1);
            grad.addColorStop(stop, 'hsl(' + c.h + ', ' + c.s + '%, ' + c.l + '%)');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Add vertical lightness variation (bright at top, darker at bottom)
        var whiteGrad = ctx.createLinearGradient(0, 0, 0, h);
        whiteGrad.addColorStop(0, 'rgba(255,255,255,0.3)');
        whiteGrad.addColorStop(0.5, 'rgba(255,255,255,0)');
        whiteGrad.addColorStop(1, 'rgba(0,0,0,0.35)');
        ctx.fillStyle = whiteGrad;
        ctx.fillRect(0, 0, w, h);

        // Set thumb to center initially
        var thumb = document.getElementById('spectrum-thumb');
        var centerX = w / 2;
        var centerY = h / 2;
        thumb.style.left = centerX + 'px';
        thumb.style.top = centerY + 'px';

        // Read the center color
        var pixel = ctx.getImageData(Math.floor(centerX * dpr), Math.floor(centerY * dpr), 1, 1).data;
        var hex = this.rgbToHex(pixel[0], pixel[1], pixel[2]);
        this.selectedHex = hex;
        thumb.style.backgroundColor = hex;

        var preview = document.getElementById('selected-color-preview');
        var hexText = document.getElementById('selected-color-hex');
        if (preview) preview.style.background = hex;
        if (hexText) hexText.textContent = hex.toUpperCase();
    }

    // --- Phase 1: Spectrum ---
    startExperience() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'test_start', {
                app_name: 'color-personality',
                content_type: 'color-mixing-lab',
                event_category: 'engagement'
            });
        }

        this.currentStep = 0;
        this.phase1Colors = [];
        this.phase2Choices = [];
        this.scores = {};
        this.resultType = null;

        Object.keys(COLOR_TYPES).forEach(function(type) {
            this.scores[type] = 0;
        }.bind(this));

        this.showScreen('phase1-screen');
        this.updateProgress();
        this.showSpectrumRound(0);
    }

    showSpectrumRound(index) {
        var round = SPECTRUM_ROUNDS[index];
        var promptEl = document.getElementById('spectrum-prompt');
        if (promptEl) promptEl.textContent = window.i18n.t(round.promptKey);

        // Small delay so DOM is ready
        var self = this;
        requestAnimationFrame(function() {
            self.drawSpectrum(index);
        });
    }

    confirmColor() {
        this.phase1Colors.push(this.selectedHex);

        // Score based on hue
        var rgb = this.hexToRgb(this.selectedHex);
        var hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);

        // Award points based on hue match to color types
        this.scoreFromHSL(hsl);

        this.currentStep++;
        this.updateProgress();

        if (this.currentStep < 3) {
            // Next spectrum round
            this.showSpectrumRound(this.currentStep);
        } else {
            // Move to Phase 2
            this.showScreen('phase2-screen');
            this.showPaletteRound(0);
        }
    }

    scoreFromHSL(hsl) {
        var h = hsl.h;
        var s = hsl.s;
        var l = hsl.l;
        var self = this;

        // If very low saturation -> white
        if (s < 15) {
            self.scores.white = (self.scores.white || 0) + 3;
            return;
        }

        // Score by hue proximity
        var typeScores = {};
        Object.keys(COLOR_TYPES).forEach(function(type) {
            if (type === 'white') return;
            var range = COLOR_TYPES[type].hueRange;
            var mid = (range[0] + range[1]) / 2;
            var dist = self.hueDist(h, mid);
            var maxDist = 180;
            var score = Math.max(0, (maxDist - dist) / maxDist);
            typeScores[type] = score;
        });

        // Get top 2 scoring types
        var sorted = Object.keys(typeScores).sort(function(a, b) {
            return typeScores[b] - typeScores[a];
        });

        if (sorted.length >= 1) self.scores[sorted[0]] = (self.scores[sorted[0]] || 0) + 3;
        if (sorted.length >= 2) self.scores[sorted[1]] = (self.scores[sorted[1]] || 0) + 1;
    }

    hueDist(h1, h2) {
        var d = Math.abs(h1 - h2);
        return Math.min(d, 360 - d);
    }

    // --- Phase 2: Palette comparison ---
    showPaletteRound(index) {
        var pair = PALETTE_PAIRS[index];
        this.updateProgress();

        // Render left palette
        var leftColors = document.getElementById('palette-left-colors');
        var rightColors = document.getElementById('palette-right-colors');
        var leftLabel = document.getElementById('palette-left-label');
        var rightLabel = document.getElementById('palette-right-label');

        leftColors.innerHTML = '';
        rightColors.innerHTML = '';

        pair.left.colors.forEach(function(c) {
            var swatch = document.createElement('div');
            swatch.className = 'palette-swatch';
            swatch.style.background = c;
            leftColors.appendChild(swatch);
        });

        pair.right.colors.forEach(function(c) {
            var swatch = document.createElement('div');
            swatch.className = 'palette-swatch';
            swatch.style.background = c;
            rightColors.appendChild(swatch);
        });

        leftLabel.textContent = window.i18n.t(pair.left.labelKey);
        rightLabel.textContent = window.i18n.t(pair.right.labelKey);

        // Update step counter
        var stepEl = document.getElementById('current-step-2');
        if (stepEl) stepEl.textContent = this.currentStep + 1;
    }

    selectPalette(side) {
        var pairIndex = this.currentStep - 3;
        var pair = PALETTE_PAIRS[pairIndex];
        this.phase2Choices.push(side);

        // Score the choice
        var chosen = side === 0 ? pair.left : pair.right;
        var self = this;
        Object.keys(chosen.scores).forEach(function(type) {
            self.scores[type] = (self.scores[type] || 0) + chosen.scores[type];
        });

        this.currentStep++;
        this.updateProgress();

        if (this.currentStep < 7) {
            // Animate transition
            var self = this;
            var card = side === 0 ? document.getElementById('palette-left') : document.getElementById('palette-right');
            card.style.transform = 'scale(1.05)';
            card.style.borderColor = '#ff6b6b';

            setTimeout(function() {
                card.style.transform = '';
                card.style.borderColor = '';
                self.showPaletteRound(self.currentStep - 3);
            }, 300);
        } else {
            // Done -> mixing animation
            this.showMixingAnimation();
        }
    }

    // --- Progress bar ---
    updateProgress() {
        var totalSteps = 7;
        var progress = ((this.currentStep + 1) / totalSteps) * 100;

        var fill1 = document.getElementById('progress-fill');
        var fill2 = document.getElementById('progress-fill-2');
        var step1 = document.getElementById('current-step');
        var step2 = document.getElementById('current-step-2');

        if (fill1) fill1.style.width = Math.min(progress, 100) + '%';
        if (fill2) fill2.style.width = Math.min(progress, 100) + '%';
        if (step1) step1.textContent = Math.min(this.currentStep + 1, totalSteps);
        if (step2) step2.textContent = Math.min(this.currentStep + 1, totalSteps);
    }

    // --- Mixing animation ---
    showMixingAnimation() {
        this.showScreen('mixing-screen');

        // Generate signature color from all chosen colors
        this.signatureHex = this.generateSignatureColor();

        // Animate the mixing
        var liquid = document.getElementById('mix-liquid');
        var dropsContainer = document.getElementById('color-drops');

        if (liquid) {
            liquid.style.background = 'linear-gradient(180deg, ' +
                this.phase1Colors[0] + ', ' +
                this.phase1Colors[1] + ', ' +
                this.phase1Colors[2] + ')';
            liquid.style.backgroundSize = '100% 300%';
        }

        // Animate drops falling
        if (dropsContainer) {
            dropsContainer.innerHTML = '';
            var self = this;
            this.phase1Colors.forEach(function(c, i) {
                var drop = document.createElement('div');
                drop.className = 'color-drop';
                drop.style.backgroundColor = c;
                drop.style.left = (i * 15 - 15) + 'px';
                drop.style.animationDelay = (i * 0.3) + 's';
                dropsContainer.appendChild(drop);
            });
        }

        // Animate liquid rising
        var self = this;
        setTimeout(function() {
            if (liquid) liquid.style.height = '80%';
        }, 300);

        // After liquid settles, blend to signature color
        setTimeout(function() {
            if (liquid) {
                liquid.style.background = self.signatureHex;
                liquid.style.backgroundSize = '';
            }
        }, 1800);

        // Calculate result and show
        setTimeout(function() {
            self.calculateResult();
        }, 3000);
    }

    generateSignatureColor() {
        // Mix all phase1 colors
        var totalR = 0, totalG = 0, totalB = 0;

        this.phase1Colors.forEach(function(hex) {
            var rgb = this.hexToRgb(hex);
            totalR += rgb.r;
            totalG += rgb.g;
            totalB += rgb.b;
        }.bind(this));

        var count = this.phase1Colors.length || 1;
        var avgR = Math.round(totalR / count);
        var avgG = Math.round(totalG / count);
        var avgB = Math.round(totalB / count);

        // Adjust based on phase 2 choices to add personality influence
        this.phase2Choices.forEach(function(choice, i) {
            var pair = PALETTE_PAIRS[i];
            var chosen = choice === 0 ? pair.left : pair.right;
            // Slightly shift toward chosen palette's first color
            var shiftColor = this.hexToRgb(chosen.colors[0]);
            avgR = Math.round(avgR * 0.85 + shiftColor.r * 0.15);
            avgG = Math.round(avgG * 0.85 + shiftColor.g * 0.15);
            avgB = Math.round(avgB * 0.85 + shiftColor.b * 0.15);
        }.bind(this));

        return this.rgbToHex(
            Math.min(255, Math.max(0, avgR)),
            Math.min(255, Math.max(0, avgG)),
            Math.min(255, Math.max(0, avgB))
        );
    }

    calculateResult() {
        // Find the type with the highest score
        var maxScore = 0;
        var resultType = 'red';
        var self = this;

        Object.keys(this.scores).forEach(function(type) {
            if (self.scores[type] > maxScore) {
                maxScore = self.scores[type];
                resultType = type;
            }
        });

        this.resultType = resultType;

        if (typeof gtag !== 'undefined') {
            gtag('event', 'test_complete', {
                app_name: 'color-personality',
                event_category: 'engagement',
                result_type: this.resultType,
                signature_color: this.signatureHex
            });
        }

        this.showScreen('result-screen');
        this.displayResult();
    }

    displayResult() {
        var typeData = COLOR_TYPES[this.resultType];
        var compatibility = getColorCompatibility(this.resultType);

        // Signature color card
        var gradient = document.getElementById('signature-gradient');
        var hexDisplay = document.getElementById('signature-hex');
        if (gradient) {
            gradient.style.background = 'linear-gradient(135deg, ' +
                this.signatureHex + ', ' + typeData.colorValue + ')';
        }
        if (hexDisplay) hexDisplay.textContent = this.signatureHex.toUpperCase();

        // Title and tagline
        var titleEl = document.getElementById('result-title');
        var taglineEl = document.getElementById('result-tagline');
        if (titleEl) titleEl.textContent = window.i18n.t(typeData.nameKey);
        if (taglineEl) taglineEl.textContent = window.i18n.t(typeData.taglineKey);

        // Blend swatches
        var swatchesEl = document.getElementById('blend-swatches');
        if (swatchesEl) {
            swatchesEl.innerHTML = '';
            var labels = [
                window.i18n.t('phase1.label1'),
                window.i18n.t('phase1.label2'),
                window.i18n.t('phase1.label3')
            ];
            var self = this;
            this.phase1Colors.forEach(function(c, i) {
                var swatch = document.createElement('div');
                swatch.className = 'blend-swatch';
                swatch.style.background = c;
                swatch.setAttribute('data-label', labels[i] || '');
                swatchesEl.appendChild(swatch);
            });
            // Arrow
            var arrow = document.createElement('div');
            arrow.className = 'blend-arrow';
            arrow.innerHTML = '&#8594;';
            swatchesEl.appendChild(arrow);
            // Result swatch
            var resultSwatch = document.createElement('div');
            resultSwatch.className = 'blend-swatch blend-result';
            resultSwatch.style.background = this.signatureHex;
            resultSwatch.setAttribute('data-label', window.i18n.t('result.signature'));
            swatchesEl.appendChild(resultSwatch);
        }

        // Description
        var descEl = document.getElementById('result-description');
        if (descEl) descEl.innerHTML = '<p>' + window.i18n.t(typeData.descriptionKey) + '</p>';

        // Color meaning
        var meaningEl = document.getElementById('color-meaning-text');
        if (meaningEl) meaningEl.textContent = window.i18n.t(typeData.meaningKey);

        // Strengths
        var strengthsList = document.getElementById('strengths-list');
        if (strengthsList) {
            strengthsList.innerHTML = '';
            typeData.strengthsKey.forEach(function(key) {
                var li = document.createElement('li');
                li.textContent = window.i18n.t(key);
                strengthsList.appendChild(li);
            });
        }

        // Weaknesses
        var weaknessesList = document.getElementById('weaknesses-list');
        if (weaknessesList) {
            weaknessesList.innerHTML = '';
            typeData.weaknessesKey.forEach(function(key) {
                var li = document.createElement('li');
                li.textContent = window.i18n.t(key);
                weaknessesList.appendChild(li);
            });
        }

        // Compatible types
        var compatibleList = document.getElementById('compatible-list');
        if (compatibleList) {
            compatibleList.innerHTML = '';
            compatibility.compatible.forEach(function(type) {
                var item = document.createElement('div');
                item.className = 'type-item';
                var ct = COLOR_TYPES[type];
                var swatch = document.createElement('span');
                swatch.style.display = 'inline-block';
                swatch.style.width = '12px';
                swatch.style.height = '12px';
                swatch.style.borderRadius = '50%';
                swatch.style.background = ct.colorValue;
                swatch.style.marginRight = '8px';
                swatch.style.verticalAlign = 'middle';
                item.appendChild(swatch);
                item.appendChild(document.createTextNode(window.i18n.t(ct.nameKey)));
                compatibleList.appendChild(item);
            });
        }

        // Incompatible types
        var incompatibleList = document.getElementById('incompatible-list');
        if (incompatibleList) {
            incompatibleList.innerHTML = '';
            compatibility.incompatible.forEach(function(type) {
                var item = document.createElement('div');
                item.className = 'type-item';
                var ct = COLOR_TYPES[type];
                var swatch = document.createElement('span');
                swatch.style.display = 'inline-block';
                swatch.style.width = '12px';
                swatch.style.height = '12px';
                swatch.style.borderRadius = '50%';
                swatch.style.background = ct.colorValue;
                swatch.style.marginRight = '8px';
                swatch.style.verticalAlign = 'middle';
                item.appendChild(swatch);
                item.appendChild(document.createTextNode(window.i18n.t(ct.nameKey)));
                incompatibleList.appendChild(item);
            });
        }

        // Confetti
        this.createConfetti();
    }

    createConfetti() {
        var container = document.getElementById('confetti-container');
        if (!container) return;
        container.innerHTML = '';

        var typeData = COLOR_TYPES[this.resultType];
        for (var i = 0; i < 30; i++) {
            var confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.width = (6 + Math.random() * 6) + 'px';
            confetti.style.height = (6 + Math.random() * 6) + 'px';
            confetti.style.backgroundColor = i % 2 === 0 ? typeData.colorValue : this.signatureHex;
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            confetti.style.animationDelay = (Math.random() * 0.8) + 's';
            confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
            container.appendChild(confetti);
            (function(el) {
                setTimeout(function() { el.remove(); }, 4000);
            })(confetti);
        }
    }

    // --- Result image generation ---
    generateResultImage() {
        var canvas = document.getElementById('result-canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 600;

        var typeData = COLOR_TYPES[this.resultType];

        // Background
        var bgGrad = ctx.createLinearGradient(0, 0, 800, 600);
        bgGrad.addColorStop(0, '#0f0f23');
        bgGrad.addColorStop(1, '#1a1a3f');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 800, 600);

        // Signature color circle
        var colorGrad = ctx.createLinearGradient(300, 100, 500, 300);
        colorGrad.addColorStop(0, this.signatureHex);
        colorGrad.addColorStop(1, typeData.colorValue);
        ctx.fillStyle = colorGrad;
        ctx.beginPath();
        ctx.arc(400, 180, 80, 0, Math.PI * 2);
        ctx.fill();

        // Hex code inside circle
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(this.signatureHex.toUpperCase(), 400, 186);

        // Type name
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 40px sans-serif';
        ctx.fillText(window.i18n.t(typeData.nameKey), 400, 340);

        // Tagline
        ctx.fillStyle = '#b0b0b0';
        ctx.font = '20px sans-serif';
        ctx.fillText(window.i18n.t(typeData.taglineKey), 400, 385);

        // Phase 1 color swatches
        var startX = 280;
        var self = this;
        this.phase1Colors.forEach(function(c, i) {
            ctx.fillStyle = c;
            ctx.beginPath();
            ctx.arc(startX + i * 60, 450, 20, 0, Math.PI * 2);
            ctx.fill();
        });

        // Arrow
        ctx.fillStyle = '#b0b0b0';
        ctx.font = '24px sans-serif';
        ctx.fillText('>', startX + 190, 458);

        // Result swatch
        ctx.fillStyle = self.signatureHex;
        ctx.beginPath();
        ctx.arc(startX + 230, 450, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Branding
        ctx.fillStyle = '#ff6b6b';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText('Color Mixing Lab - dopabrain.com', 400, 550);

        return canvas;
    }

    downloadResultImage() {
        var canvas = this.generateResultImage();
        var link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'color-mixing-lab-' + this.resultType + '-' + Date.now() + '.png';
        link.click();

        if (typeof gtag !== 'undefined') {
            gtag('event', 'download_image', {
                event_category: 'share',
                color_type: this.resultType
            });
        }
    }

    shareKakao() {
        var typeData = COLOR_TYPES[this.resultType];
        var resultUrl = window.location.href;
        var resultType = window.i18n.t(typeData.nameKey);

        if (typeof Kakao !== 'undefined' && Kakao.Share) {
            Kakao.Share.sendDefault({
                objectType: 'feed',
                content: {
                    title: window.i18n.t('share.kakao_title'),
                    description: resultType + ' | ' + this.signatureHex,
                    imageUrl: 'https://dopabrain.com/color-personality/icon-512.svg',
                    link: { mobileWebUrl: resultUrl, webUrl: resultUrl }
                },
                buttons: [{
                    title: window.i18n.t('share.kakao_button'),
                    link: { mobileWebUrl: resultUrl, webUrl: resultUrl }
                }]
            });
        } else {
            this.shareCopy();
        }

        if (typeof gtag !== 'undefined') {
            gtag('event', 'share', { method: 'kakao', color_type: this.resultType });
        }
    }

    shareTwitter() {
        var typeData = COLOR_TYPES[this.resultType];
        var resultType = window.i18n.t(typeData.nameKey);
        var text = window.i18n.t('share.twitter_text')
            .replace('{type}', resultType)
            .replace('{hex}', this.signatureHex);
        var url = 'https://twitter.com/intent/tweet?text=' +
            encodeURIComponent(text) + '&url=' + encodeURIComponent(window.location.href);
        window.open(url, '_blank', 'width=550,height=420');

        if (typeof gtag !== 'undefined') {
            gtag('event', 'share', { method: 'twitter', color_type: this.resultType });
        }
    }

    shareFacebook() {
        var url = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href);
        window.open(url, '_blank', 'width=550,height=420');

        if (typeof gtag !== 'undefined') {
            gtag('event', 'share', { method: 'facebook', color_type: this.resultType });
        }
    }

    shareCopy() {
        var typeData = COLOR_TYPES[this.resultType];
        var resultType = window.i18n.t(typeData.nameKey);
        var text = window.i18n.t('share.copy_text')
            .replace('{type}', resultType)
            .replace('{hex}', this.signatureHex)
            .replace('{url}', window.location.href);

        navigator.clipboard.writeText(text).then(function() {
            alert(window.i18n.t('message.copy_success'));
        }).catch(function() {
            alert(window.i18n.t('message.copy_error'));
        });

        if (typeof gtag !== 'undefined') {
            gtag('event', 'share', { method: 'copy', color_type: this.resultType });
        }
    }

    // --- Navigation ---
    goBack() {
        if (this.currentStep === 0) {
            this.resetExperience();
        } else if (this.currentStep <= 3) {
            this.currentStep = Math.max(0, this.currentStep - 1);
            if (this.phase1Colors.length > this.currentStep) {
                this.phase1Colors.pop();
            }
            this.updateProgress();
            this.showScreen('phase1-screen');
            this.showSpectrumRound(this.currentStep);
        } else {
            this.currentStep = Math.max(3, this.currentStep - 1);
            if (this.phase2Choices.length > this.currentStep - 3) {
                this.phase2Choices.pop();
            }
            this.updateProgress();
            this.showScreen('phase2-screen');
            this.showPaletteRound(this.currentStep - 3);
        }
    }

    resetExperience() {
        this.currentStep = 0;
        this.phase1Colors = [];
        this.phase2Choices = [];
        this.scores = {};
        this.resultType = null;
        this.signatureHex = '#000000';
        this.showScreen('intro-screen');
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(function(screen) {
            screen.classList.remove('active');
        });
        var target = document.getElementById(screenId);
        if (target) target.classList.add('active');
        window.scrollTo(0, 0);
    }

    toggleLangMenu() {
        var menu = document.getElementById('lang-menu');
        if (menu) menu.classList.toggle('hidden');
    }

    async changeLang(lang) {
        await window.i18n.setLanguage(lang);
        var menu = document.getElementById('lang-menu');
        if (menu) menu.classList.add('hidden');

        // Re-render current screen if needed
        if (this.resultType) {
            this.displayResult();
        } else if (this.currentStep < 3) {
            this.showSpectrumRound(this.currentStep);
        } else if (this.currentStep < 7) {
            this.showPaletteRound(this.currentStep - 3);
        }
    }

    // --- Theme ---
    initTheme() {
        var self = this;
        var themeToggle = document.getElementById('theme-toggle');
        var html = document.documentElement;

        var savedTheme = 'dark';
        try {
            savedTheme = localStorage.getItem('app-theme') || 'dark';
        } catch (e) {}

        html.setAttribute('data-theme', savedTheme);
        this.updateThemeButton(savedTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', function() {
                var currentTheme = html.getAttribute('data-theme') || 'dark';
                var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                html.setAttribute('data-theme', newTheme);
                try {
                    localStorage.setItem('app-theme', newTheme);
                } catch (e) {}
                self.updateThemeButton(newTheme);
            });
        }
    }

    updateThemeButton(theme) {
        var themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
            themeToggle.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
        }
    }

    // --- Color utilities ---
    rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(function(x) {
            var hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }
}

// Start app
var app;
document.addEventListener('DOMContentLoaded', function() {
    app = new ColorMixingLab();
});
