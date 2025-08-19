const { z } = require('zod');
const { id } = require('zod/locales');

const createLaudoSchema = z.object({
    titulo: z.string().min(3).max(160),
    descricao: z.string().optional(),
    //apenas o admin.admin usa:
    empresa_id: z.coerce.number().int().positive().optional()
});

const listLaudosQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    status: z.enum(['aberto', 'em_aberto', 'fechado']).optional(),
    me: z.enum(['true','false']).optional()
});

const idParamSchema = z.object({
    id: z.coerce.number().int().positive()
});

module.exports = { createLaudoSchema, listLaudosQuerySchema, idParamSchema };