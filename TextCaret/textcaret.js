import React from "react";
import {ints} from "./utils";

export default class TextCaret extends React.Component{
	constructor(props){
		super(props);

		this.state ={
			 className: props.className
			//,children: props.children
			,caretClass: props.blinkChars ? "afts":"aft"
			,caretContent: props.caretContent ||"▐"
			,className : [props.className, "react", "caretshell"].join(" ")
			,childType : props.children.type
			,style: props.style
			,step: props.instep ? 0: 1

			,scrollExtent: 0
			,scrollLeft: null
			,scrollWidth: null
			};
		this.div =React.createRef();
		this.carettop =React.createRef();

		this.syncCaret =this.syncCaret.bind(this);
		this.blur =this.blur.bind(this);
		this.focus =this.focus.bind(this);
		this.tmrPauase =0;
	}//end ctor

	syncCaret(evt){
		clearTimeout(this.tmrPauase);
		let io =evt.target
			,caret =this.carettop.current;

		this.tmrPause =setTimeout(()=>caret.classList.remove("anipause"),50);
		caret.classList.remove("anipause");

		let leftspin
			,offw =io.offsetWidth
			,txt =io.value
			,marker =caret.querySelector("mark")
			,selectionEnd =io.selectionEnd +this.state.step;
		var stretched =this.state.scrollExtent;

		if(io.scrollWidth != this.state.scrollWidth){

			let ioc =io.cloneNode(false);
			ioc.style.position ="absolute";import React from "react";
import {ints} from "./utils";

export default class TextCaret extends React.Component{
    constructor(props){
        super(props);

        this.state ={
             className: props.className
            ,caretClass: props.blinkChars ? "afts":"aft"
            ,caretContent: props.caretContent ||"┃"
            ,className : [props.className, "react", "caretshell"].join(" ")
            ,childType : props.children.type
            ,style: props.style
            ,step: props.instep ? 0: 1
            ,fitted: props.fitted //|| true   ~else vertical scrollable

            };
        this.div =React.createRef();
        this.carettop =React.createRef();

        this.syncCaret =this.syncCaret.bind(this);
    }//end ctor

    syncCaret(evt){
        let io =evt.target
            ,caret =this.carettop.current;

        this.tmrPause =setTimeout(()=>caret.classList.remove("anipause"),50);
        caret.classList.remove("anipause");

        let txt =io.value
            ,marker =caret.querySelector("mark")
            ,selectionEnd =io.selectionEnd +this.state.step;

        this.div.current.style.maxWidth =(io.offsetWidth) +'px';
        let placeChar =marker.classList.contains("afts") ? this.state.caretContent:"i";
        caret.style.maxWidth =io.clientWidth +'px';
        caret.style.maxHeight =io.offsetHeight +'px';
 
		try{
            if(caret.childNodes[0].nodeName ==="MARK")
                caret.insertBefore(document.createTextNode(" "), caret.childNodes[0]);

            var data =caret.childNodes[0].data =txt.substring(0,selectionEnd);
            let insertChar =(txt.length > selectionEnd-1
                && txt.substr(selectionEnd-1,1).search(/[\n\r\t ]/) ===-1)
                    ? txt.charAt(selectionEnd-1) :placeChar;

            if(insertChar.length){
                marker.setAttribute("data-content", insertChar);
            }
            else{
                marker.removeAttribute("data-content");
            }
		}
		finally{
            var markwidth =parseInt(window.getComputedStyle(marker,":after").getPropertyValue("width"));
            let caretChar =marker.getAttribute("data-content");
            if(caretChar ===this.state.caretContent){
                 marker.style.marginLeft =-(markwidth *3/4)+'px';
            }
            else
                marker.style.marginLeft =-markwidth+'px'
            if(!marker.matches("[data-content]"))
                marker.style.marginLeft =0;
            else if(marker.offsetLeft <0)
                marker.style.marginLeft =-(markwidth /3)+'px';

            caretChar += txt.substr(selectionEnd);
            if(marker.nextSibling)
                marker.nextSibling.data =caretChar;
            else
                caret.appendChild(document.createTextNode(caretChar));

           caret.scrollTop =io.scrollTop;
           caret.scrollLeft =io.scrollLeft;
		}//end finally

        //let aftwidth =markwidth || parseInt(window.getComputedStyle(marker,":after").getPropertyValue("width"));
    }//end syncCaret

    componentDidMount(){
        let ctl =React.Children.toArray(this.props.children)
                    .find(v=>["textarea","input"].indexOf(v.type) !== -1 && v.ref);
        if(!ctl || !(ctl =ctl.ref.current)) return;

        ctl.oninput =ctl.onkeyup = ctl.onclick =ctl.onscroll =this.syncCaret;

        if(typeof(this.state.fitted) ==='undefined'){
            this.state.fitted =["auto","scroll"]
                    .indexOf(window.getComputedStyle(ctl)["overflow-y"])
                    ===-1;
        }

        if(this.state.childType==="input")
            this.carettop.current.classList.add("input");
    }

    shouldComponentUpdate(nextProps, nextState){
        return false;
    }

    render(){
        return(
            <div className={this.state.className} style={this.state.style} ref={this.div}>
                <div tabIndex="-1" className="caretsub" ref={this.carettop}
                  style={this.state.childType==="input" ? {whiteSpace:"nowrap"}:null}>
                    <mark className={this.state.caretClass}/>
                </div>
                {this.props.children}
            </div>
        );
    }
}


			ioc.style.color ="white";
			ioc.style.top =-(io.offsetHeight+1) +'px';

			io.parentNode.appendChild(ioc);

			ioc.scrollLeft =io.scrollWidth -offw;
			stretched =Math.floor(ioc.scrollLeft);
			io.parentNode.removeChild(ioc);
		}
		this.div.current.style.maxWidth =(io.clientWidth) +'px';
		let placeChar =marker.classList.contains("afts") ? this.state.caretContent:"i";

//		try{
			if(Math.abs(io.scrollLeft-this.state.scrollLeft) <3 && caret.style.textAlign ==="right"){
				if(marker.nextSibling) caret.removeChild(marker.nextSibling);
				if(selectionEnd <= txt.length){
					let tail =txt.substr(selectionEnd-1);
					caret.appendChild(document.createTextNode(tail.substr(this.state.markerAbsolute ? 0:1)));
					caret.style.marginLeft =0;
					if(tail.length){
						let mark =tail.charAt(0).replace(/[\n\r ]/, placeChar);
						marker.setAttribute("data-content",mark);
					}
					if(Math.abs(stretched- this.state.scrollExtent) >3){
						let maxScroll =io.scrollWidth -offw
							,scrollRatio =stretched / maxScroll;
						caret.style.marginLeft =((parseInt(caret.style.marginLeft)||0)
							+((stretched- this.state.scrollExtent) / scrollRatio)) +'px';
					}
				}
				else{
					marker.setAttribute("data-content", placeChar);
				}
				return;
			}
			else{
				if(caret.childNodes[0].nodeName ==="MARK")
					caret.insertBefore(document.createTextNode(" "), caret.childNodes[0]);

				var data =caret.childNodes[0].data =txt.substring(0,selectionEnd);
				let insertChar =(txt.length > selectionEnd-1
					&& txt.substr(selectionEnd-1,1).search(/[\n\r\t ]/) ===-1)
						? txt.charAt(selectionEnd-1) :placeChar;

				if(insertChar.length){
					marker.setAttribute("data-content", insertChar);
					// if(!this.state.markerAbsolute){
					// 	if(marker.nextSibling) caret.removeChild(marker.nextSibling);
					// }
					// else if(marker.nextSibling)
					// 	caret.childNodes[2].data =insertChar;
					// else
					// 	caret.appendChild(document.createTextNode(insertChar));
				}
				else{
					marker.removeAttribute("data-content");
				}
			}
//		}
//		finally{
			var markwidth =parseInt(window.getComputedStyle(marker,":after").getPropertyValue("width"));
			let caretChar =marker.getAttribute("data-content");
			if(caretChar ===this.state.caretContent){
				marker.style.marginLeft =-(markwidth/2)+'px';
			}
			else
				marker.style.marginLeft =-markwidth+'px'
			
			if(marker.nextSibling)
				marker.nextSibling.data =caretChar;
			else
				caret.appendChild(document.createTextNode(caretChar));
//		}//end finally

		let aftwidth =markwidth || parseInt(window.getComputedStyle(marker,":after").getPropertyValue("width"));
		markwidth =this.state.markerAbsolute ? aftwidth :0;

		if(this.state.childType !=="input"){
			if(io.scrollHeight != io.offsetHeight)
				io.style.height =io.scrollHeight +'px';
			if(marker.offsetLeft > offw){
				io.style.width =marker.offsetLeft +aftwidth;
			}
		}
		else if( Math.abs(io.scrollLeft -this.state.scrollLeft) <3  && io.selectionEnd ===io.selectionStart
			&& (!this.state.markerAbsolute ||
				offw >= caret.offsetWidth +(parseFloat(caret.style.marginLeft)||0))){

			return;
		}

		else if(data.length ==0){
			caret.style.marginLeft ='';
			caret.style.textAlign ='';
		}

		else if(io.scrollWidth != io.offsetWidth){
			caret.style.marginTop =-io.scrollTop+'px';
			caret.style.height=io.scrollTop+'px';
			caret.style.marginLeft ='';
			caret.style.textAlign ='';

			let caw =caret.clientWidth
				,maxScroll =io.scrollWidth -offw
				,scrollRatio =stretched / maxScroll;

			if(selectionEnd >=txt.length-1){
//				let mupx =marker.getAttribute("data-content") ===this.state.caretContent ? 0.5 :0;

				caret.childNodes[0].data =this.state.markerAbsolute ? "" :txt.slice(-1);
				caret.style.textAlign ="right";
//				caret.style.marginLeft =(mupx* markwidth)+'px';
				leftspin =stretched;
			}
			else if(offw <= caret.clientWidth){
				let lword =[], minwi =caret.style.minWidth;
				caret.minWidth ='';
				while(offw < caret.clientWidth && caret.childNodes[0].data.length){
					lword.push(caret.childNodes[0].data.charAt(0));
					caret.childNodes[0].data =caret.childNodes[0].data.substr(1);
				}
				caret.minWidth =minwi;

				let ladjusted =-(caw-caret.offsetWidth);
				caret.childNodes[0].data =data;

				caret.style.marginLeft =ladjusted+'px';
				io.scrollLeft =- ladjusted *scrollRatio;
			}
			else{
				caret.style.marginLeft ='';
				caret.style.textAlign ='';
			}
		}
		else{
			caret.style.marginLeft ='';
		}
		this.setState({
				 scrollLeft: leftspin || io.scrollLeft
				,scrollWidth: io.scrollWidth
				,scrollExtent: stretched || this.state.scrollExtent
			});

	}//end syncCaret

	focus(evt){
		this.carettop.current.style.minWidth =evt.target.offsetWidth+"px";
	}

	blur(evt){
		if(this.state.scrollLeft){
			setTimeout(()=>evt.target.scrollLeft =this.state.scrollLeft, 5);
		}
	}//end blur

	componentDidMount(){
//		let ctl =this.props.target ? this.props.target.current
//				: this.props.children.ref.current
		let ctl =React.Children.toArray(this.props.children)
					.find(v=>["textarea","input"].indexOf(v.type) !== -1 && v.ref);
		if(!ctl || !(ctl =ctl.ref.current)) return;

		ctl.oninput =ctl.onkeyup = ctl.onclick /*=ctl.onfocus*/ =ctl.onscroll =this.syncCaret;
		if(this.state.childType ==="input"){
			ctl.onblur =this.blur;
			ctl.onfocus =this.focus;
		}

		if(this.state.childType==="input")
			this.carettop.current.classList.add("input");
		
		this.setState({markerAbsolute: window.getComputedStyle(this.carettop.current.querySelector('mark'),":after")
								.getPropertyValue("position")==="absolute"});
	}
	component

	render(){
		return(
			<div className={this.state.className} style={this.state.style} ref={this.div}>
				<span tabIndex="-1" className="caretsub" ref={this.carettop}
				  style={this.state.childType==="input" ? {whiteSpace:"nowrap"}:null}>
					<mark className={this.state.caretClass}/>
				</span>
				{this.props.children}
			</div>
		);
	}
}

