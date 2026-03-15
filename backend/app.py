from flask import Flask, request, jsonify
import cv2
import numpy as np
from detection import detect_persons, assess_danger

app = Flask(__name__)

@app.route('/detect', methods=['POST'])
def detect():
    try:
        file = request.files['image']
        img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
        
        if img is None:
            return jsonify({'error': 'Invalid image'}), 400
        
        persons = detect_persons(img)
        dangers = assess_danger(persons, img)
        
        return jsonify({'persons': persons, 'dangers': dangers})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)