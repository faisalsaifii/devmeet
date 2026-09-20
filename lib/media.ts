const MEDIA_STATE_KEY = "devmeet-media-state";

export type MediaState = {
	micEnabled: boolean;
	cameraEnabled: boolean;
};

const DEFAULT_MEDIA_STATE: MediaState = {
	micEnabled: true,
	cameraEnabled: true,
};

export const getMediaState = (): MediaState => {
	if (typeof window === "undefined") return DEFAULT_MEDIA_STATE;
	const raw = window.sessionStorage.getItem(MEDIA_STATE_KEY);
	if (!raw) return DEFAULT_MEDIA_STATE;
	try {
		return { ...DEFAULT_MEDIA_STATE, ...JSON.parse(raw) };
	} catch {
		return DEFAULT_MEDIA_STATE;
	}
};

export const storeMediaState = (state: MediaState): void => {
	if (typeof window === "undefined") return;
	window.sessionStorage.setItem(MEDIA_STATE_KEY, JSON.stringify(state));
};