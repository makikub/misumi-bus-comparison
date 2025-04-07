#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import json
import datetime
import requests
from bs4 import BeautifulSoup
import jpholiday

# スクレイピング対象URL
URLs = {
    'chigasaki': 'https://www.kanachu.co.jp/sp/diagram/timetable01?cs=0000802161-6&nid=00127236',
    'tsujido': 'https://www.kanachu.co.jp/sp/diagram/timetable01?cs=0000801834-12&nid=00127236'
}

# 曜日タイプ
DAY_TYPES = ['weekday', 'saturday', 'holiday']

# 出力ディレクトリ
OUTPUT_DIR = '../frontend/data'

def ensure_output_dir():
    """出力ディレクトリの存在確認と作成"""
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

def fetch_timetable(url):
    """指定URLから時刻表データを取得"""
    print(f"Fetching: {url}")
    headers = {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
    }
    
    response = requests.get(url, headers=headers)
    response.encoding = 'utf-8'
    
    if response.status_code != 200:
        print(f"Failed to fetch data: {response.status_code}")
        return None
    
    return response.text

def parse_timetable(html_content):
    """HTMLから時刻表データを解析"""
    soup = BeautifulSoup(html_content, 'lxml')
    result = {}
    
    # 曜日タブごとにデータを抽出
    for i, day_type in enumerate(DAY_TYPES):
        timetable_section = soup.select(f'#time_table_tab_{i+1}')
        if not timetable_section:
            print(f"No timetable found for {day_type}")
            result[day_type] = []
            continue
        
        time_table = timetable_section[0]
        
        # 時間ごとの時刻リスト
        timetable_data = []
        
        # 時間行を取得
        hour_rows = time_table.select('dl.sp_tblTime')
        
        for hour_row in hour_rows:
            # 時を取得
            hour = hour_row.select('dt')[0].text.strip()
            
            # 分リストを取得
            minute_elements = hour_row.select('dd span')
            
            for minute_el in minute_elements:
                minute = minute_el.text.strip()
                
                # 特殊記号の処理（例: 停留所通過など）
                note = ''
                if not minute.isdigit():
                    # 数字以外の文字が含まれる場合、注釈として扱う
                    if any(c.isdigit() for c in minute):
                        # 数字を抽出
                        digit_part = ''.join(c for c in minute if c.isdigit())
                        note = ''.join(c for c in minute if not c.isdigit())
                        minute = digit_part
                    else:
                        # 完全に数字以外の場合はスキップ
                        continue
                
                bus_time = {
                    'hour': hour,
                    'minute': minute,
                }
                
                if note:
                    bus_time['note'] = note
                    
                timetable_data.append(bus_time)
        
        result[day_type] = timetable_data
    
    return result

def save_timetable(data, filename='bus_timetable.json'):
    """時刻表データをJSONとして保存"""
    # 出力パスの作成
    output_path = os.path.join(OUTPUT_DIR, filename)
    
    # JSONとして保存
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Saved timetable to {output_path}")

def main():
    """メイン処理"""
    ensure_output_dir()
    
    # 各方面の時刻表を取得・解析
    result = {}
    
    for direction, url in URLs.items():
        html_content = fetch_timetable(url)
        if html_content:
            result[direction] = parse_timetable(html_content)
    
    # 結果をJSONとして保存
    save_timetable(result)
    
    # 現在の祝日情報も生成・保存
    generate_holiday_data()

def generate_holiday_data(months_ahead=6):
    """祝日データを生成して保存"""
    today = datetime.date.today()
    end_date = today + datetime.timedelta(days=30*months_ahead)
    
    # 期間内の祝日を取得
    holidays = {}
    current_date = today
    
    while current_date <= end_date:
        if jpholiday.is_holiday(current_date):
            holiday_name = jpholiday.holiday_name(current_date)
            holidays[current_date.isoformat()] = holiday_name
        current_date += datetime.timedelta(days=1)
    
    # 祝日データを保存
    holiday_path = os.path.join(OUTPUT_DIR, 'holidays.json')
    with open(holiday_path, 'w', encoding='utf-8') as f:
        json.dump(holidays, f, ensure_ascii=False, indent=2)
    
    print(f"Saved holiday data to {holiday_path}")

if __name__ == "__main__":
    main()
