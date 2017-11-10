const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
		_id: {
			type: String,
			default: uuid.v4
		},
		email: {
				type: String,
				required: true,
				unique: true,
				index: true
		},
		firstName: {
				type: String,
				required: true
		},
		lastName: {
				type: String,
				required: true
		},
		dateOfBirth: {
				type: Date,
				required: true
		},
		graduationYear: {
				type: String,
				required: true
		},
		phoneNumber: {
				type: String,
				required: true
		},
		password: {
				type: String,
				required: true
		},
		createdAt: {
			type: Date,
			default: Date.now
		},
		modifiedAt: {
			type: Date,
			default: Date.now
		},
		refreshToken: String
});

UserSchema.static({
	authenticate(email, password) {
		return new Promise((resolve, reject) => {
			this.findOne({ email })
				.then(user => {
					if (!user) return reject('No user with that email!');

					user.validPassword(password)
						.then(() => {
							resolve(user);
						})
						.catch(() => {
							reject("Invalid password!");
						});
				});
		});
	}
});

UserSchema.method({
	validPassword(password) {
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, this.password, (err, valid) => {
				if (err || !valid) return reject();
				else return resolve();
			});
		});
	}
});

/**
 * Helper method to hash password before saving.
 * @param {Function} next Move to next middlware.
 * @return {Function} Next middleware.
 */
UserSchema.pre('save', function(next) {
	if (!this.isModified('password')) return next();

	bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
		if (err) return next(err);

		bcrypt.hash(this.password, salt, (err, hash) => {
			if (err) next(err);

			this.password = hash;
			this.modifiedAt = Date.now();
			next();
		});
	});
});

module.exports = mongoose.model("User", UserSchema);
