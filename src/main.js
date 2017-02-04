var client = require('socket.io-client');
var socket = client.connect('http://localhost:3000');
var WatchJS = require("watchjs")
var watch = WatchJS.watch;

gr.registerComponent('Rotate', {
    attributes: {
        speed: {
            default: '1',
            converter: 'Number',
        },
    },
    $mount: function() {
        this.phi = 0;
    },
    $update: function() {
        this.phi += this.getAttribute('speed');
        this.node.setAttribute('rotation', 0 + ',' + this.phi + ',' + 0);
    },
});

socket.on('connect', function() {
    console.log('yea!!');
});
var data = {
    comment: null
};

socket.on('date', function(_data) {
    data.comment = _data;
    console.log(_data);
});

gr(function() {
    const $$ = gr("#main");
    const scene = $$("scene").single();
    const sphere = $$("#mesh").first();
    sphere.addComponent("Rotate", {
        speed: 0.2
    });
    watch(data, "comment", function() {
        const n = scene.addChildByName("text", {
            text: data.comment,
            position: [Math.random() * 3 - 2, 10, Math.random() * 3 - 2],
            rotation: `0,${Math.random()*360},0`,
            scale: "1",
        })
        n.addComponent("RigidBody");
    });
});