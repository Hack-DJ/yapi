import yapi from '../yapi.js'
import baseModel from './base.js'

class projectModel extends baseModel{
    getName(){
        return 'project'
    }

    getSchema(){
        return {
            uid: {type: Number, required: true},
            name: {type: String, required: true},
            basepath: {type: String, required: true, validate: {
                validator: (v) => {
                    return v && v[v.length - 1] === '/'
                },
                message: 'basepath字符串结尾必须是/'
            }},
            desc: String,
            group_id: {type: Number, required: true},
            members: Array,
            prd_host: {type: String, required: true},
            env: [
                {name: String, domain: String}
            ],
            add_time: Number,
            up_time: Number
        }
    }

    save(data) {
        let m = new this.model(data);
        return m.save();
    }


    get(id){
        return this.model.findOne({
            _id: id
        }).exec()
    }

    getByDomain(domain){
        return this.model.find({
            prd_host: domain
        }).exec()
    }

    checkNameRepeat(name){
        return this.model.count({
            name: name
        })
    }

    checkDomainRepeat(domain, basepath){
        return this.model.count({
            prd_host: domain,
            basepath: basepath
        })
    }


    list (group_id){
        return this.model.find({
            group_id: group_id
        }).exec()
    }

    countByGroupId(group_id){
        return this.model.count({
            group_id: group_id
        })
    }

    del(id){
        return this.model.deleteOne({
            _id: id
        })
    }
    up(id, data){
        data.up_time = yapi.commons.time();
        return this.model.update({
            _id: id,
        }, data, { runValidators: true })
    }

    addMember(id, uid){
        return this.model.update({
            _id: id
        }, {
            $push: {members: uid}
        })
    }

    delMember(id, uid){
        return this.model.update({
            _id: id
        }, {
            $pull: {members: uid}
        })
    }

    checkMemberRepeat(id, uid){
        return this.model.count({
            _id: id,
            members:[uid]
        })
    }

}

module.exports = projectModel;