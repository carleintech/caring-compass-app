export var AuthAction;
(function (AuthAction) {
    AuthAction["LOGIN"] = "LOGIN";
    AuthAction["LOGOUT"] = "LOGOUT";
    AuthAction["REGISTER"] = "REGISTER";
    AuthAction["PASSWORD_RESET_REQUEST"] = "PASSWORD_RESET_REQUEST";
    AuthAction["PASSWORD_RESET_CONFIRM"] = "PASSWORD_RESET_CONFIRM";
    AuthAction["PASSWORD_UPDATE"] = "PASSWORD_UPDATE";
    AuthAction["EMAIL_UPDATE"] = "EMAIL_UPDATE";
    AuthAction["EMAIL_VERIFY"] = "EMAIL_VERIFY";
    AuthAction["MFA_ENABLE"] = "MFA_ENABLE";
    AuthAction["MFA_DISABLE"] = "MFA_DISABLE";
    AuthAction["MFA_VERIFY"] = "MFA_VERIFY";
    AuthAction["TOKEN_REFRESH"] = "TOKEN_REFRESH";
    AuthAction["ACCOUNT_LOCK"] = "ACCOUNT_LOCK";
    AuthAction["ACCOUNT_UNLOCK"] = "ACCOUNT_UNLOCK";
})(AuthAction || (AuthAction = {}));
// Error types
export class AuthError extends Error {
    code;
    statusCode;
    constructor(message, code, statusCode = 400) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.name = 'AuthError';
    }
}
export var AuthErrorCode;
(function (AuthErrorCode) {
    AuthErrorCode["INVALID_CREDENTIALS"] = "INVALID_CREDENTIALS";
    AuthErrorCode["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    AuthErrorCode["USER_ALREADY_EXISTS"] = "USER_ALREADY_EXISTS";
    AuthErrorCode["EMAIL_NOT_VERIFIED"] = "EMAIL_NOT_VERIFIED";
    AuthErrorCode["ACCOUNT_DISABLED"] = "ACCOUNT_DISABLED";
    AuthErrorCode["TOKEN_EXPIRED"] = "TOKEN_EXPIRED";
    AuthErrorCode["TOKEN_INVALID"] = "TOKEN_INVALID";
    AuthErrorCode["PERMISSION_DENIED"] = "PERMISSION_DENIED";
    AuthErrorCode["WEAK_PASSWORD"] = "WEAK_PASSWORD";
    AuthErrorCode["INVALID_EMAIL"] = "INVALID_EMAIL";
    AuthErrorCode["MFA_REQUIRED"] = "MFA_REQUIRED";
    AuthErrorCode["MFA_INVALID"] = "MFA_INVALID";
    AuthErrorCode["RATE_LIMITED"] = "RATE_LIMITED";
    AuthErrorCode["INVITE_INVALID"] = "INVITE_INVALID";
    AuthErrorCode["INVITE_EXPIRED"] = "INVITE_EXPIRED";
})(AuthErrorCode || (AuthErrorCode = {}));
//# sourceMappingURL=types.js.map