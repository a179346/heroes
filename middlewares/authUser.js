// 如果在 header 中有給 Name 跟 Password => 進行身分驗證
// 身分驗證成功 => 設定 req.hahowAuth
module.exports = async function (req, res, next) {
  try {
    const name = req.get('Name');
    const password = req.get('Password');
    if (name && typeof (name) === 'string' && password && typeof (password) === 'string') {
      await req.HahowApi.Authenticate(name, password);
      req.hahowAuth = { name, password };
    }
    next();
  } catch (error) {
    next(error);
  }
};