/**
 * Utility function to format date strings for display in the predictions UI.
 */
export function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const utc3 = new Date(d.getTime() - 3 * 60 * 60 * 1000);
    const dia = String(utc3.getDate()).padStart(2, '0');
    const mes = String(utc3.getMonth() + 1).padStart(2, '0');
    const ano = utc3.getFullYear();
    const hora = String(utc3.getHours()).padStart(2, '0');
    const min = String(utc3.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${hora}:${min} UTC-3`;
}
