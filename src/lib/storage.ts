import type { Session } from '../types';

const STORAGE_KEY = 'archery-sessions';

export function getSessions(): Session[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session[]) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: Session[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function getSession(id: string): Session | null {
  return getSessions().find(s => s.id === id) ?? null;
}

export function createSession(session: Session): void {
  const sessions = getSessions();
  sessions.push(session);
  saveSessions(sessions);
}

export function updateSession(session: Session): void {
  const sessions = getSessions();
  const idx = sessions.findIndex(s => s.id === session.id);
  if (idx >= 0) {
    sessions[idx] = session;
    saveSessions(sessions);
  }
}

export function deleteSession(id: string): void {
  saveSessions(getSessions().filter(s => s.id !== id));
}
