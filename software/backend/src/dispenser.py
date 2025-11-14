import lgpio
import time

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

DELAY = 0.001
CHIP = lgpio.gpiochip_open(0)

def initialize_motor(motor_pins):
    for mp in motor_pins:
        lgpio.gpio_claim_output(CHIP, mp, 0)

def initialize_switch(switch_pin):
    lgpio.gpio_claim_input(CHIP, switch_pin, lgpio.SET_PULL_UP)

def calculate_steps(lab_code):
    return

def disable_motors(motor_pins):
    for mp in motor_pins:
        lgpio.gpio_write(CHIP, mp, 0)

def dispense_foundation(motor_pins, switch_pin, steps):
    initialize_pins(motor_pins, switch_pin)
    for step in range(steps):
        for halfstep in DISPENSE_SEQUENCE:
            if lgpio.gpio_read(CHIP, switch_pin) == 0:
                return
            for pin in range(4):
                lgpio.gpio_write(CHIP, motor_pins[pin], halfstep[pin])
            time.sleep(DELAY)
    disable_motors(motor_pins)

def extract_foundation(motor_pins, steps):
    initialize_pins(motor_pins, None)
    for step in range(steps):
        for halfstep in EXTRACT_SEQUENCE:
            for pin in range(4):
                lgpio.gpio_write(CHIP, motor_pins[pin], halfstep[pin])
            time.sleep(DELAY)
    disable_motors(motor_pins)