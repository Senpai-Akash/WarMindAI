import cv2
import numpy as np

def detect_persons(frame):
    # Load Haar cascade for full body detection
    body_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_fullbody.xml')
    
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    bodies = body_cascade.detectMultiScale(gray, 1.1, 3)
    
    persons = []
    for (x, y, w, h) in bodies:
        persons.append({'x': int(x), 'y': int(y), 'w': int(w), 'h': int(h)})
    
    return persons

def assess_danger(persons, frame):
    # Placeholder: simple heuristic
    # TODO: Implement based on items, expressions, behavior
    dangers = []
    for person in persons:
        # For now, random danger level
        danger_level = np.random.choice(['low', 'medium', 'high'])
        dangers.append({'person': person, 'danger': danger_level})
    return dangers