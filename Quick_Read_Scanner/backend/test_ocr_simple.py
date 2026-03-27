import httpx
import json

def test_health():
    url = "http://127.0.0.1:8000/api/v1/health"
    try:
        response = httpx.get(url)
        print(f"Health Check: {response.status_code}")
        print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"Health Check failed: {e}")

if __name__ == "__main__":
    test_health()
