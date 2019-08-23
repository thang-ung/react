import React from 'react';
var $ =require("jquery");

export class Ellipsor extends React.Component{
	constructor(props){
		super(props);

		this.onClick = this.onClick.bind(this);
		this.timell =0;
		this.element =props.element;
	}//end ctor

	onClick(evt){
		this.element.toggleClass('eclipsor');
		if( this.state.eclipsor = $(this).is(':checked') ){
			let mu =$.Event('mouseup');
			mu.which =1;
			mu.data ='autotimer';

			this.element.on('mouseleave', (event)=>{
				let ix =document.elementsFromPoint(event.x, event.y)
						.indexOf(this.element[0]);
				if(ix >=0) return;

				clearTimeout(this.timell);
				if( this.element.is('.unellipsed:not(.detach)') ){
					this.timell =setTimeout(()=>{
						if( this.element.is('.unellipsed') )
							this.moless.trigger(mu);
						}, this.state.eclinterval);
				}
			})
			.on('mouseenter',()=>{
				clearTimeout(this.timell);
				this.timell =setTimeout(() =>this.element.filter(':not(.detach)').removeClass("ellipsed").addClass("unellipsed", 600, 'easeOutExpo'), 500);
				});
		}
		else
			this.element.off('mouseleave mouseenter');
	}//end onClick

	render(){
		return(<input type="checkbox" id="eclipsor" data-title="Enable auto\nCollapse"></input>);
	}

	static get autocheck(){
		return(<input type="checkbox" id="eclipsor" data-title-left={"Enable auto\nCollapse"}></input>);
	}
}//end ellipsor

export class Ellipser extends React.Component{
	constructor(props){
		super(props);
		this.timer =setTimeout(()=>{}, 0);
		this.setState({
			eclipsor :false,
			eclinterval: props.eclinterval || 800,
			ellipsed :false	//initial state only
		  });
		this.done =props.done || (()=>0);
		this.mouseup = this.mouseup.bind(this);
		return;
	}

	collapse(t =400){
		return this.element.removeClass("unellipsed").addClass("ellipsed", t, 'easeInCubic');
	}

	mouseup(evt){
		if(evt.which !==1) return;
		var tic =this.element, t =400,
			wrapper =this.element.parent('div,p');
		if(evt.data ==='autotimer')
			t =50;

		tic.toggleClass("ellipsed unellipsed", t,'easeInCubic',
		()=>{
			this.done(evt, this);
		});
	}//end mouseup


	render(){
		return(
			<span className="moless ui-widget" onclick={onclick}></span>
		);
	}
}//end Ellipser

// requirejs(["jquery","jqueryui"],
// function(){
// 	$.widget( "ui.ellipser",{
// 		options:{
// 				done:()=>0,
// 				eclipsor :false,
// 				eclinterval: 800,
// 				ellipsed :false	//initial state only
// 			},
// 		_create:function(){
// 			if( $(this).next('span.moless').length ==0 ){
// 				this.element.addClass("ui-widget")
// 					/*.removeClass('ellipser')*/	//makes rerunable easier
// 					.removeClass('ellipsed unellipsed')
// 					.addClass(this.options.ellipsed ? 'ellipsed': 'unellipsed');
// 				this.moless =$( "<span>" )
// 					.addClass("moless").addClass("ui-widget")
// 					.insertAfter( this.element )
// 					.mouseup((evt)=>{
// 						if(evt.which !=1) return;
// 						var tic =this.element, t =400,
// 							wrapper =this.element.parent('div,p');
// 						if(evt.data =='autotimer')
// 							t =50;

// 						tic.toggleClass("ellipsed unellipsed", t,'easeInCubic',
// 						()=>{
// 							this.options.done(evt, this);
// 						});
// 					});

// 				let io =this, $wo =$('#eclipsor');
// 				$wo.on('click',function(){
// 					io.element.toggleClass('eclipsor');
// 					if( io.options.eclipsor = $(this).is(':checked') ){
// 						let mu =$.Event('mouseup');
// 						mu.which =1;
// 						mu.data ='autotimer';

// 						io.element.on('mouseleave', ()=>{
// 							let ix =document.elementsFromPoint(event.x, event.y)
// 									.indexOf(io.element[0]);
// 							if(ix >=0) return;

// 							clearTimeout(io.timell);
// 							if( io.element.is('.unellipsed:not(.detach)') ){
// 								io.timell =setTimeout(()=>{
// 									if( io.element.is('.unellipsed') )
// 										io.moless.trigger(mu);
// 									}, io.options.eclinterval);
// 							}
// 						})
// 						.on('mouseenter',()=>{
// //							io.moless.trigger(mu);
// 							clearTimeout(io.timell);
// 							io.timell =setTimeout(() =>io.element.filter(':not(.detach)').removeClass("ellipsed").addClass("unellipsed", 600, 'easeOutExpo'), 500);
// 							});
// 					}
// 					else
// 						io.element.off('mouseleave mouseenter');
// 				})/*.prop('checked', this.options.eclipsor)*/;

// 				if(this.options.eclipsor) $wo.click();
// 			}
// 			else{
// 				this.destroy();
// 				return false;
// 			}
// 		},//end constructor

// 		collapse:function(t =400){
// 			return this.element.removeClass("unellipsed").addClass("ellipsed", t, 'easeInCubic');
// 		},
// 		timer: setTimeout(()=>{}, 0),
		
// 	});//end ellipser

// //	$("span.ellipser:not(.ui-widget):not(.nauto)").ellipser();
// 	return $;
// });
