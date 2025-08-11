const { z } = require('zod');
const cnpjRegex = /^\d{14}$/;

const createEmpresaSchema = z.object({
  nome: z.string().min(3, 'nome deve ter ao menos 3 caracteres').max(120),
  cnpj: z.string().regex(cnpjRegex, 'cnpj deve ter 14 dígitos').optional()
    .or(z.literal('').transform(() => undefined))
});

const updateEmpresaSchema = z.object({
  nome: z.string().min(3).max(120).optional(),
  cnpj: z.string().regex(cnpjRegex).optional()
}).refine(obj => Object.keys(obj).length > 0, {
  message: 'Envie ao menos um campo para atualizar'
});

const listEmpresasQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional()
});

const idParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

module.exports = {
  createEmpresaSchema,
  updateEmpresaSchema,
  listEmpresasQuerySchema,
  idParamSchema
};