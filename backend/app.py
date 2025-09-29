import os
from flask import Flask, request, jsonify
from flask_cors import CORS

from utils.code_parser import parse_code
from utils.llm_client import generate_documentation
from utils.doc_formatter import format_documentation

app = Flask(__name__)

# This is the final, correct CORS setup that fixes the connection issues.
CORS(app, resources={r"/generate-docs-from-text": {"origins": "*"}})

@app.route('/generate-docs-from-text', methods=['POST'])
def handle_doc_generation_from_text():
    try:
        data = request.get_json()
        code_content = data['code']
        language = data['language']
        style = data.get('style', 'simple')
    except Exception:
        return jsonify({'error': 'Invalid JSON payload.'}), 400

    if not code_content or not language:
        return jsonify({'error': 'Missing "code" or "language" in request.'}), 400

    dummy_filename = f"pasted_code.{language}"

    try:
        parsed_elements = parse_code(code_content, dummy_filename)
        if not parsed_elements:
            return jsonify({'error': 'Could not parse any code from the provided text.'}), 400

        generated_docs = generate_documentation(parsed_elements, style)
        final_documentation = format_documentation(generated_docs)
        
        return jsonify({'documentation': final_documentation})

    except EnvironmentError as e:
        # This will catch the API key error and report it clearly.
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({'error': f"An error occurred during generation: {str(e)}"}), 500

if __name__ == '__main__':
    print("Starting Flask server on http://127.0.0.1:5000")
    app.run(debug=True)