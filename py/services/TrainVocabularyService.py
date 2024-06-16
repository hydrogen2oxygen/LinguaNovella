import os
import sqlite3

class TrainVocabularyService:

    def __init__(self, db_path):
        self.db_path = db_path

        # Ensure the directory exists
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)

        self._create_table()

    def _create_table(self):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS vocabulary (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    phrase_id INTEGER NOT NULL,
                    word TEXT NOT NULL,
                    translation TEXT NOT NULL,
                    wrong INTEGER DEFAULT 0,
                    correct INTEGER DEFAULT 0,
                    written INTEGER DEFAULT 0,
                    last_update DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS phrase (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    phrase TEXT NOT NULL,
                    translation TEXT NOT NULL,
                    from_lang TEXT NOT NULL,
                    to_lang TEXT NOT NULL
                )
            ''')
            conn.commit()

    # FIRST save the phrase and store its ID into the data json
    def save_phrase_to_db(self, data):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            phrase = data.get('text')
            translation = data.get('translation')
            from_lang = data.get('from_lang')
            to_lang = data.get('to_lang')
            cursor.execute('INSERT INTO phrase (phrase, translation, from_lang, to_lang) VALUES (?, ?, ?, ?)', (phrase, translation, from_lang, to_lang))
            conn.commit()
            data.update([('phrase_id',cursor.lastrowid)])

    # SECOND save the vocabulary set
    def save_vocabulary_set(self, data):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            translations = data.get('translations')
            phrase_id = data.get('phrase_id')
            for voc in translations:
                word = voc.get('word')
                translation = voc.get('translation')
                cursor.execute('INSERT INTO vocabulary (phrase_id, word, translation, last_update) VALUES (?,?,?,CURRENT_TIMESTAMP)', (phrase_id, word, translation))
            conn.commit()

    def get_vocabulary_from_db(self, phrase_id):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT phrase_id, word, wrong, correct, last_update, written FROM vocabulary WHERE phrase_id = ?', (phrase_id,))
            result = cursor.fetchall()
            if result:
                return result
            return None

    def save_vocabulary_session(self, data):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            vocabulary = data.get('vocabulary')
            for voc in vocabulary:
                word = voc.get('word')
                correct = voc.get('correct')
                wrong = voc.get('wrong')
                written = voc.get('written')
                phrase_id = voc.get('phrase_id')
                cursor.execute('UPDATE vocabulary SET wrong = ?, correct = ?, written = ?, last_update = CURRENT_TIMESTAMP WHERE word = ? AND phrase_id = ?', (wrong, correct, written, word, phrase_id))
            conn.commit()

