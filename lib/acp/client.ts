import type { JsonRpcRequest, JsonRpcResponse } from "./types";

export async function sendAcpRequest(
  _endpoint: string,
  _request: JsonRpcRequest
): Promise<JsonRpcResponse> {
  throw new Error(
    "ACP client not implemented. This is a placeholder for future ACP integration."
  );
}
