// const newGameButton = document.getElementById("new-game-button");
// const loadGameButton = document.getElementById("load-game-button");
// const saveGameButton = document.getElementById("save-game-button");
// // Define variables to store game data
// let gameData = {
//     year: 2020,
//     difficulty: "easy",
//     objectives: {
//       budgetLimit: true,
//       oilLimit: true,
//       ghgLimit: true,
//       fuelMin: true,
//       electricityMin: true,
//       heatMin: true,
//       totalEnergyMin: true,
//     },
//     energySector: "vehicleFuel",
//     topGridItems: [
//       { name: "CHL 125", imgSrc: "./images/sprites/37.png", alt: "", shapeSrc: "./images/shapes/145.png" },
//       { name: "CROP PROFILES 24", imgSrc: "./images/shapes/73.png", alt: "", shapeSrc: "./images/shapes/145.png" },
//       { name: "CELLULAR PROFILE 60", imgSrc: "./images/shapes/67.png", alt: "", shapeSrc: "./images/shapes/145.png" },
//       { name: "NATURAL GAS 40", imgSrc: "./images/shapes/79.png", alt: "", shapeSrc: "./images/shapes/145.png" },
//       { name: "ELECTRICITY 40", imgSrc: "./images/shapes/65.png", alt: "", shapeSrc: "./images/shapes/145.png" }
//     ],
//     objectivesTable: {
//       budgetLimit: 2236,
//       fuelMin: 25
//     }
//   };
// newGameButton.addEventListener("click", function() {
//   // code for starting a new game
//   document.getElementById("new-game-button").addEventListener("click", function() {
//     // Reset game data
//     gameData.year = 2020;
//     gameData.difficulty = "easy";
//     gameData.objectives = {
//       budgetLimit: true,
//       oilLimit: true,
//       ghgLimit: true,
//       fuelMin: true,
//       electricityMin: true,
//       heatMin: true,
//       totalEnergyMin: true,
//     };
//     gameData.energySector = "vehicleFuel";
//     gameData.topGridItems = [
//       { name: "CHL 125", imgSrc: "./images/sprites/37.png", alt: "", shapeSrc: "./images/shapes/145.png" },
//       { name: "CROP PROFILES 24", imgSrc: "./images/shapes/73.png", alt: "", shapeSrc: "./images/shapes/145.png" },
//       { name: "CELLULAR PROFILE 60", imgSrc: "./images/shapes/67.png", alt: "", shapeSrc: "./images/shapes/145.png" },
//       { name: "NATURAL GAS 40", imgSrc: "./images/shapes/79.png", alt: "", shapeSrc: "./images/shapes/145.png" },
//       { name: "ELECTRICITY 40", imgSrc: "./images/shapes/65.png", alt: "", shapeSrc: "./images/shapes/145.png" }
//     ];
//     gameData.objectivesTable = {
//       budgetLimit: 2236,
//       fuelMin: 25
//     };
  
//     // Display success message
//     alert("New game created!");
//   });
// });

// loadGameButton.addEventListener("click", function() {
//     document.getElementById("load-game-button").addEventListener("click", function() {
//         // Retrieve game data from storage (in this case, from local storage)
//         let savedGameData = JSON.parse(localStorage.getItem("gameData"));
      
//         // Check if there is saved game data
//         if (savedGameData) {
//           // Set game data to saved game data
//           gameData = savedGameData;
      
//           // Display success message
//           alert("Game loaded successfully");
//         } else {
//           // Display error message
//           alert("No saved game data found.");
//         }
//       });
// });

// saveGameButton.addEventListener("click", function() {
//     document.getElementById("save-game-button").addEventListener("click", function() {
//         // Save game data to local storage
//         localStorage.setItem("gameData", JSON.stringify(gameData));
      
//         // Display success message
//         alert("Game saved successfully!");
//       });
// });
paper.install(window);
window.onload = function() {
    const canvas = document.getElementById("graphCanvas");
    canvas.width = 520;
    canvas.height = 520;

    paper.setup("graphCanvas");

    let staticassets = [];
    let dynamicassets = [];

    let elecbargroup = makeBar(new Point(20,497), "ELEC", "elecicon", 140);
    let heatbargroup = makeBar(new Point(100,497), "HEAT", "heaticon", 79);
    let energybargroup = makeBar(new Point(180, 497), "ENERGY", "energyicon", 100);
    let fuelbargroup = makeBar(new Point(100,180), "FUEL", "fuelicon", 76);

    updateBarToValue(elecbargroup, 126, false, 13);
    updateBarToValue(heatbargroup, 40, false);
    updateBarToValue(energybargroup, 70, false, 30);
    updateBarToValue(fuelbargroup, 30, false);

    

    //max necessary for any one bar is 140
    //height is always the same. 70 on any bar is always at the same y level


    function makeBar(position, name, iconpath, maxval){

        const scale = (maxval / 140);
        // Don't have original code handy and little time remaining, approximation of original scale
        // It is doubtless significantly less complex than this but I simply do not have the time to refine
        const scalefactor = ((1.2 * Math.pow(.3 * scale + .2,2))/(Math.pow(.3*scale + .2, 2) + 1)) + .77;
        const basewidth = 40 * scalefactor;
        const basedepthx = 10 * scalefactor
        const basedepthy = 10 * scalefactor;
        const barheight = 275 * scale;

        let barGroup = new Group(
        );
        project.currentStyle = {
            strokeColor: '#000000',
            strokeWidth: 2,
        };

        let baseloop = new Path({
            segments: [
                position,
                position.add([basewidth,0]),
                position.subtract([-basewidth - basedepthx, basedepthy]),
                position.subtract(-basedepthx, basedepthy)
            ],
            closed: true,
            strokeColor: "black",
            name: `${name}staticbaseloop`,
        });

        let toploop = baseloop.clone();
        toploop.name = `${name}statictoploop`;
        toploop.position = baseloop.position.subtract([0,barheight]);

        let icon = new Raster(iconpath);
        icon.position = [baseloop.position.x, 
            baseloop.position.y-(barheight / 2)];
        icon.name = `${name}staticicon`;

        let firstlinker = new Path.Line({
            from: baseloop.segments[0].point,
            to: toploop.segments[0].point,
            strokeColor: "black",
            name: `${name}staticlinker1`,
        });

        let secondlinker = new Path.Line({
            from: baseloop.segments[1].point,
            to: toploop.segments[1].point,
            strokeColor: "black",
            name: `${name}staticlinker2`,
        });

        let thirdlinker = new Path.Line({
            from: baseloop.segments[2].point,
            to: toploop.segments[2].point,
            strokeColor: "black",
            name: `${name}staticlinker3`,
        });

        let fourthlinker = new Path.Line({
            from: baseloop.segments[3].point,
            to: toploop.segments[3].point,
            strokeColor: "black",
            name: `${name}staticlinker4`,
        });

        project.currentStyle = {
            strokeWidth: 0,
            strokeColor: 'black'
        };

        let bartitle = new PointText({
            point: baseloop.position.add([0,20]),
            content: name,
            fontWeight: 'bold',
            justification: 'center',
            name: `${name}statictitle`,
        });

        barGroup.addChildren([baseloop, toploop, icon, firstlinker, secondlinker, thirdlinker,
            fourthlinker, bartitle]);
        
        staticassets.push(baseloop, toploop, icon, firstlinker, secondlinker, thirdlinker,
            fourthlinker, bartitle);
        
        project.currentStyle = {
            strokeWidth: 1,
        };
        
        return barGroup;

    }

    function updateBarToValue(bargroup, value, satisfaction, efficiency = 0){

        let baseloop = bargroup.getItem({
            name: /.*baseloop/
        });
        let toploop = bargroup.getItem({
            name: /.*toploop/
        });

        let surfaceloop = baseloop.clone();
        surfaceloop.name = "dynamicsurfaceloop";

        let surfacecolor = (satisfaction ? "#91C84B" : "#FF0000");
        surfaceloop.fillColor = surfacecolor;

        surfaceloop.position = surfaceloop.position.subtract([0, 275 * (value/140)]);
        
        project.currentStyle = {
            strokeWidth: 2,
        };

        let frontloop = new Path({
            segments: [
                baseloop.segments[0].point,
                surfaceloop.segments[0].point,
                surfaceloop.segments[1].point,
                baseloop.segments[1].point,
            ],
            closed: true,
            fillColor: surfacecolor,
            name: `dynamicfrontloop`,
        });

        let sideloop = new Path({
            segments: [
                baseloop.segments[1].point,
                surfaceloop.segments[1].point,
                surfaceloop.segments[2].point,
                baseloop.segments[2].point,
            ],
            closed: true,
            fillColor: surfacecolor,
            name: `dynamicsideloop`,
        });

        let coverpath = new Path({
            segments: [
                toploop.segments[0].point,
                toploop.segments[1].point,
                toploop.segments[2].point,
            ]
        });

        project.currentStyle = {
            strokeWidth: 1,
        };

        let labelyval = ((surfaceloop.position.y > toploop.position.y) ? 
            toploop.position.y - 10 : surfaceloop.position.y - 10)

        let valuelabel = new PointText({
            point: [surfaceloop.position.x + 4, labelyval],
            content: `${value}`,
            justification: 'center',
            fontSize: 16,
            name: `dynamicvaluelabel`,
        });

        bargroup.addChildren([frontloop, sideloop, valuelabel, coverpath]);
        dynamicassets.push(surfaceloop, frontloop, sideloop, valuelabel, coverpath);
        
        let overeff = null;
        let overcap = null;

        if(efficiency > 0){
            let effscale = (efficiency/140) * 275;
            let efffrontloop = new Path({
               segments: [
                toploop.segments[0].point.add([0,effscale]),
                toploop.segments[0].point,
                toploop.segments[1].point,
                toploop.segments[1].point.add([0,effscale])
               ],
               strokeWidth: 2,
               fillColor: surfacecolor,
               closed: true,
               name: "efffrontloop"
            });
            let effsideloop = new Path({
                segments: [
                    toploop.segments[1].point.add([0,effscale]),
                    toploop.segments[1].point,
                    toploop.segments[2].point,
                    toploop.segments[2].point.add([0,effscale])
                ],
                strokeWidth: 2,
                closed: true,
                fillColor: surfacecolor,
                name: "effsideloop"
            });

            let effbotloop = new Path({
                segments: [
                    toploop.segments[0].point.add([0,effscale]),
                    toploop.segments[1].point.add([0,effscale]),
                    toploop.segments[2].point.add([0,effscale]),
                    toploop.segments[3].point.add([0,effscale])
                ],
                strokeWidth: 0,
                closed: true,
            })

            let efftoploop = toploop.clone();
            efftoploop.fillColor = surfacecolor;
            efftoploop.name = "efftoploop";

            bargroup.addChildren([efffrontloop, effsideloop, efftoploop, effbotloop]);
            dynamicassets.push(efffrontloop, effsideloop, efftoploop, effbotloop);

            overeff = effbotloop.position.y > surfaceloop.position.y;
            overcap = toploop.position.y > surfaceloop.position.y;

            if(satisfaction){
                if(overeff){
                    let pastefffrontloop;
                    let pasteffsideloop;
                    let targetloop;
                    if(!overcap){
                        targetloop = surfaceloop  
                    } else if (overcap){
                        targetloop = toploop
                    }
                    pastefffrontloop = new Path({
                        segments: [
                            effbotloop.segments[0].point,
                            effbotloop.segments[1].point,
                            targetloop.segments[1].point,
                            targetloop.segments[0].point,
                        ],
                        fillColor: "#FFA500",
                        closed: true,
                        strokeWidth: 2,
                        name: "pastefffrontloop"
                    });
                    pasteffsideloop = new Path({
                        segments: [
                            effbotloop.segments[1].point,
                            effbotloop.segments[2].point,
                            targetloop.segments[2].point,
                            targetloop.segments[1].point,
                        ],
                        fillColor: "#FFA500",
                        closed: true,
                        strokeWidth: 2,
                        name: "pasteffsideloop"
                    });
                    surfaceloop.sendToBack();
                    if(surfaceloop.position.y - toploop.position.y <= .1){
                        efftoploop.fillColor = "#FFA500"
                    }
                    bargroup.addChildren([pastefffrontloop, pasteffsideloop]);
                    dynamicassets.push(pastefffrontloop, pasteffsideloop)
                }
            }
        }  

        surfaceloop.bringToFront();
        if (efficiency > 0){
            bargroup.getItem({name: /.*efffrontloop/}).bringToFront();
            bargroup.getItem({name: /.*effsideloop/}).bringToFront();
            if(overeff){
                bargroup.getItem({name: /.*pastefffrontloop/}).bringToFront();
                bargroup.getItem({name: /.*pasteffsideloop/}).bringToFront();
            }
        }
        coverpath.bringToFront();
        bargroup.getItem({name: /.*linker2/}).bringToFront()
        icon = bargroup.getItem({name: /.*ico/});
        icon.bringToFront();
        if(overcap){
            bargroup.getItem({name: /.*efftoploop/}).sendToBack()
        }
        if (overeff && !overcap){
            surfaceloop.sendToBack();
        }

    }

    function cleanupDynamic(){
        for(element of dynamicassets){
            element.remove();
        }
    }



}
  
  
  
  

  
