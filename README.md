Counter POS — How to Run

This app has two parts that must run at the same time:


Frontend (this repo) — Next.js
Backend (pos-ai-backend) — Python/FastAPI


Prerequisites


Git — git-scm.com
Node.js (LTS) — nodejs.org
Python 3.11 or 3.12 — python.org/downloads
(avoid Python 3.14, it's too new for some of our packages)


1. Clone the repo

bashgit clone https://github.com/Ivy3001/pos-ai-demo.git
cd pos-ai-demo

2. Run the backend

bashcd pos-ai-backend
python -m venv venv

Activate it:


Windows (PowerShell): venv\Scripts\activate
Mac/Linux: source venv/bin/activate


Then:

bashpip install -r requirements.txt

Copy the env file:


Windows: copy .env.example .env
Mac/Linux: cp .env.example .env


Start it:

bashuvicorn main:app --reload --port 8000

Leave this terminal running.

3. Run the frontend

Open a second terminal, in the pos-ai-demo root folder:

bashcopy .env.local.example .env.local   # Windows
cp .env.local.example .env.local     # Mac/Linux

npm install
npm run dev

Leave this terminal running too.

4. Open the app

Go to http://localhost:3000.

Demo login accounts:

User ID: 1042   Password: 1234
User ID: 2091   Password: 5678
