// 성격 색상 타입 데이터
const COLOR_TYPES = {
    red: {
        nameKey: 'colors.red.name',
        taglineKey: 'colors.red.tagline',
        descriptionKey: 'colors.red.description',
        colorValue: '#ff6b6b',
        colorGradient: 'linear-gradient(135deg, #ff6b6b, #ff8787)',
        emoji: '🔥',
        meaningKey: 'colors.red.meaning',
        strengthsKey: [
            'colors.red.strength1',
            'colors.red.strength2',
            'colors.red.strength3'
        ],
        weaknessesKey: [
            'colors.red.weakness1',
            'colors.red.weakness2'
        ],
        deepAnalysisKey: 'colors.red.deepAnalysis'
    },
    blue: {
        nameKey: 'colors.blue.name',
        taglineKey: 'colors.blue.tagline',
        descriptionKey: 'colors.blue.description',
        colorValue: '#4ecdc4',
        colorGradient: 'linear-gradient(135deg, #4ecdc4, #45b7aa)',
        emoji: '🌊',
        meaningKey: 'colors.blue.meaning',
        strengthsKey: [
            'colors.blue.strength1',
            'colors.blue.strength2',
            'colors.blue.strength3'
        ],
        weaknessesKey: [
            'colors.blue.weakness1',
            'colors.blue.weakness2'
        ],
        deepAnalysisKey: 'colors.blue.deepAnalysis'
    },
    green: {
        nameKey: 'colors.green.name',
        taglineKey: 'colors.green.tagline',
        descriptionKey: 'colors.green.description',
        colorValue: '#00b894',
        colorGradient: 'linear-gradient(135deg, #00b894, #1dd1a1)',
        emoji: '🌿',
        meaningKey: 'colors.green.meaning',
        strengthsKey: [
            'colors.green.strength1',
            'colors.green.strength2',
            'colors.green.strength3'
        ],
        weaknessesKey: [
            'colors.green.weakness1',
            'colors.green.weakness2'
        ],
        deepAnalysisKey: 'colors.green.deepAnalysis'
    },
    yellow: {
        nameKey: 'colors.yellow.name',
        taglineKey: 'colors.yellow.tagline',
        descriptionKey: 'colors.yellow.description',
        colorValue: '#ffd93d',
        colorGradient: 'linear-gradient(135deg, #ffd93d, #ffed4e)',
        emoji: '⭐',
        meaningKey: 'colors.yellow.meaning',
        strengthsKey: [
            'colors.yellow.strength1',
            'colors.yellow.strength2',
            'colors.yellow.strength3'
        ],
        weaknessesKey: [
            'colors.yellow.weakness1',
            'colors.yellow.weakness2'
        ],
        deepAnalysisKey: 'colors.yellow.deepAnalysis'
    },
    purple: {
        nameKey: 'colors.purple.name',
        taglineKey: 'colors.purple.tagline',
        descriptionKey: 'colors.purple.description',
        colorValue: '#a29bfe',
        colorGradient: 'linear-gradient(135deg, #a29bfe, #9b59b6)',
        emoji: '✨',
        meaningKey: 'colors.purple.meaning',
        strengthsKey: [
            'colors.purple.strength1',
            'colors.purple.strength2',
            'colors.purple.strength3'
        ],
        weaknessesKey: [
            'colors.purple.weakness1',
            'colors.purple.weakness2'
        ],
        deepAnalysisKey: 'colors.purple.deepAnalysis'
    },
    orange: {
        nameKey: 'colors.orange.name',
        taglineKey: 'colors.orange.tagline',
        descriptionKey: 'colors.orange.description',
        colorValue: '#ff9f43',
        colorGradient: 'linear-gradient(135deg, #ff9f43, #ff7675)',
        emoji: '🌅',
        meaningKey: 'colors.orange.meaning',
        strengthsKey: [
            'colors.orange.strength1',
            'colors.orange.strength2',
            'colors.orange.strength3'
        ],
        weaknessesKey: [
            'colors.orange.weakness1',
            'colors.orange.weakness2'
        ],
        deepAnalysisKey: 'colors.orange.deepAnalysis'
    },
    pink: {
        nameKey: 'colors.pink.name',
        taglineKey: 'colors.pink.tagline',
        descriptionKey: 'colors.pink.description',
        colorValue: '#ff6b9d',
        colorGradient: 'linear-gradient(135deg, #ff6b9d, #ff85a2)',
        emoji: '🌸',
        meaningKey: 'colors.pink.meaning',
        strengthsKey: [
            'colors.pink.strength1',
            'colors.pink.strength2',
            'colors.pink.strength3'
        ],
        weaknessesKey: [
            'colors.pink.weakness1',
            'colors.pink.weakness2'
        ],
        deepAnalysisKey: 'colors.pink.deepAnalysis'
    },
    white: {
        nameKey: 'colors.white.name',
        taglineKey: 'colors.white.tagline',
        descriptionKey: 'colors.white.description',
        colorValue: '#e8f5e9',
        colorGradient: 'linear-gradient(135deg, #e8f5e9, #f5f5f5)',
        emoji: '🤍',
        meaningKey: 'colors.white.meaning',
        strengthsKey: [
            'colors.white.strength1',
            'colors.white.strength2',
            'colors.white.strength3'
        ],
        weaknessesKey: [
            'colors.white.weakness1',
            'colors.white.weakness2'
        ],
        deepAnalysisKey: 'colors.white.deepAnalysis'
    }
};

// 호환성 데이터
function getColorCompatibility(colorType) {
    const compatibility = {
        red: {
            compatible: ['yellow', 'orange'],
            incompatible: ['blue', 'green']
        },
        blue: {
            compatible: ['green', 'white'],
            incompatible: ['red', 'orange']
        },
        green: {
            compatible: ['blue', 'white'],
            incompatible: ['red', 'orange']
        },
        yellow: {
            compatible: ['red', 'orange'],
            incompatible: ['blue', 'purple']
        },
        purple: {
            compatible: ['pink', 'white'],
            incompatible: ['yellow', 'orange']
        },
        orange: {
            compatible: ['red', 'yellow'],
            incompatible: ['blue', 'green']
        },
        pink: {
            compatible: ['purple', 'white'],
            incompatible: ['green', 'yellow']
        },
        white: {
            compatible: ['blue', 'green', 'purple', 'pink'],
            incompatible: []
        }
    };
    return compatibility[colorType] || { compatible: [], incompatible: [] };
}

// 퀴즈 질문 데이터
const QUIZ_QUESTIONS = [
    {
        textKey: 'questions.q1.text',
        options: [
            { textKey: 'questions.q1.opt1', types: { red: 3, orange: 1 } },
            { textKey: 'questions.q1.opt2', types: { yellow: 3, orange: 1 } },
            { textKey: 'questions.q1.opt3', types: { blue: 3, green: 1 } },
            { textKey: 'questions.q1.opt4', types: { purple: 3, pink: 1 } }
        ]
    },
    {
        textKey: 'questions.q2.text',
        options: [
            { textKey: 'questions.q2.opt1', types: { red: 3, pink: 1 } },
            { textKey: 'questions.q2.opt2', types: { green: 3, white: 1 } },
            { textKey: 'questions.q2.opt3', types: { blue: 3, white: 1 } },
            { textKey: 'questions.q2.opt4', types: { yellow: 3, orange: 1 } }
        ]
    },
    {
        textKey: 'questions.q3.text',
        options: [
            { textKey: 'questions.q3.opt1', types: { orange: 3, red: 1 } },
            { textKey: 'questions.q3.opt2', types: { blue: 3, purple: 1 } },
            { textKey: 'questions.q3.opt3', types: { green: 3, white: 1 } },
            { textKey: 'questions.q3.opt4', types: { purple: 3, pink: 1 } }
        ]
    },
    {
        textKey: 'questions.q4.text',
        options: [
            { textKey: 'questions.q4.opt1', types: { red: 3, orange: 1 } },
            { textKey: 'questions.q4.opt2', types: { yellow: 3, white: 1 } },
            { textKey: 'questions.q4.opt3', types: { blue: 3, green: 1 } },
            { textKey: 'questions.q4.opt4', types: { pink: 3, purple: 1 } }
        ]
    },
    {
        textKey: 'questions.q5.text',
        options: [
            { textKey: 'questions.q5.opt1', types: { white: 3, blue: 1 } },
            { textKey: 'questions.q5.opt2', types: { green: 3, white: 1 } },
            { textKey: 'questions.q5.opt3', types: { red: 3, orange: 1 } },
            { textKey: 'questions.q5.opt4', types: { purple: 3, pink: 1 } }
        ]
    },
    {
        textKey: 'questions.q6.text',
        options: [
            { textKey: 'questions.q6.opt1', types: { orange: 3, yellow: 1 } },
            { textKey: 'questions.q6.opt2', types: { red: 3, pink: 1 } },
            { textKey: 'questions.q6.opt3', types: { blue: 3, white: 1 } },
            { textKey: 'questions.q6.opt4', types: { green: 3, white: 1 } }
        ]
    },
    {
        textKey: 'questions.q7.text',
        options: [
            { textKey: 'questions.q7.opt1', types: { purple: 3, pink: 1 } },
            { textKey: 'questions.q7.opt2', types: { yellow: 3, orange: 1 } },
            { textKey: 'questions.q7.opt3', types: { blue: 3, green: 1 } },
            { textKey: 'questions.q7.opt4', types: { white: 3, pink: 1 } }
        ]
    },
    {
        textKey: 'questions.q8.text',
        options: [
            { textKey: 'questions.q8.opt1', types: { red: 3, orange: 1 } },
            { textKey: 'questions.q8.opt2', types: { green: 3, blue: 1 } },
            { textKey: 'questions.q8.opt3', types: { purple: 3, white: 1 } },
            { textKey: 'questions.q8.opt4', types: { yellow: 3, orange: 1 } }
        ]
    },
    {
        textKey: 'questions.q9.text',
        options: [
            { textKey: 'questions.q9.opt1', types: { orange: 3, red: 1 } },
            { textKey: 'questions.q9.opt2', types: { pink: 3, purple: 1 } },
            { textKey: 'questions.q9.opt3', types: { white: 3, green: 1 } },
            { textKey: 'questions.q9.opt4', types: { yellow: 3, red: 1 } }
        ]
    },
    {
        textKey: 'questions.q10.text',
        options: [
            { textKey: 'questions.q10.opt1', types: { blue: 3, white: 1 } },
            { textKey: 'questions.q10.opt2', types: { red: 3, orange: 1 } },
            { textKey: 'questions.q10.opt3', types: { purple: 3, pink: 1 } },
            { textKey: 'questions.q10.opt4', types: { green: 3, white: 1 } }
        ]
    },
    {
        textKey: 'questions.q11.text',
        options: [
            { textKey: 'questions.q11.opt1', types: { yellow: 3, orange: 1 } },
            { textKey: 'questions.q11.opt2', types: { blue: 3, green: 1 } },
            { textKey: 'questions.q11.opt3', types: { red: 3, pink: 1 } },
            { textKey: 'questions.q11.opt4', types: { white: 3, purple: 1 } }
        ]
    },
    {
        textKey: 'questions.q12.text',
        options: [
            { textKey: 'questions.q12.opt1', types: { red: 3, orange: 1 } },
            { textKey: 'questions.q12.opt2', types: { blue: 3, white: 1 } },
            { textKey: 'questions.q12.opt3', types: { green: 3, white: 1 } },
            { textKey: 'questions.q12.opt4', types: { purple: 3, pink: 1 } }
        ]
    }
];
