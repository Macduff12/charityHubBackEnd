module.exports = class UserDto {
    email;
    id;
    isActivated;
    phone;
    fullName;
    role; 
   
    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.phone = model.phone;
        this.fullName = model.fullName;
        this.role = model.role;
    }
}
