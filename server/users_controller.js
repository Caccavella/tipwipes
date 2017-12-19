module.exports = {
    
            get_users: (req, res, next) => {
                req.app.get('db').users.all_users().then(response => res.status(200).send(response))
            },
    
            get_user_by_id: (req, res, nest) => {
                req.app.get('db').users.user_by_id(req.params.id).then(response => res.status(200).send(response))
            },
            create_user: (req,res,next) => {
                req.app.get('db').users.create_user().then( () => res.status(200).send() );
            },    
            delete_user: (req, res, next) => {
                req.app.get('db').users.delete_user(req.params.id).then(response => res.status(200).send(response))
            },
            get_user_by_email: (req, res, nest) => {
                req.app.get('db').users.user_by_email(req.params.id).then(response => res.status(200).send(response))
            }
    
        }