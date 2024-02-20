exports.invalidEndpoints = (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
};

exports.customErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.psqlErrors = (err, req, res, next) => {
  if ((err.code = "22P02")) {
    res.status(400).send({ msg: "bad request" });
  }
  next(err);
};

exports.serverErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
};
