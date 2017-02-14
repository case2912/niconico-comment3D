export default class CommentManager {
    constructor() {
        this.comments = [];
        this.waitZ = 1000;
        this.scene = gr("#main")("scene").single();
    }
    register(max) {
        for (var i = 0; i < max; i++) {
            this.addText(i);
        }
    }
    addText(order) {
        const n = this.scene.addChildByName("mesh", {
            color: "green",
            geometry:"cube",
            position: [0, 0, this.waitZ + 100 * order],
        });
        const rigid = n.getComponent("RigidBody");
        n.addComponent("Reset");
        n.on("reset", (i) => {
            n.setAttribute("position", [0, 0, this.waitZ + 100 * order]);
            n.setAttribute("rotation", "0,0,0");
            const rigid = n.getComponent("RigidBody");
            n.removeComponent(rigid);
        });
        this.comments.push(n);
    }
    set(comment) {
        for (var i = 0; i < this.comments.length; i++) {
            const target = this.comments[i];
            const targetPos = target.getAttribute("position");
            if (targetPos.Z >= this.waitZ) {
                target.setAttribute("position", [Math.random() * 3 - 2, 10, Math.random() * 3 - 2]);
                // target.setAttribute("rotation", `0,${Math.random()*360},0`);
                target.setAttribute("text", comment);
                target.addComponent("RigidBody");
                break;
            } else if (i === this.comments.length - 1) {
                return;
            }
        }

    }
}