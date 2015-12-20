#!/usr/bin/python

from Adafruit_PWM_Servo_Driver import PWM
import time

# ===========================================================================
# Example Code
# ===========================================================================

# Initialise the PWM device using the default address
pwm = PWM(0x40)
# Note if you'd like more debug output you can instead run:
# pwm = PWM(0x40, debug=True)

servoMin = 150  # Min pulse length out of 4096
servoMax = 300  # Max pulse length out of 4096

PAN_SERVO = 0
TILT_SERVO = 1


def setServoPulse(channel, pulse):
    pulseLength = 1000000  # 1,000,000 us per second
    pulseLength /= 60  # 60 Hz
    print "%d us per period" % pulseLength
    pulseLength /= 4096  # 12 bits of resolution
    print "%d us per bit" % pulseLength
    pulse *= 1000
    pulse /= pulseLength
    pwm.setPWM(channel, 0, pulse)


pwm.setPWMFreq(60)  # Set frequency to 60 Hz


def pan(percent):
    pwm.setPWM(PAN_SERVO, 0, int((servoMax - servoMin) * (percent / 100.0)))


pwm.setPWM(0, 0, servoMin);
pwm.setPWM(1, 0, servoMax);
