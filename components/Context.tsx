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

type Signal = Parameters<PeerInstance["signal"]>[0];

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
	name: string;
	setName: (name: string) => void;
	callEnded: boolean;
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
}: {
	children: ReactNode;
	roomId?: string;
}) => {
	const [callAccepted, setCallAccepted] = useState(false);
	const [callEnded, setCallEnded] = useState(false);
	const [stream, setStream] = useState<MediaStream>();
	const [name, setName] = useState("");
	const [call, setCall] = useState<Call>({});
	const [me, setMe] = useState("");
	const [editorTheme, setEditorTheme] = useState("vs-dark");
	const [editorFontSize, setEditorFontSize] = useState<string | number>(18);
	const [currentWindow, setCurrentWindow] = useState("both");
	const [hydrated, setHydrated] = useState(false);

	const myVideo = useRef<HTMLVideoElement | null>(null);
	const userVideo = useRef<HTMLVideoElement | null>(null);
	const connectionRef = useRef<PeerInstance | null>(null);
	const socketRef = useRef<Socket | null>(null);
	const callUserRef = useRef<() => void>(() => {});
	const answerCallRef = useRef<() => void>(() => {});
	const streamRef = useRef<MediaStream | undefined>(undefined);
	const callRef = useRef<Call>({});
	const callAcceptedRef = useRef(false);
	const callEndedRef = useRef(false);
	const pendingCallRef = useRef(false);
	const pendingAnswerRef = useRef(false);

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

		let localStream: MediaStream | undefined;

		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then((currentStream) => {
				localStream = currentStream;
				streamRef.current = currentStream;
				setStream(currentStream);
				if (myVideo.current) {
					myVideo.current.srcObject = currentStream;
				}
				if (pendingCallRef.current) {
					pendingCallRef.current = false;
					callUserRef.current();
				}
				if (pendingAnswerRef.current) {
					pendingAnswerRef.current = false;
					answerCallRef.current();
				}
			})
			.catch((err) => console.log(err));

		socket.on("me", (id: string) => setMe(id));

		socket.on("user-joined", () => {
			if (callAcceptedRef.current || callEndedRef.current) {
				return;
			}
			if (streamRef.current) {
				callUserRef.current();
			} else {
				pendingCallRef.current = true;
			}
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
				if (streamRef.current) {
					answerCallRef.current();
				} else {
					pendingAnswerRef.current = true;
				}
			}
		);

		if (roomId) {
			socket.emit("join-room", roomId);
		}

		return () => {
			socket.disconnect();
			localStream?.getTracks().forEach((track) => track.stop());
		};
	}, [roomId]);

	const answerCall = async () => {
		setCallAccepted(true);

		const Peer = (await import("simple-peer")).default;
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream: streamRef.current,
		});

		peer.on("signal", (data) => {
			socketRef.current?.emit("answerCall", { signal: data });
		});

		peer.on("stream", (currentStream) => {
			if (userVideo.current) {
				userVideo.current.srcObject = currentStream;
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

		peer.on("signal", (data) => {
			socketRef.current?.emit("callUser", {
				signalData: data,
				from: me,
				name,
			});
		});

		peer.on("stream", (currentStream) => {
			if (userVideo.current) {
				userVideo.current.srcObject = currentStream;
			}
		});

		socketRef.current?.on("callAccepted", (signal: Signal) => {
			setCallAccepted(true);
			peer.signal(signal);
		});

		connectionRef.current = peer;
	};

	const leaveCall = () => {
		setCallEnded(true);
		connectionRef.current?.destroy();
		window.location.reload();
	};

	useEffect(() => {
		callUserRef.current = callUser;
		answerCallRef.current = answerCall;
		streamRef.current = stream;
		callRef.current = call;
		callAcceptedRef.current = callAccepted;
		callEndedRef.current = callEnded;
	});

	return (
		<SocketContext.Provider
			value={{
				roomId: roomId ?? "",
				call,
				callAccepted,
				myVideo,
				userVideo,
				stream,
				name,
				setName,
				callEnded,
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
