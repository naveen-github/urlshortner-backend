module.exports = (sequelize, Sequelize) => {
    const Urls = sequelize.define('Urls', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      uuid: {
        type: Sequelize.UUID,
        allowNull:false,
        defaultValue: Sequelize.UUIDV1,
        unique:true,
        primaryKey:true
      },
      originalUrl: {
        type: Sequelize.STRING
      },
      shortUrl: {
        type: Sequelize.STRING
      },
      topCountries: Sequelize.VIRTUAL
    }, {
      tableName: 'urls'
    });
    return Urls;
  };
  