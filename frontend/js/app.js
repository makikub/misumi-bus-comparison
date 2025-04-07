// グローバル変数
let busData = null;
let holidayData = null;
let currentDayType = 'weekday'; // 'weekday', 'saturday', 'holiday'
const USE_SAMPLE_DATA = true; // 開発時はサンプルデータを使用
const USE_INLINE_DATA = true; // ファイル読み込みエラー時はインラインデータを使用

// インラインサンプルデータ（ファイル読み込みエラー時に使用）
const INLINE_BUS_DATA = {
  "chigasaki": {
    "weekday": [
      {"hour": "6", "minute": "21"},
      {"hour": "6", "minute": "36"},
      {"hour": "6", "minute": "55"},
      {"hour": "7", "minute": "19"},
      {"hour": "7", "minute": "48"},
      {"hour": "8", "minute": "18"},
      {"hour": "8", "minute": "58"},
      {"hour": "9", "minute": "26"},
      {"hour": "9", "minute": "56"},
      {"hour": "10", "minute": "26"},
      {"hour": "10", "minute": "56"},
      {"hour": "11", "minute": "26"},
      {"hour": "11", "minute": "56"},
      {"hour": "12", "minute": "26"},
      {"hour": "12", "minute": "56"},
      {"hour": "13", "minute": "26"},
      {"hour": "13", "minute": "56"},
      {"hour": "14", "minute": "26"},
      {"hour": "14", "minute": "56"},
      {"hour": "15", "minute": "26"},
      {"hour": "15", "minute": "56"},
      {"hour": "16", "minute": "28"},
      {"hour": "16", "minute": "56"},
      {"hour": "17", "minute": "28"},
      {"hour": "17", "minute": "56"},
      {"hour": "18", "minute": "16"},
      {"hour": "18", "minute": "36"},
      {"hour": "18", "minute": "56"},
      {"hour": "19", "minute": "16"},
      {"hour": "19", "minute": "36"},
      {"hour": "20", "minute": "26"},
      {"hour": "20", "minute": "56"},
      {"hour": "21", "minute": "26"},
      {"hour": "21", "minute": "56"},
      {"hour": "22", "minute": "31"}
    ],
    "saturday": [
      {"hour": "6", "minute": "55"},
      {"hour": "7", "minute": "25"},
      {"hour": "7", "minute": "55"},
      {"hour": "8", "minute": "25"},
      {"hour": "8", "minute": "55"},
      {"hour": "9", "minute": "25"},
      {"hour": "9", "minute": "55"},
      {"hour": "10", "minute": "25"},
      {"hour": "10", "minute": "55"},
      {"hour": "11", "minute": "25"},
      {"hour": "11", "minute": "55"},
      {"hour": "12", "minute": "25"},
      {"hour": "12", "minute": "55"},
      {"hour": "13", "minute": "25"},
      {"hour": "13", "minute": "55"},
      {"hour": "14", "minute": "25"},
      {"hour": "14", "minute": "55"},
      {"hour": "15", "minute": "25"},
      {"hour": "15", "minute": "55"},
      {"hour": "16", "minute": "25"},
      {"hour": "16", "minute": "55"},
      {"hour": "17", "minute": "25"},
      {"hour": "17", "minute": "55"},
      {"hour": "18", "minute": "25"},
      {"hour": "18", "minute": "55"},
      {"hour": "19", "minute": "25"},
      {"hour": "19", "minute": "55"},
      {"hour": "20", "minute": "25"},
      {"hour": "20", "minute": "55"},
      {"hour": "21", "minute": "25"},
      {"hour": "21", "minute": "55"}
    ],
    "holiday": [
      {"hour": "6", "minute": "55"},
      {"hour": "7", "minute": "25"},
      {"hour": "7", "minute": "55"},
      {"hour": "8", "minute": "25"},
      {"hour": "8", "minute": "55"},
      {"hour": "9", "minute": "25"},
      {"hour": "9", "minute": "55"},
      {"hour": "10", "minute": "25"},
      {"hour": "10", "minute": "55"},
      {"hour": "11", "minute": "25"},
      {"hour": "11", "minute": "55"},
      {"hour": "12", "minute": "25"},
      {"hour": "12", "minute": "55"},
      {"hour": "13", "minute": "25"},
      {"hour": "13", "minute": "55"},
      {"hour": "14", "minute": "25"},
      {"hour": "14", "minute": "55"},
      {"hour": "15", "minute": "25"},
      {"hour": "15", "minute": "55"},
      {"hour": "16", "minute": "25"},
      {"hour": "16", "minute": "55"},
      {"hour": "17", "minute": "25"},
      {"hour": "17", "minute": "55"},
      {"hour": "18", "minute": "25"},
      {"hour": "18", "minute": "55"},
      {"hour": "19", "minute": "25"},
      {"hour": "19", "minute": "55"},
      {"hour": "20", "minute": "25"},
      {"hour": "20", "minute": "55"},
      {"hour": "21", "minute": "25"},
      {"hour": "21", "minute": "55"}
    ]
  },
  "tsujido": {
    "weekday": [
      {"hour": "5", "minute": "57"},
      {"hour": "6", "minute": "16"},
      {"hour": "6", "minute": "34"},
      {"hour": "6", "minute": "46"},
      {"hour": "6", "minute": "58"},
      {"hour": "7", "minute": "10"},
      {"hour": "7", "minute": "25"},
      {"hour": "7", "minute": "40"},
      {"hour": "7", "minute": "55"},
      {"hour": "8", "minute": "17"},
      {"hour": "8", "minute": "37"},
      {"hour": "9", "minute": "05"},
      {"hour": "9", "minute": "35"},
      {"hour": "10", "minute": "05"},
      {"hour": "10", "minute": "35"},
      {"hour": "11", "minute": "05"},
      {"hour": "11", "minute": "35"},
      {"hour": "12", "minute": "05"},
      {"hour": "12", "minute": "35"},
      {"hour": "13", "minute": "05"},
      {"hour": "13", "minute": "35"},
      {"hour": "14", "minute": "05"},
      {"hour": "14", "minute": "35"},
      {"hour": "15", "minute": "05"},
      {"hour": "15", "minute": "35"},
      {"hour": "16", "minute": "07"},
      {"hour": "16", "minute": "35"},
      {"hour": "17", "minute": "07"},
      {"hour": "17", "minute": "35"},
      {"hour": "17", "minute": "55"},
      {"hour": "18", "minute": "15"},
      {"hour": "18", "minute": "35"},
      {"hour": "18", "minute": "55"},
      {"hour": "19", "minute": "15"},
      {"hour": "19", "minute": "35"},
      {"hour": "20", "minute": "05"},
      {"hour": "20", "minute": "35"},
      {"hour": "21", "minute": "05"},
      {"hour": "21", "minute": "35"},
      {"hour": "22", "minute": "10"}
    ],
    "saturday": [
      {"hour": "6", "minute": "25"},
      {"hour": "7", "minute": "05"},
      {"hour": "7", "minute": "35"},
      {"hour": "8", "minute": "05"},
      {"hour": "8", "minute": "35"},
      {"hour": "9", "minute": "05"},
      {"hour": "9", "minute": "35"},
      {"hour": "10", "minute": "05"},
      {"hour": "10", "minute": "35"},
      {"hour": "11", "minute": "05"},
      {"hour": "11", "minute": "35"},
      {"hour": "12", "minute": "05"},
      {"hour": "12", "minute": "35"},
      {"hour": "13", "minute": "05"},
      {"hour": "13", "minute": "35"},
      {"hour": "14", "minute": "05"},
      {"hour": "14", "minute": "35"},
      {"hour": "15", "minute": "05"},
      {"hour": "15", "minute": "35"},
      {"hour": "16", "minute": "05"},
      {"hour": "16", "minute": "35"},
      {"hour": "17", "minute": "05"},
      {"hour": "17", "minute": "35"},
      {"hour": "18", "minute": "05"},
      {"hour": "18", "minute": "35"},
      {"hour": "19", "minute": "05"},
      {"hour": "19", "minute": "35"},
      {"hour": "20", "minute": "05"},
      {"hour": "20", "minute": "50"},
      {"hour": "21", "minute": "50"}
    ],
    "holiday": [
      {"hour": "6", "minute": "25"},
      {"hour": "7", "minute": "05"},
      {"hour": "7", "minute": "35"},
      {"hour": "8", "minute": "05"},
      {"hour": "8", "minute": "35"},
      {"hour": "9", "minute": "05"},
      {"hour": "9", "minute": "35"},
      {"hour": "10", "minute": "05"},
      {"hour": "10", "minute": "35"},
      {"hour": "11", "minute": "05"},
      {"hour": "11", "minute": "35"},
      {"hour": "12", "minute": "05"},
      {"hour": "12", "minute": "35"},
      {"hour": "13", "minute": "05"},
      {"hour": "13", "minute": "35"},
      {"hour": "14", "minute": "05"},
      {"hour": "14", "minute": "35"},
      {"hour": "15", "minute": "05"},
      {"hour": "15", "minute": "35"},
      {"hour": "16", "minute": "05"},
      {"hour": "16", "minute": "35"},
      {"hour": "17", "minute": "05"},
      {"hour": "17", "minute": "35"},
      {"hour": "18", "minute": "05"},
      {"hour": "18", "minute": "35"},
      {"hour": "19", "minute": "05"},
      {"hour": "19", "minute": "35"},
      {"hour": "20", "minute": "05"},
      {"hour": "20", "minute": "50"},
      {"hour": "21", "minute": "50"}
    ]
  }
};

// インライン祝日データ
const INLINE_HOLIDAY_DATA = {
  "2025-04-29": "昭和の日",
  "2025-05-03": "憲法記念日",
  "2025-05-04": "みどりの日",
  "2025-05-05": "こどもの日",
  "2025-05-06": "振替休日",
  "2025-07-21": "海の日",
  "2025-08-11": "山の日",
  "2025-09-15": "敬老の日",
  "2025-09-23": "秋分の日",
  "2025-10-13": "スポーツの日"
};

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
        if (USE_INLINE_DATA) {
            // インラインデータを使用
            console.log('インラインバスデータを使用します');
            busData = INLINE_BUS_DATA;
            
            // 最終更新時間の表示
            document.getElementById('last-updated').textContent = new Date().toLocaleString('ja-JP');
            
            // バス時刻の表示更新
            updateBusTimes();
            return;
        }
        
        // 開発時はサンプルデータを使用
        const dataUrl = USE_SAMPLE_DATA ? 'data/sample_bus_timetable.json' : 'data/bus_timetable.json';
        console.log(`ファイルからデータを読み込みます: ${dataUrl}`);
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
        
        if (USE_INLINE_DATA) {
            // エラー時にインラインデータを使用
            console.log('ファイル読み込みエラーのためインラインデータを使用します');
            busData = INLINE_BUS_DATA;
            document.getElementById('last-updated').textContent = new Date().toLocaleString('ja-JP') + ' (内蔵データ)';
            updateBusTimes();
            return;
        }
        
        document.querySelector('#chigasaki .next-time').textContent = '--:--';
        document.querySelector('#chigasaki .remaining').textContent = 'データ取得エラー';
        document.querySelector('#tsujido .next-time').textContent = '--:--';
        document.querySelector('#tsujido .remaining').textContent = 'データ取得エラー';
    }
}

// 祝日データの取得
async function fetchHolidayData() {
    try {
        if (USE_INLINE_DATA) {
            // インラインデータを使用
            console.log('インライン祝日データを使用します');
            holidayData = INLINE_HOLIDAY_DATA;
            return;
        }
        
        // 開発時はサンプルデータを使用
        const dataUrl = USE_SAMPLE_DATA ? 'data/sample_holidays.json' : 'data/holidays.json';
        console.log(`ファイルからデータを読み込みます: ${dataUrl}`);
        const response = await fetch(dataUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        holidayData = await response.json();
    } catch (error) {
        console.error('祝日データの取得に失敗しました:', error);
        
        if (USE_INLINE_DATA) {
            // エラー時にインラインデータを使用
            console.log('ファイル読み込みエラーのためインライン祝日データを使用します');
            holidayData = INLINE_HOLIDAY_DATA;
            return;
        }
        
        holidayData = {};
    }
}

// 現在時刻の更新
function updateClock() {
    const now = new Date();
    
    // 日付表示
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    const dateString = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 (${days[now.getDay()]})`;
    const dateElement = document.getElementById('current-date');
    dateElement.textContent = dateString;
    
    // 曜日による日付表示の色分け
    const day = now.getDay();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD形式
    
    // 日付の色分け用のクラスをリセット
    dateElement.classList.remove('holiday', 'saturday', 'sunday');
    
    // 祝日、日曜、土曜の色分け
    if (holidayData && holidayData[dateStr]) {
        dateElement.classList.add('holiday');
    } else if (day === 0) {
        dateElement.classList.add('sunday');
    } else if (day === 6) {
        dateElement.classList.add('saturday');
    }
    
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
