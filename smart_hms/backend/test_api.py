#!/usr/bin/env python3
"""
Simple API test script to verify endpoints are working
"""
import requests
import json

BASE_URL = 'http://localhost:8000/api'

def test_endpoint(method, endpoint, data=None, headers=None):
    """Test a single API endpoint"""
    url = f"{BASE_URL}{endpoint}"
    try:
        if method.upper() == 'GET':
            response = requests.get(url, headers=headers)
        elif method.upper() == 'POST':
            response = requests.post(url, json=data, headers=headers)
        else:
            print(f"Unsupported method: {method}")
            return False
        
        print(f"{method.upper()} {endpoint} - Status: {response.status_code}")
        if response.status_code < 400:
            try:
                data = response.json()
                print(f"Response: {json.dumps(data, indent=2)[:200]}...")
            except:
                print(f"Response: {response.text[:200]}...")
        else:
            print(f"Error: {response.text}")
        print("-" * 50)
        return response.status_code < 400
    except requests.exceptions.ConnectionError:
        print(f"Connection error for {endpoint} - Is the server running?")
        return False
    except Exception as e:
        print(f"Error testing {endpoint}: {e}")
        return False

def main():
    print("Testing Smart Hospital Management System API")
    print("=" * 50)
    
    # Test public endpoints
    print("Testing public endpoints...")
    test_endpoint('GET', '/auth/token/')
    
    # Test registration
    print("Testing user registration...")
    register_data = {
        'username': 'test_user',
        'email': 'test@example.com',
        'password': 'testpass123',
        'password_confirm': 'testpass123',
        'first_name': 'Test',
        'last_name': 'User',
        'role': 'patient'
    }
    test_endpoint('POST', '/auth/register/', register_data)
    
    # Test login
    print("Testing user login...")
    login_data = {
        'username': 'admin',
        'password': 'admin123'
    }
    login_response = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
    
    if login_response.status_code == 200:
        token = login_response.json()['tokens']['access']
        headers = {'Authorization': f'Bearer {token}'}
        
        print("Testing authenticated endpoints...")
        test_endpoint('GET', '/dashboard/', headers=headers)
        test_endpoint('GET', '/users/', headers=headers)
        test_endpoint('GET', '/patients/', headers=headers)
        test_endpoint('GET', '/doctors/', headers=headers)
        test_endpoint('GET', '/appointments/', headers=headers)
        
        # Test AI symptom checker
        print("Testing AI symptom checker...")
        ai_data = {'symptoms': 'fever headache fatigue'}
        test_endpoint('POST', '/ai/symptom-checker/', ai_data, headers)
    
    print("API testing completed!")

if __name__ == '__main__':
    main()
