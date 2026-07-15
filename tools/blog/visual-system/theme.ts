export const journalTheme = {
  graphite: '#18181b',
  inkMuted: '#52525b',
  zinc: '#d4d4d8',
  zincSoft: '#e4e4e7',
  paper: '#f7f5ef',
  white: '#ffffff',
  emerald: '#059669',
  emeraldDark: '#047857',
} as const

export const journalThemeCss = `
  :root {
    --journal-graphite: ${journalTheme.graphite};
    --journal-ink-muted: ${journalTheme.inkMuted};
    --journal-zinc: ${journalTheme.zinc};
    --journal-zinc-soft: ${journalTheme.zincSoft};
    --journal-paper: ${journalTheme.paper};
    --journal-white: ${journalTheme.white};
    --journal-emerald: ${journalTheme.emerald};
    --journal-emerald-dark: ${journalTheme.emeraldDark};
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  .journal-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    inset: 48px;
    opacity: 0.42;
    pointer-events: none;
    position: absolute;
    z-index: 0;
  }

  .journal-grid > span {
    border-left: 1px solid var(--journal-zinc-soft);
  }

  .journal-grid > span:last-child {
    border-right: 1px solid var(--journal-zinc-soft);
  }

  .crop-mark {
    color: var(--journal-graphite);
    height: 22px;
    opacity: 0.72;
    position: absolute;
    width: 22px;
    z-index: 8;
  }

  .crop-mark::before,
  .crop-mark::after {
    background: currentColor;
    content: '';
    position: absolute;
  }

  .crop-mark::before {
    height: 1px;
    width: 22px;
  }

  .crop-mark::after {
    height: 22px;
    width: 1px;
  }

  .crop-mark--tl { left: 25px; top: 25px; }
  .crop-mark--tr { right: 25px; top: 25px; transform: rotate(90deg); }
  .crop-mark--br { bottom: 25px; right: 25px; transform: rotate(180deg); }
  .crop-mark--bl { bottom: 25px; left: 25px; transform: rotate(270deg); }

  .registration-mark {
    color: var(--journal-emerald-dark);
    height: 13px;
    opacity: 0.72;
    position: absolute;
    width: 13px;
    z-index: 8;
  }

  .registration-mark::before,
  .registration-mark::after {
    background: currentColor;
    content: '';
    left: 6px;
    position: absolute;
    top: 0;
  }

  .registration-mark::before { height: 13px; width: 1px; }
  .registration-mark::after { height: 1px; left: 0; top: 6px; width: 13px; }

  .paper-edge {
    border: 1px solid var(--journal-graphite);
    box-shadow: 7px 7px 0 var(--journal-zinc);
  }

  .stamp {
    align-items: center;
    border: 2px solid var(--journal-emerald-dark);
    color: var(--journal-emerald-dark);
    display: inline-flex;
    font-family: 'Journal Mono', monospace;
    font-size: 9px;
    font-weight: 700;
    justify-content: center;
    letter-spacing: 0.12em;
    line-height: 1.12;
    min-height: 34px;
    padding: 5px 8px 4px;
    text-align: center;
    text-transform: uppercase;
    transform: rotate(-2deg);
  }

  .annotation {
    color: var(--journal-emerald-dark);
    font-family: 'Journal Serif', serif;
    font-style: italic;
  }

  .folio {
    align-items: flex-end;
    border-left: 1px solid var(--journal-zinc);
    color: var(--journal-ink-muted);
    display: flex;
    flex-direction: column;
    font-family: 'Journal Mono', monospace;
    font-size: 9px;
    justify-content: center;
    letter-spacing: 0.09em;
    line-height: 1.45;
    text-transform: uppercase;
  }
`
