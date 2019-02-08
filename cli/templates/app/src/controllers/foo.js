/**
 * Demo Controller
 * @namespace app.controllers.foo
 * @author Blacksmith Studio <code@blacksmith.studio>
 * @param {Object} app - app namespace to update
 *
 * @returns {Object} controller
 */
module.exports = (app) => {
    const Logger = app.drivers.logger 

    return {
        bar(req, res){
            Logger.success('Demo foo::bar', 'Request successfully received !')
            res.status(200).send({ 
                success : true, 
                message : 'Yeah !' 
            })
        }
    }
}