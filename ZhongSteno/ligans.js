import React from "react";
import LangContext from "./langContext";
import {flexbug} from './flexbug';
const $ =require("jquery");

export default class Ligans extends React.Component{
	static contextType =LangContext;

	constructor(props){
		super(props);
		this.state ={
				tiles:props.tiles ||[]
				,className: "zhongwen-void ligan flexbug rfloat"};
	}//end ctor

	componentDidMount(){
		this.componentDidUpdate();
	}
	componentDidUpdate(){
		flexbug.resizeFlexColumn($('#ligan'));
	}

	componentWillReceiveProps(nextProps){
		this.setState({ tiles: nextProps.tiles });
	}

	render(){
		return(<span id="ligan" className={this.state.className}>
				{this.state.tiles}
			</span>)
	}
}