import sys
sys.path.append('../')
from tools.WordTranslator import WordTranslator
from services.TrainVocabularyService import TrainVocabularyService

translation_db_location = '../../database/test_translations.db'
vocabulary_db_location = '../../database/test_vocabulary.db'

translator = WordTranslator(translation_db_location, 'RU', 'EN')
translated_phrase = translator.translate_entire_phrase('Это о том, как быстро выучить новые слова')
data = {}
data.update([('translation', translated_phrase)])
vocabulary = TrainVocabularyService(vocabulary_db_location)
phrase_id = vocabulary.save_phrase_to_db(data)
vocabulary.save_phrase_to_db()