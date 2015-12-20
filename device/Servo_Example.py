#!/usr/bin/python

import random
import threading
import time
import socket

from Adafruit_PWM_Servo_Driver import PWM


class Servo:
    """A class for controlling a Servo"""

    def distanceToMove(self):
        return abs(self.targetPos - self.currentPos)

    def directionToMove(self):
        if self.targetPos > self.currentPos:
            return 1
        else:
            return -1

    def _updateServo(self):
        while True:
            if self.distanceToMove() > 0:

                # When should deceleration begin?
                # a = (v2-v1)/2s
                # a = (-v1)/2d
                if self.currentSpeed > self.maxRecordedSpeed:
                    self.maxRecordedSpeed = self.currentSpeed
                    print "%s: speed = %s" % (self.name, self.currentSpeed)

                if self.currentSpeed/(2 * self.distanceToMove()) >= self.acceleration:
                    self.currentSpeed -= self.acceleration
                else:
                    self.currentSpeed += (self.acceleration * 0.75)

                if self.currentSpeed > self.maxSpeed:
                    self.currentSpeed = self.maxSpeed

                if self.currentSpeed < 0:
                    self.currentSpeed = 0

                if self.distanceToMove() > self.currentSpeed:
                    self.setServoPosition(self.currentPos + self.currentSpeed * self.directionToMove())
                else:
                    self.setServoPosition(self.targetPos)
            else:
                self.currentSpeed = 0

            time.sleep(0.001)

    def __init__(self, name, pwm, channel, minPulseLength, maxPulseLength, maxRate, acceleration):
        self.name = name
        self.pwm = pwm
        self.channel = channel
        self.minPulseLength = minPulseLength
        self.maxPulseLength = maxPulseLength
        self.targetPos = 50
        self.currentPos = 50
        self.currentSpeed = 0
        self.maxRecordedSpeed = 0
        self.acceleration = acceleration
        self.maxSpeed = maxRate
        t = threading.Thread(target=self._updateServo)
        t.daemon = True
        t.start()

    def setServoPosition(self, pos):
        self.currentPos = pos
        pulseWidth = int((self.maxPulseLength - self.minPulseLength) * (pos / 100.0)) + self.minPulseLength
        self.pwm.setPWM(self.channel, 0, pulseWidth)

    def setTargetPosition(self, pos):
        self.targetPos = pos


class PanTiltDevice:
    """A class for controlling the PanTilt Device"""
    pwm = PWM(0x40)
    PAN_SERVO_CHANNEL = 0
    TILT_SERVO_CHANNEL = 1

    def __init__(self):
        self.pwm = PWM(0x40)
        self.pwm.setPWMFreq(10)  # Set frequency to 60 Hz
        self.panServo = Servo("pan", self.pwm, self.PAN_SERVO_CHANNEL, 180, 630, 0.2, 0.003)
        self.tiltServo = Servo("tilt", self.pwm, self.TILT_SERVO_CHANNEL, 450, 600, 0.4, 0.005)
        self.panTarget = 50
        self.tiltTarget = 50
        self.init()

    def init(self):
        self.panAndTilt(self.panTarget, self.tiltTarget)

    def pan(self, percent):
        self.panTarget = percent
        print "panning to %d percent" % self.panTarget
        self.panServo.setTargetPosition(self.panTarget)

    def tilt(self, percent):
        print "tilting to %d percent" % percent
        self.tiltServo.setTargetPosition(percent)

    def panAndTilt(self, panPercent, tiltPercent):
        self.pan(panPercent)
        self.tilt(tiltPercent)


panTilt = PanTiltDevice()

# panTilt.pan(50)
# panTilt.tilt(0)

while True:
    tilt = int(random.random() * 100)
    pan = int(random.random() * 100)
    sleep = random.random() * 0.5 + 5.5
    panTilt.panAndTilt(pan, tilt)
    time.sleep(sleep)

    # for pct in range(0, 100, 10):
    #     panTilt.pan(pct)
    #     panTilt.tilt(pct)
    #     time.sleep(0.5)
    #
    # for pct in range(100, 0, -10):
    #     panTilt.pan(pct)
    #     panTilt.tilt(pct)
    #     time.sleep(0.2)
