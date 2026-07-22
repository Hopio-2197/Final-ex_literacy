let mylist = [];
const th_num = 4;

//サイトを開いたときに課題リストを復元する仕組み
function loadList() {

    const json = localStorage.getItem('mylist'); //localStorageから'mylist'データを持ってくる
    mylist = json ? JSON.parse(json) : []; //JSON文字列を配列として扱えるようにするために，JSON.parse(json)とした

    //tbodyタグの作成
    const tbody = document.getElementById("mylist");
    tbody.innerHTML = ""; //既存の表の中身をクリアにしないで同じ行が重複してしまうのを防ぐ工夫

    //tbodyタグにtrタグを追加する処理
    for (let j = 0; j < mylist.length; j++) {

        const tr = document.createElement("tr"); //trタグの作成

        for (let k = 0; k < th_num; k++) {

            const td = document.createElement("td"); //tdタグの作成

            if (k === 3) {
                const button = document.createElement("button"); //buttonタグの作成
                button.textContent = "達成"; //buttonタグの子要素に達成という文字を入れる
                button.dataset.index = String(j); //「あなたは何行目のボタンですよ」と伝える

                //ボタンが押されたときに，finish(引数:行番号)が実行されるようにする
                button.addEventListener("click", () => {
                    finish(Number(button.dataset.index));
                });

                td.appendChild(button);
            }
            else {
                td.textContent = mylist[j][k]; //変数tdは再代入不可なので，td.textContentとすることで要素のプロパティに値を入れるようにした
            }
            tr.appendChild(td);
        }
        tbody.append(tr);
    }
}

//サイトを開いたとき，またはリロード時に関数ltoR()と関数setSeasonBackgroundが実行されるようにする工夫
document.addEventListener('DOMContentLoaded', () => {
    ltoR();
    setSeasonBackground();
});

//loadList()とRow_Painted()の2つの関数をまとめた関数
function ltoR(){

    loadList();
    Row_Painted();
}

//動的リストの作成
function addTask() { //idea2：追加ボタンを押したときに表に新たな行が追加される仕組み

    if (document.getElementById("subject").value.trim() === "" || document.getElementById("content").value.trim() === "") {
        alert("科目または内容は必ず書いてね！");
    }
    else {
        const thead = ["subject", "content", "deadline", "operation"]; //見出しの内容
        let row = [];

        //tbodyタグの作成
        const tbody = document.getElementById("mylist");

        //tbodyタグにtrタグを追加する処理
        const tr = document.createElement("tr"); //trタグの作成

        for (let i = 0; i < th_num; i++) {

            const td = document.createElement("td"); //tdタグの作成

            if (i === 3) {
                row[i] = "noncomplete"; //以前はここでボタンタグを入れていたが，それだとローカルストレージはJSON文字列でしか保存できないで，リロードするとボタンではなく[object,object]が表示されるようになってしまっていた
            }
            else {
                row[i] = document.getElementById(thead[i]).value.trim();
                td.textContent = document.getElementById(thead[i]).value.trim();
            }
            tr.appendChild(td);
        }
        tbody.append(tr);
        mylist.push(row); //配列mylistの更新

        //入力欄をクリアにする
        const inputs = document.getElementsByClassName("input_data"); //はじめは，idで持ってきて一つ一つクリアにしていたがこれだと，theadの見出しを増やしたときに，増やした分だけクリア処理のコードを書かないといけなくてめんどくさい！

        for (let j = 0; j < inputs.length; j++) {

            inputs[j].value = "";
        }
    }
}

//表データをローカルストレージに保存する仕組み
function saveList() {

    localStorage.setItem("mylist", JSON.stringify(mylist));
}

//複数の関数を1つにする
function AtoR() { 
    
    addTask();
    saveList();
    loadList(); //addTask()単体ではなく，AtoL()をボタンのonclick属性に指定することでaddTask()でボタンを作らなくても，loadList()でボタンタグを作成するようにしたので，ユーザからは"noncomplete"の文字が見えることはないし，ボタンタグをローカルストレージに保存できないという問題を解決できた
    Row_Painted();
}


//表に追加された情報を全消去する仕組み
function allDelete() {
    
    mylist = [];
    saveList(); //間にsaveList()をはさむことで，前回のlocalStorageの内容を反映させないようにした
    loadList();
}

//達成ボタンを押したらその行の情報がクリアになる仕組み
function finish(row_num) {
    
    const deadline = mylist[row_num][2];

    //締め切り期限内に達成できた時だけ誉め言葉を表示し，行を消すようにする
    if(isOver(deadline) !== true){

        alert(Praise());

        mylist.splice(row_num, 1); //row_num番目の要素から数えて1要素をカットする，ここで空の配列を使用するとloadList()したときに，undefinedとなったり行が消えずに空の行が表示されたままになっちゃう
        saveList(); 
        loadList();
        Row_Painted();
    }
}

//締め切りまでの残り日数に応じて行の背景色を変える仕組み
function Row_Painted(){
    
    const today = new Date();
    const TODAY = 24 * 60 * 60 * 1000 //1日をミリ秒で表している
    let deadline; //締め切り日を格納する変数
    let remainDay; //残り日数を格納する変数

    const taskList = document.getElementById("mylist"); //id属性値("mylist")を持つtbodyタグの取得
    const rows = taskList.children; //tbodyタブの子要素であるtrタグを配列のような形で取得

    for(let i = 0; i < mylist.length; i++){
        
        deadline = new Date(mylist[i][2]); //ミリ秒で表された締め切り日の取得
        deadline.setHours(23, 59, 59); //当日はセーフにするために23時59分59秒に変える
        
        remainDay = (deadline - today) / TODAY; //締め切りまでの残り日数の取得

        //締め切り日を過ぎた場合
        if(remainDay < 0){
            rows[i].classList.add("over") //trタグにclass属性値("over")を追加する
        }
        //締め切り日当日の場合
        else if(remainDay < 1){
            rows[i].classList.add("soon") //trタグにclass属性値("over")を追加する
        }
        //締め切り日3日前の場合
        else if(remainDay <= 3){
            rows[i].classList.add("near") //trタグにclass属性値("over")を追加する
        };
    }
}

//締め切りを過ぎているかを判定する仕組み (true: 過ぎている, false: 過ぎていない)
function isOver(d){ //dは，締め切りを表す

    const today = new Date(); 
    const deadline = new Date(d); 
    
    deadline.setHours(23, 59, 59); //当日(23時59分)いっぱいはセーフにしたいので，0時0分を変更する

    return deadline < today; 
}

//ランダムな誉め言葉を戻り値として返す関数
function Praise(){
     
    //複数の誉め言葉を配列で保存しておく
    const Praises = [
        "締め切り前に出せたの偉すぎ！",
        "途中で投げ出さなかったのが一番偉い！",
        "前より段取りよくなってるね！",
        "余裕持って終わらせられてるじゃん！",
        "提出まで含めて完璧だね！",
        "よし！，今日の自分偉い！",
        "未来の自分を助けたな！",
        "天才か？（締め切り守ってる時点で）",
        "今日だけは自分にご褒美上げていいよ！",
        "え！，ちゃんとしてる人じゃん",
        "大変だったよね．よく終わらせた！",
        "締め切り部門，優勝おめでとう！",
        "人類の進歩を見た！",
        "この調子で世界とれる！",
        "えらい！，偉人！，えら人！",
        "よし！，今日は勝ちだね！",
        "未来の自分，今泣いて喜んでるよ！",
        "え？間に合ったの？やればできるじゃん",
        "今日のあなた，信用できる！",
        "ギリギリ芸卒業の気配あるよ！",
        "チャットGPT使ったか～？（笑）",
        "提出＝人生の勝利条件！",
        "サボりたい気持ちを倒したね！，経験値うまいでしょ～（笑）",
        "やる気じゃなくて，やり遂げたのが偉いね！",
        "提出の達成感は，合法のドラッグ！",
        "よし！，次は休憩を提出します",
        "今日のあなたは，ちゃんとしてる！",
        "提出した？えら！",
        "勝ち確だね！",
        "神ムーブかましてるな～",
        "今日だけは自分に甘くしていいよ！",
        "ぎりぎりの民から，余裕の民に転職だね！",
        "未来を救った英雄！！",
        "提出したので今日のノルマ達成！",
        "締め切り守れる人，尊敬します！",
        "やり切ったの，普通にすごすぎます！",
        "未来の自分にプレゼントしましたね！",
        "継続できるのが一番強いですよ！",
        "ちゃんと終わらせたのが偉いです！",
        "はい勝ち～！（笑）",
    ];

    const index = Math.floor(Math.random() * Praises.length); //ランダムな添え字を取得する仕組み
    
    return Praises[index];
}

//季節に応じて背景の画像を変える関数
function setSeasonBackground() {
    const month = new Date().getMonth() + 1; //0-11だから1を足す

    let season;

    if (month >= 3 && month <= 5) {
        season = "spring";
    }
    else if (month >= 6 && month <= 8) {
        season = "summer";
    }
    else if (month >= 9 && month <= 11) {
        season = "autumn";
    }
    else {
        season = "winter";
    }

    document.body.classList.add(season); //bodyタグにclassを追加する
}