from flask import Flask, request, jsonify
from flask_cors import CORS
from app.new import get_openai_response

app = Flask(__name__)

# Allow CORS for the specific URL
CORS(app, resources={r"/ask": {"origins": "http://localhost:8080"}})

@app.route('/ask', methods=['POST'])
def ask_question():
    # Get the input question from the POST request
    data = request.get_json()
    question = data.get("question")

    if not question:
        return jsonify({"error": "No question provided"}), 400

    try:
        # Call your chatbot function to get the response
        response = get_openai_response(question)
        return jsonify({"response": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
