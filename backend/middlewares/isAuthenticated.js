import jwt, { decode } from "jsonwebtoken";
export default async function isAuthenticated(req, res, next) {
    console.log("req.cookies.token");
    try {

        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized", sucess: false });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized ! Invalid Token!!", sucess: false });
        }
        req.id = decoded.id;

        next();

    }
    catch (error) {
        console.log(`error in isAuthenticated middleware :: ${error}`);
        return res.status(500).json({ message: "Internal server error", sucess: false });
    }
}