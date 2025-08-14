const { z, ZodString } = require('zod');
const { create } = require('../empresas/empresa.model');

const base = {
    nome: z.string().min(3).max(120),
    email: z.string().email(),
    senha: z.string().min(8),
    role: z.enum(['admin', 'usuario']), // não exponha o 'admin.admin' na API
    empresa_id: z.coerce.number().int().positive().optional()
};

const createUserBySuperadmin = z.object({ ...base, empresa_id: z.coerce.number().int().positive() });
const createUserByAdmin      = z.object({ ...base }).omit({ empresa_id: true }).extend({ role: z.literal('admin', 'usuario') });

module.exports = { createUserBySuperadmin, createUserByAdmin};