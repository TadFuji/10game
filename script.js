// 10を作るゲーム - メインロジック

// ゲーム状態
let currentNumbers = [];
let usedNumbers = [];

// DOM要素
const numbersContainer = document.getElementById('numbers');
const answerInput = document.getElementById('answer');
const resultDisplay = document.getElementById('result');
const checkButton = document.getElementById('check');
const nextButton = document.getElementById('next');
const keypad = document.getElementById('keypad');

// 初期化
function init() {
    generateNumbers();
    createKeypad();
    setupEvents();
}

// 1〜9のランダムな数字を4つ生成
function generateNumbers() {
    currentNumbers = [];
    for (let i = 0; i < 4; i++) {
        currentNumbers.push(Math.floor(Math.random() * 9) + 1);
    }
    usedNumbers = [];
    displayNumbers();
    answerInput.value = '';
    resultDisplay.textContent = '';
    resultDisplay.className = 'result';
    updateKeypadState();
}

// 数字を表示
function displayNumbers() {
    numbersContainer.innerHTML = currentNumbers
        .map((num, index) => `<span class="number" data-index="${index}">${num}</span>`)
        .join('');

    // 使用済みマーキング更新
    updateNumberDisplay();
}

// 使用済み数字の表示更新
function updateNumberDisplay() {
    const numberElements = numbersContainer.querySelectorAll('.number');
    numberElements.forEach((el, index) => {
        if (usedNumbers.includes(index)) {
            el.classList.add('used');
        } else {
            el.classList.remove('used');
        }
    });
}

// キーパッド作成
function createKeypad() {
    // 数字4つ + 演算子 + 括弧 + 削除 + クリア
    const keys = [
        { label: currentNumbers[0], type: 'number', index: 0 },
        { label: currentNumbers[1], type: 'number', index: 1 },
        { label: currentNumbers[2], type: 'number', index: 2 },
        { label: currentNumbers[3], type: 'number', index: 3 },
        { label: '+', type: 'operator' },
        { label: '−', type: 'operator', value: '-' },
        { label: '×', type: 'operator', value: '*' },
        { label: '÷', type: 'operator', value: '/' },
        { label: '←', type: 'action', action: 'backspace' },
        { label: 'C', type: 'action', action: 'clear' },
    ];

    keypad.innerHTML = keys.map(key => {
        const dataAttrs = key.index !== undefined ? `data-index="${key.index}"` : '';
        const value = key.value || key.label;
        return `<button class="key ${key.type}-key" data-type="${key.type}" data-value="${value}" data-action="${key.action || ''}" ${dataAttrs}>${key.label}</button>`;
    }).join('');
}

// キーパッドの状態更新
function updateKeypadState() {
    const keys = keypad.querySelectorAll('.key');
    keys.forEach(key => {
        if (key.dataset.type === 'number') {
            const index = parseInt(key.dataset.index);
            key.textContent = currentNumbers[index];
            key.dataset.value = currentNumbers[index];

            if (usedNumbers.includes(index)) {
                key.classList.add('disabled');
            } else {
                key.classList.remove('disabled');
            }
        }
    });
}

// イベント設定
function setupEvents() {
    // キーパッドクリック
    keypad.addEventListener('click', (e) => {
        const key = e.target.closest('.key');
        if (!key || key.classList.contains('disabled')) return;

        const type = key.dataset.type;
        const value = key.dataset.value;
        const action = key.dataset.action;
        const index = key.dataset.index;

        if (type === 'number') {
            usedNumbers.push(parseInt(index));
            answerInput.value += value;
            updateNumberDisplay();
            updateKeypadState();
        } else if (type === 'operator') {
            answerInput.value += value;
        } else if (type === 'action') {
            if (action === 'backspace') {
                handleBackspace();
            } else if (action === 'clear') {
                usedNumbers = [];
                answerInput.value = '';
                updateNumberDisplay();
                updateKeypadState();
            }
        }
    });

    // 判定ボタン
    checkButton.addEventListener('click', checkAnswer);

    // 次へボタン
    nextButton.addEventListener('click', () => {
        generateNumbers();
        createKeypad();
    });

    // Enterキーで判定
    answerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

    // 入力フィールドへのフォーカス制御（モバイル用）
    answerInput.addEventListener('focus', () => {
        // ソフトウェアキーボードを表示させない
        answerInput.blur();
    });
}

// バックスペース処理
function handleBackspace() {
    const currentValue = answerInput.value;
    if (currentValue.length === 0) return;

    const lastChar = currentValue.slice(-1);

    // 削除する文字が数字かチェック
    if (/\d/.test(lastChar)) {
        // 使用済みリストから最後に使った該当数字を復元
        const num = parseInt(lastChar);
        // 後ろから探して最初に見つかったものを削除
        for (let i = usedNumbers.length - 1; i >= 0; i--) {
            if (currentNumbers[usedNumbers[i]] === num) {
                usedNumbers.splice(i, 1);
                break;
            }
        }
    }

    answerInput.value = currentValue.slice(0, -1);
    updateNumberDisplay();
    updateKeypadState();
}

// 答え判定
function checkAnswer() {
    const expression = answerInput.value;

    if (!expression) {
        resultDisplay.textContent = '式を入力してください';
        resultDisplay.className = 'result incorrect';
        return;
    }

    // 入力された数字を抽出してチェック
    const inputNumbers = expression.match(/\d/g);
    if (!inputNumbers || inputNumbers.length !== 4) {
        resultDisplay.textContent = '4つの数字を使ってください';
        resultDisplay.className = 'result incorrect';
        return;
    }

    // 使用された数字が正しいかチェック
    const sortedInput = inputNumbers.map(Number).sort((a, b) => a - b);
    const sortedCurrent = [...currentNumbers].sort((a, b) => a - b);

    if (JSON.stringify(sortedInput) !== JSON.stringify(sortedCurrent)) {
        resultDisplay.textContent = '与えられた数字を使ってください';
        resultDisplay.className = 'result incorrect';
        return;
    }

    // 計算実行
    try {
        // 安全な評価（数字と演算子のみ許可）
        const safeExpression = expression.replace(/[^0-9+\-*/().]/g, '');
        const result = Function('"use strict"; return (' + safeExpression + ')')();

        if (Math.abs(result - 10) < 0.0001) {
            resultDisplay.textContent = '正解！ 🎉';
            resultDisplay.className = 'result correct';
        } else {
            resultDisplay.textContent = `= ${result}（10ではない）`;
            resultDisplay.className = 'result incorrect';
        }
    } catch (e) {
        resultDisplay.textContent = '式が正しくありません';
        resultDisplay.className = 'result incorrect';
    }
}

// 答えを探す（総当たり）
function findSolution() {
    const ops = ['+', '-', '*', '/'];
    const opSymbols = ['+', '−', '×', '÷'];

    // 4つの数字の全順列を生成
    function permutations(arr) {
        if (arr.length <= 1) return [arr];
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
            for (const perm of permutations(rest)) {
                result.push([arr[i], ...perm]);
            }
        }
        return result;
    }

    const perms = permutations([0, 1, 2, 3]); // インデックスの順列

    // 全組み合わせを試す
    for (const perm of perms) {
        const nums = perm.map(i => currentNumbers[i]);

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                for (let k = 0; k < 4; k++) {
                    // 式を構築
                    const expr = `${nums[0]}${ops[i]}${nums[1]}${ops[j]}${nums[2]}${ops[k]}${nums[3]}`;

                    try {
                        const result = eval(expr);
                        if (Math.abs(result - 10) < 0.0001) {
                            // 表示用に演算子を変換
                            const displayExpr = `${nums[0]}${opSymbols[i]}${nums[1]}${opSymbols[j]}${nums[2]}${opSymbols[k]}${nums[3]}`;
                            return displayExpr;
                        }
                    } catch (e) {
                        // 計算エラーは無視
                    }
                }
            }
        }
    }

    return null; // 解が見つからない
}

// 答えを表示
function showSolution() {
    const solution = findSolution();

    if (solution) {
        resultDisplay.textContent = `こたえ: ${solution}`;
        resultDisplay.className = 'result correct';
    } else {
        resultDisplay.textContent = 'この数字では10が作れません 😢';
        resultDisplay.className = 'result incorrect';
    }
}

// 起動
init();

// 「こたえ」ボタンのイベント設定
document.getElementById('hint').addEventListener('click', showSolution);
