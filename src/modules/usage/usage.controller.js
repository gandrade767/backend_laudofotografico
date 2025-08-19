const { getUsageByCompany, getUsageFor } = require('./usage.model');

function human(bytes) {
  if (bytes == null) return '0 B';
  const units = ['B','KB','MB','GB','TB'];
  let i = 0; let num = Number(bytes);
  while (num >= 1024 && i < units.length - 1) { num /= 1024; i++; }
  return `${num.toFixed(num >= 10 || num % 1 === 0 ? 0 : 2)} ${units[i]}`;
}

async function usageAll(req, res, next) {
  try {
    const rows = await getUsageByCompany();
    res.json(rows.map(r => ({
      empresa_id: r.empresa_id,
      empresa_nome: r.empresa_nome,
      total_bytes: Number(r.total_bytes),
      total_human: human(r.total_bytes)
    })));
  } catch (err) { next(err); }
}

async function usageOne(req, res, next) {
  try {
    const empresa_id = Number(req.params.empresa_id);
    const r = await getUsageFor(empresa_id);
    res.json({
      empresa_id: r.empresa_id,
      empresa_nome: r.empresa_nome,
      total_bytes: Number(r.total_bytes),
      total_human: human(r.total_bytes)
    });
  } catch (err) { next(err); }
}

module.exports = { usageAll, usageOne };