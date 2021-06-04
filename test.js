var req = new XMLHttpRequest();
req.open('GET', 'http://flip3.engr.oregonstate.edu:5654/', true);

req.setRequestHeader('Content-Type', 'application/json');
req.addEventListener('load', function(){  // Listener that waits for the request to complete
    if(req.status >= 200 && req.status < 400){
        console.log(JSON.parse(req.responseText).data)
    }else{
        console.log("Error in network request: " + req.statusText);
    }
});
req.send(null);
event.preventDefault();