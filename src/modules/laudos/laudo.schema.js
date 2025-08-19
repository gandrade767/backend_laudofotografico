const { z } = require('zod');

const createLaudoSchema = z.object({
  titulo: z.string().min(3).max(160),
  descricao: z.string().optional(),
  // ⚠️ empresa_id NÃO vem do body: para admin/usuario vem do token
});

const listLaudosQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  status: z.enum(['aberto','em_analise','fechado']).optional(),
  me: z.enum(['true','false']).optional() // usuario pode pedir só os próprios
});

const idParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

module.exports = { createLaudoSchema, listLaudosQuerySchema, idParamSchema };
