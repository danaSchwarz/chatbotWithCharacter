from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
from personalities_system_prompts import fetch_system_prompt_personality

app = Flask(__name__)
CORS(app)


@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    history = data.get('history', [])
    personality = data.get('personality')
    if not personality:
        return jsonify({'error': 'Missing personality data'}), 400

    system_prompt = (
        f"Your name is {personality.get('name')}. "
        f"Your are {personality.get('title')}. "
        f"{personality.get('description')}"
    )

    if not history:
        # No chat history, ask LLM to greet user
        full_prompt = (
            f"System: {system_prompt}\n"
            "Assistant: Please greet the user warmly and briefly. "
            "IMPORTANT: Always respond in 10 words or less, no exceptions."
        )
    else:
        # Build prompt from system prompt + conversation history
        line_instructions = "IMPORTANT: Always respond in 30 words or less, no exceptions. End your response with a question."
        prompt_lines = [f"System: {system_prompt} {line_instructions}"]
        for message in history:
            role = message.get('role', '').capitalize()
            content = message.get('content', '')
            prompt_lines.append(f"{role}: {content}")
        prompt_lines.append("Assistant:")
        full_prompt = "\n".join(prompt_lines)

    try:
        process = subprocess.Popen(
            ['ollama', 'run', 'llama3'],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        stdout, stderr = process.communicate(input=full_prompt, timeout=30)

        if stderr and not stdout:
            return jsonify({'error': stderr.strip()}), 500

        return jsonify({'response': stdout.strip()})

    except subprocess.TimeoutExpired:
        return jsonify({'error': 'LLM process timed out.'}), 504
    except Exception as e:
        return jsonify({'error': str(e)}), 500


"""
@app.route('/story', methods=['POST'])
def story():  # ✅ Function renamed to avoid conflict
    data = request.get_json()
    world = data.get("world")
    characters = data.get("characters", [])

    if not world or not characters:
        return jsonify({'error': 'Missing world or characters input'}), 400

    # Build story prompt
    character_descriptions = "; ".join(
        f"{char} - {fetch_system_prompt_personality(char)}"
        for char in characters
    )
    story_prompt = (
        f"Write a story approximately 100 words. "
        f"It takes place in {world}. "
        f"The characters of the story are: {character_descriptions}."
    )

    try:
        process = subprocess.Popen(
            ['ollama', 'run', 'llama3'],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        stdout, stderr = process.communicate(input=story_prompt, timeout=30)

        if stderr and not stdout:
            return jsonify({'error': stderr.strip()}), 500

        return jsonify({'response': stdout.strip()})

    except subprocess.TimeoutExpired:
        return jsonify({'error': 'LLM process timed out.'}), 504
    except Exception as e:
        return jsonify({'error': str(e)}), 500
"""

if __name__ == "__main__":
    app.run(debug=True)
