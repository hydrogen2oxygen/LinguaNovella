import os
import sqlite3

class TrainVocabularyService:

    def __init__(self, db_path, from_lang, to_lang, user_name, phrase):
        self.db_path = db_path
        self.from_lang = from_lang
        self.to_lang = to_lang
        self.user_name = user_name
        self.phrase = phrase

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
                    wrong INTEGER DEFAULT 0,
                    correct INTEGER DEFAULT 0,
                    last_update DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS phrase (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    phrase TEXT NOT NULL,
                    language TEXT NOT NULL,
                    translation TEXT NOT NULL,
                    from_lang TEXT NOT NULL,
                    to_lang TEXT NOT NULL
                )
            ''')
            conn.commit()

    def get_vocabulary_from_db(self, phrase_id):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT phrase_id, word, wrong, correct, last_update FROM vocabulary WHERE phrase_id = ?', (phrase_id,))
            result = cursor.fetchone()
            if result:
                return result[0]
            return None

    def save_vocabulary_session(self, data):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            vocabulary = data.get('vocabulary')
            for voc in vocabulary:
                word = voc.get('word')
                correct = voc.get('correct')
                wrong = voc.get('wrong')
                phrase_id = voc.get('phrase_id')
                cursor.execute('UPDATE translations SET wrong = ?, correct = ?, last_update = CURRENT_TIMESTAMP WHERE word = ? and phrase_id = ?', (wrong, correct, word, phrase_id))
            conn.commit()