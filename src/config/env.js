require('dotenv').config();
const { z } = require('zod');

const schema = z.object({
  PORT: z.coerce.number().default(3000),

  PGHOST: z.string(),
  PGPORT: z.coerce.number().default(5432),
  PGDATABASE: z.string(),
  PGUSER: z.string(),
  PGPASSWORD: z.string(),
  PGSSLMODE: z.enum(['disable', 'require']).default('disable')
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('Erro ao validar variáveis de ambiente:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

module.exports = parsed.data;
