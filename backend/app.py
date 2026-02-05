from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

users = {}


@app.route("/chat", methods=["POST"])
def chat():

    data = request.json
    msg = data.get("message", "").lower().strip()
    user_id = data.get("userId", "guest")

    if user_id not in users:
        users[user_id] = {
            "step": 0,
            "name": "",
            "email": ""
        }

    step = users[user_id]["step"]

    reply = ""


    # Step 0
    if step == 0:

        users[user_id]["step"] = 1
        reply = "Hi 👋 Welcome to AmplifyEase. What's your name?"


    # Step 1
    elif step == 1:

        users[user_id]["name"] = msg.title()
        users[user_id]["step"] = 2

        reply = f"Nice to meet you, {msg.title()} 😊 Please share your email."


    # Step 2
    elif step == 2:

        users[user_id]["email"] = msg
        users[user_id]["step"] = 3

        reply = "Thanks! How can I help you today?"


    # Step 3
    else:

        if "intern" in msg:
            reply = "We offer 2-month paid internships with extension options."

        elif "contact" in msg:
            reply = "You can reach us at support@amplifyease.com"

        elif "company" in msg:
            reply = "AmplifyEase builds scalable digital products."

        else:
            reply = "You can ask about Internship, Contact, or Company."


    return jsonify({
        "reply": reply
    })


if __name__ == "__main__":
    app.run(debug=True)
