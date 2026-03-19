module.exports = function (app) {
    app.get('/authors/add', function (req, res) {
        res.render('authors/add.twig');
    });

    app.post('/authors/add', function (req, res) {
        let name = req.body.name;
        let group = req.body.group;
        let rol = req.body.rol;

        let missing = [];
        if (name === undefined || name === null) {
            missing.push('name');
        }
        if (group === undefined || group === null) {
            missing.push('group');
        }
        if (rol === undefined || rol === null) {
            missing.push('rol');
        }

        if (missing.length > 0) {
            let responseMissing = '';
            for (let i = 0; i < missing.length; i++) {
                if (i > 0) {
                    responseMissing += '<br>';
                }
                responseMissing += missing[i] + ' no enviado en la petici\u00f3n.';
            }
            res.send(responseMissing);
            return;
        }

        let response = 'Autor agregado: ' + name + '<br>'
            + 'Grupo: ' + group + '<br>'
            + 'Rol: ' + rol;
        res.send(response);
    });

    app.get('/authors', function (req, res) {
        let authors = [{
            name: 'Freddie Mercury',
            group: 'Queen',
            rol: 'cantante'
        }, {
            name: 'Miles Davis',
            group: 'Miles Davis Quintet',
            rol: 'trompetista'
        }, {
            name: 'Itzhak Perlman',
            group: 'Solista',
            rol: 'violinista'
        }, {
            name: 'John Coltrane',
            group: 'John Coltrane Quartet',
            rol: 'saxofonista'
        }, {
            name: 'Martha Argerich',
            group: 'Solista',
            rol: 'pianista'
        }];

        let response = {
            authors: authors
        };
        res.render('authors/authors.twig', response);
    });

    app.get('/author*', function (req, res) {
        res.redirect('/authors');
    });
};
