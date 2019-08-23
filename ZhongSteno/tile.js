import React from "react";
const $ =require("jquery");


export default class Tile extends React.Component{
	constructor(props){
		super(props);
		this.state ={
			name: props.name
			,className: props.className
			,derived: props.derived ? 1:null
			,literal: props.literal
			,enterTile: props.enterTile
			,strokes: props.strokes || null
			,tip: props.tip
//			,tip: (props.tip || 0) > 1 ? props.tip: null

			,void: props.void
		};
//		this.state.enterTile =this.state.enterTile.bind(this);
//		this.key =props.name;
		this.tile =React.createRef();
	}
	componentDidMount(){
		this.tile.current.addEventListener("mouseenter", this.state.enterTile);
	}
	render(){
		return(<div //onMouseEnter={this.state.enterTile}
			ref={this.tile}
			//key={this.key}
			//key={parseInt('0x'+ escape(this.state.literal.charAt(0)).substr(2))}
			data-jump={this.props.jump ? "up":null}
			tip={this.state.tip} void={this.state.void}
			className={this.state.className}
			data-strokes={this.state.strokes}>
				<div className="jump" name={this.state.name}
					data-derived={this.state.derived}>{this.state.literal}
				</div>
		</div>);
	}

	static stopPropagation(event){
		event.returnValue =false;
		event.stopImmediatePropagation();
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
}


export class TinyTile extends React.Component{
	constructor(props){
		super(props);
		this.state ={
			name: props.name
//			,class: ("jump " +(props.class || '')).trim()
			,className: props.className
			,derived: props.derived ? 1:null
			,literal: props.literal
			,enterTile: props.enterTile

			,strokes: props.strokes || null
			,tip: props.tip

			,post: props.post
			,void: props.void
		};
//		this.key =props.name;
		this.element =React.createRef();
	}

	componentDidMount(){
		if(this.state.post){
			let wo =this;
			$(this.element.current)
				.on("mousedown", function moodown(evt){
					wo.state.post()(evt.originalEvent);
				})
				.on("contextmenu",(evt)=>{
					Tile.stopPropagation(evt.originalEvent);
				});
		}
	}//componentDidMount

	render(){
		return(<div name={this.state.name} ref={this.element}
			onMouseEnter={this.state.enterTile}
			className={this.state.className}
			tip={this.state.tip} void={this.state.void}
			data-derived={this.state.derived}>
				{this.state.literal}
		</div>);
	}
}

export class FunTile extends TinyTile{
	constructor(props){
		super(props);
		this.state =Object.assign({
				 mousedown: props["data-mousedown"]
				,value: props["data-value"]
			}, this.state);
	}
	componentDidMount(){
		$(this.element.current).data({
			"mousedown": this.state.mousedown
			,"value":this.state.value});
	}
}