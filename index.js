var app = require('express')();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
users = [];
var user;
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', function(req, res) {
   res.sendFile(__dirname+'/1st/index.html');
});
app.post('/app.html',function(req,res){
   user=req.body.username;
   res.redirect('/app.html');
});
app.get('/app.html',function(req,res){
   console.log(user);
   res.sendFile(__dirname+'/app.html',{user:user});
});
app.get('/1st/index.html',function(req,res){
   res.sendFile(__dirname+'/1st/index.html');
});
msg=[];
id=0;
io.on('connection', function(socket) {
   socket.on('setUsername', function() {
      
      if(users.indexOf(user) > -1) {
         var destination = '1st/index.html';
         socket.emit('redirect', destination);
      } else {
         id+=1;
         console.log("user "+user + " connected");
         users.push(user);
         socket.emit('userSet', {user:users,username:user},id,msg);
         io.sockets.emit('allUser',{user:users});
      }
   });
   
   socket.on('msg', function(data) {
      msg.push(data);
      io.sockets.emit('newmsg',data,id);
   })
   socket.on('umsg',function(data){
      io.sockets.emit('unewmsg',data);
   });
});

http.listen(3000, function() {
   console.log('Server is up');
});