import type { MemoryEntry } from "./types";

const store = new Map<string, MemoryEntry>();

export function get(key: string): MemoryEntry | undefined {
  return store.get(key);
}

export function set(key: string, value: string): void {
  const existing = store.get(key);
  const now = Date.now();
  store.set(key, {
    key,
    value,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  });
}

export function remove(key: string): boolean {
  return store.delete(key);
}

export function list(): MemoryEntry[] {
  return Array.from(store.values());
}
