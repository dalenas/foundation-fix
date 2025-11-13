import time
import lgpio

IN1 = 6
IN2 = 13
IN3 = 19
IN4 = 26

pins = [IN1, IN2, IN3, IN4]

STEPS_NEEDED = 2000
DELAY = 0.001

# reverse order of halfstep sequence
halfstep_seq = [
    [1, 0, 0, 1],
    [0, 0, 0, 1],
    [0, 0, 1, 1],
    [0, 0, 1, 0],
    [0, 1, 1, 0],
    [0, 1, 0, 0],
    [1, 1, 0, 0],
    [1, 0, 0, 0],
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
