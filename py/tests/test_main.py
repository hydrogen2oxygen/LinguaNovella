import sys
import os
sys.path.append('../')
from tools.WordTranslator import WordTranslator
from services.TrainVocabularyService import TrainVocabularyService

print("# define the test databases")
translation_db_location = '../../database/test_translations.db'
vocabulary_db_location = '../../database/test_vocabulary.db'

# delete previous ones
if os.path.exists(translation_db_location):
    os.remove(translation_db_location)
if os.path.exists(vocabulary_db_location):
    os.remove(vocabulary_db_location)

print("# set some testdata")
text = 'Это о том, как быстро выучить новые слова'
from_lang = 'ru'
to_lang = 'en'

print("# translate")
translator = WordTranslator(translation_db_location, from_lang, to_lang)
translated_phrase = translator.translate_entire_phrase(text)
translated_words = translator.translate_word_by_word(text)
print(translated_words)

print("# data object holds all relevant data (obviously)")
data = {}
data.update([('from_lang', from_lang)])
data.update([('to_lang', to_lang)])
data.update([('text', text)])
data.update([('translation', translated_phrase)])
data.update([('translations', translated_words)])

print("# create a set of vocabulary training data")
vocabulary = TrainVocabularyService(vocabulary_db_location)
vocabulary.save_phrase_to_db(data)
vocabulary.save_vocabulary_set(data)
print("# vocabulary: ")
print(data)

print("# retrieve vocabulary with the phrase id")
data = vocabulary.get_vocabulary_from_db(data.get('phrase_id'))
print(data)

print("# after a training session, the data is updated in the database")
vocabulary.save_vocabulary_session(data)