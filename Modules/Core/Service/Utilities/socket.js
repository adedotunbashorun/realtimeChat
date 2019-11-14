exports.notification = io => {
    io.on("connection", function(socket) {

        socket.on("user_join", function(data) {
            this.username = data;
            socket.broadcast.emit("user_join", data);
        });
    
        socket.on("chat_message", function(data) {
            data.username = this.username;
            socket.broadcast.emit("chat_message", data);
        });
    
        socket.on("disconnect", function(data) {
            socket.broadcast.emit("user_leave", this.username);
        });

        socket.on("new_user", (data) => {
            socket.broadcast.emit("new_user", data);
        })
    });
}

