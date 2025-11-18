import lgpio
import time

IN1 = 24
IN2 = 25
IN3 = 8
IN4 = 7

pins = [IN1, IN2, IN3, IN4] 

STEPS_NEEDED = 1000
DELAY = 0.001

halfstep_seq = [
    [1, 0, 0, 0],
    [1, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 1],
    [0, 0, 0, 1],
    [1, 0, 0, 1],   
]

chip = lgpio.gpiochip_open(0)
for p in pins:
    lgpio.gpio_claim_output(chip, p, 0)

try:
    for step in range(STEPS_NEEDED):
        for halfstep in halfstep_seq:
            for pin in range(4):
                lgpio.gpio_write(chip, pins[pin], halfstep[pin])
            time.sleep(DELAY)
finally:
    for p in pins:
        lgpio.gpio_write(chip, p, 0)
    lgpio.gpiochip_close(chip)