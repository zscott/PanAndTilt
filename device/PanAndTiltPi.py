#!/usr/bin/python

import random
import threading
import time
import socket
import sys

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
                    # print "%s: speed = %s" % (self.name, self.currentSpeed)

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
        # self.panServo = Servo("pan", self.pwm, self.PAN_SERVO_CHANNEL, 280, 660, 0.2, 0.003)
        self.panServo = Servo("pan", self.pwm, self.PAN_SERVO_CHANNEL, 120, 700, 0.3, 0.01)
        self.tiltServo = Servo("tilt", self.pwm, self.TILT_SERVO_CHANNEL, 320, 650, 0.3, 0.02)
        self.panTarget = 50
        self.tiltTarget = 50
        self.init()

    def init(self):
        self.panAndTilt(self.panTarget, self.tiltTarget)

    def pan(self, percent):
        self.panTarget = percent
        # print "panning to %d percent" % self.panTarget
        self.panServo.setTargetPosition(self.panTarget)

    def tilt(self, percent):
        # print "tilting to %d percent" % percent
        self.tiltServo.setTargetPosition(percent)

    def panAndTilt(self, panPercent, tiltPercent):
        self.pan(panPercent)
        self.tilt(tiltPercent)


class RemotePanTiltController:

    def __init__(self, panTilt):
        self.HOST = '104.197.47.145'
        self.PORT = 5000
        self.panTilt = panTilt
        self.client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    def connect(self):
        self.client_socket.connect((self.HOST, self.PORT))
        print "connected to remote pan and tilt controller %s:%d" % (self.HOST, self.PORT)

    def streamCommands(self):
        msgLen = 2

        while True:
            bytes_recvd = 0
            chunks = []
            while bytes_recvd < msgLen:
                chunk = self.client_socket.recv(min(msgLen - bytes_recvd, 2048))
                if chunk == '':
                    raise RuntimeError("socket connection broken")
                chunks.append(chunk)
                bytes_recvd += len(chunk)

            msg = ''.join(chunks)
            pan = ord(msg[0])
            tilt = ord(msg[1])
            panTilt.panAndTilt(pan, tilt)



while True:
    try:
        panTilt = PanTiltDevice()
        remote = RemotePanTiltController(panTilt)
        remote.connect()
        remote.streamCommands()
    except:
        print "error"

    time.sleep(5)

