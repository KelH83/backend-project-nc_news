exports.invalidEndpoints = (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
};

exports.customErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.psqlErrors = (err, req, res, next) => {
  if (
    err.code === "22P02" ||
    err.code === "42601" ||
    err.code === "42703" ||
    err.code === "23502"
  ) {
    res.status(400).send({ msg: "bad request" });
 
  }else if (err.code === "23503"){
    res.status(404).send({ msg: "not found" });
  }
  next(err);
};

exports.serverErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
};
