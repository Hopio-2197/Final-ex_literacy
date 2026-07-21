const omikujiData = [
    {
        fortune: "大凶",
        comment: "おつかれいいぃぃぃぃ～～～！！！やっちゃったね！！！今日は家から出ないようにしよう！！",
        probability: 0.025
    },
    {
        fortune: "凶",
        comment: "おつかれいい～！背後に気をつけて！",
        probability: 0.075
    },
    {
        fortune: "末吉",
        comment: "おつかれ！言うことはないから気を付けて！",
        probability: 0.15
    },
    {
        fortune: "吉",
        comment: "体調に気を付けて程よくがんばれ",
        probability: 0.5
    },
    {
        fortune: "中吉",
        comment: "いい調子だね！！この調子で続けていこう！！",
        probability: 0.15
    },
    {
        fortune: "大吉",
        comment: "やったね！！！今日は何かいいことがありそう！！！",
        probability: 0.075
    },
    {
        fortune: "神吉",
        comment: "おめでとう！！！！これを当てたあなたは豪運の持ち主だ！！！！宝くじやギャンブルをするなら今かも！！????",
        probability: 0.025
    }
];

const button = document.getElementById("omikujiButton");
const countdownElement = document.getElementById("countdown");
const resultElement = document.getElementById("result");
const fortuneElement = document.getElementById("fortune");
const commentElement = document.getElementById("comment");

// 確率分布に基づいておみくじ結果を選択する関数
function selectFortune() {
    const random = Math.random();
    let cumulativeProbability = 0;

    for (const item of omikujiData) {
        cumulativeProbability += item.probability;

        if (random < cumulativeProbability) {
            return item;
        }
    }

    return omikujiData[omikujiData.length - 1];
}

// カウントダウンを開始する関数
function startCountdown() {
    let count = 3;

    button.disabled = true;
    resultElement.classList.add("hidden");

    countdownElement.textContent = count;

    const interval = setInterval(() => {
        count--;

        if (count > 0) {
            countdownElement.textContent = count;
        } else {
            clearInterval(interval);

            countdownElement.textContent = "結果は～～～";

            setTimeout(() => {
                const result = selectFortune();

                fortuneElement.textContent = result.fortune;
                commentElement.textContent = result.comment;

                resultElement.classList.remove("hidden");
                countdownElement.textContent = "";
                button.disabled = false;
            }, 1000);
        }
    }, 1000);
}

button.addEventListener("click", startCountdown);