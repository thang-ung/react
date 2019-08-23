////import axios from "axios"
/*
requirejs.config({
	//			enforceDefine: true,
				paths:{
					jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min'
					,jqueryui: 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min'
				}
			});
module.exports = {
	//...
	externals: {
		jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min'
	}
	};
*/
var $ =require("jquery");
//var XMLParser = require('react-xml-parser');
var XMLParser = require('xmldom-qsa').DOMParser;
const peekcount =27, peekmax =33;
const xmroot =process.env.REACT_APP_XML_FOLDER  || "./";

export class Zhong{
	constructor(){
		this._hots ={};
		this.className ={};

		Zhong.setGlyphs();
		Zhong.rxBellish(this);
		this.rx();
	}//end constructor

	static textOf(ta){
		if(typeof(ta)==='string' || ta instanceof String)
			return ta;
		else if($(ta).is('textarea,input,select') )
			return $(ta).val();
		else
			return $(ta).text();
	}//end textOf

	static setGlyphs(refresh =false){
		if(refresh);
		else if(Zhong.radicals && Zhong.radicals.length) return;
		let xmparse =new XMLParser();

		fetch(xmroot +'xml/jungpk-x.xml')
			.then(response => response.text())
//			.then(response => xmparse.parseFromString(response, 'text/xml'))
			.then(response =>$.parseXML(response))
			.then((dxml) => {
					Zhong.strokes =dxml.documentElement;
/*					let xpand =zhong.strokes.querySelectorAll('w:not([uend])');
					xpand.forEach((stro,i)=>{
						let	a =parseInt(stro.getAttribute('zi'));
						if(!isNaN(a))
							stro.setAttribute('zi', unescape('%u'+a.toString(16)));
					});
*/
					let xpand =Zhong.strokes.querySelectorAll('w[uend]');
					xpand.forEach((stro,i)=>{
						let	a =parseInt(stro.getAttribute('zi'))
							,z =parseInt(stro.getAttribute('uend'))
							,simpl =stro.getAttribute('alt')
							,n =stro.getAttribute('n')
							,lbl =[];

						for(; a <= z; a++)
							lbl.push( $('<w>')
								.attr({'n': n
									,'zi': unescape('%u'+a.toString(16))
									,'alt':simpl}) );
						console.log(lbl.length);
						$(stro).replaceWith(lbl);
					});

				}
			)
			.catch((err)=>{
				console.log(err);
			});

		fetch(xmroot +'xml/jungrads.xml')
			.then(response => response.text())
			.then(response =>$.parseXML(response))
//			.then(response => xmparse.parseFromString(response, 'text/xml'))
			.then((dxml) => {
					Zhong.radicals =[];

					$(dxml).find('entry').each((i, valu)=>{
						let $valu =$(valu);
						let	idn =parseInt($valu.attr('n'));
						let ent ={radical:	$valu.attr('rad'),
								r:		parseInt($valu.attr('r')),
								n:		idn,
								alt:	$valu.attr('alt')};

						Zhong.radicals[idn-1] =(Zhong.radicals[idn-1] || []).concat([ent]);
					});
				}
			);
	}//end setGlyphs

	static glyphRootNode(glyf){
		var i=1, icode =parseInt('0x'+ escape(glyf).substr(2));
		let $node =$(Zhong.strokes).find('w').filter((k,node)=>{
			if(i){
				let $n =$(node);
				var	a =parseInt($n.attr('zi')) || $n.attr('zi'),
					z =parseInt($n.attr('uend') || a);
				return( a ===glyf || (!isNaN(a) && a <=icode && icode <=z) ? i-- :0 );
			}
			return false;
		});

		return $node;
	}//end glyphRootNode

	static glyphRootNodeEx(glyf){
		return Zhong.strokes.querySelector('w[zi="'+glyf+'"]');

		//performs very poorly
//		let eva =document.evaluate('/jungpk/entry/strokes[@zi="'+glyf+'"]', zhong.strokes, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
//		return(eva ? eva.singleNodeValue :null);
	}//end glyphRootNodeEx

	static pageOn(src, limitcount =100, isRadical =false){
		var hn =0, tiles =[];
		for(var i=0, w=0, prv=0	//stroke count
		  ; src.length && ((hn =parseInt(isRadical ? src[0].n : src[0].getAttribute('n')) || 0) ===prv
			 || w <= limitcount)
		  ; i++, w++){

			try{
			let	$src =$(src[0]);
			//hn =parseInt(isRadical ? src[0].n : $src.attr('n')) || 0;
			if(hn > prv){
				tiles[hn] =[];
				prv = hn;
			}
			if(isRadical){	//radicals
				tiles[hn].push(src[0].radical +((src[0].alt || '0') ==='0' ? '':'~') +(src[0].r-1));
			}
			else if($src.is('w') && $src.cached){
				tiles[hn].push(...$src.cached);
				let jz =src.indexOf($src.parent().find('[n="'+hn+'"]').last()[0]);
				if(jz >0){
					src.splice(0, jz);
					i += jz;
				}
			}
			else if($src.attr('zi')){
				var	a =parseInt($src.attr('zi')),
					z =parseInt($src.attr('uend') || a),
					simpl =$src.attr('alt') ? '~':'';

				if(isNaN(a))
					tiles[hn].push($src.attr('zi') +simpl);
				else if(z-a){
						let lbl =[];
						for(; a <= z; a++)
							lbl.push(unescape('%u'+a.toString(16)) +simpl);
						$src.cached =lbl;
						tiles[hn].push(...lbl);
						w += (lbl.length -1);
				}
				else tiles[hn].push(unescape('%u'+a.toString(16)) +simpl);
			}
			src.shift();
			}
			catch(err){
				console.log(err);
			}
		}//loop strokes
		if(src.length ===0) tiles.push("stop");

		return tiles;
	}//end pageOn

	static async rxPinyin(){
		fetch(xmroot +'xml/fonal.json'
			,(data)=>{
				if(data.ok)
					Zhong.fonal=data.json();
				else
					throw new Error(data.statusText);
			})
			.catch(err=>{
				console.log(err);
			});
		return Zhong.fonal;
	}

	static rxBellish(wo){
		wo = wo || this;
		Promise.all([
			fetch(xmroot +'xml/fonal.json').then(datx =>datx.json()),
			fetch(xmroot +'xml/ligan.json').then(datx =>datx.json())
		])
		.then(([data, dataj])=>{
			Zhong.fonal =data;
			wo._hots =dataj;
		})
		.catch(err=>console.log(err));
	}//end rxBellish

	async rx(refresh =false){
		if(refresh);
		else if(Object.keys(this._hots).length) return;

		let whilst =Promise.all([
			fetch(xmroot +'xml/omnibus.shu').then(datx =>datx.text()),
			fetch(xmroot +'xml/皓镧传.shu').then(datx =>datx.text()),
			fetch(xmroot +'xml/魏璎珞.jung').then(datx =>datx.text()),
			fetch(xmroot +'xml/将夜.jung').then(datx =>datx.text())
			]
		).then((dats)=>{
			let $serials ='';
			for(let dat of dats)
				$serials += dat;
			this.munchPrioti(null, $serials, 0);
		})
		.catch(err=>{
			console.log(['did not rx...', err]);
		});
		await whilst;
		await this.shelves();

		return this.prio;
	}//end rx

	munchPrioti(evt, $feed, demux){
		if(typeof demux ==='undefined')	demux =$('#firstly:checked').length;

		var dat =Zhong.textOf($feed).split(/[\r\n\t ,\.?;\(\)“”%$#@&!*`-。‘’“”]+/gu),	//《》
			nset =demux ? {} : this._hots;

		dat =dat.join('').split('');

		for(var i=dat.length-1, rgxIgnore =/[　!！0-9a-z:;，,\.\-\+~{\(\[（）\]\)}'"《》]/i; i >=0; i--){
			var glyph =dat[i];
			if(rgxIgnore.test(glyph) || (demux && this._hots[glyph])) continue;

			if(!nset[glyph] || nset[glyph] > -999){
				var k = nset[glyph] = (nset[glyph] || 0) +1;
				if(k<1) nset[glyph] =1;	//increment ligan from zero, not negative.
			}

		}//end loop
		if(demux)
			$.extend( this._hots, nset );
		else
			this._hots =nset;

		this.prio =[];
		for( var glif in this._hots )
			if( this._hots.hasOwnProperty(glif)){
				var r =this._hots[glif];
				this.prio[r] =(this.prio[r] || []);
				this.prio[r].push(glif);
			}
		//end loop
	}//end munchPrioti

	iGlyph(g){
		let nod =Zhong.glyphRootNodeEx(g);
		if(nod /*&& nod.parentNode*/){
			let k =document.evaluate('count(./preceding-sibling::*)+1', nod.parentNode, null, XPathResult.ANY_TYPE, null).numberValue -1;
			return k;
		}
		return -1;
	}

	async shelves(threshold =3){
		if(!Zhong.strokes || !this.prio){
			return this.qu || [];
		}

		let m =230, qu =[];
		for(let j of Object.keys(this.prio).sort((l,r)=>r-l)){
			qu =qu.concat(this.prio[j]);
			if(j <threshold || --m ===0) break;
		}//end loop
		this.qu ={};
		qu.forEach((g,i)=>{
			let nod =Zhong.glyphRootNodeEx(g);
			if(nod /*&& nod.parentNode*/){
				let k =document.evaluate('count(./preceding-sibling::*)+1', nod.parentNode, null, XPathResult.ANY_TYPE, null).numberValue -1;
//			let k =$n.parent('entry').attr('radical');
				this.qu[k] =(this.qu[k] || [peekcount]);
				this.qu[k].push(g);
			}
			else console.log(g);
		});

		for(let rad in this.qu){
			this.qu[rad][0] =Math.min(this.qu[rad][0], this.qu[rad].length-1);
		};
		return this.qu;
	}//end shelves

	async rank(glyphs, $radical, threshold =3){
		(glyphs.match(/([^\n\r ,\.\-;])/g) || []).forEach((glyph,i)=>{
			if(!this._hots[glyph] || this._hots[glyph] > -999){
				let k = this._hots[glyph] = (this._hots[glyph] || 0) +1;

				this.prio[k] =(this.prio[k] || []);
				this.prio[k].push(glyph);

				switch(k-1){
				case 0:
					break;
				default:
					// remove lesser priorize
					this.prio[k-1] =this.prio[k-1].filter(c => c !== glyph);

				}//end switch

				try{
					let radic =$radical || $(Zhong.glyphRootNodeEx(glyph).parentNode);

					let rn;
					if(!radic || radic.length ===0
					  || (rn =document.evaluate('count(./preceding-sibling::*)+1', radic[0], null, XPathResult.ANY_TYPE, null).numberValue) ===0);
					else if((this.qu[rn-1] =(this.qu[rn-1] || [0])) && k < threshold)
						this.qu[rn-1].push(glyph);
					else{
						let i=this.qu[rn-1].indexOf(glyph);
						switch(Math.min(i, this.qu[rn-1][0])){
						case this.qu[rn-1][0]:
							this.qu[rn-1].splice(i, 1);
						case -1:
							break;
						default:
							return;
						}
						this.qu[rn-1].splice(Math.min(12, this.qu[rn-1].length-1, this.qu[rn-1][0]++) || 1,0,glyph);
					}
				}
				catch(er){
					console.log('.'+glyph+'.');
				}
			}//if
		});
	}//end rank

	async imposeThumbs(jdata){
		console.log('imposer');
		for(let glyf in this.qu){
			jdata[glyf] = jdata[glyf] || this.qu[glyf];
		}
		this.qu =jdata;
	}//end imposeThumb

	hottops(k=200){
		return Object.keys(this._hots).sort((x,y) => this._hots[y] - this._hots[x]).slice(0,k);
	}//end hottops

	hotlines(k=200, limitLength=60){
		let regux =new RegExp('(.{1,' +limitLength+ '})','sug');
		return this.hottops(k).join('').match(regux).join('\n');
	}//end hotlines

	hotmeter(ln){
		var glyphs =ln.match(/[^ 　!！0-9a-z:;，,\.\-\+~{\(\[（）\]\)}]/ig),
			hits =[];
		for(let g of glyphs){
			if(this._hots[g]) hits.push(this._hots[g]);
		}
		return hits.sort((L,R)=> (L<0 ? R-L:L-R) )[0];	//give ligans precedence
	}//end hotmeter

	get radicals(){
		return Zhong.radicals;
	}
	get strokes(){
		return Zhong.strokes;
	}
	get hots(){
		return this._hots;
	}
	get pinheads(){
		return this.qu;
	}
}//end Zhong
