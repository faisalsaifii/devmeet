import { createServer } from "node:http";
import next from "next";
import { Server, type Socket } from "socket.io";

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

		io.on("connection", (socket: Socket) => {
			socket.emit("me", socket.id);

			socket.on("disconnect", () => {
				socket.broadcast.emit("callEnded");
			});

			const relay = (event: string) => {
				socket.on(event, (data: unknown) => socket.broadcast.emit(event, data));
			};

			for (const event of ["cCodeChange", "cppCodeChange", "pyCodeChange", "javaCodeChange"]) {
				relay(event);
			}

			socket.on("callUser", ({ userToCall, signalData, from, name }) => {
				io.to(userToCall).emit("callUser", { signal: signalData, from, name });
			});

			socket.on("answerCall", (data) => {
				io.to(data.to).emit("callAccepted", data.signal);
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