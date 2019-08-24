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
}//end TextCaret
