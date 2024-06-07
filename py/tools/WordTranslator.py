import os
import sqlite3
from translate import Translator

class WordTranslator:
    def __init__(self, db_path, from_lang, to_lang):
        self.db_path = db_path
        self.from_lang = from_lang
        self.to_lang = to_lang
        self.translator = Translator(from_lang=self.from_lang, to_lang=self.to_lang)

        # Ensure the directory exists
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)

        self._create_table()

    def _create_table(self):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS translations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    word TEXT NOT NULL,
                    translation TEXT NOT NULL
                )
            ''')
            conn.commit()

    def get_translation_from_db(self, word):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT translation FROM translations WHERE word = ?', (word,))
            result = cursor.fetchone()
            if result:
                return result[0]
            return None

    def save_translation_to_db(self, word, translation):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('INSERT INTO translations (word, translation) VALUES (?, ?)', (word, translation))
            conn.commit()

    def translate_and_store(self, text):
        words = text.split()
        translations = []
        for word in words:
            translation = self.get_translation_from_db(word)
            if not translation:
                translation = self.translator.translate(word)
                self.save_translation_to_db(word, translation)
            translations.append({"word": word, "translation": translation})
        return translations

    def fetch_all_translations(self):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT word, translation FROM translations')
            return cursor.fetchall()
