import React from "react";
import {FunTile} from "./tile";
import {Ellipsor} from "./ellipser";
import {Zhong} from "./czhong";
import mikih from "../images/mikih.png";
import crossX from "../images/x.png";
import compassJe from "../images/compass-je.png";
import ghost from "../images/ghoul.png";

var $ =require("jquery");

const parakeys = {

	 "sp":" ", "¶":"\n"
	,"’ ƒ":new RegExp("‘$1’"), "” ƒ":new RegExp("“$1”")
	,"ghoul": (wo)=>{ let title ='ghost toggler';
		return(<img src={ghost} alt="●"
				data-title-left={title}
				style={{maxWidth:"1.28em"}}
				onClick={(evt)=>{
						if(wo && wo.current)
							wo.current.toggle("hidden");
						else
							$(evt.target).parents('#parakeys')[0].parentNode.querySelector('.ellipser').classList.toggle('hidden');
					}}
				/>);
		}

	,"draghand": (<img src={mikih} alt="●"
	 		 data-title="drag handle"/>)


	,"灭 ƒ": ()=>{ let title ='List top\ncommon glyphs';
		let fn =(wo, dest)=>{
			if(wo && wo.context instanceof Zhong){
				let lnwidth =20;
				if(dest instanceof Selection && dest.baseNode){
					let $dest =$(dest.baseNode.nodeName==="#text" ? dest.baseNode.parentNode : dest.baseNode);
					let fosz =parseInt($dest.css('font-size'))
						,w =$dest.parent().width();
						lnwidth =parseInt(1.4*w/fosz) || lnwidth;
					console.log(lnwidth);
					return wo.context.hotlines(300,lnwidth);
				}
				else return wo;
			}
		}
		return(<FunTile className="jump" data-mousedown={fn}
			data-title-left={title} literal="灭 ƒ" />);
	}

	,"∞ƒ": (content)=>{ let title ='Recalibrate';
			return (<img src={compassJe} style={{maxWidth:"1.28em"}}
					data-title-left={title} alt="●"
					onClick={(evt, wo)=>{
						if(wo && wo.context instanceof Zhong)
							return wo.context.rx();
					}}
					/>);
		}
	,"拇ƒ": ()=>{ let title ='Thumbsuck';
		let fn=(wo)=>{
			if(wo && wo.context instanceof Zhong){
				let $postee =window.getSelection()
					, srtxt=$postee.toString();
				let inputln =srtxt.replace(/[\r\n ]+$/g, "");

				if(inputln.length >0){
					try{
						wo.context.qu =JSON.parse(inputln);
						$postee.deleteFromDocument();
					}
					catch(e){
						wo.context.rank(inputln);
						console.log(e);
					}
					return '';
				}
				else
					return JSON.stringify(wo.context.qu);
			}
		};

		return(<FunTile className="jump" data-mousedown={fn}
			data-title-left={title} literal="拇ƒ" />);
		}

	,"histscro": (<input type="checkbox" defaultChecked
			 data-title={"Enable\nscroll history"}/>)


	,"trackpad": (<input type="checkbox" value="-1"
			 data-title-left={"Navigate by\ntrackpad gesture\ndirection"}/>)

	,"invertShiftScro": (<input type="checkbox"
			 data-title-left={"invert shift+scroll\ndrilldown"}/>)

	,"fastscro": (<input type="checkbox"
			 data-title-left={"Enable scroll\nno delays"}/>)
	,"ellip": Ellipsor.autocheck
	};

export function mkParakeys(template, props){
	let parsky =[], io =this;

	if(!document.querySelectorAll('#parakeys').length){
		for( var glif in template ){
			if( parakeys.hasOwnProperty(glif)){
				let parakey =parakeys[glif];
//				if(parakey instanceof RegExp)
//					parsky.push(<div class="parakey"><div data-value={parakey} class="jump">{glif}</div></div>);
//				else 
				if( typeof(parakey) =='function'){
					try{
						var $p =parakey(props[glif]);
					}
					catch(e){
						$p =(<div className='jump' data-value={parakeys[glif]}>{glif}</div>);
					}
					finally{
//						$p.props.id= glif;
						parsky.push(<div key={glif} className="parakey">{$p}</div>);
					}
				}

				else if( parakey.type && ['input','img'].indexOf(parakey.type) >=0 ){
					parsky.push(<div key={glif} className="parakey">{parakey}</div>);
				}
				else{
					parsky.push(<div key={glif} className="parakey">
							<FunTile data-value={parakey} className="jump" literal={glif} />
						</div>);
				}
			}
		}//end loop
		let $parakeys =(<span key="parakeysuite" id="parakeys" className="once">
				{parsky}
			</span>);

		let btnClose =(<div key="btnclose" className="parakey" id="btnclose"
				 onClick={()=>io.bench.current.classList.add('hidden')}
				 data-title="Close"><img src={crossX} alt="●"/></div>);

		return [$parakeys, btnClose];
	}
	return null;
}//end mkParakeys

export default parakeys;