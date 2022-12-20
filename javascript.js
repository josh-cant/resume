

//{ 
//"type": "module"
//}

 
var width = 764;
var height = 486;

var lowColor = '#DEEDCF';
var highColor = '#0A2F51';
 


// D3 Projection
var projection = d3.geoAlbersUsa()
.translate([width / 2, height / 2]) // translate to center of screen
.scale([950]); // scale things down so see entire US

// definte the state splitting
var path = d3.geoPath() 
.projection(projection); // uses albersusa

// formatting for large numbers
var thousandsformat = d3.format(",");

// Create SVG element and append map to the SVG

var svg = d3.select("#savage")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "#485d6a");


// variables for later
var clicked = "false"
var selected = undefined



var pathToCsv2 = "data/State agg - no standard.csv"; //please note this csv doesnt have alaska


//Put your hard-coded list in `constants.js` files to clean things up.
//It is reachable by the variable `VARIABLE_NAMES`
var valuelist = VARIABLE_NAMES;
        
d3.dsv(",", pathToCsv2, function (d) {
  return {
      State_abbrev: d["State Abbreviation"],
      StateName: d["State Name"],
      ["Number of Cities"]: d["Number of Cities"],
      ["Average 2020/2021 household income"]: d["Average Household Income 2020/2021"],
      ["Historic Percent Change in Household Income 1984-2019"]: d["Percent Change in Household Income, 1984-2019"],
      ["Average Yearly Historic Percent Change in Income 1984-2019"]: d["Average Yearly Percent Change in Household Income, 1984-2019"],
      ["Minimum Wage"]: d["MinWage"],
      ["Average House Price 2020/2021"]: d["Average House Price 2020/2021"],
      ["Percent Change in Historic House Prices 2000-2019"]: d["Percent Change in Housing Prices, 2000-2019"],
      ["Average Yearly Percent Change in Housing Prices 2000-2019"]: d["Average Yearly Percent Change in Housing Prices, 2000-2019"],
      ["# of Violent Crime"]: d["Violent Crime Total"],
      ["# of Property Crime"]: d["Property Crime Total"],
      ["Property Crime Per Capita"]: d["Property Crime Per Capita"],
      ["Violent Crime Per Capita"]: d["Violent Crime Per Capita"],
      ["Total Crime Per Capita"]: d["Total Crime Per Capita"],
      Pop: d.TotalPop,
      Men: d.Men,
      Women: d.Women,
      VotingAge: d.VotingAgeCitizen,
      Employed: d.Employed,
      ["% Hispanic"]: d.Hispanic,
      ["% White"]: d.White,
      ["% Black"]: d.Black,
      ["% Native"]: d.Native,
      ["% Asian"]: d.Asian,
      ["% Pacific Islander"]: d.Pacific,
      ["Average Income"]: d.Income,
      ["Income Per Capita"]: d.IncomePerCap,
      ["% in Poverty"]: d.Poverty,
      ["% Child Poverty"]: d.ChildPoverty,
      ["% Professional Workers"]: d.Professional,
      ["% Service Workers"]: d.Service,
      ["% Office Workers"]: d.Office,
      ["% Construction Workers"]: d.Construction,
      ["% Production Workers"]: d.Production,
      ["% who Drive to Work"]: d.Drive,
      ["% who Carpool to Work"]: d.Carpool,
      ["% who use Public Transport "]: d.Transit,
      OtherTrans: d.OtherTransp,
      ["% Who Work At Home"]: d.WorkAtHome,
      ["Average Commute"]: d.MeanCommute,
      ["% Privately Employed"]: d.PrivateWork,
      ["% Self Employed"]: d.SelfEmployed,
      ["% Family Businesses"]: d.FamilyWork,
      ["% Unemployed"]: d.Unemployment,
      ["Average City Population"]: d.Population,

  }
}).then(function (data) {
    let pathToNNData= "data/nearest_neighbors.csv";

    d3.dsv(",", pathToNNData, function (d) {
        return {
        'city_id': +d['city_id'],
        'state_abbreviation': d['State Abbreviation'],
        'city': d['City'],
        'county': d['County'],
        'state': d['State'],
        'city_state': d['city_state'],
        'city_county': d['city_county'],
        'city_st_abbr': d['city_st_abbr'],
        'lat': d['lat'],
        'lng': d['lng'],
        0: +d['0_x'],
        1: +d['1_x'],
        2: +d['2_x'],
        3: +d['3_x'],
        4: +d['4_x'],
        5: +d['5_x'],
        6: +d['6_x'],
        7: +d['7_x'],
        8: +d['8_x'],
        9: +d['9_x'],
        10: +d['10_x'],
        11: +d['11_x'],
        12: +d['12_x'],
        13: +d['13_x'],
        14: +d['14_x'],
        15: +d['15_x'],
        16: +d['16_x'],
        17: +d['17_x'],
        18: +d['18_x'],
        19: +d['19_x'],
        20: +d['20_x'],
        'd0': +d['0_y'],
        'd1': +d['1_y'],
        'd2': +d['2_y'],
        'd3': +d['3_y'],
        'd4': +d['4_y'],
        'd5': +d['5_y'],
        'd6': +d['6_y'],
        'd7': +d['7_y'],
        'd8': +d['8_y'],
        'd9': +d['9_y'],
        'd10': +d['10_y'],
        'd11': +d['11_y'],
        'd12': +d['12_y'],
        'd13': +d['13_y'],
        'd14': +d['14_y'],
        'd15': +d['15_y'],
        'd16': +d['16_y'],
        'd17': +d['17_y'],
        'd18': +d['18_y'],
        'd19': +d['19_y'],
        'd20': +d['20_y']
        }
        
    }).then(function (nndata) {

    console.log(data);
    console.log(nndata);
//    console.log(data.columns)

    var dataarray = [];
    
    for (var i = 0; i < data.length; i++) {
//        if data[i].
        dataarray.push(parseFloat(data[i].NumCities))
//        console.log(data[i].NumCities)
    }

    //
//    console.log(dataarray)
    var maxx = d3.max(dataarray);
    var minn = d3.min(dataarray);
    var scaler = d3.scaleLinear()
                    .domain([minn,maxx])
                    .interpolate(d3.interpolateLab)
                    .range([lowColor,highColor]);
//    console.log(maxx, minn)

    d3.json("us_states.json", function(json) {
        for (var i = 0; i < data.length; i++) {
            var dataState = data[i].StateName;
            var dataValue = parseInt(data[i]["Number of Cities"]); // This will need to be replaced / reactive
//            console.log(dataValue)
            for (var j = 0; j < json.features.length; j++) { // loop the json to find the states
                var jsonState = json.features[j].properties.name;
                if (dataState == jsonState) {
                    json.features[j].properties.NumCities = dataValue; // Get the coords from the json
                    break; // stop when coords are found
                }
            }
        }

        
        var valuelist = [
                         "Average 2020/2021 household income",
                         "Historic Percent Change in Household Income 1984-2019",
                         "Average Yearly Historic Percent Change in Income 1984-2019",
                         "Minimum Wage", 
                         "Average House Price 2020/2021",
                         "Percent Change in Historic House Prices 2000-2019",
                         "Average Yearly Percent Change in Housing Prices 2000-2019",
                         "# of Violent Crime",
                         "# of Property Crime",
                         "Property Crime Per Capita",
                         "Violent Crime Per Capita",
                         "Total Crime Per Capita",
//                         "Pop",
//                         "Men",
//                         "Women",
//                         "VotingAge",
//                         "Employed",
                         "% Hispanic",
                         "% White",
                         "% Black",
                         "% Native",
                         "% Asian",
                         "% Pacific Islander",
                         "Average Income",
                         "Income Per Capita",
                         "% in Poverty",
                         "% Child Poverty",
                         "% Professional Workers",
                         "% Service Workers",
                         "% Office Workers",
                         "% Construction Workers",
                         "% Production Workers",
                         "% who Drive to Work",
                         "% who Carpool to Work",
                         "% who use Public Transport ",
//                         "OtherTrans",
                         "% Who Work At Home",
                         "Average Commute",
                         "% Privately Employed",
                         "% Self Employed",
                         "% Family Businesses",
                         "% Unemployed",
                         "Average City Population"];
        

        
        
        // If we want to add city dots the code below *should* do it. Major problems with null values that brick live preview somewhere down the line
        
        // If we do this we should add a "show cities" button that shows / hides the cities
        
        // If we include this information we have to provide a link to the city georgaphies dataset somewhere on the page, probably in the data section
        
        
        
//        d3.csv("data/gdata_not_standardized.csv", function(city) {
//						console.log(city)
//						svg.selectAll("circle")
//						   .data(city)
//						   .enter()
//						   .append("circle")
//						   .attr("cx", function(d) {
//                            return (projection([d.lng,d.lat])[0])
////							   
//						   })
////                        console.log(projection([d.lng,d.lat]))
//						   .attr("cy", function(d) {
//							   return projection([d.lng, d.lat])[1];
//						   })
////						   .attr("r", 5)
//						   .style("fill", "yellow")
//						   .style("stroke", "gray")
//						   .style("stroke-width", 0.25)
//						   .style("opacity", 0.75)
//						   .append("title")			//Simple tooltip
//						   .text(function(d) {
//								return d.place + ": Pop. " + formatAsThousands(d.population);
//						   });
        

        
        
        
        
        
        
        var dropvar = data.columns
        var first = dropvar.shift() // ignore these its the only way I could get this to work
        var second = dropvar.shift() // ""
        var third = dropvar.shift() // ""
        
        d3.select("#variableDropdown")
        .selectAll("options")
        .data(valuelist).enter()
        .append("option")
        .text(function (d) {
            return d;
        })
//        .data(valuelist).enter()
        .attr("value", function (d) {
            return d;
        });
       
            // event listener for the dropdown. Update choropleth and legend when selection changes. Call createMapAndLegend() with required arguments.
        d3.select("#variableDropdown").on("change", function (d) {
            svg.html("")
            d3.select("#dashboard1").html("")
            d3.select("#dashboard2").html("")
            createMap(json, data, d3.select(this).property("value"));
            updateCityDropdown(SELECTED_CITY);
            
            //Test if resetting these helps
            clicked = "false"
            selected = undefined
            
    });
        // run creation function on NumCities
        createMap(json, data, valuelist[0])
        const nn_tip = d3.tip()
        .attr("id", "nn_tooltip")
        .attr('class', 'd3-tip')
        .attr('offset', [-1, 0])
        .html(function (d) {
            return `<strong>City: </strong><span class='details'>${d.city.city_state}<br></span>
            <strong>Ranking: </strong><span class='details'>${d.rank}<br/></span>
            <strong>Distance Score: </strong><span class='details'>${d.dist}<br/></span>`
        //                    <strong>Number of Users: </strong><span class='details'>${d.users}<br/></span>
        //                    <strong>Avg Rating: </strong><span class='details'>${d.rating}<br/></span>`
        });
    let nn_mouseOver = function(d) {
        d3.select(this).attr('r', 10).style('stroke', 'black');
        
        nn_tip.show(d, this);
    }

    let nn_mouseLeave = function(d) {
        d3.select(this).attr('r', 5).style('stroke', function(d) {
            if(d.rank == 1) {
                return 'red';
            }
            if(d.rank == 0) {
                return 'black';
            }
            return "#FEDE00";
        });

        nn_tip.hide(d);
    }
    let nn_margin = {top: 60, right: 50, bottom: 50, left: 100},
        nn_width = 800 - nn_margin.left - nn_margin.right,
        nn_height = 400 - nn_margin.top - nn_margin.bottom;

    //Create dropdown to select the state
    d3.select("#StateDropdown")
    .selectAll("options")
    .data(UNIQUE_CITIES).enter()
    .append("option")
    .text(function (d) {
        return d;
    });

    //When the state selection changes, run the method to update the list of cities
    // d3.select("#StateDropdown").on("change", function(d) {
    //     updateCityDropdown(d3.select(this).property("value"));
    // })

    //Keeps track of the current selection of cities
    let current_cities = [];
    let current_city_id = 'current_cities_selection';
    let current_city_id_ = '#' + current_city_id;


    //This function clears out the old dropdown and replaces it with the new cities corresponding to the selected state
    function updateCityDropdown(state) {
        SELECTED_STATE = state;
        current_cities = nndata.filter(g => g.state == SELECTED_STATE);
        if(state == null) {
            getNearestCities(null);
        }
        //console.log(current_cities)
        let c = [{'city':'None'}];
        current_cities.forEach(function(d) {
            c.push(d);
        })
        //console.log(c);
        d3.selectAll(current_city_id_).remove();
        let selection = d3.select("#CityDropdown")
            .selectAll("options")
            .data(c);
        
        selection.enter()
            .append("option")
            .attr('id', current_city_id)
            .merge(selection)
            .text(function (d) {
                return d.city;
            });
        
    }

    //Initialize the city dropdown with cities from the first state (Alabama)
    updateCityDropdown('None');
    //getNearestCities(null);

    function getCity(city, state) {
        let r = nndata.filter(g => g.state == state & g.city == city)[0];
        //console.log(r);
        return r;
    }

    function getCityByID(id) {
        return nndata.filter(g => g.city_id == id)[0];
    }

    function getCitiesByID(ids, main_city_id, distances) {
        let cities = [];
        let i = 1;
        for( id in ids) {
            let new_city = getCityByID(ids[id]);
            //console.log(new_city);

            // if(new_city[0].lat == undefined || new_city[0].lng == undefined) {
            //     console.log("Undefined");
            //     console.log(new_city);
            // }
            //console.log(distances[i-1]);
            cities.push({'rank':i, 'city':new_city, 'dist':distances[i-1]});
            i = i + 1;
        }
        let mc_data = getCityByID(main_city_id);
        cities.push({'rank':0, 'city':mc_data, 'dist':0});
        // nndata.forEach(function(d) {
        //     if(d.city_id in ids) {
        //         cities.push(d)
        //     }
        // });
        return cities.reverse();
    }

     //When the city selection changes
    d3.select("#CityDropdown").on("change", function(d) {
        SELECTED_CITY = d3.select(this).property("value");
        let num = d3.select('#slider').property("value");
        //console.log(num);
        getNearestCities(SELECTED_CITY, num);
    });

    d3.select('#slider').on("change", function(d) {
        getNearestCities(SELECTED_CITY, d3.select(this).property("value"));
    });
    
    function getNearestCities(city_name, n = 5) {
        if (n > 20) {
            n = 20;
        }
        if (n < 0) {
            n = 0;
        }
        if (city_name == null) {
            updateCityPoints(svg, null);
            return null;
        }
        //console.log(n);
        // let e = document.getElementById("CityDropdown");
        // let city_name = e.value;

        let cty = getCity(city_name, SELECTED_STATE);
        //console.log(cty);
        let nn = [];
        let distances = [];
        // console.log(cty);
        let indexes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
        let dindexes = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd10', 'd11', 'd12', 'd13', 'd14', 'd15', 'd16', 'd17', 'd18', 'd19', 'd20'];
        for(let i = 0; i < n; i++) {
            let v = cty[indexes[i]];
            let vd = cty[dindexes[i]];
            nn.push(v);
            distances.push(vd);
        }
        // console.log("NN");
        // console.log(nn);
        let cities = getCitiesByID(nn, cty['0'], distances);
        
        

        updateCityPoints(svg, cities);

        //nn_cities = nndata.filter(g => g.city_id == 0);
        //console.log(nn_cities);
    }

    //getNearestCities(0);

    
    
    let current_cities_plotted = "current_cities_plotted_1234567";
    let current_cities_plotted_ = '#' + current_cities_plotted;

    



    function updateCityPoints(svg, cities) {
        // console.log("update city points");
        d3.selectAll(current_cities_plotted_).remove();
        // var projection = d3.geoAlbersUsa()
        //     .translate([width / 2, height / 2]) // translate to center of screen
        //     .scale([1000]); // scale things down so see entire US
        if(cities == null) {
            return null;
        }
        // console.log('cities');
        // console.log(cities);
    
        svg
            .selectAll("circle")
            .data(cities)
            .enter()
            .append("circle")
            .attr('id', current_cities_plotted)
            .attr("cx", function(d) {
                let p = projection([d.city.lng, d.city.lat])[0];
                //console.log("x: " + p);
                return p;
            })
            .attr("cy", function(d) {
                let p = projection([d.city.lng, d.city.lat])[1];
                //console.log("y: " + p);
                return p;
            })
            .attr("r", 5)
            .style("fill", function(d) {
                if(d.rank == 1) {
                    return 'red';
                }
                if(d.rank == 0) {
                    return 'black';
                }
                return "#FEDE00";
            })
            .style("stroke", function(d) {
                if(d.rank == 1) {
                    return 'red';
                }
                if(d.rank == 0) {
                    return 'black';
                }
                return "#FEDE00";
            })
            .style("opacity", 0.8)
            .on('mouseover', nn_mouseOver)
            .on('mouseleave', nn_mouseLeave)
            .call(nn_tip);
    }
        
    function createMap(json, data, varselect) {
        
    var datafilter = data.map(function(d){return {State: d.StateName, value:parseFloat(d[varselect])};
                                         })
   
        for (var i = 0; i < data.length; i++) {
            var dataState = datafilter[i].State;
            var dataValue = datafilter[i].value;
            for (var j = 0; j < json.features.length; j++) { // loop the json to find the states
                var jsonState = json.features[j].properties.name;
                if (dataState == jsonState) {
                    json.features[j].properties.variable = dataValue; // Get the coords from the json
                    break; // stop when coords are found
                }
            }
        }
//        
//        console.log(json.features)
        
        var dataray = []
        
        for (var i = 0; i < data.length; i++) {
        dataray.push(parseFloat(datafilter[i].value))
    }
        
//        console.log(dataray)
        var lowColor = '#91DFDA';
        var highColor = '#00354C';
        var midColor = "#3195BE";
        var pickColor = "#FEDE00";
        var maxx1 = d3.max(dataray);
        var midd1 = d3.median(dataray)
        var minn1 = d3.min(dataray);
        var scaler1 = d3.scaleLinear()
                    .domain([minn1,midd1, maxx1])
                    .interpolate(d3.interpolateLab)
                    .range([lowColor,midColor, highColor]);

        
        
        
        
        
    // mouseover code, remove if you dont want mouseover
        
    //tooltip for the mouseover
        
    const tip = d3.tip()
        .attr("id", "tooltip")
        .attr('class', 'd3-tip')
        .attr('offset', [-1, 0])
        .html(function (d) {
            return `<strong>State: </strong><span class='details'>${d.properties.name}<br></span>
            <strong>Number of Cities: </strong><span class='details'>${d.properties.NumCities}<br/></span>
            <strong>${varselect}: </strong><span class='details'>${d.properties.variable}<br/></span>`
//                    <strong>Number of Users: </strong><span class='details'>${d.users}<br/></span>
//                    <strong>Avg Rating: </strong><span class='details'>${d.rating}<br/></span>`
        });
        
    svg.call(tip);

        //mouseover code
                
    let mouseOver = function(d) {
        d3.selectAll(".State")
            .transition()
            .duration(200)
            .style("opacity",.5)

        //Testing this out
        if(selected != d.properties.name) {
        tip.show(d, this);
        }
        
        
        d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 1)
            .style("stroke", "#000")
    
        if (clicked === "true" && selected === d.properties.name 
                    ) {
                    
                     d3.select(this)
                        .transition()
                        .duration(200)
                        .style("opacity", 1)
                        .style("stroke", pickColor)
                    
                    }

    }
    
    let mouseLeave = function(d) {
        if (d.properties.name != selected) {
                    
                    
                    
                    d3.selectAll(".State")
                    .transition()
                    .duration(200)
                    .style("opacity",.8)

       

                tip.hide(d);

                 if (clicked === "false" || clicked === "true" && selected != d.properties.name 
                    ) {

                    d3.select(this)
                        .transition()
                        .duration(200)
                        .style("opacity", .8)
                        .style("stroke", "transparent")
                    
                if (clicked === "true" && selected === d.properties.name 
                    ) {
                    
                     d3.select(this)
                        .transition()
                        .duration(200)
                        .style("opacity", 1)
                        .style("stroke", pickColor)
//                        .style("fill",pickColor)
                    
                    }
                     
                 }
                }
        
    }
    
    
    // on click code
//        export selected
//        export clicked
        let oneclick = function(d) {
            if (clicked === "false"){
                //Testing this out
                tip.hide(d);
            clicked = "true";
            selected = d.properties.name;
                dashdrop(selected)
//            modules.export = {selected = selected}    
            
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity", 1)
                    .style("stroke", pickColor)
//            export {clicked, selected}
            SELECTED_CITY = selected;
            updateCityDropdown(SELECTED_CITY);
            
            }
    }
         
        let dubclick = function(d) {
            if (clicked === "true" && selected === d.properties.name){
                
                


                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity", .8)
                    .style("stroke", "transparent")
//                    .style("fill", )
            console.log(selected);
            selected = undefined;
            dashdrop(selected);
            clicked = "false";
            SELECTED_CITY = null;
            updateCityDropdown(SELECTED_CITY);
//                export {clicked, selected}
                }
    }
        

   svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("stroke", "transparent")
            .style("stroke-width", 2)
            .style("fill",function(d) {
            return scaler1(d.properties.variable)
            
   }) 
         // mouseover code, remove if you dont want mouseovers
            .style("opacity", .8)
            .on("mouseover", mouseOver)
            .on("mouseleave", mouseLeave)
                    
        
        // on click code
            .on("click", oneclick)
//        on double click code –– cancels the click selection
            .on("dblclick",dubclick)
        
        // Call functio from knn.js -Josh
    //add_nn_points(svg, projection, 'None');
// legend
        
        // I have genuinely no idea how to fix this, but it would be a good add. Code pulled form choropleth_example.js
        
//        var w = 140, h = 300;
//
//        var key = d3.select("span")
//            .append("svg")
//            .attr("width", width)
//            .attr("height", 1500)
//            .attr("class", "legend");
//
//        var legend = key.append("defs")
//            .append("svg:linearGradient")
//            .attr("id", "gradient")
//            .attr("x1", "100%")
//            .attr("y1", "0%")
//            .attr("x2", "100%")
//            .attr("y2", "100%")
//            .attr("spreadMethod", "pad");
//
//        legend.append("stop")
//            .attr("offset", "0%")
//            .attr("stop-color", highColor)
//            .attr("stop-opacity", 1);
//
//        legend.append("stop")
//            .attr("offset", "100%")
//            .attr("stop-color", lowColor)
//            .attr("stop-opacity", 1);
//
//        key.append("rect")
//            .attr("width", w - 100)
//            .attr("height", h)
//            .style("fill", "url(#gradient)")
//            .attr("transform", "translate(0,10)");
//
//        var y = d3.scaleLinear()
//            .range([h, 0])
//            .domain([minn1, maxx1]);
//
//        var yAxis = d3.axisRight(y);
//
//        key.append("g")
//            .attr("class", "y axis")
//            .attr("transform", "translate(100,-100)")
//            .call(yAxis)
//        
        
        
              // add dashboard  
        
    
   //////////////////////////////////////////////////////////////////////////////////////////
   //////////////////////////////////////////////////////////////////////////////////////////
   //////////////////////////////////////////////////////////////////////////////////////////
   //////////////////////////////////////////////////////////////////////////////////////////
        
    




    }
    });
}).catch(function (error) {
    console.log(error);
});
function dashdrop(state){

var pathToCsv3 = "data/dns4.csv";
d3.dsv(",", pathToCsv3, function (d) {
        return {
            State_abbrev: d["State Abbreviation"],
            StateName: d["State Name"],
            CityName: d.City,
            CountyName: d["County Name"],
            ["Average 2020/2021 household income"]: d["Average Household Income 2020/2021"],
            ["Historic Percent Change in Household Income 1984-2019"]: d["Percent Change in Household Income, 1984-2019"],
            ["Average Yearly Historic Percent Change in Income 1984-2019"]: d["Average Yearly Percent Change in Household Income, 1984-2019"],
            ["Minimum Wage"]: d["MinWage"],
            ["Average House Price 2020/2021"]: d["Average House Price 2020/2021"],
            ["Percent Change in Historic House Prices 2000-2019"]: d["Percent Change in Housing Prices, 2000-2019"],
            ["Average Yearly Percent Change in Housing Prices 2000-2019"]: d["Average Yearly Percent Change in Housing Prices, 2000-2019"],
            ["# of Violent Crime"]: d["Violent Crime Total"],
            ["# of Property Crime"]: d["Property Crime Total"],
            ["Property Crime Per Capita"]: d["Property Crime Per Capita"],
            ["Violent Crime Per Capita"]: d["Violent Crime Per Capita"],
            ["Total Crime Per Capita"]: d["Total Crime Per Capita"],
            Pop: d.TotalPop,
            Men: d.Men,
            Women: d.Women,
            VotingAge: d.VotingAgeCitizen,
            Employed: d.Employed,
            ["% Hispanic"]: d.Hispanic,
            ["% White"]: d.White,
            ["% Black"]: d.Black,
            ["% Native"]: d.Native,
            ["% Asian"]: d.Asian,
            ["% Pacific Islander"]: d.Pacific,
            ["Average Income"]: d.Income,
            ["Income Per Capita"]: d.IncomePerCap,
            ["% in Poverty"]: d.Poverty,
            ["% Child Poverty"]: d.ChildPoverty,
            ["% Professional Workers"]: d.Professional,
            ["% Service Workers"]: d.Service,
            ["% Office Workers"]: d.Office,
            ["% Construction Workers"]: d.Construction,
            ["% Production Workers"]: d.Production,
            ["% who Drive to Work"]: d.Drive,
            ["% who Carpool to Work"]: d.Carpool,
            ["% who use Public Transport "]: d.Transit,
            OtherTrans: d.OtherTransp,
            ["% Who Work At Home"]: d.WorkAtHome,
            ["Average Commute"]: d.MeanCommute,
            ["% Privately Employed"]: d.PrivateWork,
            ["% Self Employed"]: d.SelfEmployed,
            ["% Family Businesses"]: d.FamilyWork,
            ["% Unemployed"]: d.Unemployment,
            ["Average City Population"]: d.Population,

                }
    }).then(function (data) {

//        console.log(data);
        
        
       // d3.select("#cityDropdown").on("change", function (d) {
    let current_citiess = [];
    let current_city_ids = 'current_cities_selection';
    let current_city_idss = '#' + current_city_ids;
    let totalcity = [];
            
    if (state != undefined){
        current_citiess = data.filter(function(d){ return d.StateName == state});
        console.log(current_citiess)

        d3.selectAll(current_city_ids).remove();
        let selection = d3.select("#cDropdown")
            .selectAll("options")
            .data(current_citiess);
        
        selection.enter()
            .append("option")
            .attr('id', current_city_ids)
            .merge(selection)
            .text(function (d) {
              return d.CityName;
            });
        d3.select("#cDropdown").on("change", function(d){
            totalcity.push(d3.select(this).property("value"));
           // console.log(totalcity)            
        })
        d3.select("#button1").on("click", function(d){
            //console.log(totalcity)
            d3.select("#dasboard").html("")
            citydata(totalcity)
        })
        d3.select("#button2").on("click", function(d){
            //console.log(totalcity)
            d3.select("#dasboard").html("")
            totalcity = [];
        })
       //citydata(current_citiess[0].CityName)
        
    }
    if (state == undefined){
        current_citiess = data.filter(function(d){ return d.StateName == state});
        console.log(state)
        d3.select("#cDropdown").html("")
        d3.select("#dashboard1").html("")
        d3.select("#dashboard2").html("")
        d3.select("#dasboard").html("")
        totalcity = [];
}
    
    function citydata(city){ 
    selectedcity = data.filter(function(d){return (d.StateName == state && city.includes(d.CityName))})
       
       console.log(selectedcity)
        //var varsee = []
        //d3.select("#variableDropdown").on("change", function (d) {
        //   let varsee = d3.select(this).property("value")})
        let varsee = d3.select("#variableDropdown").property("value");
         console.log(varsee)
        //selectedvar = data.filter(function(d){return parseFloat(d[varsee])}) 
       //selectedvar = selectedcity.filter(function(d){return d[varsee]})
        let datafilter = selectedcity.map(function(d){return {name: d.CityName, value:parseFloat(d[varsee])};
                                                      })
        
       // d3.select("#dashboard").append("options")
         //   .data(datafilter)
        //const datatab = []
       // for (var i = 0; i < datafilter.length; i++)
         //   datatab.push({"name": datafilter[i].Variable, "value": datafilter[i].value})
            //datatab.push = datafilter[i].value
        //
        console.log(datafilter)
        //console.log(datatab)
        var max = -100
        for (var i = 0; i < datafilter.length; i++){
            if (datafilter[i].value > max)
                max = datafilter[i].value
        }
        console.log(max)
        var xb = d3.scaleLinear().range([0, 900])
        var yb = d3.scaleBand().range([200,0])
        xb.domain([0, max]);
        //datafilter = datafilter.slice(datafilter.length - , datafilter.length);
        console.log(datafilter)
        yb.domain(datafilter.map(function(d){return d.name})).padding(.2);
        document.getElementById("dashboard1").innerHTML = varsee;
        
        //document.getElementById("dashboard2").innerHTML = datafilter[0].value
        
        let grap = d3.select("#dasboard").append("g").attr("id", "graph").attr("transform", "translate(" +100+ ", 0 )")               
        grap.selectAll("rect")
            .data(datafilter)
            .enter()
            .append("rect")
            .attr("x", xb(0))
            .attr("y", function(d){
            return yb(d.name)
        })
            .attr("width", function(d){
            return xb(d.value)
        })
            .attr("height", yb.bandwidth()-1)
            .attr("fill", "#fede80")
            .attr("stroke","black")
        grap.append("g")
            .call(d3.axisLeft(yb))
                .style("stroke","#fff")
        grap.append("g").attr("transform", "translate(0, " +200+ ")")
            .call(d3.axisBottom(xb))
                .style("stroke","#fff")
        grap.append("text")
            .attr("x", -100)
            .attr("y", 20)
            .text("Cities")
                .attr("id","barlabel")
                .style("stroke", "#fff")
        //plotty.append("text").text("Hello")
                      //  .attr("y", function(d){
                      //      return 
                      //  })
                     
        //console.log(selectedvar)

    }
          
});

    
    
};
});
 