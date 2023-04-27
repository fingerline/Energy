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

    let elecbargroup = makeBar(new Point(20,497), "ELEC", "blank", 140);
    let heatbargroup = makeBar(new Point(100,497), "HEAT", "blank", 79);
    let energybargroup = makeBar(new Point(180, 497), "ENERGY", "blank", 100);
    let fuelbargroup = makeBar(new Point(100,197), "FUEL", "blank", 76)
    

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
        });

        let toploop = baseloop.clone();
        toploop.position = baseloop.position.subtract([0,barheight]);

        let firstlinker = new Path.Line({
            from: baseloop.segments[0].point,
            to: toploop.segments[0].point,
            strokeColor: "black",
        });

        let secondlinker = new Path.Line({
            from: baseloop.segments[1].point,
            to: toploop.segments[1].point,
            strokeColor: "black",
        });

        let thirdlinker = new Path.Line({
            from: baseloop.segments[2].point,
            to: toploop.segments[2].point,
            strokeColor: "black",

        });

        let fourthlinker = new Path.Line({
            from: baseloop.segments[3].point,
            to: toploop.segments[3].point,
            strokeColor: "black",
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
        });

        let energylabel = new PointText({
            point: toploop.position.subtract([-4,10]),
            content: "0",
            fontWeight: 'bold',
            justification: 'center',
            fontSize: 16
        })

        barGroup.addChildren(0, [baseloop, toploop, firstlinker, secondlinker, thirdlinker,
            fourthlinker, bartitle, energylabel]);

        return barGroup;

    }





}
  
  
  
  

  
