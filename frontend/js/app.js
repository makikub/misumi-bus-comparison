// グローバル変数
let busData = null;
let holidayData = null;
let currentDayType = 'weekday'; // 'weekday', 'saturday', 'holiday'
const USE_SAMPLE_DATA = true; // 開発時はサンプルデータを使用

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', () => {
    // 初期データ取得
    fetchBusData();
    fetchHolidayData();
    
    // 時計の開始
    updateClock();
    setInterval(updateClock, 1000);
    
    // バス時刻の定期更新（30秒ごと）
    setInterval(updateBusTimes, 30000);
});

// バスデータの取得
async function fetchBusData() {
    try {
        // 開発時はサンプルデータを使用
        const dataUrl = USE_SAMPLE_DATA ? 'data/sample_bus_timetable.json' : 'data/bus_timetable.json';
        const response = await fetch(dataUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        busData = await response.json();
        
        // 最終更新時間の表示
        document.getElementById('last-updated').textContent = new Date().toLocaleString('ja-JP');
        
        // バス時刻の表示更新
        updateBusTimes();
    } catch (error) {
        console.error('バスデータの取得に失敗しました:', error);
        document.querySelector('#chigasaki .next-time').textContent = '--:--';
        document.querySelector('#chigasaki .remaining').textContent = 'データ取得エラー';
        document.querySelector('#tsujido .next-time').textContent = '--:--';
        document.querySelector('#tsujido .remaining').textContent = 'データ取得エラー';
    }
}

// 祝日データの取得
async function fetchHolidayData() {
    try {
        // 開発時はサンプルデータを使用
        const dataUrl = USE_SAMPLE_DATA ? 'data/sample_holidays.json' : 'data/holidays.json';
        const response = await fetch(dataUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        holidayData = await response.json();
    } catch (error) {
        console.error('祝日データの取得に失敗しました:', error);
        holidayData = {};
    }
}

// 現在時刻の更新
function updateClock() {
    const now = new Date();
    
    // 日付表示
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    const dateString = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 (${days[now.getDay()]})`;
    document.getElementById('current-date').textContent = dateString;
    
    // 時刻表示
    const timeString = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('current-time').textContent = timeString;
    
    // 曜日種別の判定と表示
    checkDayType(now);
}

// 曜日種別の判定
function checkDayType(date) {
    const day = date.getDay();
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD形式
    let newDayType;
    
    // 祝日判定
    if (holidayData && holidayData[dateStr]) {
        newDayType = 'holiday';
        document.getElementById('calendar-type').textContent = '休日ダイヤ';
        document.getElementById('calendar-type').title = holidayData[dateStr]; // 祝日名をツールチップに表示
    } 
    // 日曜判定
    else if (day === 0) {
        newDayType = 'holiday';
        document.getElementById('calendar-type').textContent = '休日ダイヤ';
        document.getElementById('calendar-type').title = '日曜日';
    } 
    // 土曜判定
    else if (day === 6) {
        newDayType = 'saturday';
        document.getElementById('calendar-type').textContent = '土曜ダイヤ';
        document.getElementById('calendar-type').title = '土曜日';
    } 
    // 平日判定
    else {
        newDayType = 'weekday';
        document.getElementById('calendar-type').textContent = '平日ダイヤ';
        document.getElementById('calendar-type').title = '平日';
    }
    
    // 曜日種別が変わった場合にバス時刻を更新
    if (currentDayType !== newDayType) {
        currentDayType = newDayType;
        updateBusTimes();
    }
}

// バス時刻の更新
function updateBusTimes() {
    if (!busData) return;
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentMinutes = currentHour * 60 + currentMinute;
    
    // 茅ヶ崎駅行きの次のバス
    updateNextBus('chigasaki', busData.chigasaki[currentDayType], currentMinutes);
    
    // 辻堂駅行きの次のバス
    updateNextBus('tsujido', busData.tsujido[currentDayType], currentMinutes);
}

// 次のバス時刻の計算と表示
function updateNextBus(stationId, timetable, currentMinutes) {
    if (!timetable || timetable.length === 0) {
        document.querySelector(`#${stationId} .next-time`).textContent = '--:--';
        document.querySelector(`#${stationId} .remaining`).textContent = 'データがありません';
        document.querySelector(`#${stationId} .following-buses`).innerHTML = '';
        return;
    }
    
    // 時刻表から「現在時刻より後」のバスを抽出
    const upcomingBuses = timetable.filter(bus => {
        const busMinutes = parseInt(bus.hour) * 60 + parseInt(bus.minute);
        return busMinutes > currentMinutes;
    });
    
    if (upcomingBuses.length === 0) {
        // 本日の残りのバスが無い場合
        document.querySelector(`#${stationId} .next-time`).textContent = '--:--';
        document.querySelector(`#${stationId} .remaining`).textContent = '本日のバスは終了しました';
        document.querySelector(`#${stationId} .following-buses`).innerHTML = '';
        return;
    }
    
    // 次のバス
    const nextBus = upcomingBuses[0];
    const nextBusTime = `${nextBus.hour}:${nextBus.minute.toString().padStart(2, '0')}`;
    const nextBusMinutes = parseInt(nextBus.hour) * 60 + parseInt(nextBus.minute);
    const minutesRemaining = nextBusMinutes - currentMinutes;
    
    document.querySelector(`#${stationId} .next-time`).textContent = nextBusTime;
    document.querySelector(`#${stationId} .remaining`).textContent = `あと${minutesRemaining}分`;
    
    // 次の次のバス（ある場合）
    if (upcomingBuses.length > 1) {
        const followingBus = upcomingBuses[1];
        const followingBusTime = `${followingBus.hour}:${followingBus.minute.toString().padStart(2, '0')}`;
        const followingBusMinutes = parseInt(followingBus.hour) * 60 + parseInt(followingBus.minute);
        const followingMinutesRemaining = followingBusMinutes - currentMinutes;
        
        document.querySelector(`#${stationId} .following-buses`).innerHTML = 
            `<p>次: ${followingBusTime} (あと${followingMinutesRemaining}分)</p>`;
    } else {
        document.querySelector(`#${stationId} .following-buses`).innerHTML = '';
    }
    
    // 残り時間が近い場合、強調表示
    const remainingElement = document.querySelector(`#${stationId} .remaining`);
    if (minutesRemaining <= 5) {
        remainingElement.classList.add('urgent');
    } else {
        remainingElement.classList.remove('urgent');
    }
}
