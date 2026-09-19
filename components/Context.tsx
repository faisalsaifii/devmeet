"use client";

import {
	createContext,
	useContext,
	useState,
	useRef,
	useEffect,
	type ReactNode,
	type RefObject,
} from "react";
import { io, type Socket } from "socket.io-client";
import type { Instance as PeerInstance } from "simple-peer";
import { getStoredName } from "@/lib/name";

type Signal = Parameters<PeerInstance["signal"]>[0];
type MediaKind = "audio" | "video";

type Call = {
	isReceivingCall?: boolean;
	from?: string;
	name?: string;
	signal?: unknown;
};

type SocketContextValue = {
	roomId: string;
	call: Call;
	callAccepted: boolean;
	myVideo: RefObject<HTMLVideoElement | null>;
	userVideo: RefObject<HTMLVideoElement | null>;
	stream?: MediaStream;
	remoteStream?: MediaStream;
	connecting: boolean;
	name: string;
	setName: (name: string) => void;
	callEnded: boolean;
	roomEnded: boolean;
	micEnabled: boolean;
	toggleMic: () => void;
	cameraEnabled: boolean;
	toggleCamera: () => void;
	me: string;
	callUser: () => void;
	leaveCall: () => void;
	answerCall: () => void;
	editorTheme: string;
	setEditorTheme: (theme: string) => void;
	editorFontSize: string | number;
	setEditorFontSize: (size: string | number) => void;
	currentWindow: string;
	setCurrentWindow: (window: string) => void;
};

export const SocketContext = createContext<SocketContextValue | null>(null);

export const useSocket = () => {
	const context = useContext(SocketContext);
	if (!context) {
		throw new Error("useSocket must be used within a ContextProvider");
	}
	return context;
};

const getStoredValue = (key: string, fallback: string) => {
	if (typeof window === "undefined") return fallback;
	return window.localStorage.getItem(key) ?? fallback;
};

const ContextProvider = ({
	children,
	roomId,
	initialRoomEnded = false,
}: {
	children: ReactNode;
	roomId?: string;
	initialRoomEnded?: boolean;
}) => {
	const [callAccepted, setCallAccepted] = useState(false);
	const [callEnded, setCallEnded] = useState(false);
	const [stream, setStream] = useState<MediaStream>();
	const [remoteStream, setRemoteStream] = useState<MediaStream>();
	const [connectionGraceElapsed, setConnectionGraceElapsed] = useState(false);
	const [name, setName] = useState(() => getStoredName());
	const [call, setCall] = useState<Call>({});
	const [me, setMe] = useState("");
	const [editorTheme, setEditorTheme] = useState("vs-dark");
	const [editorFontSize, setEditorFontSize] = useState<string | number>(18);
	const [currentWindow, setCurrentWindow] = useState("both");
	const [hydrated, setHydrated] = useState(false);
	const [micEnabled, setMicEnabled] = useState(true);
	const [cameraEnabled, setCameraEnabled] = useState(true);
	const [roomEnded, setRoomEnded] = useState(initialRoomEnded);

	const myVideoRef = useRef<HTMLVideoElement | null>(null);
	const userVideoRef = useRef<HTMLVideoElement | null>(null);
	const connectionRef = useRef<PeerInstance | null>(null);
	const socketRef = useRef<Socket | null>(null);
	const callUserRef = useRef<() => void>(() => {});
	const answerCallRef = useRef<() => void>(() => {});
	const streamRef = useRef<MediaStream | undefined>(undefined);
	const callRef = useRef<Call>({});
	const callAcceptedRef = useRef(false);
	const callEndedRef = useRef(false);
	const micEnabledRef = useRef(true);
	const cameraEnabledRef = useRef(true);

	/* eslint-disable react-hooks/set-state-in-effect -- hydrate persisted state on the client only */
	useEffect(() => {
		setEditorTheme(getStoredValue("editor-theme", "vs-dark"));
		setEditorFontSize(getStoredValue("editor-font-size", "18"));
		setCurrentWindow(getStoredValue("current-window", "both"));
		setHydrated(true);
	}, []);
	/* eslint-enable react-hooks/set-state-in-effect */

	useEffect(() => {
		if (!hydrated) return;
		localStorage.setItem("editor-theme", editorTheme);
		localStorage.setItem("editor-font-size", String(editorFontSize));
		localStorage.setItem("current-window", currentWindow);
	}, [hydrated, editorTheme, editorFontSize, currentWindow]);

	useEffect(() => {
		const socket = io();
		socketRef.current = socket;

		socket.on("me", (id: string) => setMe(id));

		socket.on("user-joined", () => {
			if (callAcceptedRef.current || callEndedRef.current) {
				return;
			}
			callUserRef.current();
		});

		socket.on(
			"callUser",
			({
				from,
				name: callerName,
				signal,
			}: {
				from: string;
				name: string;
				signal: unknown;
			}) => {
				setCall({ isReceivingCall: true, from, name: callerName, signal });
				if (callAcceptedRef.current || callEndedRef.current) {
					return;
				}
				answerCallRef.current();
			}
		);

		socket.on(
			"callAccepted",
			(payload: { signal?: Signal; name?: string } | Signal) => {
				setCallAccepted(true);
				const data = payload as { signal?: Signal; name?: string } | null;
				if (data?.name) {
					setCall((prev) => ({ ...prev, name: data.name }));
				}
				const signal = data?.signal ?? (payload as Signal);
				if (signal) {
					connectionRef.current?.signal(signal);
				}
			}
		);

		socket.on("renegotiate", (data: { signal: Signal }) => {
			connectionRef.current?.signal(data.signal);
		});

		socket.on("callEnded", () => {
			setCallEnded(true);
			setRoomEnded(true);
			connectionRef.current?.destroy();
		});

		socket.on("roomClosed", () => {
			setRoomEnded(true);
			connectionRef.current?.destroy();
			streamRef.current?.getTracks().forEach((track) => track.stop());
		});

		if (roomId) {
			socket.emit("join-room", roomId);
		}

		return () => {
			socket.disconnect();
			connectionRef.current?.destroy();
			streamRef.current?.getTracks().forEach((track) => track.stop());
		};
	}, [roomId]);

	const attachStream = (currentStream: MediaStream) => {
		streamRef.current = currentStream;
		setStream(currentStream);
		if (myVideoRef.current) {
			myVideoRef.current.srcObject = currentStream;
		}
		currentStream
			.getAudioTracks()
			.forEach((track) => (track.enabled = micEnabledRef.current));
		currentStream
			.getVideoTracks()
			.forEach((track) => (track.enabled = cameraEnabledRef.current));
		const peer = connectionRef.current;
		if (peer) {
			currentStream.getTracks().forEach((track) => {
				try {
					peer.addTrack(track, currentStream);
				} catch {
					// Track is already attached to the peer connection.
				}
			});
		}
	};

	const ensureMediaTrack = async (kind: MediaKind) => {
		const currentStream = streamRef.current ?? new MediaStream();
		streamRef.current = currentStream;

		const hasTrack =
			kind === "audio"
				? currentStream.getAudioTracks().length > 0
				: currentStream.getVideoTracks().length > 0;

		if (!hasTrack) {
			const acquired = await navigator.mediaDevices.getUserMedia(
				kind === "audio" ? { audio: true } : { video: true }
			);
			acquired.getTracks().forEach((track) => currentStream.addTrack(track));
		}

		attachStream(currentStream);
		return currentStream;
	};

	const answerCall = async () => {
		setCallAccepted(true);

		const Peer = (await import("simple-peer")).default;
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream: streamRef.current,
		});
		let initialSignal = true;

		peer.on("signal", (data) => {
			if (initialSignal) {
				initialSignal = false;
				socketRef.current?.emit("answerCall", { signal: data, name });
			} else {
				socketRef.current?.emit("renegotiate", { signal: data });
			}
		});

		peer.on("stream", (currentStream) => {
			setRemoteStream(currentStream);
			if (userVideoRef.current) {
				userVideoRef.current.srcObject = currentStream;
			}
		});

		const incomingSignal = callRef.current.signal;
		if (incomingSignal) {
			peer.signal(incomingSignal as Signal);
		}

		connectionRef.current = peer;
	};

	const callUser = async () => {
		const Peer = (await import("simple-peer")).default;
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream: streamRef.current,
		});
		let initialSignal = true;

		peer.on("signal", (data) => {
			if (initialSignal) {
				initialSignal = false;
				socketRef.current?.emit("callUser", {
					signalData: data,
					from: me,
					name,
				});
			} else {
				socketRef.current?.emit("renegotiate", { signal: data });
			}
		});

		peer.on("stream", (currentStream) => {
			setRemoteStream(currentStream);
			if (userVideoRef.current) {
				userVideoRef.current.srcObject = currentStream;
			}
		});

		connectionRef.current = peer;
	};

	const leaveCall = () => {
		socketRef.current?.emit("hang-up");
		setCallEnded(true);
		setRoomEnded(true);
		connectionRef.current?.destroy();
		streamRef.current?.getTracks().forEach((track) => track.stop());
	};

	const toggleMic = () => {
		const next = !micEnabledRef.current;
		micEnabledRef.current = next;
		setMicEnabled(next);

		if (next) {
			ensureMediaTrack("audio").catch((err) => {
				console.log(err);
				micEnabledRef.current = false;
				setMicEnabled(false);
			});
		} else {
			streamRef.current
				?.getAudioTracks()
				.forEach((track) => (track.enabled = false));
		}
	};

	const toggleCamera = () => {
		const next = !cameraEnabledRef.current;
		cameraEnabledRef.current = next;
		setCameraEnabled(next);

		if (next) {
			ensureMediaTrack("video").catch((err) => {
				console.log(err);
				cameraEnabledRef.current = false;
				setCameraEnabled(false);
			});
		} else {
			streamRef.current
				?.getVideoTracks()
				.forEach((track) => (track.enabled = false));
		}
	};

	/* eslint-disable react-hooks/exhaustive-deps -- media init should run once per room */
	useEffect(() => {
		let cancelled = false;

		const init = async () => {
			try {
				await ensureMediaTrack("audio");
				if (cancelled) return;
				await ensureMediaTrack("video");
			} catch (err) {
				console.log(err);
				micEnabledRef.current = false;
				cameraEnabledRef.current = false;
				setMicEnabled(false);
				setCameraEnabled(false);
			}
		};

		init();

		return () => {
			cancelled = true;
		};
	}, [roomId]);
	/* eslint-enable react-hooks/exhaustive-deps */

	useEffect(() => {
		callUserRef.current = callUser;
		answerCallRef.current = answerCall;
		callRef.current = call;
		callAcceptedRef.current = callAccepted;
		callEndedRef.current = callEnded;
	});

	/* Reveal the meet UI if the peer never shows up (e.g. waiting alone in a room). */
	useEffect(() => {
		if (callEnded || roomEnded || (stream && remoteStream)) {
			return;
		}
		const timer = setTimeout(() => setConnectionGraceElapsed(true), 8000);
		return () => clearTimeout(timer);
	}, [callEnded, roomEnded, stream, remoteStream]);

	const connecting =
		!callEnded &&
		!roomEnded &&
		!connectionGraceElapsed &&
		!(stream && remoteStream);

	return (
		<SocketContext.Provider
			value={{
				roomId: roomId ?? "",
				call,
				callAccepted,
				myVideo: myVideoRef,
				userVideo: userVideoRef,
				stream,
				remoteStream,
				connecting,
				name,
				setName,
				callEnded,
				roomEnded,
				micEnabled,
				toggleMic,
				cameraEnabled,
				toggleCamera,
				me,
				callUser,
				leaveCall,
				answerCall,
				editorTheme,
				setEditorTheme,
				editorFontSize,
				setEditorFontSize,
				currentWindow,
				setCurrentWindow,
			}}
		>
			{children}
		</SocketContext.Provider>
	);
};

export { ContextProvider };