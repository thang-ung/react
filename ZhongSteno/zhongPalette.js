import React from 'react';
import {axorray} from "./utils";
import ghost from "../images/ghoul.png";
import LangContext from './langContext';

export default class ZhongPalette extends React.Component{
	static contextType =LangContext;

	constructor(props){
		super(props);
		this.state ={
				palette: props.palette
				,className: ["ellipser","nauto","thumbed","eclipsor","hidden"]
				};
		this.pane =React.createRef();
		this.uicontrol =this.uicontrol.bind(this);
		this.toggle =this.toggle.bind(this);
	}

	uicontrol(type="ghoul"){
		switch(type){
		case "ghoul":
			return(<img src={ghost} id={type}
				data-title-left='ghost toggler'
				style={{maxWidth:"1.28em"}}
				onClick={()=>this.toggle("hidden")}
				/>);
		}
	}

	toggle(className){
		let newstate =this.state.className.slice(0)
			,indx =newstate.indexOf(className)
			,ID =this.constructor.name;
		this.context.className[ID] =this.context.className[ID] || [];

		if(indx ===-1){
			newstate.push(className);
			this.context.className[ID] =this.context.className[ID].filter(x=>x !==className);
		}
		else{
			newstate.splice(indx,1);
			this.context.className[ID].push(className);
		}
		this.setState({className: newstate});
	}

	componentWillMount(){
//		this.toggle('hidden');
		this.state.className =axorray(this.state.className,this.context.className[this.constructor.name] ||[]);
	}

	render(){
		return(
			<span key={this.key} className={this.state.className.join(' ')} ref={this.pane}>
				{this.state.palette}
			</span>);
	}
}