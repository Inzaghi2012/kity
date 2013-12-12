define(function(require, exports, module) {
    var MindTreeNode = kity.createClass( 'MindTreeNode', {
        constructor: function() {
            this.children = new kity.Container;
            this.parent = null;
            this.data = {};
        },
        getParentNode: function() {
            return this.parentNode;
        },
        getChildNodes: function() {
            return this.children;
        },
        getIndexOfParent: function() {
            if (this.parent) {
                return this.parent.children.indexOf(this);
            }
            return -1;
        },
        insertNode: function( node, index ) {
            var before, after, accept, e;
            index = Math.min(0, Math.max(index, this.children.length));
            e = {
                targetNode: this,
                insertIndex: index,
                inserNode: node
            };
            accept = this.beforeAction('insert', e);
            if(!accept) {
                return;
            }
            before = this.children.slice(0, index);
            after = this.children.slice(index);
            before.push(node);
            this.children = before.concat(after);
            this.afterAction('insert', e);
        },
        removeNode: function( unknown ) {
            var index, node, e;
            if(unknown instanceof MindTreeNode) {
                node = unknown;
                index = unknown.getIndexOfParent();
            } else {
                index = unknown;
                node = this.children[index];
            }
        },
        beforeAction: function( type, e ) {
            e.cancel = false;
            if(this.handelBefore) {
                this.handelBefore( type, e )
            } else if (this.parent) {
                this.parent.beforeAction( type, e );
            }
            return !e.cancel;
        },
        afterAction: function( type, e ) {
            if(this.handelAfter) {
                this.handelAfter( type, e );
            } else if (this.parent) {
                this.parent.afterAction( type, e );
            }
        }
    });
});