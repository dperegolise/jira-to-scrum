# Mocking the Server Data

When endpoints point to the ***local*** Express server, Express will use this folder to attempt to resolve /api $http calls.

## Examples

### Simple list call
 For the api call:
 
 ```javascript
   GET /api/accounts
 ```
 We would have a directory called **/data/accounts**.
  and a file: **default.json**
  with an array of the objects we want to use as the response.
  
### Respond for a single object

say we wanted account 2332,

 ```javascript
   GET /api/accounts/2332
 ```
  In directory **/data/accounts**.
  We'd have a file: **2332.json**
  with the single object we want to use as the response.
 
### Response to a Post

The response to 
 ```javascript
   POST /api/accounts/2332
 ```
 would be the same as the single Get.
 
 Of course, this is completely customizable if you edit 
 
 **/server/gulpExpress.js** and its config.  If you're comfortable with node, go for it!