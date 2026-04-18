from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')

def load_model():
    if not os.path.exists(MODEL_PATH):
        return None
    return joblib.load(MODEL_PATH)

artifacts = load_model()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model_loaded': artifacts is not None})

@app.route('/predict', methods=['POST'])
def predict():
    global artifacts
    if artifacts is None:
        artifacts = load_model()
        if artifacts is None:
            return jsonify({'error': 'Model not trained yet. Run train.py first.'}), 503

    data = request.json
    model = artifacts['model']
    le_eth = artifacts['le_eth']
    le_rel = artifacts['le_rel']
    le_ctr = artifacts['le_ctr']

    # Safe encode with fallback to index 0 for unseen labels
    def safe_encode(le, val):
        val = str(val)
        if val in le.classes_:
            return le.transform([val])[0]
        return 0

    try:
        features = [
            int(data.get('A1_Score', 0)),
            int(data.get('A2_Score', 0)),
            int(data.get('A3_Score', 0)),
            int(data.get('A4_Score', 0)),
            int(data.get('A5_Score', 0)),
            int(data.get('A6_Score', 0)),
            int(data.get('A7_Score', 0)),
            int(data.get('A8_Score', 0)),
            int(data.get('A9_Score', 0)),
            int(data.get('A10_Score', 0)),
            min(float(data.get('age', 25)), 100),
            1 if str(data.get('gender', 'm')).lower() == 'f' else 0,
            1 if str(data.get('jundice', 'no')).lower() == 'yes' else 0,
            1 if str(data.get('austim', 'no')).lower() == 'yes' else 0,
            1 if str(data.get('used_app_before', 'no')).lower() == 'yes' else 0,
            safe_encode(le_eth, data.get('ethnicity', 'Others')),
            safe_encode(le_rel, data.get('relation', 'Self')),
            safe_encode(le_ctr, data.get('contry_of_res', 'United States')),
        ]

        X = np.array(features).reshape(1, -1)
        prediction = model.predict(X)[0]
        probability = model.predict_proba(X)[0]

        score = sum([
            int(data.get('A1_Score', 0)), int(data.get('A2_Score', 0)),
            int(data.get('A3_Score', 0)), int(data.get('A4_Score', 0)),
            int(data.get('A5_Score', 0)), int(data.get('A6_Score', 0)),
            int(data.get('A7_Score', 0)), int(data.get('A8_Score', 0)),
            int(data.get('A9_Score', 0)), int(data.get('A10_Score', 0)),
        ])

        return jsonify({
            'prediction': 'YES' if prediction == 1 else 'NO',
            'probability': round(float(probability[1]), 4),
            'probability_no': round(float(probability[0]), 4),
            'score': score,
            'model_accuracy': round(float(artifacts.get('accuracy', 0.95)), 4)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    print("SpectrumSense ML Service starting on http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=False)
