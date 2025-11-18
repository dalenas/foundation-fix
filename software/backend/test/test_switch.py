import lgpio
import time

CHIP = 0
SWITCH_PIN = 2

h = lgpio.gpiochip_open(CHIP)

lgpio.gpio_claim_input(h, SWITCH_PIN, lgpio.SET_PULL_UP)

print("Listening for switch clicks... Press CTRL+C to exit.")

try:
    while True:
        value = lgpio.gpio_read(h, SWITCH_PIN)

        if value == 0:
            print("Switch CLICKED!")
            while lgpio.gpio_read(h, SWITCH_PIN) == 0:
                time.sleep(0.01)

        time.sleep(0.01)

except KeyboardInterrupt:
    pass

finally:
    lgpio.gpiochip_close(h)