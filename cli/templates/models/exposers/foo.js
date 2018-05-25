/**
 * Foo Exposer system for models
 * @author Alexandre Pereira <alex@blacksmith.studio>
 *
 * @returns {Object} exposer
 */
module.exports = {
    'public': [
        'id'
    ],

    'private': [
        'id',
        'firstname',
        'lastname',
        'created_at',
        'updated_at'
    ]
}
