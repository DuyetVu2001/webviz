// @flow
//
//  Copyright (c) 2018-present, Cruise LLC
//
//  This source code is licensed under the Apache License, Version 2.0,
//  found in the LICENSE file in the root directory of this source tree.
//  You may not use this file except in compliance with the License.

import React, { useEffect, useRef, useMemo } from "react";
import { Joystick as JoystickCom } from "react-joystick-component";
import styled from "styled-components";

import { ROSBRIDGE_WEBSOCKET_URL_QUERY_KEY } from "webviz-core/src/util/globalConstants";

const ROSLIB = window.ROSLIB;

const JoystickStyled = styled.div`
  & h1 {
    color: white;
  }
`;

export default function Joystick() {
  const rosClient = useRef(null);
  const cmdVel = useRef(null);
  const twist = useMemo(
    () =>
      new ROSLIB.Message({
        linear: {
          x: 0.5,
          y: 0,
          z: 0,
        },
        angular: {
          x: 0,
          y: 0,
          z: 0,
        },
      }),
    []
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const websocketUrl = params.get(ROSBRIDGE_WEBSOCKET_URL_QUERY_KEY) || "ws://localhost:9090";

    rosClient.current = new ROSLIB.Ros({ url: websocketUrl, transportLibrary: "workersocket" });

    cmdVel.current = new ROSLIB.Topic({
      ros: rosClient.current,
      name: "/cmd_vel",
      messageType: "geometry_msgs/Twist",
    });
  }, []);

  const forward = () => {
    twist.linear.x = 0.3;
    twist.angular.z = 0;

    cmdVel.current.publish(twist);
  };

  const backward = () => {
    twist.linear.x = -0.3;
    twist.angular.z = 0;

    cmdVel.current.publish(twist);
  };

  const turnLeft = () => {
    twist.linear.x = 0;
    twist.angular.z = 0.5;

    cmdVel.current.publish(twist);
  };

  const turnRight = () => {
    twist.linear.x = 0;
    twist.angular.z = -0.5;

    cmdVel.current.publish(twist);
  };

  const stop = () => {
    twist.linear.x = 0;
    twist.angular.z = 0;

    cmdVel.current.publish(twist);
  };

  const handleMove = (value) => {
    console.log({ value });

    if (value.direction === "FORWARD") {
      forward();
    } else if (value.direction === "BACKWARD") {
      backward();
    } else if (value.direction === "LEFT") {
      turnLeft();
    } else if (value.direction === "RIGHT") {
      turnRight();
    } else {
      stop();
    }
    // console.log(value);
  };

  const handleStop = () => stop();

  return (
    <JoystickStyled>
      <JoystickCom size={100} sticky={true} baseColor="red" stickColor="blue" move={handleMove} stop={handleStop} />
    </JoystickStyled>
  );
}
