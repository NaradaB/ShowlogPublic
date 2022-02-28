module.exports = (sequelize, DataTypes) => {
	const Users = sequelize.define('Users', {
		username: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		email: {
			type: DataTypes.STRING
		},
		password: {
			type: DataTypes.STRING
		},
		shows: {
			type: DataTypes.STRING
		},
		followers: {
			type: DataTypes.STRING
		}
	});

	return Users;
};
