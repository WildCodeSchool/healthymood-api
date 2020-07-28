const getServerBaseURL = (req) => {
  const url = req.get('host').startsWith('localhost') ? ('http://' + req.get('host')) : ('https://' + req.get('host'));
  return url;
};

module.exports = {
  getServerBaseURL
};
