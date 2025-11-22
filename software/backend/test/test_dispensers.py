import sys
import os

module_directory = os.path.abspath("../src/")
sys.path.insert(0, module_directory)

import numpy as np
import lgpio
import dispenser as disp
import time

DELAY = 5
#disp.extract_foundation(disp.WHITE_MOTOR_PINS, 4096)
#disp.dispense_foundation(disp.WHITE_MOTOR_PINS, disp.WHITE_SWITCH_PIN, STEPS_PROP[disp.WHITE_IND])
#time.sleep(DELAY)
#disp.extract_foundation(disp.BLACK_MOTOR_PINS, 4096)
#disp.dispense_foundation(disp.BLACK_MOTOR_PINS, disp.BLACK_SWITCH_PIN, STEPS_PROP[disp.BLACK_IND])
#time.sleep(DELAY)
#disp.extract_foundation(disp.RED_MOTOR_PINS, 4096)
#disp.dispense_foundation(disp.RED_MOTOR_PINS, disp.RED_SWITCH_PIN, STEPS_PROP[disp.RED_IND])
#time.sleep(DELAY)
#disp.extract_foundation(disp.BLUE_MOTOR_PINS, 4096)
#disp.dispense_foundation(disp.BLUE_MOTOR_PINS, disp.BLUE_SWITCH_PIN, STEPS_PROP[disp.BLUE_IND])
#time.sleep(DELAY)
disp.extract_foundation(disp.YELLOW_MOTOR_PINS, 4096)
#disp.dispense_foundation(disp.YELLOW_MOTOR_PINS, disp.YELLOW_SWITCH_PIN, STEPS_PROP[disp.YELLOW_IND])
#lgpio.gpiochip_close(disp.CHIP)


#disp.extract_foundation(disp.WHITE_MOTOR_PINS, 4096)
#disp.dispense_foundation(disp.WHITE_MOTOR_PINS, disp.WHITE_SWITCH_PIN, 4096)
#disp.extract_foundation(disp.BLACK_MOTOR_PINS, 4096)
#disp.dispense_foundation(disp.BLACK_MOTOR_PINS, disp.BLACK_SWITCH_PIN, 4096)
#disp.extract_foundation(disp.RED_MOTOR_PINS, 4096)
#disp.dispense_foundation(disp.RED_MOTOR_PINS, disp.RED_SWITCH_PIN, 4096)
#disp.extract_foundation(disp.BLUE_MOTOR_PINS, 4096)
#disp.dispense_foundation(disp.BLUE_MOTOR_PINS, disp.BLUE_SWITCH_PIN, 4096)
#disp.extract_foundation(disp.YELLOW_MOTOR_PINS, 4096)
#disp.dispense_foundation(disp.YELLOW_MOTOR_PINS, disp.YELLOW_SWITCH_PIN, 4096)
lgpio.gpiochip_close(disp.CHIP)