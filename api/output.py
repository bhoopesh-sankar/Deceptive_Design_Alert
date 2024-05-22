import requests

url = "http://127.0.0.1:5000/"
data = {"tokens": ["in demand", "two only", "left"]}

response = requests.post(url, json=data)
print(response.text)
