"""Returns the result of detect intent with texts as inputs.

    Using the same `session_id` between requests allows continuation
    of the conversation."""

# gcloud functions deploy lookerdemo_chat --entry-point handle_request --runtime python37  --trigger-http
import dialogflow_v2 as dialogflow
import os
import requests
import uuid

# this function handles the request body and checks input fields
def handle_request(request):

    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    # Parse the JSON - assume all requests are made with JSON content type
    request_json = request.get_json()
    if request_json:
        if 'session_id' in request_json:
            session_id = request_json['session_id'] 
            if not isinstance(session_id, str):
                return ('Session ID must be a string', 422, headers)
        else:
            # if session id is missing then create one
            session_id = uuid.uuid4()
        
        if 'text' in request_json:
            text = request_json['text'] 
            if not isinstance(text , str):
                return ('Text must be a string', 422, headers)
        else:
            # no text input
            return ('Missing text input', 422, headers)
        
        # get intents
        response = detect_intent_texts(session_id, text)
        return ({'message': response,'session_id': session_id}, 200, headers)

    else:
        # request cant be parsed
        return ('Request cannot be processed', 422, headers)

    

def detect_intent_texts(session_id, text):
    project_id='intricate-reef-291721'
    language_code='EN'
    session_client = dialogflow.SessionsClient()

    session = session_client.session_path(project_id, session_id)
    print('Session path: {}\n'.format(session))

    text_input = dialogflow.types.TextInput(
        text=text, language_code=language_code)

    query_input = dialogflow.types.QueryInput(text=text_input)

    response = session_client.detect_intent(
        session=session, query_input=query_input)

    print('Query text: {}'.format(response.query_result.query_text))
    print('Detected intent: {} (confidence: {})\n'.format(
        response.query_result.intent.display_name,
        response.query_result.intent_detection_confidence))
    print('Fulfillment text: {}\n'.format(
        response.query_result.fulfillment_text))
    
    return response.query_result.fulfillment_text