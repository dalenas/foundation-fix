# 1: Color Bias Adjustment and Sampling
```python
def IMAGE_PROCESSING(SAMPLE_PICTURE) :
    #INPUT: SAMPLE_PICTURE - image captured by camera
    #OUTPUT: LAB_values - color values compatible with paint mixing

    ### Get/Validate image containing skin region 
    ### & reference colors/control sheet

    if SAMPLE_PICTURE is EMPTY/NOT_DETECTED :
        RAISE_ERROR "Image captured failed or canceled"
        return NULL

    # initial samples contain gamma-corrected RGB values
    # use OpenCV region of interest rectangle

    SKIN_SAMPLE = list of pixel RGB values that constitute a skin region from SAMPLE_PICTURE
    CONTROL_SAMPLE = list of pixel RGB values that encompass the reference color sheet SAMPLE_PICTURE

    # check whether the reference sheet is present or the image is too dark/light

    if CONTROL_SAMPLE is EMPTY/NOT_DETECTED :
        RAISE_ERROR "Contol sheet not detected. Take picture with color reference sheet in a well-lit room."
        return NULL

    # get average gamma-corrected RGB codes for the skin region and control

    SKIN_RGB_AVG = calculate average of SKIN_SAMPLE
    CONTROL_MEASURED_VALUES = list of averages of CONTROL_SAMPLE
    
    # get linear RGB codes from gamma-corrected RGB codes
    # allows linear operations to be performed on the codes

    SKIN_LINEAR_RGB = apply reverse gamma-correction to SKIN_RGB_AVG
    CONTROL_LINEAR_RGB = list of linearized RGB codes from CONTROL_MEASURED_VALUES

    # find difference in the control input RGB codes and stored RGB codes

    CONTROL_KNOWN_VALUES = load("CONTROL_DATABASE.csv") and linearize the codes
    CONTROL_TRANSFORM = find transformation matrix that makes CONTROL_LINEAR_RGB = CONTROL_KNOWN_VALUES * CONTROL_TRANSFORM

    # apply difference to the values found in the skin region for lighting correction

    XYZ = apply CONTROL_TRANFORM to SKIN_LINEAR_RGB

    # convert rgb value to lab for later processing

    LAB_VALUES = convert XYZ color space to LAB(XYZ)

    for element in LAB_VALUES :
        if element is OUT_OF_RANGE :
            RAISE_ERROR "color conversion error. take a new picture." 
            return NULL

    return LAB_VALUES


def DETECT_SKIN_REGION(sample_picture) -> np.ndarray 
    


def DETECT_REFERENCE_PATCHES(sample_picture) -> np.ndarray
    # OUTPUT: control mask that highlights the printout that has reference colorsx
    
def AVG_RGB(sample_picture, region) -> list
    # OUTPUT: rgb_list #[r, g, b]
    # computes average RGB of the defined skin regions

def CALCULATE_DIFFERENCE(rgb_control_known, rgb_control_reading) -> list
    # OUTPUT: delta_E #[r, g, b] of the offset

def GENERATE_CCM(delta_E) -> list[list]
    # OUTPUT: ccm_matrix #2d list -> 3x3 matrix correcting the offset
    # uses the offset between expected rgb of control set and measured value (delta_E)
    # to construct matrix that can be applied to rgb of skin sample

def APPLY_CCM(ccm_matrix, rgb_skin_raw) -> list
    # OUTPUT: rgb_skin_corrected
    #runs skin sample through generated color corrector

def CONVERT_RGB_LAB(rgb_skin_corrected) -> list
    # OUTPUT: LAB_values
    # Utilizes a linear transformation that converts rgb to LAB
    # openCV has a function that does this


```