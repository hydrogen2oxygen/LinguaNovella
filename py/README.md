# Lingua Novella Technical Documentation for Developers
## Start in development environment
First build the Angular UI with
````shell
ui> npm install
````
Then you can start the server and the angular ui separately (use two different shell instances)
````shell
py> python main.py
ui> ng serve
````

## Tests
Call [test_main.py](py/tests/test_main.py) for the entire test breakthrough.

## Database
### translations.db
**translations.db** contains just the translations and it is better to not delete it in order to save performance.
#### TRANSLATIONS

### training.db
Instead **training.db** contains all the training data.
#### PHRASE
A phrase makes sense, it contains multiple words in a correct order and context.
#### VOCABULARY
Every word in the vocabulary is also related to a phrase, in order to understand the context and grammar.
