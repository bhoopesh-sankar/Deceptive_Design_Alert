from flask import Flask, jsonify, request
from flask_cors import CORS
from transformers import BertForSequenceClassification, BertTokenizerFast, pipeline

model_path = "add your model path here"
model = BertForSequenceClassification.from_pretrained(model_path)
tokenizer = BertTokenizerFast.from_pretrained(model_path)
nlp = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)

app = Flask(__name__)
CORS(app)


@app.route('/', methods=['POST'])
def main():
    if(request.method == 'POST'):
        print('Request Get')
    output = []
    tkn = []
    scr = []
    dict1 = {}
    if request.method == 'POST':
        data = request.get_json().get('tokens')
        for token in data:
            result = nlp(token)
            sentiment = result[0]['label']
            score = result[0]['score']
            if(sentiment != 'Not Dark Pattern'):    
                if(score >= 0.80):
                    output.append(sentiment)
                    scr.append(score)
                    tkn.append(token)
                    dict1[token] = sentiment
    response_data = '{ \'result\': ' +  str(output) + ' }'
    response_tkn = '{ \'token\': ' +  str(tkn) + ' }'
    print(response_data)
    print("\n")
    print(response_tkn)
    print("\n")
    print("Score :",scr)
    print("\n")
    print(len(output))
    print("\n")
    print("dictionary : ",dict1)
    return jsonify(dict1)
   

@app.route("/process", methods=["POST"])
def process_input():
    user_input = request.form["search"]
    result = nlp(user_input)
    print(result)
    return jsonify(result[0]['label'])

if __name__ == '__main__':
    app.run(threaded=True, debug=True)

