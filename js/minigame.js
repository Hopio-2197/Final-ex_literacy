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

function makeAnswer(value){
    answer += value;

    document.getElementById("answer").textContent = answer;
}

function clearAnswer(){
    answer += "";

    document.getElementById("answer").textContent = answer;
}

function judgeAnswer(answer){
    
}

function makeProblem(){
    let nums = [];
    nums = out_nums(10, nums);

    nums.sort(() => Math.random() - 0.5);

    document.getElementById("numbers").textContent  = nums.join(" ");
}


// 少なくとも一つは解のある問題を作る関数
function out_nums(goal,nums){
    // numは出力する配列

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