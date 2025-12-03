import csv
import requests

# Path to the CSV file
CSV_FILE = 'mobiles_clean.csv'
# API endpoint for creating mobiles
API_URL = 'http://localhost:8000/api/'

def parse_int(value):
    """Parse integer from string, removing commas and handling errors."""
    try:
        return int(str(value).replace(',', '').strip())
    except Exception:
        return 0

def main():
    with open(CSV_FILE, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        # Clean up fieldnames to remove any leading/trailing whitespace and BOM
        def strip_bom(s):
            return s.replace('\ufeff', '').strip() if s else s
        reader.fieldnames = [strip_bom(fn) for fn in reader.fieldnames]
        for row in reader:
            # Also clean up keys in each row
            row = {strip_bom(k): v for k, v in row.items()}
            try:
                data = {
                    'brand': row['Brand'],
                    'model': row['Model'],
                    'main_camera': row['Back Camera'],
                    'sim_card': 'Dual',  # Default value, adjust if needed
                    'screen_size': str(row['Screen Size']),
                    'battery': parse_int(row['Battery Capacity']),
                    'storage': parse_int(row.get('Storage', 128)),  # Default 128 if missing
                    'ram': parse_int(row['RAM']),
                    'self_cam': parse_int(row['Front Camera'].replace('MP', '').strip()),
                    'price': parse_int(row['Price']),
                    'display': 'Amoled',  # Default value, adjust if needed
                }
            except KeyError as e:
                print(f"KeyError: {e}. Row keys: {list(row.keys())}")
                continue
            response = requests.post(API_URL, json=data)
            if response.status_code == 201:
                print(f"Created: {data['brand']} {data['model']}")
            else:
                print(f"Failed to create: {data['brand']} {data['model']} | Status: {response.status_code} | Response: {response.text}")

if __name__ == '__main__':
    main()
