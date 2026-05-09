require("dotenv").config();

const token = process.env.AccessToken || "";
const appId = process.env.applicationId || "concept-elite-dev";

if (!token) {
  console.warn("[proxy.conf.js] AccessToken is empty.");
}

module.exports = [
  {
    context: ["/api/squarespace"],
    target: "https://connect.squareup.com",
    secure: true,
    changeOrigin: true,
    pathRewrite: { "^/api/squarespace": "" },
    bypass: function (req) {
      req.headers["authorization"] = `Bearer ${token}`;
      req.headers["accept"] = "application/json";
      req.headers["content-type"] = "application/json";
      console.log("[proxy] headers being sent:", {
        authorization: req.headers["authorization"]?.slice(0, 20),
        host: req.headers["host"],
      });
      return null;
    },
  },
];
