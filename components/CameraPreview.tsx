"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { getMediaState, storeMediaState } from "@/lib/media";

const controlButton = (enabled: boolean) =>
	enabled
		? "bg-white/90 text-neutral-900 shadow-lg shadow-black/20 hover:bg-white"
		: "bg-white/15 text-white shadow-lg shadow-black/20 hover:bg-white/25";

const CameraPreview = ({ className = "" }: { className?: string }) => {
	const [initial] = useState(getMediaState);
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const micRef = useRef(initial.micEnabled);
	const cameraRef = useRef(initial.cameraEnabled);
	const [micEnabled, setMicEnabled] = useState(initial.micEnabled);
	const [cameraEnabled, setCameraEnabled] = useState(initial.cameraEnabled);
	const [failed, setFailed] = useState(false);

	useEffect(() => {
		let cancelled = false;

		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				if (cancelled) {
					stream.getTracks().forEach((track) => track.stop());
					return;
				}
				streamRef.current = stream;
				stream
					.getAudioTracks()
					.forEach((track) => (track.enabled = micRef.current));
				stream
					.getVideoTracks()
					.forEach((track) => (track.enabled = cameraRef.current));
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
				}
			})
			.catch((err) => {
				console.log(err);
				if (!cancelled) setFailed(true);
			});

		return () => {
			cancelled = true;
			streamRef.current?.getTracks().forEach((track) => track.stop());
		};
	}, []);

	const persistState = () =>
		storeMediaState({
			micEnabled: micRef.current,
			cameraEnabled: cameraRef.current,
		});

	const toggleMic = () => {
		const next = !micRef.current;
		micRef.current = next;
		setMicEnabled(next);
		streamRef.current
			?.getAudioTracks()
			.forEach((track) => (track.enabled = next));
		persistState();
	};

	const toggleCamera = () => {
		const next = !cameraRef.current;
		cameraRef.current = next;
		setCameraEnabled(next);
		streamRef.current
			?.getVideoTracks()
			.forEach((track) => (track.enabled = next));
		persistState();
	};

	return (
		<div
			className={`relative aspect-video w-full overflow-hidden rounded-xl border border-foreground/10 bg-neutral-950 ${className}`}
		>
			<video
				ref={videoRef}
				muted
				autoPlay
				playsInline
				className="h-full w-full object-cover"
			/>
			{failed ? (
				<div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
					<VideoOff className="size-8" />
					<p className="text-xs">Camera &amp; mic unavailable</p>
				</div>
			) : (
				<>
					{!cameraEnabled && (
						<div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-neutral-950/70 text-white">
							<VideoOff className="size-8" />
							<p className="text-xs">Camera is off</p>
						</div>
					)}
					{!micEnabled && (
						<div className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-black/50 px-2 py-0.5 text-xs font-black text-white">
							<MicOff className="size-3" />
							Muted
						</div>
					)}
					<div className="absolute right-2 bottom-2 flex items-center gap-1.5">
						<button
							type="button"
							onClick={toggleMic}
							aria-label={micEnabled ? "Mute microphone" : "Unmute microphone"}
							className={`grid size-9 cursor-pointer place-items-center rounded-lg ${controlButton(micEnabled)}`}
						>
							{micEnabled ? (
								<Mic className="size-4" />
							) : (
								<MicOff className="size-4" />
							)}
						</button>
						<button
							type="button"
							onClick={toggleCamera}
							aria-label={cameraEnabled ? "Turn camera off" : "Turn camera on"}
							className={`grid size-9 cursor-pointer place-items-center rounded-lg ${controlButton(cameraEnabled)}`}
						>
							{cameraEnabled ? (
								<Video className="size-4" />
							) : (
								<VideoOff className="size-4" />
							)}
						</button>
					</div>
				</>
			)}
		</div>
	);
};

export default CameraPreview;