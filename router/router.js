const knex = require('knex');
const router = require('express').Router();

const knewConfig = {
	client: 'sqlite3',
	connection: {
		filename: './data/lambda.sqlite3'
	},
	useNullAsDefault: true
};

const db = knex(knewConfig);

router.get('/', (req, res) => {
	db('zoos')
		.then((zoos) => {
			res.status(200).json(zoos);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

router.get('/:id', (req, res) => {
	db('zoos')
		.where({ id: req.params.id })
		.first()
		.then((zoo) => {
			if (zoo) {
				res.status(200).json(zoo);
			} else {
				res.status(404).json({ message: 'Animal not found.' });
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

router.post('/', (req, res) => {
	if (!req.body.name) {
		res.status(400).json({ message: 'Please provide a name.' });
	} else {
		db('zoos')
			.insert(req.body, 'id')
			.then((ids) => {
				db('zoos').where({ id: ids[0] }).first().then((zoo) => {
					res.status(200).json(zoo);
				});
			})
			.catch((err) => {
				res.status(500).json(err);
			});
	}
});

module.exports = router;
