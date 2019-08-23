let $ =require("jquery");

export class flexbug{
		static async resizeFlexColumn($flexCol){
			let digi =/^([0-9]*).*$/,
				$anchor =$flexCol.children().last(),
				pads =parseInt(($flexCol.css('padding-left') ||'0').replace(digi,'$1')) 
						 +parseInt(($flexCol.css('padding-right') ||'0').replace(digi,'$1'));
			if($anchor.length){
				let ileft =$anchor.offset().left ,
					iri =$flexCol.offset().left;

				if($flexCol.css('direction') ==='rtl')
					$flexCol.css('width', pads +$anchor.width() + Math.abs(iri +-ileft));
				else
					$flexCol.css('width', pads +$flexCol.width() +Math.abs(iri -ileft));
			}
		}//end resizeFlexColumn

}//end flexbug