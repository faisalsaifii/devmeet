declare global {
  var __devmeetClosedRooms: Set<string> | undefined;
}

export const getClosedRooms = (): Set<string> => {
  if (!globalThis.__devmeetClosedRooms) {
    globalThis.__devmeetClosedRooms = new Set<string>();
  }
  return globalThis.__devmeetClosedRooms;
};

export const isRoomClosed = (roomId: string): boolean =>
  getClosedRooms().has(roomId);

export const closeRoom = (roomId: string): void => {
  getClosedRooms().add(roomId);
};