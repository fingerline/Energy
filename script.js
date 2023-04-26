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

  
  
  
  

  
