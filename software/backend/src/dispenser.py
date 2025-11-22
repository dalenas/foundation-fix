import lgpio
import numpy as np
import time

from src import lab_to_mix as ltm
from .lib import constants as const

WHITE_MOTOR_PINS = [24, 25, 8, 7]
BLACK_MOTOR_PINS = [10, 9, 11, 5]
RED_MOTOR_PINS = [6, 13, 19, 26]
BLUE_MOTOR_PINS = [14, 15, 18, 23]
YELLOW_MOTOR_PINS = [12, 16, 20, 21]

WHITE_SWITCH_PIN = 2
BLACK_SWITCH_PIN = 27
RED_SWITCH_PIN = 17
BLUE_SWITCH_PIN = 3
YELLOW_SWITCH_PIN = 4

WHITE_IND = 0
BLACK_IND = 1
RED_IND = 2
BLUE_IND = 3
YELLOW_IND = 4

DISPENSE_SEQUENCE = [
    [1, 0, 0, 1],
    [0, 0, 0, 1],
    [0, 0, 1, 1],
    [0, 0, 1, 0],
    [0, 1, 1, 0],
    [0, 1, 0, 0],
    [1, 1, 0, 0],
    [1, 0, 0, 0],
]
EXTRACT_SEQUENCE = [
    [1, 0, 0, 0],
    [1, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 1],
    [0, 0, 0, 1],
    [1, 0, 0, 1],   
]

STEPS_5ML = 825
DELAY = 0.001

def initialize_motor(motor_pins, chip):
    for mp in motor_pins:
        lgpio.gpio_claim_output(chip, mp, 0)

def initialize_switch(switch_pin, chip):
    lgpio.gpio_claim_input(chip, switch_pin, lgpio.SET_PULL_UP)

def calculate_steps(lab_code):
    prop = ltm.proportion_calculation(lab_code)
    return np.round(STEPS_5ML * prop).astype(int)

def disable_motors(motor_pins, chip):
    for mp in motor_pins:
        lgpio.gpio_write(chip, mp, 0)

def disable_pin(switch_pin, chip):
    lgpio.gpio_write(chip, swtich_pin, 0)

def dispense_foundation(motor_pins, switch_pin, steps, chip):
    initialize_motor(motor_pins, chip)
    initialize_switch(switch_pin, chip)
    for step in range(steps):
        for halfstep in DISPENSE_SEQUENCE:
            if lgpio.gpio_read(chip, switch_pin) == 0:
                return
            for pin in range(4):
                lgpio.gpio_write(chip, motor_pins[pin], halfstep[pin])
            time.sleep(DELAY)
    disable_motors(motor_pins, chip)
    disable_pin(switch_pin, chip)

def extract_foundation(motor_pins, steps, chip):
    initialize_motor(motor_pins, chip)
    for step in range(steps):
        for halfstep in EXTRACT_SEQUENCE:
            for pin in range(4):
                lgpio.gpio_write(chip, motor_pins[pin], halfstep[pin])
            time.sleep(DELAY)
    disable_motors(motor_pins, chip)