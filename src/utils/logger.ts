import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

class Logger {
  private mcpServer: McpServer | null = null;

  setMcpServer(mcpServer: McpServer) {
    this.mcpServer = mcpServer;
  }

  log(level: Parameters<McpServer["server"]["sendLoggingMessage"]>[0]["level"], data: unknown) {
    this.mcpServer?.server.sendLoggingMessage({
      level,
      data,
    });
  }

  info(data: unknown) {
    this.log("info", data);
  }

  error(data: unknown) {
    this.log("error", data);
  }

  warn(data: unknown) {
    this.log("warning", data);
  }

  debug(data: unknown) {
    this.log("debug", data);
  }
}

export const logger = new Logger();
