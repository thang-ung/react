import React from 'react';
import LangContext from "./langContext"
import Tile, {TinyTile} from "./tile";
import {axorray, ints} from "./utils";

const $ =require("jquery");
const peekcount =27, peekmax =33;


export default class Thumbs extends React.Component{
	static contextType =LangContext;

	constructor(props){
		super(props);
		this.qu =props.qu;
		this.state ={
			 ch: props.ch || ''
			,classes: "bucket zhongwen-void climid maskout"
			,above: props.above || 0	//placement of thumbs
			,root: props.root
			,msdelays: props.msdelays || 2000
			,post: props.post || (()=>0)
			};
		this.thumvue =React.createRef();
		this.mouseMove = this.mouseMove.bind(this);
		this.mouseBtn = this.mouseBtn.bind(this);
		this.delayedOff =this.delayedOff.bind(this);
		this.steadyOn =this.steadyOn.bind(this);
		this.tmrOff =0;
	}//end ctor

	componentDidMount(){
		this.onEvents();
		this.componentDidUpdate();
	}
	componentDidUpdate(){
		let $this =this.thumvue.current
			, lu =$this.querySelectorAll('.qu')
			, glyph =this.state.root
			, bench =$this.parentNode;
		if(lu.length ===0 || !glyph) return;

		let coord =window.getComputedStyle(glyph)
			, xy =glyph.offsets(bench)
			//, frame =$bench.offset()
			, h =glyph.offsetHeight
			, x =xy.left +(glyph.offsetWidth/2)  -Math.floor($this.offsetWidth /3)
			, y =((bench.clientHeight -(h*1.2)-xy.top)) +(this.state.above ? 22:-23);

		$this.style.css({left: x+'px', bottom: y+'px'});

		setTimeout(()=>{
//			let evml =new MouseEvent('mouseleave', this.context.moxy);
//			evml.simulated =true;
//			$this.dispatchEvent(evml);
//			this.delayedOff();

			let thumhi =lu[0].clientHeight;
			let topties =Array.from(lu).filter(tile=>Math.floor(tile.offsetTop) <thumhi);

			if(lu[topties.length]){
				try{
					lu[topties.length-1].classList.add('top-ends')

					let tall =parseFloat($this.offsetHeight)
						, ny =y +(thumhi*.9) -tall;
					$this.style.bottom= ny+'px';
				}
				catch{
					console.log([h,x,y])
				}
			}

			setTimeout(()=>$this.classList.remove('maskout'), 10);

		},10);

	}//end composeWillUpdate

	componentWillReceiveProps(nextProps) {
		this.setState({ root: nextProps.root });
	}

	handleChange(glyph){
		this.setState({
			ch: glyph.charAt(0)
		});
	}

	get root(){
		return this.state.root;
	}

	get isBusy(){
		return(this.state.ch && this.state.ch.length);
	}

	mouseBtn(event){
		return this.state.post()(event.nativeEvent);
	}

	mouseMove(event){
		let xy = this.context.moxy ={x:event.nativeEvent.x,y:event.nativeEvent.y}
			,$this =this.thumvue.current
			,root =this.state.root;
		let $jump =document.elementsFromPoint(xy.x,xy.y).any((v)=>v.matches('.qu, .jump') ? v: 0);
		let jmp =$jump;

		try{
			if(!$jump)	return;

			else if($jump.classList.contains('qu')){
				$this.classList.remove('limbo',50);
				$jump =root ? root.matches(':not([data-jump])').parentNode : null;
			}
			else if(!root || $jump !==root)
				$jump =$jump.parentNode;
			else	return;
		}
		finally{
			if(jmp && !jmp.classList.contains('qu'))
				$this.classList.add('limbo',100);
		}

		if($jump){
			//console.log($jump);
			const evme =new MouseEvent("mouseenter",  Object.assign(xy,
						{which:0
						,screenX: xy.x
						,screenY: xy.y
						,clientX: xy.x
						,clientY: xy.y}));
			//let evme =$.Event('mouseout', Object.assign(xy, {which:0}) );
			evme.data ={bits:256};
			//$jump.trigger(evme, {flags:256});
			$jump.dispatchEvent(evme);
		}
}

	onEvents(){
/*		let tmThumb =0;

		this.thumvue.current.addEventListener('wheel', (evt)=>{
				if(evt.wheelDelta < 0){
					//this.mkThumbs(0);$thumbview.addClass('ghoul')
					if(tmThumb ===0)
						tmThumb =setTimeout(()=>this.setState({"x":0}), 200);
					return Tile.stopPropagation(evt);
				}
			}
			,{passive:false});
*/
		$(this.thumvue.current)
		.on('mousedown',(evt)=>{
			let $jump =$(document.elementsFromPoint(evt.originalEvent.x,evt.originalEvent.y)).filter('.qu, .jump').first().filter(':not(.qu)');
			try{
				if( $(evt.target).is('.qu') );
				else if(evt.buttons ===4 || !$jump.length){
					this.setState({ch:''});
				}
				else{
					let evme =$.Event('mousedown', this.context.moxy);
					$jump.trigger(evme);
				}
			}
			finally{
				return Tile.stopPropagation(evt.originalEvent);
			}
		})
		.on('contextmenu',(evt)=>{
			return Tile.stopPropagation(evt.originalEvent);
		})
	}
	delayedOff(){
		this.tmrOff =setTimeout(()=>{
			if( this.state.root === document.elementFromPoint(this.context.moxy.x, this.context.moxy.y))
				this.delayedOff();
			else
				this.setState({ch:null});
		}, this.state.msdelays);
	}
	steadyOn(){
		clearTimeout(this.tmrOff);
	}

	render(){
		let lu =[], qu =[];
		if(!this.state.ch){
			this.state.root =null;
		}
		else if(this.context.pinheads){
			let root =this.state.root;
			let k =parseInt((root && root.getAttribute('name')) 
				|| this.context.iGlyph(this.state.ch));
			if($.isNumeric(k) && k >= 0 && this.context.pinheads[k])
				qu =this.context.pinheads[k].slice(1, Math.min(peekmax, Math.max(this.context.pinheads[k][0], peekcount)))//.reverse()
		}
		else if(this.state.ch) qu.push(this.state.ch);

		qu.sort((l,r)=>l===this.state.ch ? -1:0)
			.forEach((g,i)=>{
				lu.push(<TinyTile key={g} className={(g===this.state.ch ? 'rid ':'')+'qu'}
					post={this.state.post}
//					onMouseDown={this.mouseBtn} onContextMenu={Tile.stopPropagation}
					literal={g}/>);
//				lu.push(<div key={g} class={(g===this.state.ch ? 'rid ':'')+'qu'}>{g}</div>);
			});

		return(<div id="qu" className={this.state.classes}
			ref={this.thumvue} key={this.state.ch}
			onMouseEnter={()=>clearTimeout(this.tmrOff)}
			onMouseLeave={this.delayedOff}
			onMouseMove={this.mouseMove}>{lu}</div>);
	}//end render
}