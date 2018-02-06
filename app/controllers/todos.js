var Todo = require('../models/todo');
 
exports.getTodos = function(req, res, next){
  Todo.find({userID: req.params.user_id},function(err, todos) {
  //   Todo.find(function(err, todos) {
        if (err){
	    console.log("find err + " + err);
            res.send(err);
        }
	else{
	if(todos.length == 0) console.log("no information");
	else{
		console.log("req.params.user_id is  " + req.params.user_id);
 		console.log(todos);
        	res.json(todos);
 		}
	}
    });
 
}
 
exports.createTodo = function(req, res, next){
    Todo.create({
        title : req.body.title,
	userID : req.params.user_id
    }, function(err, todo) {
        if (err){
            res.send(err);
        }
	//res.redirect('/api/users/'+req.params.user_id+'/todos');
  	Todo.find({userID : req.params.user_id},function(err, todos) {
            if (err){
               res.send(err);
            }
            res.json(todos);
        });
    });
}
 
exports.deleteTodo = function(req, res, next){
 
    Todo.remove({
        _id : req.params.todo_id
    },function(err, todo) {
        res.json(todo);
    });
}

