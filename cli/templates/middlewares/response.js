/**
 * @author Blacksmith <code@blacksmith.studio>
 * @param app
 * @returns {*}
 */
module.exports = app => {
    /**
     * API Gateway to standardise responses
     * @param {Object} req - express request
     * @param {Object} res - express response
     * @param {function} next - next method (in controller...)
     */
    return function(req, res, next) {

        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void
        res.sendSuccess = (o, status = 200) =>
            !res.headersSent
                ? res.status(status).send({ success: true, ...o })
                : void 0
        res.sendError = (e, status = 500, ...args) => {
            return !res.headersSent
                ? res.status(status).send({
                    success: false,
                    error: e.message || e,
                    ...args.reduce((s, v) => typeof v == 'string' ? ((s.message = v) && s) : Object.assign(s, v), {})
                })
                : void 0
        }

        res.sendUnauthorized = reason =>
            res.sendError('Unauthorized', 403, { reason })

        next()
    }
}
