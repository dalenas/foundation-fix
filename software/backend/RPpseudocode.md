# 2: Raspberry Pi Code

```python
def EVENT_HANDLER():
    #extract lab values
    SAMPLE_PICTURE = CAMERA_CAPUTRE initiated by BUTTON_PRESS
    LAB_VALUES = IMAGE_PROCESSING(SAMPLE_PICTURE)
    
    #calculate servo turns for desired recipe
    PAINT_QUANTITIES =  assign paint quantities indicating how many 
                        times the servo should turn with TARGET_SHADE
    
    DEPLOY_TO_RASPBERRY_PI(PAINT_QUANTITIES)
    #servo motors move syringes
```