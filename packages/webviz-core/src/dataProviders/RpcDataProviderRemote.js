// @flow
//
//  Copyright (c) 2018-present, Cruise LLC
//
//  This source code is licensed under the Apache License, Version 2.0,
//  found in the LICENSE file in the root directory of this source tree.
//  You may not use this file except in compliance with the License.

import { type Time } from "rosbag";
import * as zaplib from "zaplib/dist/zaplib_worker_runtime";

import type { DataProvider, DataProviderDescriptor, DataProviderMetadata } from "webviz-core/src/dataProviders/types";
import type { NotifyPlayerManagerData } from "webviz-core/src/players/types";
import type { UserNodeLogs } from "webviz-core/src/players/UserNodePlayer/types";
import type { CompiledUserNodeDataById } from "webviz-core/src/types/panels";
import Rpc from "webviz-core/src/util/Rpc";
import { setupWorker } from "webviz-core/src/util/RpcWorkerUtils";
// The "other side" of `RpcDataProvider`. Instantiates a `DataProviderDescriptor` tree underneath,
// in the context of wherever this is instantiated (e.g. a Web Worker, or the server side of a
// WebSocket).
export default class RpcDataProviderRemote {
  constructor(rpc: Rpc, getDataProvider: (DataProviderDescriptor) => DataProvider) {
    setupWorker(rpc);
    let provider: DataProvider;
    rpc.receive(
      "initialize",
      async ({
        childDescriptor,
        zapWorkerPort,
      }: {
        childDescriptor: DataProviderDescriptor,
        zapWorkerPort: MessagePort,
      }) => {
        if (zapWorkerPort) {
          await zaplib.initializeWorker(zapWorkerPort);
        }

        provider = getDataProvider(childDescriptor);
        return provider.initialize({
          progressCallback: (data) => {
            rpc.send("extensionPointCallback", { type: "progressCallback", data });
          },
          reportMetadataCallback: (data: DataProviderMetadata) => {
            rpc.send("extensionPointCallback", { type: "reportMetadataCallback", data });
          },
          notifyPlayerManager: (data: NotifyPlayerManagerData) =>
            rpc.send("extensionPointCallback", { type: "notifyPlayerManager", data }),
          nodePlaygroundActions: {
            setCompiledNodeData: (data: CompiledUserNodeDataById) =>
              rpc.send("extensionPointCallback", { type: "setCompiledNodeData", data }),
            addUserNodeLogs: (data: UserNodeLogs) =>
              rpc.send("extensionPointCallback", { type: "addUserNodeLogs", data }),
            setUserNodeRosLib: (data: string) =>
              rpc.send("extensionPointCallback", { type: "setUserNodeRosLib", data }),
          },
          zaplib: zapWorkerPort ? zaplib : undefined,
        });
      }
    );
    rpc.receive(
      "getMessages",
      async ({ start, end, topics }: { start: Time, end: Time, topics: ?$ReadOnlyArray<string> }) => {
        const messages = await provider.getMessages(start, end, { rosBinaryMessages: topics });
        const { parsedMessages, rosBinaryMessages, bobjects } = messages;
        const messagesToSend = rosBinaryMessages ?? [];
        if (parsedMessages != null || bobjects != null) {
          throw new Error(
            "RpcDataProvider only accepts raw messages (that still need to be parsed with ParseMessagesDataProvider)"
          );
        }
        const arrayBuffers = new Set<ArrayBuffer>();
        for (const message of messagesToSend) {
          // Do not add SharedArrayBuffers to transferrables
          if (message.message instanceof ArrayBuffer) {
            arrayBuffers.add(message.message);
          }
        }
        return { messages: messagesToSend, [Rpc.transferrables]: Array.from(arrayBuffers) };
      }
    );

    rpc.receive("close", () => provider.close());
  }
}
