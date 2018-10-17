$(document).ready(function () {
    M.AutoInit();

    var roomTitle = "",
        roomId = 0;

    window.onhashchange = function () {
        // console.log(location.hash);
        var hash = location.hash.replace("#", "");
        switch (hash) {
            case 'm':
            case 'h':
            case 't':
            case 'e':
                renderRoomSelect(hash);
                break;
        }
        location.hash = "";
    }

    function renderRoomSelect(type) {
        let college = {
            m: "管",
            h: "人",
            t: "科",
            e: "教"
        };
        let tmp;
        $("#header-text").html(`教室預約`);
        $('#calendar').fullCalendar('removeEventSources');
        roomTitle = college[type];
        tmp = classRoomTemplate(roomTitle);
        $("#class-room").html(tmp);
    }

    // 選取教室時觸發
    $('#class-room').change(function () {
        if (!isNaN(this.value) && this.value != "") {
            $('#calendar').fullCalendar('removeEventSources');
            console.log(this.value);
            roomId = this.value;
            getEvents();
            $("#header-text").html(`教室預約: ${roomTitle}-${roomId}`);
        } else {
            $("#header-text").html(`教室預約`);
        }
    });

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

    function classRoomTemplate(tag) {
        return `
        <option value="" disabled selected>Choose your option</option>
        <option value="201">${tag} 201</option>
        <option value="301">${tag} 301</option>
        <option value="401">${tag} 401</option>`;
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