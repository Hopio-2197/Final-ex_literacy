// ハンバーガーメニューの関数
window.addEventListener('load', function () {
    var $button = this.document.querySelector('.toggle-menu-button');
    var $menu = this.document.querySelector('.header-site-menu');

    $button.addEventListener('click', function () {
        if ($menu.classList.contains('is-show')) {
            $menu.classList.remove('is-show');
        }
        else {
            $menu.classList.add('is-show');
        }
    });
});

// 変数の初期化
var nums = [];
var answer = "";
var text_result = "";

// 解答を生成する関数
function makeAnswer(value,btn,type){
    // 文字列として加える
    answer += value;
    document.getElementById("answer").textContent = answer;

    // 数字を使用不可能に
    if (type == 0){
        btn.disabled = true;
    }
}

// 解答の(一時)計算
function calclate(){
    try {
        answer = Function('"use strict"; return (' + answer + ')')();
        answer = String(answer);
        document.getElementById("answer").textContent = answer;
    } catch (e) {
        text_result = "式が正しくありません";
        document.getElementById("result").textContent = text_result;
    }
}

// 解答をクリアする関数
function clearAnswer(){
    // 解答を初期状態に直す
    answer = "";
    text_result = "";

    // 表記も初期状態に直す
    document.getElementById("answer").textContent = answer;
    document.getElementById("result").textContent = text_result;

    // 数字を全て使用可能にする
    document.querySelectorAll('.num').forEach(btn => {btn.disabled = false;});
}

// 解答を判定する関数
function judgeAnswer(){
    // 文字列を式に変換
    answer = Function('"use strict"; return (' + answer + ')')();

    if (answer == 10){
        text_result = "正解！";
        document.getElementById("result").textContent = text_result;
    }else{
        text_result = "違います，，";
        document.getElementById("result").textContent = text_result;
    }
}

// 問題生成の関数
function makeProblem(){
    nums = [];
    answer = "";
    clearAnswer();

    nums = out_nums(10, nums);

    document.getElementById("numbers").textContent  = nums.join(" ");
}


// 少なくとも一つは解のある問題を作り，配列で返す関数
function out_nums(goal,nums){   // numは出力する配列

    // 配列の大きさが3以上の時，残りの数を数字の列に加える
    if (nums.length >= 3)  {
        nums.push(goal);
        return nums;
    }

    // ランダムに演算子と数字を出力する：数字1~9,演算子:0~3
    var num;
    var calc;
    var newgoal;

    while(true){
        num = Math.floor(Math.random() * 9 + 1);
        calc = Math.floor(Math.random() * 4);

        // 四則演算子の対応関係
        if(calc == 0){
            newgoal =goal - num;
        }else if(calc == 1){
            newgoal = goal + num;
        }else if(calc == 2){
            if(goal % num != 0){
                continue;
            }
            newgoal = Math.floor(goal/num);
        }else{
            newgoal = goal * num;
        }

        // newgoalが一桁になるときだけ採用
        if(newgoal < 10 && newgoal >=0){
            goal = newgoal;
            break;
        }
    }

    // 生成した数字を配列に入れる
    nums.push(num);

    // 再帰構造で数字を生成&出力
    return out_nums(goal, nums);
}