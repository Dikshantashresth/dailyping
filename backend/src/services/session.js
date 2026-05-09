export function setSession(res, token, nameoftoken) {
    return res.cookie(nameoftoken, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
}
//# sourceMappingURL=session.js.map