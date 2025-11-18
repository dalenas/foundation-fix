import sys
import os

module_directory = os.path.abspath("../src/")
sys.path.insert(0, module_directory)

import lgpio
import dispenser as disp

disp.disable_motors(disp.WHITE_MOTOR_PINS)
disp.disable_motors(disp.BLACK_MOTOR_PINS)
disp.disable_motors(disp.RED_MOTOR_PINS)
disp.disable_motors(disp.BLUE_MOTOR_PINS)
disp.disable_motors(disp.YELLOW_MOTOR_PINS)
lgpio.gpiochip_close(disp.CHIP)