module.exports = (sequelize, DataTypes) => {
	const Shows = sequelize.define('Shows', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		owner: {
			type: DataTypes.STRING
		},
		showid: {
			type: DataTypes.STRING
		},
		date_added: {
			type: DataTypes.STRING
		},
		finished: {
			type: DataTypes.INTEGER
		},
		review_comment: {
			type: DataTypes.STRING
		},
		review_score: {
			type: DataTypes.INTEGER
		}
	});

	return Shows;
};
