import cv2
import numpy
import os
import matplotlib.pyplot as plt

def image_capture():

    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Error: Could not open camera.")
    else:
        ret, frame = cap.read()

    if ret:
        cv2.imshow("Captured Image", frame)
        cv2.waitKey(0) # Wait indefinitely until a key is pressed
        cv2.destroyAllWindows()
    else:
        print("Error: Could not read frame.")

    cap.release()

    return ret, frame

def define_skin(img):
    face_cascade = cv2.CascadeClassifier('../data/haarcascade_frontalface_default.xml')
    if face_cascade.empty():
        print("Error: Could not load Haar cascade XML file.")
    else:
        print("Cascade loaded successfully!")
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    plt.imshow(gray, cmap = 'gray')
    faces = face_cascade.detectMultiScale(gray)
    print(faces)

def main() :
    ret, img = image_capture()
    define_skin(img)

if __name__ == '__main__' :
    main()