import { createServer, type IncomingMessage } from "node:http";
import type { Duplex } from "node:stream";
import next from "next";
import { WebSocketServer } from "ws";
import { Server, type Socket } from "socket.io";
import { Hocuspocus } from "@hocuspocus/server";
import { closeRoom, isRoomClosed } from "./lib/rooms";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST ?? (dev ? "localhost" : "0.0.0.0");
const port = Number(process.env.PORT ?? 3000);

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app
	.prepare()
	.then(() => {
		const server = createServer((req, res) => handler(req, res));

		const io = new Server(server, {
			cors: {
				origin: "*",
				methods: ["GET", "POST"],
			},
		});

		const collab = new Hocuspocus({ name: "devmeet" });

		const collabWebSocketServer = new WebSocketServer({ noServer: true });

		server.on("upgrade", (request: IncomingMessage, socket: Duplex, head: Buffer) => {
			const { pathname } = new URL(request.url ?? "/", "http://localhost");

			if (pathname === "/collab") {
				collabWebSocketServer.handleUpgrade(request, socket, head, (ws) => {
					collabWebSocketServer.emit("connection", ws, request);
				});
			} else if (pathname.startsWith("/_next/")) {
				// Forward dev-mode HMR websockets to Next.js. A server-websocket
				// with a `path` option would reject every other upgrade with 400.
				app.getUpgradeHandler()(request, socket, head);
			}
			// /socket.io upgrades are handled by socket.io's own listener.
		});

		collabWebSocketServer.on("connection", (socket, request) => {
			collab.handleConnection(socket, request);
		});

		io.on("connection", (socket: Socket) => {
			socket.emit("me", socket.id);

			socket.on("join-room", (room: string) => {
				if (isRoomClosed(room)) {
					socket.emit("roomClosed");
					return;
				}
				const roomSockets = io.sockets.adapter.rooms.get(room);
				let memberCount = 0;
				if (roomSockets) {
					for (const id of roomSockets) {
						const member = io.sockets.sockets.get(id);
						if (member && !member.disconnected) memberCount++;
					}
				}
				if (memberCount >= 2) {
					socket.emit("roomFull");
					return;
				}
				socket.data.room = room;
				socket.join(room);
				socket.broadcast.to(room).emit("user-joined", { id: socket.id });
			});

			socket.on("hang-up", () => {
				const room = socket.data.room as string | undefined;
				if (room) {
					closeRoom(room);
					socket.to(room).emit("roomClosed");
					socket.emit("roomClosed");
				}
			});

			socket.on("disconnect", () => {
				const room = socket.data.room as string | undefined;
				if (room) {
					socket.to(room).emit("user-left");
				}
			});

			socket.on("callUser", ({ signalData, from, name }) => {
				const room = socket.data.room as string | undefined;
				if (room) {
					socket.to(room).emit("callUser", { signal: signalData, from, name });
				}
			});

			socket.on("answerCall", (data) => {
				const room = socket.data.room as string | undefined;
				if (room) {
					socket.to(room).emit("callAccepted", {
						signal: data.signal,
						name: data.name,
					});
				}
			});

			socket.on("renegotiate", (data) => {
				const room = socket.data.room as string | undefined;
				if (room) {
					socket.to(room).emit("renegotiate", data);
				}
			});

			socket.on("media-state", (data) => {
				const room = socket.data.room as string | undefined;
				if (room) {
					socket.to(room).emit("media-state", data);
				}
			});
		});

		server.listen(port, hostname, () => {
			console.log(`> Ready on http://${hostname}:${port}`);
		});
	})
	.catch((err) => {
		console.error("Failed to start server", err);
		process.exit(1);
	});