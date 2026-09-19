export const NAME_KEY = "devmeet-name";

export const getStoredName = (): string => {
	if (typeof window === "undefined") return "";
	return window.localStorage.getItem(NAME_KEY) ?? "";
};

export const storeName = (name: string): void => {
	window.localStorage.setItem(NAME_KEY, name.trim());
};