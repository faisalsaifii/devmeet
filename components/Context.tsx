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
	call: Call;
	callAccepted: boolean;
	myVideo: RefObject<HTMLVideoElement | null>;
	userVideo: RefObject<HTMLVideoElement | null>;
	stream?: MediaStream;
	name: string;
	setName: (name: string) => void;
	callEnded: boolean;
	me: string;
	callUser: (id: string) => void;
	leaveCall: () => void;
	answerCall: () => void;
	editorTheme: string;
	setEditorTheme: (theme: string) => void;
	editorFontSize: string | number;
	setEditorFontSize: (size: string | number) => void;
	currentWindow: string;
	setCurrentWindow: (window: string) => void;
	cCode: string;
	setCCode: (code: string) => void;
	javaCode: string;
	setJavaCode: (code: string) => void;
	pyCode: string;
	setPyCode: (code: string) => void;
	cppCode: string;
	setCppCode: (code: string) => void;
	handleCCodeChange: (value?: string) => void;
	handleCppCodeChange: (value?: string) => void;
	handleJavaCodeChange: (value?: string) => void;
	handlePyCodeChange: (value?: string) => void;
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

const ContextProvider = ({ children }: { children: ReactNode }) => {
	const [callAccepted, setCallAccepted] = useState(false);
	const [callEnded, setCallEnded] = useState(false);
	const [stream, setStream] = useState<MediaStream>();
	const [name, setName] = useState("");
	const [call, setCall] = useState<Call>({});
	const [me, setMe] = useState("");
	const [cCode, setCCode] = useState("");
	const [javaCode, setJavaCode] = useState("");
	const [pyCode, setPyCode] = useState("");
	const [cppCode, setCppCode] = useState("");
	const [editorTheme, setEditorTheme] = useState("vs-dark");
	const [editorFontSize, setEditorFontSize] = useState<string | number>(18);
	const [currentWindow, setCurrentWindow] = useState("both");
	const [hydrated, setHydrated] = useState(false);

	const myVideo = useRef<HTMLVideoElement | null>(null);
	const userVideo = useRef<HTMLVideoElement | null>(null);
	const connectionRef = useRef<PeerInstance | null>(null);
	const socketRef = useRef<Socket | null>(null);

	/* eslint-disable react-hooks/set-state-in-effect -- hydrate persisted state on the client only */
	useEffect(() => {
		setCCode(getStoredValue("c-code", ""));
		setJavaCode(getStoredValue("java-code", ""));
		setPyCode(getStoredValue("py-code", ""));
		setCppCode(getStoredValue("cpp-code", ""));
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
				setStream(currentStream);
				if (myVideo.current) {
					myVideo.current.srcObject = currentStream;
				}
			})
			.catch((err) => console.log(err));

		socket.on("me", (id: string) => setMe(id));

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
			}
		);

		socket.on("cCodeChange", ({ code }: { code: string }) => {
			setCCode(code);
			localStorage.setItem("c-code", code);
		});

		socket.on("cppCodeChange", ({ code }: { code: string }) => {
			setCppCode(code);
			localStorage.setItem("cpp-code", code);
		});

		socket.on("pyCodeChange", ({ code }: { code: string }) => {
			setPyCode(code);
			localStorage.setItem("py-code", code);
		});

		socket.on("javaCodeChange", ({ code }: { code: string }) => {
			setJavaCode(code);
			localStorage.setItem("java-code", code);
		});

		return () => {
			socket.disconnect();
			localStream?.getTracks().forEach((track) => track.stop());
		};
	}, []);

	const handleCCodeChange = (newValue?: string) => {
		const code = newValue ?? "";
		setCCode(code);
		socketRef.current?.emit("cCodeChange", { code });
		localStorage.setItem("c-code", code);
	};

	const handleCppCodeChange = (newValue?: string) => {
		const code = newValue ?? "";
		setCppCode(code);
		socketRef.current?.emit("cppCodeChange", { code });
		localStorage.setItem("cpp-code", code);
	};

	const handlePyCodeChange = (newValue?: string) => {
		const code = newValue ?? "";
		setPyCode(code);
		localStorage.setItem("py-code", code);
		socketRef.current?.emit("pyCodeChange", { code });
	};

	const handleJavaCodeChange = (newValue?: string) => {
		const code = newValue ?? "";
		setJavaCode(code);
		socketRef.current?.emit("javaCodeChange", { code });
		localStorage.setItem("java-code", code);
	};

	const answerCall = async () => {
		setCallAccepted(true);

		const Peer = (await import("simple-peer")).default;
		const peer = new Peer({ initiator: false, trickle: false, stream });

		peer.on("signal", (data) => {
			socketRef.current?.emit("answerCall", { signal: data, to: call.from });
		});

		peer.on("stream", (currentStream) => {
			if (userVideo.current) {
				userVideo.current.srcObject = currentStream;
			}
		});

		peer.signal(call.signal as Signal);

		connectionRef.current = peer;
	};

	const callUser = async (id: string) => {
		const Peer = (await import("simple-peer")).default;
		const peer = new Peer({ initiator: true, trickle: false, stream });

		peer.on("signal", (data) => {
			socketRef.current?.emit("callUser", {
				userToCall: id,
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

	return (
		<SocketContext.Provider
			value={{
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
				cCode,
				setCCode,
				javaCode,
				setJavaCode,
				pyCode,
				setPyCode,
				cppCode,
				setCppCode,
				handleCCodeChange,
				handleCppCodeChange,
				handleJavaCodeChange,
				handlePyCodeChange,
			}}
		>
			{children}
		</SocketContext.Provider>
	);
};

export { ContextProvider };
