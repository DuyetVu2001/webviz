// @flow
//
//  Copyright (c) 2019-present, Cruise LLC
//
//  This source code is licensed under the Apache License, Version 2.0,
//  found in the LICENSE file in the root directory of this source tree.
//  You may not use this file except in compliance with the License.

import React, { useCallback } from "react";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";

import helpContent from "./index.help.md";
import Flex from "webviz-core/src/components/Flex";
import Panel from "webviz-core/src/components/Panel";
import PanelToolbar from "webviz-core/src/components/PanelToolbar";
import type { SaveConfig } from "webviz-core/src/types/panels";

const STextArea = styled.textarea`
  width: 100%;
  height: 100%;
  resize: none;
  border: none;
  margin: 0;
  padding: 4px 6px;
  &:focus {
    background: rgba(255, 255, 255, 0.1);
  }
`;

type Config = { noteText: string };
type Props = { config: Config, saveConfig: SaveConfig<Config> };
function Note({ config, saveConfig }: Props) {
  const onChangeText = useCallback((event: SyntheticInputEvent<HTMLTextAreaElement>) => {
    saveConfig({ noteText: event.target.value });
  }, [saveConfig]);

  return (
    <Flex col style={{ height: "100%" }}>
      <PanelToolbar helpContent={helpContent} floating />
      <STextArea placeholder="Enter note here" value={config.noteText} onChange={onChangeText} />
    </Flex>
  );
}
Note.panelType = "Note";
Note.defaultConfig = { noteText: "" };

export default hot(Panel<Config>(Note));

// import ArrowDown from "@mdi/svg/svg/arrow-down-bold.svg";
// import ArrowLeft from "@mdi/svg/svg/arrow-left-bold.svg";
// import ArrowRight from "@mdi/svg/svg/arrow-right-bold.svg";
// import ArrowTop from "@mdi/svg/svg/arrow-up-bold.svg";
// import React, { useEffect, useRef } from "react";
// import React from "react";
// import { hot } from "react-hot-loader/root";
// // import { Joystick } from "react-joystick-component";
// import styled, { css } from "styled-components";

// import helpContent from "./index.help.md";
// import Flex from "webviz-core/src/components/Flex";
// import Panel from "webviz-core/src/components/Panel";
// import PanelToolbar from "webviz-core/src/components/PanelToolbar";
// import { ROSBRIDGE_WEBSOCKET_URL_QUERY_KEY } from "webviz-core/src/util/globalConstants";

// const ROSLIB = window.ROSLIB;

// type Config = { noteText: string };
// function Note() {
//   const iconStyled = css`
//     position: absolute;

//     width: 36px;
//     height: 36px;
//     cursor: pointer;
//   `;

//   const ContainerStyled = styled.div`
//     width: 100%;
//     height: 100%;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     // &:hover {
//     //   background: rgba(255, 255, 255, 0.1);
//     // }
//     background: white;

//     & .joystick {
//       position: relative;

//       width: 100%;
//       max-width: 180px;
//       height: 100%;
//       max-height: 180px;

//       & .icon-top {
//         ${iconStyled}
//         left: 50%;
//         transform: translateX(-50%);
//       }
//       & .icon-left {
//         ${iconStyled}
//         top: 50%;
//         transform: translateY(-50%);
//       }
//       & .icon-right {
//         ${iconStyled}
//         top: 50%;
//         transform: translateY(-50%);
//         right: 0;
//       }
//       & .icon-down {
//         ${iconStyled}
//         left: 50%;
//         transform: translateX(-50%);
//         bottom: 0;
//       }

//       h3 {
//         position: absolute;
//         top: 50%;
//         left: 50%;
//         transform: translate(-50%, -50%);

//         font-weight: 600;
//         font-size: 26px;
//         color: red;
//         cursor: pointer;
//       }
//     }
//   `;

//   // const rosClient = useRef(null);
//   // const cmdVel = useRef(null);

//   // useEffect(() => {
//   //   const params = new URLSearchParams(window.location.search);
//   //   const websocketUrl = params.get(ROSBRIDGE_WEBSOCKET_URL_QUERY_KEY) || "ws://localhost:9090";

//   //   // rosClient.current = new ROSLIB.Ros({ url: "ws://localhost:9090", transportLibrary: "workersocket" });
//   //   rosClient.current = new ROSLIB.Ros({ url: websocketUrl, transportLibrary: "workersocket" });
//   //   cmdVel.current = new ROSLIB.Topic({
//   //     ros: rosClient.current,
//   //     name: "/cmd_vel",
//   //     messageType: "geometry_msgs/Twist",
//   //   });
//   // }, []);

//   // const forward = () => {
//   //   const twist = new ROSLIB.Message({
//   //     linear: {
//   //       x: 0.5,
//   //       y: 0,
//   //       z: 0,
//   //     },
//   //     angular: {
//   //       x: 0,
//   //       y: 0,
//   //       z: 0,
//   //     },
//   //   });
//   //   cmdVel.current.publish(twist);
//   // };

//   // const backward = () => {
//   //   const twist = new ROSLIB.Message({
//   //     linear: {
//   //       x: -0.5,
//   //       y: 0,
//   //       z: 0,
//   //     },
//   //     angular: {
//   //       x: 0,
//   //       y: 0,
//   //       z: 0,
//   //     },
//   //   });
//   //   cmdVel.current.publish(twist);
//   // };

//   // const turnLeft = () => {
//   //   const twist = new ROSLIB.Message({
//   //     linear: {
//   //       x: 0,
//   //       y: 0,
//   //       z: 0,
//   //     },
//   //     angular: {
//   //       x: 0,
//   //       y: 0,
//   //       z: 1,
//   //     },
//   //   });
//   //   cmdVel.current.publish(twist);
//   // };

//   // const turnRight = () => {
//   //   const twist = new ROSLIB.Message({
//   //     linear: {
//   //       x: 0,
//   //       y: 0,
//   //       z: 0,
//   //     },
//   //     angular: {
//   //       x: 0,
//   //       y: 0,
//   //       z: -1,
//   //     },
//   //   });
//   //   cmdVel.current.publish(twist);
//   // };

//   // const stop = () => {
//   //   const twist = new ROSLIB.Message({
//   //     linear: {
//   //       x: 0,
//   //       y: 0,
//   //       z: 0,
//   //     },
//   //     angular: {
//   //       x: 0,
//   //       y: 0,
//   //       z: 0,
//   //     },
//   //   });
//   //   cmdVel.current.publish(twist);
//   // };

//   // const handleMove = (value) => {
//   //   if (value.direction === "FORWARD") {
//   //     forward();
//   //   } else if (value.direction === "BACKWARD") {
//   //     backward();
//   //   } else if (value.direction === "LEFT") {
//   //     turnLeft();
//   //   } else if (value.direction === "RIGHT") {
//   //     turnRight();
//   //   } else {
//   //     stop();
//   //   }
//   //   // console.log(value);
//   // };

//   // const handleStop = () => stop();

//   return (
//     <Flex col style={{ height: "100%" }}>
//       <PanelToolbar helpContent={helpContent} floating />
//       <ContainerStyled>
//         <div className="joystick">
//           <ArrowTop className="icon-top" />
//           <ArrowLeft className="icon-left" />
//           {/* <ArrowTop className="icon-top" onClick={forward} /> */}
//           {/* <ArrowLeft className="icon-left" onClick={turnLeft} /> */}
//           <h3 onClick={stop}>Stop</h3>
//           <ArrowRight className="icon-right" />
//           <ArrowDown className="icon-down" />
//           {/* <ArrowRight className="icon-right" onClick={turnRight} /> */}
//           {/* <ArrowDown className="icon-down" onClick={backward} /> */}
//         </div>

//         {/* <div className="">
//           <Joystick size={100} sticky={true} baseColor="red" stickColor="blue" move={handleMove} stop={handleStop} />
//         </div> */}
//       </ContainerStyled>
//     </Flex>
//   );
// }
// Note.panelType = "Note";
// Note.defaultConfig = { noteText: "" };

// export default hot(Panel<Config>(Note));
