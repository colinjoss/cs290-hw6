var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 5654);


function displayTable(res, context){
    mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
        if(err){
            next(err);
            return;
        };
        context.exercises = rows;
        res.render('hw6', context);
    });
};

app.get('/',function(req,res,next){
    var context = {};
    context.exercises = [];
    displayTable(res, context)
});

app.post('/',function(req,res,next){
    var context = {};
    context.exercises = [];

    // SUBMIT NEW ROW
    if(req.body['Submit']){
        if(req.body.name == ''){
	        console.log('No name');
            return;
        };
	    mysql.pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)",  
        [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs], function(err, result){
            if(err){
                next(err);
                return;
            };
        });
        setTimeout(function(){displayTable(res, context)}, 250)
    };

    // EDIT ROW
    if(req.body['Edit']){
        var context = {};
	    context.id = req.body.id;     
	    res.render('edit',context);
    };

    // SUBMIT NEW EDIT
    if(req.body['Submit Edit']){
	    var context = {};
	    mysql.pool.query('SELECT * FROM workouts WHERE id=? ', [req.body.id], function(err, rows, fields){
            if(err){
                next(err);
                return;
            };
            context.row = rows;
	        mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ",
            [req.body.name || context.row[0].name, req.body.reps || context.row[0].reps, req.body.weight || context.row[0].weight, 
	        req.body.date || context.row[0].date, req.body.lbs || context.row[0].lbs, context.row[0].id], function(err, res){
	            if(err){
                    next(err);
                    return;
                };
            });
        });
	setTimeout(function(){displayTable(res, context)}, 250)
    };

    // DELETE ROW
    if(req.body['Delete']){
        var context = {};
	    mysql.pool.query('DELETE FROM workouts WHERE id=? ', [req.body.id], function(err, res){
	        if(err){
	            next(err);
		        return;
	        };    
	    });
        setTimeout(function(){displayTable(res, context)}, 250)
    };
});

app.get('/reset-table',function(req,res,next){
    var context = {};
    mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){  //replace your connection pool with the your variable containing the connection pool
        var createString = "CREATE TABLE workouts("+
        "id INT PRIMARY KEY AUTO_INCREMENT,"+
        "name VARCHAR(255) NOT NULL,"+
        "reps INT,"+
        "weight INT,"+
        "date DATE,"+
        "lbs BOOLEAN)";
        mysql.pool.query(createString, function(err){
        context.results = "Table reset";
        res.render('hw6',context);
        })
    });
});

app.use(function(req,res){
    res.status(404);
    res.render('404');
});
  
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});
  
app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
