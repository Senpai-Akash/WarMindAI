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
    # Ensure within bounds
    x = max(0, x)
    y = max(0, y)
    w = min(w, frame.shape[1] - x)
    h = min(h, frame.shape[0] - y)
    face_img = frame[y:y+h, x:x+w]
    
    if face_img.size == 0:
        return 'neutral'
    
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

def detect_objects(frame, person):
    # Simple object detection: look for knives or weapons
    # Using Haar cascade for knives (assuming we have one, but OpenCV doesn't have built-in for knives)
    # Placeholder: random detection
    objects = []
    if np.random.rand() > 0.7:  # 30% chance
        objects.append('knife')
    if np.random.rand() > 0.8:
        objects.append('gun')
    return objects

def analyze_behavior(person):
    # Placeholder for behavior: based on position or movement
    # Since single frame, assume static
    behaviors = ['standing', 'walking', 'running', 'aggressive']
    behavior = np.random.choice(behaviors)
    return behavior

def assess_danger(persons, frame):
    dangers = []
    for person in persons:
        expression = analyze_expression(frame, person)
        objects = detect_objects(frame, person)
        behavior = analyze_behavior(person)
        
        # Danger assessment logic
        danger_score = 0
        if expression == 'angry':
            danger_score += 3
        if 'knife' in objects or 'gun' in objects:
            danger_score += 5
        if behavior == 'aggressive':
            danger_score += 2
        
        if danger_score >= 5:
            danger_level = 'high'
        elif danger_score >= 2:
            danger_level = 'medium'
        else:
            danger_level = 'low'
        
        dangers.append({
            'person': person, 
            'danger': danger_level, 
            'expression': expression,
            'objects': objects,
            'behavior': behavior
        })
    return dangers