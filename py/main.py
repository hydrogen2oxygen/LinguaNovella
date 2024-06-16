# Lingua Novella Main Application
# Copyright Pietro Lusso 2024
import webbrowser
import time
import requests
import multiprocessing
import argparse
from tools.WordTranslator import WordTranslator
from services.TrainVocabularyService import TrainVocabularyService

from waitress import serve
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
translation_db_location = '../database/translations.db'
vocabulary_db_location = '../database/vocabulary.db'

# Serving static files
# --------------------------------
@app.route('/')
def index():
    return send_from_directory('../ui/dist/ui/', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('../ui/dist/ui/', path)
# --------------------------------

# API
# HEALTH CHECKs
@app.route('/ping', methods=['GET'])
def ping():
    return "pong"

@app.route('/trainReading', methods=['POST'])
def translate_word_by_word():
    data = request.json
    text = data.get('text')
    from_lang = data.get('from_lang')
    to_lang = data.get('to_lang')
    if not text:
        return jsonify({'error': 'No text provided'}), 400

    translator = WordTranslator(translation_db_location, from_lang, to_lang)
    vocabulary = TrainVocabularyService(vocabulary_db_location)

    translated_phrase = translator.translate_entire_phrase(text)
    data.update([('translation', translated_phrase)])
    translations = translator.translate_word_by_word(text)
    data.update([('translations', translations)])

    vocabulary.save_phrase_to_db(data)
    vocabulary.save_vocabulary_set(data)

    return jsonify(data)

def start_server(port):
    serve(app, host='0.0.0.0', port=port)

# ----------------------------------------
# Main Start
def wait_for_server_and_open(port):
    url = f"http://localhost:{port}"
    while True:
        try:
            response = requests.get(url)
            if response.status_code == 200:
                print(f"If your browser does not open automatically, click here http://localhost:{port}")
                webbrowser.open(f"http://localhost:{port}")
                break
        except requests.ConnectionError:
            pass
        time.sleep(1)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        prog='Lingua Novella',
        description='Language Learning Software',
        epilog='')
    parser.add_argument('-p', '--port', default='80')
    parser.print_help()
    args = vars(parser.parse_args())
    port = args['port']
    print("Starting server ...")
    server_process = multiprocessing.Process(target=start_server, args=(port,))
    server_process.start()
    wait_for_server_and_open(port)
    server_process.join() #keep it alive