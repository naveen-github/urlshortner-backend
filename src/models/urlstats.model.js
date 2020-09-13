module.exports = (sequelize, Sequelize) => {
    const Urlstats = sequelize.define('Urlstats', {
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
      urlUUID: {
        type:Sequelize.UUID, 
        trim: true,
        allowNull:false
      },
      userIp: {
        type: Sequelize.STRING,
        defaultValue:''
      },
      country: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      city: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      timezone:{
        type: Sequelize.STRING,
        defaultValue: ''
      }
    }, {
      tableName: 'urlstats'
    });
    return Urlstats;
  };
  