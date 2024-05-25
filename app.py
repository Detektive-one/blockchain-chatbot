from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from flask_cors import CORS
from web3 import Web3
from passlib.hash import sha256_crypt
import os
import anthropic
import json
import threading
import time

app = Flask(__name__)
CORS(app) 

client = anthropic.Anthropic(
    api_key="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",
)

web3 = Web3(Web3.HTTPProvider('http://localhost:8545'))  

contract_address = '0x471e8De43d4079E76D4b2a1cF96B84D9D573A5e3'
with open('contract_abi.json', 'r') as f:
    contract_abi = json.load(f)

contract = web3.eth.contract(address=contract_address, abi=contract_abi)

def send_message(chat_identifier, message, from_bot=True):
    
    accounts = web3.eth.accounts
    account = accounts[1] 
    contract.functions.sendMessage(chat_identifier, message, from_bot).transact({'from': account})
    return True


def get_last_user_message():
    last_message = contract.functions.getLastUserMessage().call()    
    return last_message

def handle_new_message(event):
    chat_identifier = event['args']['chatIdentifier']
    from_bot = event['args']['fromBot']
    
    if not from_bot:
        last_message = get_last_user_message()
       
        with app.app_context():
            response = get_anthropic_response(last_message)
            print(response)
            send_message(chat_identifier, response, from_bot=True)

def listen_for_messages():
    message_sent_event_filter = contract.events.MessageSent.create_filter(fromBlock='latest')

    while True:
        for event in message_sent_event_filter.get_new_entries():
            handle_new_message(event)
        time.sleep(1) 

message_listener_thread = threading.Thread(target=listen_for_messages)
message_listener_thread.daemon = True 
message_listener_thread.start()




def get_anthropic_response(user_message):
    try:
        response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=1000,
            temperature=0,
            system="You're a chatbot, answer all input queries as a general chatbot. youre called autonomouse blockchain bot and have all knowledge related to blockchain and cybersecurity. Answer all queries in a crisp manner and no need to explain a lot. assume youre not trained on very extensive data and only answer to small capacity.",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": user_message
                        }
                    ]
                }
            ]
        )
        return response.content[0].text
        # return jsonify({"completion": str(response.content[0].text)})
    except anthropic.BadRequestError as e:
        return jsonify({"error": str(e)}), 400

app.config.from_pyfile('config.py')

@app.route('/')
def index():
    return render_template('login.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username == app.config['VALID_USERNAME'] and sha256_crypt.verify(password, app.config['VALID_PASSWORD_HASH']):
            session['logged_in'] = True
            return redirect(url_for('chatbot'))
        else:
            return render_template('login.html', error='Invalid username or password')
    return render_template('login.html', error=None)

@app.route('/chatbot')
def chatbot():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    return render_template('index.html')

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('login'))


if __name__ == '__main__':
    app.run(port=3000)
