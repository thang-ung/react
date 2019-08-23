import React from "react";
import {Zhong} from "./czhong"
import LangContext from "./langContext"
import HotChars from "./hotchars";
import Thumbs from "./thumbs"
import Tile, {TinyTile} from "./tile";
import Draggable from 'react-draggable';
import parakeys, {mkParakeys} from "./parakeys";
import ZhongPalette from "./zhongPalette";
import {xorray, elevate} from "./utils";

import "../css/common.css";
import "../css/jstd.css";
import "../css/zhosteno.css";

let $ =require("jquery");

function Palette(props){
	return(<span className="nauto ellipser">{props.palette}</span>);
}

export default class ZhongSteno extends React.Component{
	static contextType =LangContext;

	constructor(props){
		super(props);
		this.uponGlyph = props.uponGlyph || (()=>0);
		this.page =[];

		this.state ={
				wheeling:false
				,paged: []
				,invertShiftScroll : props.invertShiftScroll || true
				,show:0
				,cheek: null
				,tweets: []
				,whime: []
				,tx: props.tx
			};
		this.options ={
				tileLimit :props.tileLimit || 106
				,uponGlyph: props.uponGlyph || (()=>0)
				,donce: props.donce || (()=>0)
			};
		this.bench =React.createRef();
		this.thumbvue =React.createRef();
		this.hotChars =React.createRef();
		this.palette =React.createRef();

		this.dragOver = this.dragOver.bind(this);
		this.drop = this.drop.bind(this);
		this.whereAt =this.whereAt.bind(this);

		this.post = this.post.bind(this);
		this.onup = this.onup.bind(this);
		this.onfocus = this.onfocus.bind(this);
		this.mouseMove = this.mouseMove.bind(this);
		this.onNavigate =this.onNavigate.bind(this)
		this.mkParakeys =mkParakeys.bind(this);
	}


	mkTiles(isRadical, tiles, birds, glyat){
		const rgxp =/^(.*?)(~)*([0-9]+)*$/ug;
		let canvi =[], y;
		let wo =this;
		let entertile =function(event){
			let $bench =wo.$bench
				, tile =$(this).find('.jump').addBack('.jump')[0];
				//Array.from(this.classList).any((v)=>["jump","qu"].indexOf(v)>=0)
				//!([].every((v)=>["jump","qu"].indexOf(v) ===-1))

				$bench.find('[data-jump]').removeAttr('data-jump');
				tile.parentNode.setAttribute('data-jump','up');

				$bench[0].setAttribute('data-jump', $(event.target).text());
				if(isRadical
				 && (!wo.thumbvue.current.root || wo.thumbvue.current.root !==tile))
				 	setTimeout(()=>{
						let points =document.elementsFromPoint(wo.context.moxy.x, wo.context.moxy.y).filter(v=>v===tile || v.classList.contains("qu"));
						if(points.length && points[0] ===tile)
							wo.thumbvue.current.setState({
								ch: tile.textContent.charAt(0)
								,root: tile});
//						else
					 }, 200);
				else if(wo.thumbvue.current.isBusy && isRadical){
					setTimeout(()=>{
						let points =document.elementsFromPoint(wo.context.moxy.x, wo.context.moxy.y).filter(v=>v===tile);
						if(points.length===0)
							wo.thumbvue.current.setState({ch: null,root: null});
					 }, 200);
				}
			};
		for(var k in tiles){
			if( tiles[k] ==='stop') break;
			let children =[];

			for(let haizi of tiles[k]){
				rgxp.lastIndex =0;
				let tx =rgxp.exec(haizi);
/*
				let $dv=(<div class="jump" name={tx[3] || hn}
						data-derived={tx[2] ? 1:null}>{tx[1]}</div>);

				let $tile =(<div onMouseEnter={entertile}
							data-strokes={children.length ? null:hn}>{$dv}
						</div>);
*/
				let $tile =(<Tile name={tx[3] || k} derived={tx[2]}
					key={tx[1]} id={parseInt(escape(tx[1].charAt(0)).substr(2))}
					jump={tx[1]===glyat}
					enterTile={entertile} literal={tx[1]}
					strokes={children.length ? null:k}/>);

				if((y =this.context.hots[tx[1].charAt(0)]) && (y>0 || isRadical)){
					birds.push( $tile );
				}
				else
					children.push($tile);
			}

//					  data-scroll={tiles[k+1]==="stop" ? "stop":null}
//			if(children.length){
				let $dva =(<span data-strokes={k} key={k}
					  className={isRadical ? 'radical':'steno'}
					  >
						{children}
					</span>);
				canvi.push($dva);
//			}
		}
		let boolStop =tiles[k]==="stop";
		this.state.spanStrokes =(isRadical ? ''
				: '（'+	$(this.state.src).parent().attr('n') +'）\t')+
					(Object.keys(tiles)[0])+'..\t'
				+(boolStop ? (k-1): k+'●●');
		return [canvi, boolStop ? "stop":null, parseInt(k)];
	}//end mkTiless

	whimpets(palette, nlimit=3){
		let whims =[];
		if(this.state.src.length && this.state.src[0].tagName !=="w"
		 && this.context.qu){
			for(let spani of palette){
				let $leaf =spani.props.children.filter(x=>!x.props.derived);
				for(let laf of $leaf){
					if(laf.props.literal.length > 1) continue;
					let k =laf.props.name;
					let lef =this.context.qu[k];
					if(lef)
//						whims.push(...lef.slice(1,nlimit));
						whims.push(...lef.slice(1, nlimit)
							.map((val,n)=>
								(<TinyTile key={val} name={k}
									 literal={val}
									 //post={this.post}
									 tip="1" void="0" derived="2"
									 className="jump"/>
						)));
				}
			}
//			return whims.map((val,n)=>{
//				return(<TinyTile key={val} literal={val} tip="1" void="0" class="jump nonradic"/>);
//				});
			return whims;
		}
		else return [];
	}//end whimpets

	wireJump(isRadical){
		let io =this
			,$bench =this.$bench
			,$parakeys =$bench.find('#parakeys.once .jump')
			,buttonoffset =2;

		$bench.find('.jump').add($parakeys).parent('div').addBack('[void="0"]')
			.on('mousedown', function(event){
				if($(this).hasClass('parakey')){
					let $parakey =$(this).find('.jump');
					io.post()(event, $parakey.data('value') || $parakey.data('mousedown'));
					return Tile.stopPropagation(event.originalEvent);
				}

				else if((buttonoffset+event.which)%4 ===3 || $(this).hasClass('nonradic') || !isRadical){
					io.post()(event);
				}
//				else if(event.which ==1)
//					io.mkThumbs(0);
				else{
					if( io.histscro )
						io.state.paged.push({"dsrc" :io.state.src,
								"nstrokes": parseInt($bench.find('span[data-strokes]').first().attr('data-strokes')) -1});

					let $target =$(this);
					var rglyph =new RegExp('[' +$target.text().replace(/^([^ ]+)(.*?([^ ,\.\t:\[\(\)\]]).*|.*)$/gu,'$3$1')+ ']', 'gu'),
						idx =parseInt($target.find('[data-derived]').addBack('[data-derived]').attr('name') || -1);
					io.setState({show:0
						, src:$(io.context.strokes).find('entry[radical]')
						.filter((n,x)=> rglyph.test($(x).attr('radical')) || n ===idx )
						.first().children().get()});
				}
				Tile.stopPropagation(event);
			})
			.on('contextmenu', function(evt){
				evt.preventDefault();
				evt.stopPropagation();
				return false;
			});
		this.$bench.find('#parakeys').removeClass('once');
	}//end wireJump

	post($target,r){
		let sr =window.getSelection()
		return (event, spoon)=>{
				if(!sr.focusNode && !this.state.tx){
					return;
				}
				let txVal =""
					,boolTx =["text","textarea"].indexOf(document.activeElement.type) >=0;

				if(spoon instanceof RegExp){
					txVal =sr.toString().replace(/^(.+)$/su, spoon.source)
					if( txVal.length ===0 ) return;
				}
				else if(typeof(spoon) =='function'){
					txVal =spoon(this, sr);
				}
				else if(typeof(spoon)==="string"){
					txVal =spoon;
				}
				else{
					txVal =event.target.textContent.charAt(0) || "";
					this.context.rank(txVal, $(this.state.src[0]).parent());
				}

				if( txVal.length ===0 );
				else if(boolTx && document.activeElement.setRangeText){
					let tx =document.activeElement;
					tx.blur();
					tx.setRangeText(txVal);
					tx.selectionStart += txVal.length;
					tx.focus();
				}

				else if(sr.focusNode && $(sr.focusNode).parents().filter((i,x)=>x===this.bench.current).length===0){
					let rtxt =document.createRange()
						,etxt =document.createTextNode(txVal)
						,spot =$("<mark fore/>").attr("data-content", txVal)[0];

					sr.deleteFromDocument();
					sr.getRangeAt(0).insertNode(etxt);
					sr.getRangeAt(0).insertNode(spot);

					rtxt.selectNodeContents(etxt);
					sr.empty();
					sr.addRange(rtxt);
					rtxt.setStart(etxt, txVal.length);

					//console.log($(etxt).position());
					this.state.tx =etxt;

					setTimeout(()=>{
						spot.remove();
						}, 200);
				}
				else if(!this.state.tx);
				else if(this.state.tx.nodeName === "#text"){
					let rtxt =document.createRange()
						,ltxt =document.createRange()
						,etxt =document.createTextNode(txVal)
						,spot =$("<mark fore/>").attr("data-content", txVal)[0];

					ltxt.selectNodeContents(this.state.tx);
					ltxt.setStart(this.state.tx, this.state.tx.data.length);

					sr.empty();
					sr.addRange(ltxt);
					sr.getRangeAt(0).insertNode(etxt);
					sr.getRangeAt(0).insertNode(spot);
					rtxt.selectNodeContents(etxt);
					sr.empty();
					sr.addRange(rtxt);
					rtxt.setStart(etxt, txVal.length);

					setTimeout(()=>{
						spot.remove();
						}, 200);
				}
				else{
					let tx =this.state.tx;
					this.setState({tx:null});
					tx.blur();
					tx.setRangeText(txVal);
					tx.selectionStart += txVal.length;
					tx.focus();
				}
				return Tile.stopPropagation(event);
			};
	}//end post

	get parakeys(){
		return this.context.parakeys
			|| this.state.parakeys
			|| {};
	}
	get invertShiftScroll(){
		return this.state.invertShiftScroll;
	}
	get trackpad(){
		if(this.parakeys.trackpad)
			return this.parakeys.trackpad.filter(':checked').val() || 1;
		else
			return 1;
	}
	get histscro(){
		if(typeof(this.parakeys.histscro) =="undefined"){
			return true;
		}
		else
			return $(this.parakeys.histscro).is(':not(:checked)');
	}

	get $bench(){
		return $(this.bench.current);
	}

	static stopPropagation(event){
		event.returnValue =false;
		event.stopImmediatePropagation();
		event.preventDefault();
		event.stopPropagation();
		return false;
	}

	onOpen(){
		var buttons =0
			,wo =this;
		$(document).on('mousedown', async (evt)=>{
				let $bench =wo.$bench;
				if((buttons =evt.buttons&7) >=3 && !evt.shiftKey){
					let event =evt.originalEvent;
					if($bench.is(":empty"))
						$bench.removeClass("hidden");
					else if($bench.toggleClass('hidden').hasClass('hidden'))
						return evt.shiftKey || false;	//shift key will enable autoscroll

					let coords ={"left":event.x -(Math.floor(this.$bench.width() /2))
								,"top":event.y -40};
					if(coords.left < 0) coords.left =0;

					$bench.css(coords);
					if($bench.is(":empty") || !$bench.children('.ellipser').length){
						await this.context.shelves();
						//this.setState({show:0});
						this.forceUpdate();
						this.options.donce();
					}
					else
						return false;
					event.preventDefault();
					event.stopPropagation();

				}//end middle click

				setTimeout(()=>buttons=0,10);
				return true;
			})
			.on('contextmenu',(evt)=>{
				if((buttons || evt.originalEvent.buttons) &1){
					evt.originalEvent.preventDefault();
					evt.originalEvent.stopPropagation();
					return false;
				}
			});
//		this.gestureListen();
	}//end onOpen

	static tmr =0;

	onNavigate(){
		$('html')[0].addEventListener('wheel', async (event)=>{
			const bigwheel =-430;
			var delta =this.trackpad*event.wheelDeltaY || event.wheelDelta;
			var $bench =this.$bench;
			if($bench.is(':hidden') || this.state.wheeling){
				return;
			}
			//event.target is off on android tablet
			var onrad =parseInt($bench.find('span.radical').first().data('strokes') || 0)
				, inzho =this.state.wheeling || document.elementsFromPoint(event.x, event.y).filter((v)=> v ===$bench[0]).length;
			try{
				if(delta < 0 && this.state.paged.length ===0 && onrad)
					return false;
				else if(delta < bigwheel && Math.max(delta, this.state.wheeling) > bigwheel){	//huge unwind... goes to base
					console.log(this.state.wheeling +'>'+ delta);
					this.state.paged.length =0;
					inzho =1;
				}
				else if(this.state.wheeling || Math.abs(delta) <90){
					return false;
				}
				else console.log(delta);
			}
			finally{
				if(inzho){	//wheel inside bench will not scroll container, e.g., body
					event.returnValue =false;
					event.stopImmediatePropagation();
					event.preventDefault();
				}

				setTimeout(()=>{
					if(this.thumbvue.current)this.thumbvue.current.setState({ch:null})
				}, 0);	//clear fave dialog
			}//end try

			this.setState({wheeling: delta});
			let banDescend =$bench.is('.flat')
				,whilst =new Promise((resolve) =>{
					if(banDescend)
						clearTimeout(ZhongSteno.tmr);
					else
						$bench.addClass('flat');

					try{
						if(delta >0){
							let $ele =inzho ? $(document.elementFromPoint(event.x, event.y)).children('.jump:not([tip])').addBack('.jump').first() :[];

							if(!banDescend && $ele.length && event.shiftKey !==this.invertShiftScroll
							 && $bench.has('.radical').length ){
								onrad =0;
								if($ele.parent('div[data-jump]').addBack("[name]").length){
									$ele.mousedown();
								}
								else
									$bench.find('div[data-jump] > .jump').first().mousedown();
							}
							else if(!$bench.is('[data-scroll="stop"]') ){
								if( $bench.children().length
								 && this.histscro ){
									this.state.paged.push({"dsrc" :this.state.src,
											"nstrokes": parseInt($bench.find('span[data-strokes]').first().attr('data-strokes')) -1});
								}
								let pi=parseInt($bench.find('span[data-strokes]').last().data('strokes'));
								this.setState({show:pi});
							}
						}else if(event.shiftKey	//load base state
						  || this.state.paged.length ===0
						  || (event.buttons & 2) ===2){
							this.state.paged.length =0;
							this.setState({show:0, src: null});
							onrad =true;
						}else{
							let prior =this.state.paged.pop();
							onrad =prior.dsrc[0].radical;
							this.setState({show:prior.nstrokes,
								src: prior.dsrc});
						}
					}
					catch(err){
						console.log(err);
					}
					finally{
						setTimeout(resolve, $(this.parakeys.fastscro).is(':checked') ? 0: 100);
					}//end try

				});//end promise
			await whilst;
			this.setState({wheeling:0});
			if(onrad)
				ZhongSteno.tmr =setTimeout(()=>$bench.removeClass('flat',200), 500);
			else
				$bench.removeClass('flat');

			return false;
		}, {passive:false});
	}//end onNavigate

	mouseMove(event){
		let tile;
	
		this.context.moxy ={x:event.nativeEvent.x,y:event.nativeEvent.y};
		if(this.thumbvue.current.isBusy);
		else if((tile =document.elementFromPoint(event.nativeEvent.x, event.nativeEvent.y)).matches(".jump")
		 && tile.parentNode.matches("[data-jump='up']")){
			let evme =new MouseEvent('mouseenter',this.context.moxy);
			tile.parentNode.dispatchEvent(evme);
		 }
		 else if(!this.bench.current.matches("[israd]"));
		 else if(tile= this.bench.current.querySelector('[data-jump="up"]')){
			 tile.removeAttribute("data-jump");
		 }
	}//end mousemove

	mk(nstrokes, src, glyat){
		var ender, strokes
			,tiles =[]
			,birds =[];
		this.state.src= src =src || this.state.src;
		src =src.filter(x => parseInt(x.n || $(x).attr('n') ||1000) > nstrokes);
		if(!src.length){
			src =this.state.src.slice();	//new copy
		}
		let isRadical =(src instanceof Array && src.length && src[0].radical) || false;

		nstrokes =(nstrokes || parseInt(this.$bench.find('span[data-strokes]').first().data('strokes')) || 1);

		tiles =Zhong.pageOn(src, this.options.tileLimit, isRadical);

		[tiles, ender, strokes] =this.mkTiles(isRadical, tiles, birds, glyat);
		//this.state.tweets.length =0;
		this.state.tweets =birds;
		return [tiles, ender, strokes];
	}//end mk

	whereAt(glyph){
		let c
			, bench =this.bench.current
			, tile =bench.querySelector('[data-jump="up"]');

		try{
			if(window.getComputedStyle(bench).display ==='none'
			|| (c =glyph.replace(/^[ \t\r\n,-]*/u, '').charAt(0)).length ==0);

			else if( tile !==null && tile.textContent.indexOf(c) >=0 ){
				console.log('knack');
			}


			//is in current range
			else if( bench.textContent.indexOf(c) >=0 ){
				Array.from(bench.querySelectorAll('.jump'))
					.filter((v)=>v.textContent.indexOf(c) !==-1)
					.forEach(v=> v.parentNode.setAttribute('data-jump','up'));
			}
			else{
				let node =Zhong.glyphRootNodeEx(c);
				if(node instanceof Node){
					let k =node.getAttribute("n") -1;
					this.setState({show:k, src: Array.from(node.parentNode.children), cheek:c});
					this.forceUpdate();
				}
				else{
					window.alert(c +": not found.");
				}
			}

		}
		catch(err){
			console.log(tile);
		}
	}//end whereAt

	componentWillMount(){
		this.context.moxy ={x:0,y:0};
		this.state.parakeys =this.mkParakeys(parakeys, {ghoul:this.palette});
	}

	componentDidMount(){
		this.bench.current.classList.add("hidden");
		this.onOpen();
		this.onNavigate();

		var cfgObserve = {
//				subtree: true,
				attributeFilter: ['data-jump']
			};
			
		var observer = new MutationObserver((muti)=>{
			let muta;
			if((muta =muti[muti.length-1]).attributeName ==='data-jump'){
				this.uponGlyph(muta.target.getAttribute('data-jump'));
			}
		});
		observer.observe(this.bench.current, cfgObserve);
		this.componentDidUpdate();
	}
	componentDidUpdate(){
		this.wireJump(this.state.src.length && this.state.src[0].tagName !=="w");
//		flexbug.resizeFlexColumn($('#ligan'));
//		this.hotChars.current.setState({tiles:this.state.tweets});
		if(this.thumbvue.current) this.thumbvue.current.setState({ch:null});
	}
	componentWillReceiveProps(nextProps){
//		this.hotChars.current.setState();
//		this.setState({show:nextProps.show, src:nextProps.src});
//		console.log('rxprop');
	}

	collateTiles(intiles){
		let tiles =[], ligans =[];
		(intiles || [])
		.forEach(v => {
			let tip =this.context.hots[v.props.literal.charAt(0)];
			switch(parseInt(tip <0 ? -1: (tip || 0))){
			case -1:
				ligans.push(React.cloneElement(v, {tip:tip, class:"ligan"
				  ,literal:v.props.literal.charAt(0)}));
				break;
			case 1:
				tiles.push(v);
				break;
			default:
				tiles.push(React.cloneElement(v, {tip:tip}));
				break;
			}
		});
		ligans =ligans.sort((r,l) => l.props.tip -r.props.tip);
		tiles =tiles.sort((l,r) => (r.props.tip || 1) -(l.props.tip || 1));

		return [this.context.chots, this.context.ligani]=[tiles,ligans];
	}

	onfocus(evt){
//		console.log(document.activeElement.type);
		if(["text","textarea"].indexOf(document.activeElement.type) >=0)
			this.state.tx =document.activeElement;

		//return Thumbs.stopPropagation(evt.nativeEvent);
	}

	onup(evt){
		if(this.state.tx){
			setTimeout(() => {
				this.state.tx.focus();
				this.state.tx =null;
			}, 50);
		}
	}

	dragOver(evt){
		evt.nativeEvent.dataTransfer.dropEffect ='copy';
		let event =evt.nativeEvent;
		event.preventDefault();
		event.stopPropagation();
	}
	drop(evt){
		this.whereAt(evt.nativeEvent.dataTransfer.getData("text/plain"));
		let event =evt.nativeEvent;
		event.preventDefault();
		event.stopPropagation();
	}

	render(){
		//throw {err:"!!!!"};

		let [palette, isstopped, strokes] =this.mk(this.state.show, this.state.src || elevate(this.context.radicals), this.state.cheek);
		this.state.cheek =null;	//clear

		this.state.whims =this.whimpets(palette);
		if(this.hotChars.current){
			this.hotChars.current.setState({tiles:this.state.tweets
					,whims:this.state.whims});
		}
		let isRadical =(this.state.src instanceof Array && this.state.src.length && this.state.src[0].radical) ? 1: null;

		return(
			<Draggable opaciti="0.35" cancel="div.jump">
			<div id="zhong" ref={this.bench}
				className={"nil-darkreader" +(strokes<4 ? " fit-small": strokes<7 ? " fit-medium" :"")}
				onDragOver={this.dragOver}
				onDrop={this.drop}
				onPointerDown={this.onfocus}
//				onPointerUp={this.onup}
				onMouseMove={this.mouseMove}
				data-strokes={this.state.spanStrokes ||''}
				data-scroll={isstopped} israd={isRadical}>
			{this.context.qu && <React.Fragment>
				<Thumbs ref={this.thumbvue} post={this.post}/>
				<HotChars ref={this.hotChars}
				  tiles={this.state.tweets} whims={this.state.whims}/>
				{this.state.parakeys}
				<ZhongPalette palette={palette} ref={this.palette}
					key={(isRadical ? "1":this.state.src[0].parentNode.getAttribute("radical"))+strokes.toString()}/>
			</React.Fragment>}
			</div>
			</Draggable>
		);
	}//end render

	componentWillUnmount(){
		this.state.paged =this.state.tweets =this.state.src =[];
	}
}
