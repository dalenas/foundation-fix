import lgpio
import time

# ----- MOTOR SETUP -----
IN1 = 24
IN2 = 25
IN3 = 8
IN4 = 7

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

# ----- SWITCH SETUP -----
SWITCH_PIN = 2  # NO switch wired to GPIO2

chip = lgpio.gpiochip_open(0)

# motor pins
for p in pins:
    lgpio.gpio_claim_output(chip, p, 0)

# switch pin with pull-up
lgpio.gpio_claim_input(chip, SWITCH_PIN, lgpio.SET_PULL_UP)

print("Running motor. Will stop when switch is clicked.")

try:
    for step in range(STEPS_NEEDED):

        # Check limit switch BEFORE each step
        if lgpio.gpio_read(chip, SWITCH_PIN) == 0:  # 0 = switch clicked
            print("LIMIT SWITCH ACTIVATED — Motor Stopped!")
            break

        for halfstep in halfstep_seq:

            # Check switch during stepping also (extra safety)
            if lgpio.gpio_read(chip, SWITCH_PIN) == 0:
                print("LIMIT SWITCH ACTIVATED (during step) — Motor Stopped!")
                raise StopIteration

            # move motor
            for pin in range(4):
                lgpio.gpio_write(chip, pins[pin], halfstep[pin])
            time.sleep(DELAY)

except StopIteration:
    pass

finally:
    # turn off all motor coils
    for p in pins:
        lgpio.gpio_write(chip, p, 0)
    lgpio.gpiochip_close(chip)

print("Program finished.")
