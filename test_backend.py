import requests
import json

print("Testing connection to Django backend...")

try:
    # Try to get token (will fail with 405 but that's OK - means server is running)
    response = requests.post(
        "http://localhost:8000/api/token/",
        json={"username": "test", "password": "test"},
        timeout=5
    )
    print("✅ Backend is running and accessible!")
    print(f"Status code: {response.status_code}")
except requests.exceptions.ConnectionError:
    print("❌ Cannot connect to backend. Make sure it's running on port 8000")
except Exception as e:
    print(f"Error: {e}")
