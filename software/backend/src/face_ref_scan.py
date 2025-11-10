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

    cap.release()

    return ret, frame

def define_skin(img):
    cv2.imshow("Frame", img)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    plt.imshow(gray, cmap = 'gray')
    face_cascade = cv2.CascadeClassifier('software/backend/data/haarcascade_frontalface_default.xml')
    if face_cascade.empty():
        print("Error: Could not load Haar cascade XML file.")
        return 
    else:
        print("Cascade loaded successfully!")

    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(80, 80)  # ignore tiny detections
    )
    if len(faces) == 0:
        print("No faces detected.")
        return
    print(faces)
    for (x, y, w, h) in faces:
        cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
    cv2.imshow("Detected Face(s)", img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    
    (x, y, w, h) = faces[0]

    # Crop the face region
    face = img[y:y+h, x:x+w]
    face_h, face_w, _ = face.shape
    cv2.imshow("Detected Face(s)", face)
    

    # --- Define regions using percentages of the face box ---

    # Forehead: upper middle
    fh_y1 = int(0.05 * face_h)
    fh_y2 = int(0.25 * face_h)
    fh_x1 = int(0.25 * face_w)
    fh_x2 = int(0.75 * face_w)
    forehead = face[fh_y1:fh_y2, fh_x1:fh_x2]
    cv2.imshow("forehead", forehead)
    

    # Nose: central vertical strip
    ns_y1 = int(0.35 * face_h)
    ns_y2 = int(0.65 * face_h)
    ns_x1 = int(0.40 * face_w)
    ns_x2 = int(0.60 * face_w)
    nose = face[ns_y1:ns_y2, ns_x1:ns_x2]
    cv2.imshow("nose", nose)
    

    # Left cheek: lower left
    lc_y1 = int(0.45 * face_h)
    lc_y2 = int(0.75 * face_h)
    lc_x1 = int(0.10 * face_w)
    lc_x2 = int(0.35 * face_w)
    left_cheek = face[lc_y1:lc_y2, lc_x1:lc_x2]
    cv2.imshow("left cheek", left_cheek)
    


    # Right cheek: lower right
    rc_y1 = int(0.45 * face_h)
    rc_y2 = int(0.75 * face_h)
    rc_x1 = int(0.65 * face_w)
    rc_x2 = int(0.90 * face_w)
    right_cheek = face[rc_y1:rc_y2, rc_x1:rc_x2]
    cv2.imshow("right cheek", right_cheek)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    

def main() :
    ret, img = image_capture()
    define_skin(img)

if __name__ == '__main__' :
    main()