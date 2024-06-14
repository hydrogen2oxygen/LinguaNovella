import os
import re
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
                    translation TEXT NOT NULL,
                    from_lang TEXT NOT NULL,
                    to_lang TEXT NOT NULL
                )
            ''')
            conn.commit()

    def get_translation_from_db(self, word):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT translation FROM translations WHERE word = ? AND from_lang = ? AND to_lang = ?', (word, self.from_lang, self.to_lang))
            result = cursor.fetchone()
            if result:
                return result[0]
            return None

    def save_translation_to_db(self, word, translation):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('INSERT INTO translations (word, translation, from_lang, to_lang) VALUES (?, ?, ?, ?)', (word, translation, self.from_lang, self.to_lang))
            conn.commit()

    def translate_entire_phrase(self, text):
        return self.translator.translate(text)

    def translate_word_by_word(self, text):
        words = text.split()
        translations = []
        for word in words:
            word = re.sub(r'[^\w\s]', '', word, flags=re.UNICODE).lower()
            translation = self.get_translation_from_db(word)
            if not translation:
                translation = self.translator.translate(word)
                translation = re.sub(r'[^\w\s]', '', translation, flags=re.UNICODE).lower()
                self.save_translation_to_db(word, translation)
            translations.append({"word": word, "translation": translation})
        return translations

    def fetch_all_translations(self):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT word, translation FROM translations WHERE from_lang = ? AND to_lang = ?', (self.from_lang, self.to_lang))
            return cursor.fetchall()
