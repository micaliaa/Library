const User = require('../models/User');

class UserRepository {
    async findAll(condition = {}) {
        return await User.findAll(condition);
    }

    async findById(id) {
        return await User.findByPk(id);
    }

    async findByEmail(email) {
        return await User.findOne({ where: { Email: email } });
    }

    async create(userData) {
        return await User.create(userData);
    }

    async update(id, userData) {
        const user = await User.findByPk(id);
        if (!user) return null;
        return await user.update(userData);
    }

    async delete(id) {
        const user = await User.findByPk(id);
        if (!user) return null;
        await user.destroy();
        return user;
    }
   async count(condition = {}) {
    return await User.count(condition);
}

}

module.exports = new UserRepository();
