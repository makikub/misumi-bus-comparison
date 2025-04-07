#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import json
import datetime
import time
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

def fetch_all_day_types(url):
    """平日・土曜・休日の全ての時刻表データを取得"""
    all_days_data = {}
    
    # まず基本のHTMLを取得
    base_html = fetch_timetable(url)
    if not base_html:
        return None
    
    # 平日データを解析 (最初のページ表示時)
    soup = BeautifulSoup(base_html, 'lxml')
    weekday_data = parse_timetable_from_table(soup.select('table')[2])  # 時刻表は通常3番目のテーブル
    all_days_data['weekday'] = weekday_data
    
    # 土曜・休日データを取得するには通常はJavaScriptでタブを切り替える必要があるが、
    # 実際のサイトでは別のリクエストを送るか別のDOMノードが読み込まれる可能性がある
    # ここでは簡易的にセレクタを使って取得を試みる
    
    # 土曜日データを取得
    # 神奈中サイトではタブクリック後に時間を置かないとデータが反映されないことがあるため、
    # 実際の実装では複数回リクエストを送る可能性がある
    saturday_html = fetch_timetable(url + "&day=1")  # パラメータを追加してリクエスト
    if saturday_html:
        soup = BeautifulSoup(saturday_html, 'lxml')
        saturday_data = parse_timetable_from_table(soup.select('table')[2])
        all_days_data['saturday'] = saturday_data
    else:
        all_days_data['saturday'] = []
    
    # 休日データを取得
    holiday_html = fetch_timetable(url + "&day=2")  # パラメータを追加してリクエスト
    if holiday_html:
        soup = BeautifulSoup(holiday_html, 'lxml')
        holiday_data = parse_timetable_from_table(soup.select('table')[2])
        all_days_data['holiday'] = holiday_data
    else:
        all_days_data['holiday'] = []
    
    return all_days_data

def parse_timetable_from_table(table):
    """テーブルから時刻表データを解析"""
    timetable_data = []
    
    # テーブルが見つからない場合
    if not table:
        print("Table not found")
        return []
    
    # 行を順に解析
    rows = table.select('tr')
    for row in rows:
        cells = row.select('td')
        if len(cells) < 2:
            continue
        
        # 時間を取得 (最初のセルに含まれる)
        hour_text = cells[0].text.strip()
        if not hour_text or '時' not in hour_text:
            continue
        
        hour = hour_text.replace('時', '')
        
        # 分を取得 (2番目のセルに含まれる)
        minute_cell = cells[1]
        minute_items = minute_cell.select('li')
        
        # リストアイテムがない場合は直接テキストをチェック
        if not minute_items:
            minute_text = minute_cell.text.strip()
            if minute_text:
                minutes = minute_text.split()
                for minute in minutes:
                    if minute.isdigit():
                        timetable_data.append({
                            'hour': hour,
                            'minute': minute
                        })
        else:
            # リストアイテムから分を取得
            for minute_item in minute_items:
                minute = minute_item.text.strip()
                
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
    
    return timetable_data

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
        print(f"Processing {direction} direction...")
        all_days_data = fetch_all_day_types(url)
        if all_days_data:
            result[direction] = all_days_data
    
    # 結果をJSONとして保存
    save_timetable(result)
    
    # 現在の祝日情報も生成・保存
    generate_holiday_data()
    
    print("Scraping completed successfully!")

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
