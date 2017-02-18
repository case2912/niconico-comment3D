import "./regenerator";
import "grimoirejs/register";
import "grimoirejs-math/register";
import "grimoirejs-fundamental/register";
import "grimoirejs-text/register";
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
        this.node.setAttribute('rotation', 0 + ',' + this.phi + ',' + -14.3);
    },
});

gr.registerComponent("Reset", {
    $mount: function() {
        this.node.watch("positoin", (value) => {
            if (value.Y < -200) {
                const r = this.node.getComponent("RigidBody");
                r.World.remove(r.Body);
                this.node.remove();
            }
        });
    }
})

socket.on('connect', function() {
    console.log('connected!');
});
var data = {
    comment: null
};

socket.on('text', function(_data) {
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
        if (document.hasFocus()) {
            const n = scene.addChildByName("text", {
                text: data.comment,
                position: [Math.random() * 10 - 5, 10, Math.random() * 4 - 2],
                rotation: `0,${Math.random() * 90 - 45},0`,
                size: 2,
                font: "bold 18px 'ヒラギノ角ゴ'",
                material: "new(text-back)"
            });
            const scale = n.getAttribute("scale");
            n.addComponent("RigidBody");
        }
    });
});