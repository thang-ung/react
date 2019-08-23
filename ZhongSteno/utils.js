export function axorray(L,R){
	
	let xor =L.slice(0)
		,acum ={};
	xor.push(...R)
	xor.forEach(v=>{
		if(acum[v])
			acum[v]++;
		else
			acum[v]=1;
	});
	xor =[];
	for(let k in acum){
		if(acum[k]===1) xor.push(k);
	}

	return xor;
}

export function elevate(io){
	if(!io) return io;
	var	va=[];
	for(var i=0,k=io.length; i<k; i++){
		va =va.concat(io[i]);
	}
	return va;
}


if(!Array.prototype.any){
	Object.defineProperty(Array.prototype, "any", {
		enumerable: false,
		value: function(fn){
			let vout;
			for(let v of this){
				if(vout =fn(v)) return vout;
			}
			return false;
		}
	});
}

if(!CSSStyleDeclaration.prototype.css){
	Object.defineProperty(CSSStyleDeclaration.prototype,"css"
		,{ enumerable: false,
		 value: function(props){
				for(let prop in props){
					if(props[prop] && props[prop].length)
						this.setProperty(prop, props[prop]);
					else
						this.removeProperty(prop);
				}
		 	}
		});
}

if(!Node.prototype.offsets){
	Object.defineProperty(Node.prototype,"offsets"
		,{ enumerable: false,
		 value: function(rootNode =document.body, inode={}){
			 	let nodes=[], xy ={top:0, left:0};
				if(inode.x && inode.y){
					nodes =document.elementsFromPoint(inode.x,inode.y);
					//remove non-offsetParent...
				}
				else{
					inode =this;
					while(nodes.push(inode))
						if( inode ===rootNode
						 || !(inode =inode.offsetParent)) break;
				}

				for(let node of nodes){
					if(node ===rootNode) break;
					xy.top += node.offsetTop;
					xy.left += node.offsetLeft;
				}

				return xy;
		 	}
		});
}

export function ints(o){
	let ret ={}
	for(let k in o){
		if(typeof(o[k])==="number" || parseInt(o[k]))
			ret[k] =o[k];
	}
	return ret;
}