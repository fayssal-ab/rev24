/**
 * Styled confirmation dialog (Radix AlertDialog: focus trap, Escape, screen readers) replacing window.confirm.
 * Usage: `if (await confirmDialog({ title, body, danger: true })) …`
 */
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { create } from 'zustand';
import { useT } from '../hooks/useT';
import { Icon } from './Icon';

interface Ask {
  title: string;
  body?: string;
  confirm?: string;
  danger?: boolean;
  resolve: (ok: boolean) => void;
}
const useConfirm = create<{ ask: Ask | null }>(() => ({ ask: null }));

export function confirmDialog(o: Omit<Ask, 'resolve'>): Promise<boolean> {
  return new Promise((resolve) => {
    useConfirm.getState().ask?.resolve(false);
    useConfirm.setState({ ask: { ...o, resolve } });
  });
}

export function ConfirmHost() {
  const { t } = useT();
  const ask = useConfirm((s) => s.ask);
  const close = (ok: boolean) => {
    ask?.resolve(ok);
    useConfirm.setState({ ask: null });
  };
  return (
    <AlertDialog.Root open={!!ask} onOpenChange={(o) => !o && close(false)}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="dialog-overlay fixed inset-0 z-[80] bg-navy/50 backdrop-blur-[2px]" />
        <AlertDialog.Content
          className="dialog-content fixed left-1/2 top-1/2 z-[81] w-[min(92vw,26rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-line bg-surface p-5 shadow-2xl focus:outline-none"
          data-testid="confirm-dialog"
        >
          <div className="flex gap-3.5">
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${ask?.danger ? 'bg-bad/10 text-bad' : 'bg-accent/10 text-accent'}`}>
              <Icon name={ask?.danger ? 'trash' : 'alert'} size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <AlertDialog.Title className="font-display text-lg font-bold leading-snug">{ask?.title}</AlertDialog.Title>
              {ask?.body ? (
                <AlertDialog.Description className="mt-1 whitespace-pre-line text-sm text-muted">{ask.body}</AlertDialog.Description>
              ) : (
                <AlertDialog.Description className="sr-only">{ask?.title}</AlertDialog.Description>
              )}
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <AlertDialog.Cancel className="btn-ghost btn-sm" data-testid="confirm-cancel">
              {t('confirm.cancel')}
            </AlertDialog.Cancel>
            <AlertDialog.Action
              className={`btn-sm inline-flex items-center gap-1.5 rounded-lg px-4 font-semibold text-white transition hover:opacity-90 ${ask?.danger ? 'bg-bad' : 'bg-accent'}`}
              onClick={() => close(true)}
              data-testid="confirm-ok"
            >
              {ask?.confirm ?? t('confirm.ok')}
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
