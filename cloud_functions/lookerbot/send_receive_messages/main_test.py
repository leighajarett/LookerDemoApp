
"""For running local unit tests"""

from unittest.mock import Mock
import os 

# local path to dialogflow SA
os.environ['GOOGLE_APPLICATION_CREDENTIALS']='/Users/leighaj/Service Accounts/demo_app.json'

import main

demo_intent = {"text": 'I am looking for a demo that uses healthcare data'}
hi_intent = {"text": 'I am looking for a demo that uses healthcare data'}
thanks_intent = {"text": 'Great, thanks!'}
unknown_intent = {"text": 'Plants are fun'}

for data, name in zip([demo_intent,hi_intent,thanks_intent,unknown_intent],['Demo ', 'Greeting ','Thank You ','Unknown']):
    req = Mock(get_json=Mock(return_value=data), args=data)
    print(name,main.handle_request(req))
