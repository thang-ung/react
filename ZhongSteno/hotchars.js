import React from "react";
import LangContext from "./langContext";
import Ligans from "./ligans";

export default class HotChars extends React.Component{
	static contextType =LangContext;

	constructor(props){
		super(props);
		this.state ={
			 tiles: props.tiles || []
			,whims: props.whims || []
				};
		this.ligans =React.createRef();
	}//end ctor

	collateTiles(intiles){
		let tiles =[], ligans =[];
		(intiles || [])
		.forEach(v => {
			let tip =this.context.hots[v.props.literal.charAt(0)];
			switch(parseInt(tip <0 ? -1: (tip || 0))){
			case -1:
				ligans.push(React.cloneElement(v, {tip:tip, className:"ligan"
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

		return [this.state.chots, this.state.ligani]=[tiles,ligans];
	}

	componentDidUpdate(){
		if(this.ligans.current){
			this.ligans.current.setState({tiles:this.state.ligani});
		}
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			 tiles: nextProps.tiles
			,whims: nextProps.whims });
	}

	render(){
		this.collateTiles(this.state.tiles);

		return(<span id="hotc" className="zhongwen-void">
				<Ligans ref={this.ligans} tiles={this.state.ligani}/>
				{this.state.chots}
				{this.state.whims}
			</span>)
	}
}