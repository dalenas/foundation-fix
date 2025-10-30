import cv2

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