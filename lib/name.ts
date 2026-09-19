export const NAME_KEY = "devmeet-name";
export const NAME_CONFIRMED_KEY = "devmeet-name-confirmed";

export const getStoredName = (): string => {
	if (typeof window === "undefined") return "";
	return window.localStorage.getItem(NAME_KEY) ?? "";
};

export const storeName = (name: string): void => {
	window.localStorage.setItem(NAME_KEY, name.trim());
};

export const isNameConfirmed = (): boolean => {
	if (typeof window === "undefined") return false;
	return window.sessionStorage.getItem(NAME_CONFIRMED_KEY) === "1";
};

export const confirmName = (): void => {
	window.sessionStorage.setItem(NAME_CONFIRMED_KEY, "1");
};