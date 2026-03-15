import requests
import cv2
import numpy as np

# Test the detection API
def test_detection():
    # Load a sample image (assuming you have one)
    # For now, create a dummy image
    img = np.zeros((480, 640, 3), dtype=np.uint8)
    cv2.imwrite('test_image.jpg', img)
    
    with open('test_image.jpg', 'rb') as f:
        files = {'image': f}
        response = requests.post('http://localhost:5000/detect', files=files)
        print(response.json())

if __name__ == '__main__':
    test_detection()