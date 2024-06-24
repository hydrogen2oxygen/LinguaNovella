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

vocabulary = TrainVocabularyService(vocabulary_db_location)
translator = WordTranslator(translation_db_location, from_lang, to_lang)

print("# data object holds all relevant data (obviously)")
data = {}
data.update([('from_lang', from_lang)])
data.update([('to_lang', to_lang)])
data.update([('text', text)])

print("# we assume we have no phrase_id at this time (empty database)")
data = vocabulary.get_phrase(data)
print("# translate ")
translated_phrase = translator.translate_entire_phrase(text)
translated_words = translator.translate_word_by_word(text)
data.update([('translation', translated_phrase)])
data.update([('translations', translated_words)])
print(data)

print("# create a set of vocabulary training data")
vocabulary.save_phrase_to_db(data)
vocabulary.save_vocabulary_set(data)
print("# vocabulary: ")
print(data)

print("# retrieve vocabulary with the phrase id")
data = vocabulary.get_vocabulary_from_db(data.get('phrase_id'))
print(data)

print("# the use was able to learn a word successfully")
for wordObject in data.get('vocabulary'):
    if wordObject.get('word') == 'это':
        correct = wordObject.get('correct')
        wordObject.update([('correct', correct + 1)])
        break

print("# after a training session, the data is updated in the database")
print(data)
vocabulary.save_vocabulary_session(data)

print("# now we should have a phrase_id")
data = vocabulary.get_phrase(data)
if data.get('phrase_id') is None:
    print("FAIL!")
else:
    print(data.get('phrase_id'))