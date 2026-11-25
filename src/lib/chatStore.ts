/** Chat open / closed state and availability, kept apart so the chat code itself can be loaded on demand. */
import { create } from 'zustand';
import { authEnabled, useApproved, useAuth } from '../auth/auth';

const OPEN_KEY = 'g22-chat-open';

/** Panel open / closed (remembered on the device); the layout reads it to make room on wide screens. */
export const useChat = create<{ open: boolean; profile: string | null; setOpen: (o: boolean) => void; showProfile: (id: string | null) => void }>((set) => ({
  open: typeof localStorage !== 'undefined' && localStorage.getItem(OPEN_KEY) === '1',
  profile: null,
  setOpen: (open) => {
    try {
      localStorage.setItem(OPEN_KEY, open ? '1' : '0');
    } catch {
      /* private mode */
    }
    set({ open });
  },
  showProfile: (profile) => set({ profile })
}));

/** Whether the chat exists for this visitor (signed in and approved). */
export const useChatEnabled = () => {
  const approved = useApproved();
  const user = useAuth((s) => s.user);
  return authEnabled && approved && !!user;
};

