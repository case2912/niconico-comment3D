// var client = require('socket.io-client');
// var socket = client.connect('http://localhost:3000');
// var WatchJS = require("watchjs")
// var watch = WatchJS.watch;
//
// import CommentManager from './commentManager'
// gr.registerComponent('Rotate', {
//     attributes: {
//         speed: {
//             default: '1',
//             converter: 'Number',
//         },
//     },
//     $mount: function() {
//         this.phi = 0;
//     },
//     $update: function() {
//         this.phi += this.getAttribute('speed');
//         this.node.setAttribute('rotation', 0 + ',' + this.phi + ',' + 0);
//     },
// });
//
// gr.registerComponent("Reset", {
//     $update: function() {
//         const pos = this.node.getAttribute("position");
//         if (pos.Y < -100) {
//           console.log(2);
//             this.node.emit("reset", this.node);
//         }
//     }
// });
//
// socket.on('connect', function() {
//     console.log('connected!');
// });
// var data = {
//     comment: null
// };
//
// socket.on('text', function(_data) {
//     data.comment = _data;
//     console.log(_data);
// });
//
// gr(function() {
//     const $$ = gr("#main");
//     const scene = $$("scene").single();
//     const sphere = $$("#mesh").first();
//
//     const commentManager = new CommentManager();
//     commentManager.register(10);
//     sphere.addComponent("Rotate", {
//         speed: 0.2
//     });
//     watch(data, "comment", function() {
//         // if (document.hasFocus()) {
//         commentManager.set(data.comment);
//         // }
//     });
// });

gr(function() {
    const $$ = gr("#main");
    const node = $$("#target").single();
    const r = node.getComponent("RigidBody");
    setTimeout(function() {
        r.sleep();
        node.setAttribute("position", [0, 3, 0]);
        console.log(r.Body.sleepState === 2);
    }, 8000);
    setTimeout(function() {
        r.wakeUp();
        console.log(r.Body.sleepState);
    }, 12000);
});