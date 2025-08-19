const model = require('./laudo.model');
const { createLaudoSchema } = require('./laudo.schema');

async function createLaudo(req, res, next) {
    try {
        if(req.user.role !== 'admin' && req.user.role !== 'usuario') {
            return res.stauts(403).json({ error: 'Forbidden' });
        }

        const { titulo, descricao } = req.body;

        const laudo = await model.create({
            empresa_id: req.user.empresa_id, //sempre do token
            criado_por: req.user.sub,
            titulo,
            descricao
        });

        return res.status(201).json(laudo);
    } catch (err) { next(err); }
}

async function listLaudo(req, res, next) {
    try {
        if(req.user.role !== 'admin' && req.user.role !== 'usuario') {
            return res.stauts(403).json({ error: 'Forbidden' });
        }
        const { page, limit, status, me } = req.query;
        const result = await model.list({
            empresa_id: req.user.empresa_id,
            user_id: req.user.sub,
            page, limit, status, me
        });
        return res.json(result);
    } catch (err) { next(err); }
}

async function getLaudo(req, res, next) {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'usuario') {
            return res.stauts(403).json({ error: 'Forbidden' });
        }
        const laudo = await model.getByIdScoped({
            id: req.params.id,
            empresa_id: req.user.empresa_id
        });
        if (!laudo) return res.status(404).json({ error: 'NotFound' });
        return res.json(laudo);
    } catch (err) { next(err) };
}

module.exports = { createLaudo, listLaudo, getLaudo };