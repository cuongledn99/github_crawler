# Constants

Chứa các thông số mặc định được cấu hình, ví dụ như Errors message, hoặc các UserType, Acl, ...

```javascript
// constants/errors.js
const errors = {
  NOT_AUTHENTICATED: 'NOT_AUTHENTICATED',
  KEY_EXISTED: 'KEY_EXISTED'
}
export default errors


// routes/authRoute.js
import Errors from 'constants/errors'

router.get('/user', (req, res) => {
  if(!checkLogin(req)){
    res.json({error: true, message: Errors.NOT_AUTHENTICATED})
  }
})
``