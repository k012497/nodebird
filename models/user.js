const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            provider: {
                type: Sequelize.STRING(10),
                allowNull: false,
                defaultValue: 'local'
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true
            }, 
        }, {
            sequelize,
            timestamps: true, // createdAt, updatedAt 컬럼 생성
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true, // deletedAt 컬럼 생성
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }

    static associate(db) {
        // 모델 간 연결
        db.User.hasMany(db.Post); // User : Post = 1 : N
        db.User.belongsToMany(db.User, { // User : User = N : M (Follow)
            foreignKey: 'followingId',
            as: 'Followers', // foreignKey와 반대되는 모델
            through: 'Follow',
        });
        db.User.belongsToMany(db.User, { // Follow 모델 생성
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow',
        });
    }
}