import { pt } from '../i18n/pt';

const mesAno = new Intl.DateTimeFormat(pt.locale, { month: 'short', year: 'numeric', timeZone: 'UTC' });

// "2026-09" -> "set. de 2026"
export function formatMes(mes: string): string {
  const [ano, m] = mes.split('-').map(Number);
  return mesAno.format(new Date(Date.UTC(ano, m - 1, 1)));
}
