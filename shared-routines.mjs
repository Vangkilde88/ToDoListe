import {KIDS, TASKS} from './game.mjs';
import {escapeHTML as esc} from './world.mjs';

export const routineTime = seconds => seconds === null ? 'Ingen tid målt' :
  Math.floor(seconds / 60) + ':' + String(Math.floor(seconds % 60)).padStart(2, '0');

// Accept taps from every child while an earlier cloud transaction is pending.
// A failed operation must not block the next child's operation.
export function mutationQueue() {
  let tail = Promise.resolve();
  return operation => {
    const result = tail.then(operation);
    tail = result.catch(() => {});
    return result;
  };
}

export function sharedRoutines(data, type, now = Date.now()) {
  return `<section class="shared-routines">
    <div class="shared-heading"><div><p class="eyebrow">SAMMEN OM DE SMÅ SEJRE</p>
      <h1>${type === 'morgen' ? '☀️ Godmorgen, drenge' : '🌙 Klar til natten'}</h1>
      <p>Hver sin kolonne. Hvert sit tempo. Jeres helt egne stjerner.</p></div>
      <button class="secondary" data-action="home">← Klubber & overblik</button></div>
    <div class="shared-tabs" aria-label="Vælg fælles rutine">
      ${['morgen', 'aften'].map(t => `<button class="${type === t ? 'active' : ''}" data-action="routine" data-type="${t}" aria-pressed="${type === t}">${t === 'morgen' ? '☀️ Morgen' : '🌙 Aften'}</button>`).join('')}
    </div>
    <p class="shared-hint">Tryk på din egen Start-knap. Alle får stjerner for at blive færdige.</p>
    <div class="routine-board-wrap"><div class="routine-board">
      ${KIDS.map((name, index) => {
        const k = data.kids[name], r = k.routines[type];
        const receipt = k.history[data.date]?.[type];
        const count = TASKS[type].filter((_, i) => data.checks[type][name + '_' + i]).length;
        const finished = count === TASKS[type].length;
        const elapsed = r.start === null ? 0 : r.finished ? r.seconds : Math.max(0, (now - r.start) / 1000);
        return `<section class="routine-column column-${index}" aria-labelledby="name-${name}">
          <header class="column-header"><div class="column-name"><h2 id="name-${name}">${name}</h2><span>⭐ ${k.stars}</span></div>
            <div class="column-timer"><span>⏱ <strong data-clock="${name}">${routineTime(elapsed)}</strong></span><small>${count} / ${TASKS[type].length} klaret</small></div>
            <button class="primary" data-action="start" data-name="${name}" data-type="${type}" aria-label="Start ${type} for ${name}" ${r.start !== null || r.finished ? 'disabled' : ''}>${finished ? '✓ Færdig' : r.start !== null ? 'Timeren kører' : 'Start ⏱'}</button>
          </header>
          <div class="column-tasks">${TASKS[type].map((task, i) => {
            const checked = !!data.checks[type][name + '_' + i];
            return `<button class="task ${checked ? 'done' : ''}" data-action="task" data-name="${name}" data-type="${type}" data-index="${i}" aria-label="${name}: ${esc(task)}" aria-pressed="${checked}" ${r.finished ? 'disabled' : ''}><span>${esc(task)}</span><span class="checkbox" aria-hidden="true">${checked ? '✓' : ''}</span></button>`;
          }).join('')}</div>
          <div class="column-result" role="status" aria-live="polite" aria-atomic="true">
            ${finished && receipt ? `<div class="inline-reward"><span aria-hidden="true">⭐</span><h3>FÆRDIG!</h3><strong>+${receipt.earned} ⭐</strong>
              <p>Tid: ${routineTime(receipt.seconds ?? null)}</p>
              ${receipt.legacy ? '<p>Dagens belønning er bevaret.</p>' : `<p>Grundbelønning: ${receipt.base} ⭐<br>Hurtighedsbonus: ${receipt.bonus} ⭐</p>`}
              <small>Klubkonto: ${k.stars} ⭐</small></div>` : `<p>${receipt ? 'Dagens stjerner er allerede gemt.' : 'Du får mindst 5 ⭐, når hele listen er klaret.'}</p>`}
          </div>
          <button class="secondary visit-own-club" data-action="child-club" data-name="${name}">⚽ ${name}s klub →</button>
        </section>`;
      }).join('')}
    </div></div>
  </section>`;
}
