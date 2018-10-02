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
                $('#calendar').fullCalendar('removeEventSources');
                console.log("管院");
                roomTitle = "管";
                tmp = classRoomTemplate("管理學院", "管");
                $("#class-room").html(tmp);
                break;
            case 'h':
                $('#calendar').fullCalendar('removeEventSources');
                console.log("人院");
                roomTitle = "人";
                tmp = classRoomTemplate("人文學院", "人");
                $("#class-room").html(tmp);
                break;
            case 't':
                $('#calendar').fullCalendar('removeEventSources');
                console.log("科院");
                roomTitle = "科";
                tmp = classRoomTemplate("科技學院", "科");
                $("#class-room").html(tmp);
                break;
            case 'e':
                $('#calendar').fullCalendar('removeEventSources');
                console.log("教院");
                roomTitle = "教";
                tmp = classRoomTemplate("教育學院", "教");
                $("#class-room").html(tmp);
                break;
            case 'back':
                $('#calendar').fullCalendar('removeEventSources');
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
                $('#calendar').fullCalendar('removeEventSources');
                break;
            default:
                if (!isNaN(hash) && hash != "") {
                    $('#calendar').fullCalendar('removeEventSources');
                    console.log(hash);
                    roomId = hash;
                    getEvents();
                    $("#header-text").html(`教室預約: ${roomTitle}-${roomId}`);
                } else if (roomId == 0 && roomTitle == "") {
                    $("#header-text").html(`教室預約`);
                }
                break;
        }
        location.hash = "";
    }

    function getEvents() {
        db.ref(`/${roomTitle}/${roomId}`).once('value', function (snapshot) {
            var allData = snapshot.val();
            var eventData = [];
            console.log(allData);
            for (const key in allData) {
                if (allData.hasOwnProperty(key)) {
                    const element = allData[key];
                    eventData.push(element);
                }
            }
            $('#calendar').fullCalendar('addEventSource', eventData);
        });
    }

    function classRoomTemplate(title, tag) {
        return `
        <li>
            <a href="#back">
                <span class="valign-wrapper" style="justify-content: center">
                    <i class="material-icons" style="margin-right: 5px">subdirectory_arrow_left</i>
                    <span>上一頁</span>
                </span>
            </a>
        </li>
        <li>
            <h5 class="center-align">${title}</h5>
        </li>
        <li><a href="#201" class="btn waves-effect waves-light pink accent-1">${tag} 201</a></li>
        <li><a href="#301" class="btn waves-effect waves-light pink accent-1">${tag} 301</a></li>
        <li><a href="#401" class="btn waves-effect waves-light pink accent-1">${tag} 401</a></li>`;
    }

    $("#form-btn").click(renderForm);

    function renderForm(e) {
        e.preventDefault();
        let alertText = "";
        if (roomId == 0 || roomTitle == "") {
            alertText = `<h4 class="center-align">請選擇院別/教室!</h4>`;
            $(".modal-footer").html(`
            <a href="#!" class="modal-close waves-effect waves-green btn-flat">Cancel</a>`);
        } else {
            alertText = `
            <h4>請輸入預約資訊</h4>
            <div class="chip">
                ${roomTitle}${roomId}
            </div>
            <input type="text" id="start-date" class="datepicker" placeholder="Start-Date">
            <input type="text" id="end-date" class="datepicker" placeholder="End-Date">
            <input type="text" id="start-time" class="timepicker" placeholder="Start-Time">
            <input type="text" id="end-time" class="timepicker" placeholder="End-Time">
            <div class="input-field col s12">
                <select id="depart">
                    <option value="" disabled selected>Choose your option</option>
                    <optgroup label="管院">
                        <option value="資管系">資管系</option>
                        <option value="財金系">財金系</option>
                        <option value="經濟系">經濟系</option>
                        <option value="國企系">國企系</option>
                        <option value="觀餐系">觀餐系</option>
                    </optgroup>
                    <optgroup label="科院">
                        <option value="資工系">資工系</option>
                        <option value="土木系">土木系</option>
                        <option value="電機系">電機系</option>
                        <option value="應化系">應化系</option>
                        <option value="應光系">應光系</option>
                    </optgroup>
                    <optgroup label="人院">
                        <option value="中文系">中文系</option>
                        <option value="外文系">外文系</option>
                        <option value="社工系">社工系</option>
                        <option value="公行系">公行系</option>
                        <option value="歷史系">歷史系</option>
                        <option value="東南亞系">東南亞系</option>
                    </optgroup>
                    <optgroup label="教院">
                        <option value="國比系">國比系</option>
                        <option value="教政系">教政系</option>
                        <option value="諮人系">諮人系</option>
                    </optgroup>
                </select>
                <label>系所</label>
            </div>
            `;
            $(".modal-footer").html(`
            <a href="#!" class="modal-close waves-effect waves-green btn-flat">Cancel</a>
            <button id="subBtn" class="btn waves-effect waves-light">Submit
                <i class="material-icons right">send</i>
            </button>`);
        }
        $("#reserve-form").html(alertText);
        M.Datepicker.init(document.querySelectorAll('.datepicker'), {
            container: '.container',
            autoClose: true,
            format: 'yyyy-mm-dd',
            showClearBtn: true
        });
        M.Timepicker.init(document.querySelectorAll('.timepicker'), {
            container: '.container',
            autoClose: true,
            twelveHour: false
        });
        M.FormSelect.init(document.querySelectorAll('select'));
        // $('.timepicker').timepicker();
        // 手動開啟 modal
        var instance = M.Modal.getInstance(document.getElementById("modal1"));
        instance.open();
    }

    $(document).on('click', '#subBtn', submitForm);

    function submitForm() {
        var sdate = $("#start-date").val();
        var edate = $("#end-date").val();
        var stime = $("#start-time").val();
        var etime = $("#end-time").val();
        var depart = $("#depart").val();
        var eventData = {};
        console.log(sdate, edate, stime, etime, depart);
        if (!(/(\d{4})-(\d{2})-(\d{2})/.test(sdate))) {
            alert("起始日期格式錯誤");
            return;
        } else {
            eventData.start = sdate;
        }
        if (edate != "") {
            if (!(/(\d{4})-(\d{2})-(\d{2})/.test(edate))) {
                alert("結束日期格式錯誤");
                return;
            }
            if (sdate > edate) {
                alert("結束日小於開始日");
                return;
            }
            eventData.end = edate;
        } else {
            eventData.end = sdate;
        }
        if (!(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(stime))) {
            alert("開始時間格式錯誤");
            return;
        } else {
            eventData.start += `T${stime}:00`;
        }
        if (!(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(etime))) {
            alert("結束時間格式錯誤");
            return;
        }
        if (sdate == edate && stime > etime) {
            alert("結束時間小於開始時間");
            return;
        } else {
            eventData.end += `T${etime}:00`;
        }
        if (!depart) {
            alert("請選擇系所");
            return;
        } else {
            eventData.title = depart;
        }
        if (confirm("確定要預約嗎?")) {
            console.log(eventData);
            db.ref(`/${roomTitle}/${roomId}`)
                .push(eventData)
                .then(function () {
                    $('#calendar').fullCalendar('addEventSource', [eventData]);
                })
                .catch(function () {
                    alert("伺服器發生錯誤，請稍後再試");
                });
            var instance = M.Modal.getInstance(document.getElementById("modal1"));
            instance.close();
        }
    }
});