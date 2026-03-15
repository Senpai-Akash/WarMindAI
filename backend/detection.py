import cv2
import numpy as np
import face_recognition

def detect_persons(frame):
    # Load Haar cascade for full body detection
    body_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_fullbody.xml')
    
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    bodies = body_cascade.detectMultiScale(gray, 1.1, 3)
    
    persons = []
    for (x, y, w, h) in bodies:
        persons.append({'x': int(x), 'y': int(y), 'w': int(w), 'h': int(h)})
    
    return persons

def analyze_expression(frame, person):
    # Extract face from person bounding box
    x, y, w, h = person['x'], person['y'], person['w'], person['h']
    face_img = frame[y:y+h, x:x+w]
    
    # Find face encodings
    face_locations = face_recognition.face_locations(face_img)
    if not face_locations:
        return 'neutral'  # No face detected
    
    # For simplicity, assume first face
    face_encoding = face_recognition.face_encodings(face_img, face_locations)[0]
    
    # Placeholder: classify based on some heuristic
    # In real, would need a trained model for emotions
    # For now, random emotion
    emotions = ['happy', 'sad', 'angry', 'neutral', 'surprised']
    emotion = np.random.choice(emotions)
    return emotion

def assess_danger(persons, frame):
    dangers = []
    for person in persons:
        expression = analyze_expression(frame, person)
        # Simple rule: if angry, higher danger
        if expression == 'angry':
            danger_level = 'high'
        elif expression in ['sad', 'surprised']:
            danger_level = 'medium'
        else:
            danger_level = 'low'
        dangers.append({'person': person, 'danger': danger_level, 'expression': expression})
    return dangers