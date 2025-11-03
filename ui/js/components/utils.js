// Funções utilitárias para predictions

export function formatCustomDate(date) {
  const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  const dia = date.getDate();
  const mes = meses[date.getMonth()];
  const hora = date.getHours().toString().padStart(2,'0');
  const min = date.getMinutes().toString().padStart(2,'0');
  return `${dia} de ${mes} às ${hora}:${min}`;
}

export function isPeriodOpen(start, end) {
  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (now < startDate) return 'before';
  if (now > endDate) return 'after';
  return 'open';
}
