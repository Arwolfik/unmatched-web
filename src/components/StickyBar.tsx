import type { Lang, Mode } from '../types';
import { t } from '../lib/i18n';

interface Props {
  lang: Lang;
  mode: Mode;
  onModeChange: (m: Mode) => void;
  onRoll: () => void;
  rollDisabled?: boolean;
}

export function StickyBar({ lang, mode, onModeChange, onRoll, rollDisabled }: Props) {
  const s = t(lang);

  const modes: { id: Mode; label: string; sub: string }[] = [
    { id: 'duo', label: s.duo, sub: s.duoSub },
    { id: 'quad', label: s.quad, sub: s.quadSub },
    { id: 'ffa', label: s.ffa, sub: s.ffaSub },
  ];

  return (
    <div className="sticky-bar">
      <div className="sticky-inner">
        <div className="mode-tabs" role="tablist" aria-label="Game mode">
          {modes.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-pressed={mode === m.id}
              aria-selected={mode === m.id}
              className="mode-tab"
              onClick={() => onModeChange(m.id)}
            >
              <span className="mono">{m.label}</span>
              <span>{m.sub}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={onRoll}
          disabled={rollDisabled}
          title={`${s.roll} (R)`}
        >
          <span className="die" aria-hidden="true">🎲</span>
          <span>{s.roll}</span>
        </button>
      </div>
    </div>
  );
}
