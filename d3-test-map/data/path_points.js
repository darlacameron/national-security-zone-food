var pathPoints = [
							
				{
				//Declaration of emergency - can we shade Niger to show where it starts or something?
				 	type: 'LineString',
					coordinates: [
						[0, 0], //filler
						[100, 100] //filler
		 			]
				},
				{
				//AID requests NGO proposals, Niger to DC		
				 	type: 'LineString',
					coordinates: [
						[8.081666, 17.607789], //Niger, general search for coordinates
						[-77.029716, 38.895300] //USAID office, DC
		 			]
				},
				{
				//Goes to KCCO for bids, DC to Kansas City
				 	type: 'LineString',
				 	coordinates: [
						[-77.029716, 38.895300], //USAID office, DC
				 		[-94.506628, 39.009088] //KCCO
		
				 	]
				},
				{
				//farms to Didion processor				
				type: "MultiLineString",
  				coordinates: [
      					[ [-89.127544, 43.596402], [-89.106284, 43.539738] ], //Sanderson's to Didion
      					[ [-89.135772, 43.547443], [-89.106284, 43.539738] ], //Wiersma's to Didion
      					[ [-88.814436, 43.531547], [-89.106284, 43.539738] ]  //Ferron's to Didion
    				]
  
				},
		
				{
				//Didion processor to port in Chicago
					type: 'LineString',
					coordinates: [
						[-89.106284, 43.539738], //Didion
						[-87.583549, 41.663624] //Load point in Chicago
		
					]
				},
				{
					//port in Chicago to port in Norfolk
					type: 'LineString',
					coordinates: [
						[-87.583549, 41.663624], //Load point in Chicago
						[-76.283264, 36.844077] //Norfolk port
						
					]
				},
				{
				//port in Norfolk to Cotonou Port, Benin
					type: 'LineString',
					coordinates: [
						[-76.283264, 36.844077], //Norfolk port
						[2.417421, 6.350392], //Cotonou Port, Benin
						
					]
				},
				{
				//Cotonou Port, Benin to Maradi, Niger
					type: 'LineString',
					coordinates: [
						[2.417421, 6.350392], //Cotonou Port, Benin
						[7.100000, 13.483333] //Maradi, Niger
						
					]
				}
			//May have distribution to camps here, but waiting on info from Save the Children
			];