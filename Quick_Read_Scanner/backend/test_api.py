import requests

if __name__ == "__main__":
    url = "http://127.0.0.1:8000/api/v1/scan"
    try:
        files = {'file': open(r"d:\OCR system\backend\venv\Lib\site-packages\sklearn\datasets\images\flower.jpg", 'rb')}
        response = requests.post(url, files=files)
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")