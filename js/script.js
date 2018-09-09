$(document).ready(function () {
    M.AutoInit();

    var roomTitle = "",
        roomId = 0;

    window.onhashchange = function () {
        // console.log(location.hash);
        var hash = location.hash.replace("#", "");
        let tmp;
        switch (hash) {
            case 'm':
                console.log("管院");
                roomTitle = "管";
                tmp = classRoomTemplate("管理學院", "管");
                $("#class-room").html(tmp);
                break;
            case 'h':
                console.log("人院");
                roomTitle = "人";
                tmp = classRoomTemplate("人文學院", "人");
                $("#class-room").html(tmp);
                break;
            case 't':
                console.log("科院");
                roomTitle = "科";
                tmp = classRoomTemplate("科技學院", "科");
                $("#class-room").html(tmp);
                break;
            case 'e':
                console.log("教院");
                roomTitle = "教";
                tmp = classRoomTemplate("教育學院", "教");
                $("#class-room").html(tmp);
                break;
            case 'back':
                console.log("上一頁");
                roomId = 0;
                roomTitle = "";
                $("#class-room").html(`
                <li>
                    <a class="btn waves-effect waves-light brown lighten-1" href="#m" style="font-size: 25px">管理學院</a>
                </li>
                <li>
                    <a class="btn waves-effect waves-light brown lighten-1" href="#h" style="font-size: 25px">人文學院</a>
                </li>
                <li>
                    <a class="btn waves-effect waves-light brown lighten-1" href="#t" style="font-size: 25px">科技學院</a>
                </li>
                <li>
                    <a class="btn waves-effect waves-light brown lighten-1" href="#e" style="font-size: 25px">教育學院</a>
                </li>
                `);
                break;
            default:
                if (!isNaN(hash) && hash != "") {
                    console.log(hash);
                    roomId = hash;
                    $("#header-text").html(`教室預約: ${roomTitle}-${roomId}`);
                } else if (roomId == 0 && roomTitle == "") {
                    $("#header-text").html(`教室預約`);
                }
                break;
        }
        location.hash = "";
    }

    function classRoomTemplate(title, tag) {
        return `
        <li><a href="#back" style="text-align: center">上一頁</a></li>
        <li>
            <h5 style="text-align: center">${title}</h5>
        </li>
        <li><a href="#201" class="btn waves-effect waves-light pink accent-1">${tag} 201</a></li>
        <li><a href="#301" class="btn waves-effect waves-light pink accent-1">${tag} 301</a></li>
        <li><a href="#401" class="btn waves-effect waves-light pink accent-1">${tag} 401</a></li>`;
    }

    $("#form-btn").click(function (e) {
        e.preventDefault();
        let alertText = "";
        if (roomId == 0 || roomTitle == "") {
            alertText = `<h4 style="text-align: center">請選擇院別/教室!</h4>`;
            $(".modal-footer").html(`
            <a href="#!" class="modal-close waves-effect waves-green btn-flat">Cancel</a>`);
        } else {
            alertText = `
            <h4>請輸入預約資訊</h4>
            <div class="chip">
                ${roomTitle}${roomId}
            </div>
            <input type="text" id="date" class="datepicker" placeholder="Date">
            <input type="text" class="timepicker" placeholder="Start-Time">
            <input type="text" class="timepicker" placeholder="End-Time">
            <div class="input-field col s12">
                <select>
                    <option value="" disabled selected>Choose your option</option>
                    <optgroup label="管院">
                        <option value="1">資管系</option>
                        <option value="2">財金系</option>
                        <option value="2">經濟系</option>
                        <option value="2">國企系</option>
                        <option value="2">觀餐系</option>
                    </optgroup>
                    <optgroup label="科院">
                        <option value="3">資工系</option>
                        <option value="4">土木系</option>
                        <option value="5">電機系</option>
                        <option value="6">應化系</option>
                        <option value="7">應光系</option>
                    </optgroup>
                    <optgroup label="人院">
                        <option value="8">中文系</option>
                        <option value="9">外文系</option>
                        <option value="10">社工系</option>
                        <option value="11">公行系</option>
                        <option value="12">歷史系</option>
                        <option value="13">東南亞系</option>
                    </optgroup>
                    <optgroup label="教院">
                        <option value="8">國比系</option>
                        <option value="9">教政系</option>
                        <option value="10">諮人系</option>
                    </optgroup>
                </select>
                <label>系所</label>
            </div>
            `;
            $(".modal-footer").html(`
            <a href="#!" class="modal-close waves-effect waves-green btn-flat">Cancel</a>
            <button class="btn waves-effect waves-light">Submit
                <i class="material-icons right">send</i>
            </button>`);
        }
        $("#reserve-form").html(alertText);
        M.Datepicker.init(document.querySelectorAll('.datepicker'), {
            container: '.container',
            format: 'yyyy-mm-dd',
            showClearBtn: true
        });
        M.Timepicker.init(document.querySelectorAll('.timepicker'), {
            container: '.container',
            twelveHour: false
        });
        M.FormSelect.init(document.querySelectorAll('select'));
        // $('.timepicker').timepicker();
        // 手動開啟 modal
        var instance = M.Modal.getInstance(document.getElementById("modal1"));
        instance.open();
    });
});