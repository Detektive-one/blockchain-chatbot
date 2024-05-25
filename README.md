# Autonomous chat-bot using smart contract and blockchain
# Description

Welcome to the Autonomous chat-bot based upon smart contract and blockchain! This chatbot leverages the power of the Ethereum blockchain to provide a decentralized, secure, and transparent communication platform. Primarily trained on data related to cybersecurity and blockchain technology, it offers robust and reliable interactions while ensuring data integrity and privacy. Each conversation is immutably stored on the blockchain, offering unparalleled trust and verifiability. Explore the future of decentralized chat services with our innovative solution.

DRY RUN IMAGES:
![login](https://github.com/Detektive-one/blockchain-chatbot/assets/86166599/148b8675-ebd6-424b-9ed0-3aab9a803b6a)

![Dashboard](https://github.com/Detektive-one/blockchain-chatbot/assets/86166599/26a341ce-22bd-47ef-b9fc-473f6a0f08e2)

![chat](https://github.com/Detektive-one/blockchain-chatbot/assets/86166599/850409d9-dd78-4266-a6c1-4c388dcc8c4a)

# Table of Contents

    Installation
    Usage
    License
    Acknowledgments

# Installation

Detailed steps to install and set up the project. Be sure to include all dependencies and any system requirements.

    1. Clone the repository:
       bash
       
       git clonehttps://github.com/Detektive-one/blockchain-chatbot

    2. Navigate into the project directory:
       bash

       cd blockchain-chatbot
       
    3. Install the necessary dependencies:
    
       pip install -r requirements.txt [ web3, ganache, flask, flask_login, anthropic , CORS]

# Usage
Run the project:
    
    - run ganache cli [ this will start a new blockchain ]
    
    - open remix IDE, connect to ganache provider, deploy the contract
    
    - add the contract address and ABI to the app.py file and contract.js file
    
    - run the python server 
      (python app.py)

Access the application:

    Open a web browser and go to "http://localhost:3000"
    
- voila we are done. enjoy the chatbot. for any issues with responses, hard refresh the interface.

# Additional Notes

    Ensure you have Python installed on your machine. You can download it from the official Python website.

# Resources

![Python Virtual Environments]- (https://docs.python.org/3/tutorial/venv.html)

pip User Guide- https://pip.pypa.io/en/stable/user_guide/

Web3.py Documentation- https://web3py.readthedocs.io/en/stable/

Ganache Documentation- https://docs.nethereum.com/en/latest/ethereum-and-clients/ganache-cli/

Flask Documentation- https://flask.palletsprojects.com/en/3.0.x/

Flask-Login Documentation- https://flask-login.readthedocs.io/en/latest/

Anthropic API Documentation- https://docs.anthropic.com/en/api/getting-started

Flask-CORS Documentation- https://flask-cors.readthedocs.io/en/latest/

# License
This project is licensed under the MIT License - see the LICENSE file for details.
  
