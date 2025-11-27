"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordValidator = exports.emailValidator = void 0;
// Validate email format
const emailValidator = (v) => {
    // Must include @ and valid domain format
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return regex.test(v);
};
exports.emailValidator = emailValidator;
// Validate password strength
const passwordValidator = (v) => {
    // Must include at least one number, one uppercase letter, and be at least 6 characters long
    const regex = /^(?=.*[0-9])(?=.*[A-Z]).{6,}$/;
    return regex.test(v);
};
exports.passwordValidator = passwordValidator;
//# sourceMappingURL=validators.js.map